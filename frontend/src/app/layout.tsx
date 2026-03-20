import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Next.js + FastAPI ecommerce"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <AuthProvider>
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold">
                Ecommerce
              </Link>
              <nav className="flex gap-4 text-sm">
                <Link href="/products">Products</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/bookings">Bookings</Link>
                <Link href="/admin">Admin</Link>
                <Link href="/auth/login">Login</Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-600">
              © {new Date().getFullYear()} Ecommerce
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

