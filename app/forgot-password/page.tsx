"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState({ email: "", phone: "" });
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send OTP request to API
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setIsSubmitted(true);
      setSentTo({ email: data.email, phone: data.phone });

      toast({
        title: "OTP Sent Successfully",
        description: `We've sent an OTP to your ${
          data.channels.email ? "email" : ""
        }${data.channels.email && data.channels.sms ? " and " : ""}${
          data.channels.sms ? "phone" : ""
        }.`,
      });

      // Redirect to reset password page with identifier
      setTimeout(() => {
        router.push(
          `/reset-password?identifier=${encodeURIComponent(identifier)}`
        );
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
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
              Forgot Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you an OTP to reset your
              password.
            </p>
          </div>

          {isSubmitted ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-800">
                      OTP Sent Successfully!
                    </h3>
                    <div className="mt-2 text-sm text-green-700 space-y-2">
                      {sentTo.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>
                            Email: <strong>{sentTo.email}</strong>
                          </span>
                        </div>
                      )}
                      {sentTo.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>
                            Phone: <strong>{sentTo.phone}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-green-600">
                      Redirecting to verification page...
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="identifier">Email Address</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="email"
                  required
                  placeholder="email@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="mt-1"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter the email associated with your account
                </p>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
