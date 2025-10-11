"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1); // 1: Enter OTP, 2: Enter new password
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Get identifier from query params
    const identifierParam = searchParams.get("identifier");
    if (identifierParam) {
      setIdentifier(identifierParam);
    }
  }, [searchParams]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      setResetToken(data.resetToken);
      setStep(2);
      toast({
        title: "OTP Verified",
        description: "Please enter your new password.",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/otp/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSuccess(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been successfully reset.",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email and phone.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {step === 1 ? "Verify OTP" : "Reset Password"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {step === 1
                ? "Enter the 6-digit OTP sent to your email and phone"
                : "Enter your new password below"}
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-green-800">
                    Your password has been successfully reset. You will be
                    redirected to the login page shortly.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Verify OTP */}
              {step === 1 && (
                <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                  {error && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="identifier">Email Address</Label>
                    <Input
                      id="identifier"
                      name="identifier"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="mt-1"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="mt-1 text-center text-2xl tracking-widest font-bold"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:text-primary/80 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                    <Link
                      href="/forgot-password"
                      className="text-primary hover:text-primary/80"
                    >
                      Use different account
                    </Link>
                  </div>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center text-sm"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}

              {/* Step 2: Reset Password */}
              {step === 2 && (
                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                  {error && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 pr-10"
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
