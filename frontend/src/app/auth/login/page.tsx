"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch, TokenResponse } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const login = async () => {
    setErr(null);
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    if (!res.ok) {
      setErr("Invalid credentials");
      return;
    }
    const token = (await res.json()) as TokenResponse;
    setToken(token.access_token);
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-lg font-semibold">Login</h1>
      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded-md bg-black px-4 py-2 text-sm text-white" onClick={login}>
          Sign in
        </button>
        {err ? <div className="text-xs text-red-600">{err}</div> : null}
        <div className="text-xs text-zinc-600">
          No account?{" "}
          <Link className="underline" href="/auth/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

