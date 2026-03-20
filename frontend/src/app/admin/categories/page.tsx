"use client";

import { useEffect, useState } from "react";

import { apiFetch, Category } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminCategories() {
  const { token } = useAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<Category[]>("/api/categories");
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const create = async () => {
    setErr(null);
    if (!token) {
      setErr("Login as admin required.");
      return;
    }
    const created = await apiFetch<Category>("/api/categories", {
      method: "POST",
      token,
      body: JSON.stringify({ name, slug, description: null })
    });
    setItems([created, ...items]);
    setName("");
    setSlug("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Admin · Categories</h1>
        <p className="text-sm text-zinc-600">Create categories (admin JWT required).</p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <button className="mt-3 rounded-md bg-black px-4 py-2 text-sm text-white" onClick={create}>
          Create
        </button>
        {err ? <div className="mt-2 text-xs text-red-600">{err}</div> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl border bg-white p-4">
            <div className="text-sm font-medium">{c.name}</div>
            <div className="mt-1 text-xs text-zinc-600">{c.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

