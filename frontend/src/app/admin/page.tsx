"use client";

import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="text-sm text-zinc-600">Admin-only CRUD endpoints require an admin JWT.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link className="rounded-xl border bg-white p-5 hover:bg-zinc-50" href="/admin/products">
          Products
        </Link>
        <Link className="rounded-xl border bg-white p-5 hover:bg-zinc-50" href="/admin/categories">
          Categories
        </Link>
        <Link className="rounded-xl border bg-white p-5 hover:bg-zinc-50" href="/admin/posts">
          Blog posts
        </Link>
      </div>
    </div>
  );
}

