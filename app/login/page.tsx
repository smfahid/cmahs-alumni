"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, user, isLoading: authIsLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, authIsLoading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormIsLoading(true);

    try {
      const result = await signIn(identifier, password);

      if (result.error) {
        toast({
          title: "Login Failed",
          description: result.error.message || "An unknown error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "You will be redirected shortly.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setFormIsLoading(false);
    }
  };

  if (user) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-white to-primary-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 space-y-6 border border-border/50">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="identifier"
                    className="text-[15px] font-medium"
                  >
                    Email or Mobile Number
                  </Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="mt-2 h-12 rounded-xl border-2 text-[15px] focus:border-primary transition-colors"
                    placeholder="Enter your email or mobile"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-[15px] font-medium">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-2 pr-12 text-[15px] focus:border-primary transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-[15px] font-medium text-primary hover:text-primary-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-[15px] font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                disabled={formIsLoading}
              >
                {formIsLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-muted-foreground">
                  New to CMAHS Alumni?
                </span>
              </div>
            </div>

            <Link href="/membership" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl text-[15px] font-medium border-2 hover:bg-primary-50/50 hover:border-primary/30 transition-all active:scale-[0.98]"
              >
                Create an account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
