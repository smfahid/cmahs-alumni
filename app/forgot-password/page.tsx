"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getBrowserClient()

      // Get the base URL without any path
      const baseUrl = window.location.origin

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`,
      })

      if (error) throw error

      setIsSubmitted(true)
      toast({
        title: "Reset Email Sent",
        description: "Check your email for a password reset link.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {isSubmitted ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-800">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your email.
                </p>
              </div>
              <div className="text-center">
                <Link href="/login" className="text-primary hover:text-primary/80 flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

              <div className="text-center">
                <Link href="/login" className="text-primary hover:text-primary/80 flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
