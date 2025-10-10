"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface AdminProtectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminProtection({ children, fallback }: AdminProtectionProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (!isAdmin) {
        router.push("/");
        return;
      }

      setIsChecking(false);
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin privileges...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have admin privileges to access this page.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
