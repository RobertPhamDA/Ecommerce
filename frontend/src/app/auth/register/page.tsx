"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const register = async () => {
    setErr(null);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      router.push("/auth/login");
    } catch {
      setErr("Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-lg font-semibold">Register</h1>
      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Password (min 8)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded-md bg-black px-4 py-2 text-sm text-white" onClick={register}>
          Create account
        </button>
        {err ? <div className="text-xs text-red-600">{err}</div> : null}
        <div className="text-xs text-zinc-600">
          Already have an account?{" "}
          <Link className="underline" href="/auth/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

