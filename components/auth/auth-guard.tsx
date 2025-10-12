"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MainLayout } from "@/components/main-layout";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAdmin = false,
  fallback,
}: Readonly<AuthGuardProps>) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      // If admin required but user is not admin, redirect to home
      if (requireAdmin && !isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [user, isAdmin, isLoading, router, requireAdmin]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If not authenticated, show fallback or redirect
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access this page.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If admin required but user is not admin
  if (requireAdmin && !isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Admin privileges
              required.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}

// Higher-order component for easier usage
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  requireAdmin = false
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard requireAdmin={requireAdmin}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook for checking authentication status
export function useAuthGuard(requireAdmin = false) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (requireAdmin && !isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [user, isAdmin, isLoading, router, requireAdmin]);

  return {
    isAuthenticated: !!user,
    isAdmin,
    isLoading,
    canAccess: user && (!requireAdmin || isAdmin),
  };
}
