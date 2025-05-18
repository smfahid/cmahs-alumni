import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMAHS Alumni",
  description: "Char Mehar Azizia High School Alumni Association",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <NextTopLoader />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
