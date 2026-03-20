"use client";

import { useEffect, useState } from "react";

import { apiFetch, Post } from "@/lib/api";
import { apiBaseUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminPosts() {
  const { token } = useAuth();
  const [items, setItems] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("Hello world");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<Post[]>("/api/posts?published=true");
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

    let coverUrl: string | null = null;
    if (coverFile) {
      const form = new FormData();
      form.append("file", coverFile);
      const res = await fetch(`${apiBaseUrl()}/api/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Image upload failed");
      }
      const data = (await res.json()) as { url: string };
      coverUrl = data.url;
    }

    const created = await apiFetch<Post>("/api/posts", {
      method: "POST",
      token,
      body: JSON.stringify({
        title,
        slug,
        excerpt: null,
        content,
        cover_image_url: coverUrl,
        published: true
      })
    });
    setItems([created, ...items]);
    setTitle("");
    setSlug("");
    setCoverFile(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Admin · Posts</h1>
        <p className="text-sm text-zinc-600">Create blog posts (admin JWT required).</p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="grid gap-3">
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <textarea className="min-h-[140px] rounded-md border px-3 py-2 text-sm" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className="mt-3">
          <label className="text-xs text-zinc-600">Cover image (optional)</label>
          <input
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <button className="mt-3 rounded-md bg-black px-4 py-2 text-sm text-white" onClick={create}>
          Create
        </button>
        {err ? <div className="mt-2 text-xs text-red-600">{err}</div> : null}
      </div>

      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-4">
            <div className="text-sm font-medium">{p.title}</div>
            <div className="mt-1 text-xs text-zinc-600">{p.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

