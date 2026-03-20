"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Navigation() {
  const { token, logout } = useAuth();
  
  return (
    <nav className="flex gap-4 text-sm items-center">
      <Link href="/products">Products</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/bookings">Bookings</Link>
      <Link href="/admin">Admin</Link>
      {token ? (
        <button 
          onClick={logout} 
          className="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Logout
        </button>
      ) : (
        <Link href="/auth/login" className="font-medium text-black">
          Login
        </Link>
      )}
    </nav>
  );
}
