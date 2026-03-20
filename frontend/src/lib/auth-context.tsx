"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    typeof window === "undefined" ? null : localStorage.getItem("token")
  );

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    }
  };

  const value = useMemo(
    () => ({
      token,
      setToken,
      logout: () => setToken(null)
    }),
    [token]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

