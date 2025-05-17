"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Check if we have a valid reset token
  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Get the hash fragment from the URL if it exists
        const hash = window.location.hash

        if (hash && hash.includes("access_token")) {
          // Let Supabase handle the token automatically
          const supabase = getBrowserClient()

          // This will automatically process the token in the URL
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            toast({
              title: "Invalid or Expired Link",
              description: "Please request a new password reset link.",
              variant: "destructive",
            })
            router.push("/forgot-password")
          }
        }
      } catch (err) {
        console.error("Error handling password reset:", err)
        toast({
          title: "Error",
          description: "There was an error processing your password reset link.",
          variant: "destructive",
        })
      }
    }

    handlePasswordReset()
  }, [router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const supabase = getBrowserClient()

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setIsSuccess(true)
      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset.",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.")
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
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Enter your new password below.</p>
          </div>

          {isSuccess ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-800">
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </p>
              </div>
              <div className="text-center">
                <Link href="/login" className="text-primary hover:text-primary/80">
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-800">{error}</p>
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
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
