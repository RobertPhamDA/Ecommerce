"use client";

import { useEffect, useState } from "react";

import { apiFetch, Product, Category } from "@/lib/api";
import { apiBaseUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminProducts() {
  const { token } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("10.00");
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const load = async () => {
    const data = await apiFetch<Product[]>("/api/products");
    setItems(data);
    const cats = await apiFetch<Category[]>("/api/categories");
    setCategories(cats);
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

    let uploadedImageUrl: string | null = null;
    if (imageFile) {
      const form = new FormData();
      form.append("file", imageFile);
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
      uploadedImageUrl = data.url;
    }

    const created = await apiFetch<Product>("/api/products", {
      method: "POST",
      token,
      body: JSON.stringify({
        name,
        slug,
        price: Number(price),
        currency: "USD",
        description: null,
        image_url: uploadedImageUrl,
        category_id: categoryId ? Number(categoryId) : null
      })
    });
    setItems([created, ...items]);
    setName("");
    setSlug("");
    setImageFile(null);
  };

  const saveEdit = async (id: number) => {
    if (!token) return;
    try {
      let uploadedImageUrl = editData.image_url;
      if (editImageFile) {
        const form = new FormData();
        form.append("file", editImageFile);
        const res = await fetch(`${apiBaseUrl()}/api/uploads/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
        if (!res.ok) throw new Error("Image upload failed");
        uploadedImageUrl = ((await res.json()) as { url: string }).url;
      }

      const payload = { ...editData };
      if (uploadedImageUrl !== undefined) {
         payload.image_url = uploadedImageUrl;
      }

      const updated = await apiFetch<Product>(`/api/products/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
      });
      setItems(items.map(p => p.id === id ? updated : p));
      setEditingId(null);
      setEditImageFile(null);
    } catch (e: any) {
      alert(e.message || "Failed to update");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Admin · Products</h1>
        <p className="text-sm text-zinc-600">Create products (admin JWT required).</p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <select 
            className="rounded-md border px-3 py-2 text-sm bg-white"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">No Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="mt-3">
          <label className="text-xs text-zinc-600">Product image (optional)</label>
          <input
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <button className="mt-3 rounded-md bg-black px-4 py-2 text-sm text-white" onClick={create}>
          Create
        </button>
        {err ? <div className="mt-2 text-xs text-red-600">{err}</div> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-4">
            {editingId === p.id ? (
              <div className="space-y-3">
                <input className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-black" value={editData.name || ""} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="Name" />
                <input className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-black" value={editData.slug || ""} onChange={e => setEditData({...editData, slug: e.target.value})} placeholder="Slug" />
                <input className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-black" value={editData.price?.toString() || ""} onChange={e => setEditData({...editData, price: Number(e.target.value)})} placeholder="Price" />
                <select 
                  className="w-full rounded border px-2 py-1 text-sm bg-white"
                  value={editData.category_id?.toString() || ""}
                  onChange={e => setEditData({...editData, category_id: e.target.value ? Number(e.target.value) : null})}
                >
                  <option value="">No Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-600">Update Image (optional)</label>
                  <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files?.[0] ?? null)} className="text-xs w-full block" />
                </div>
                <div className="flex gap-2">
                  <button className="rounded bg-black px-3 py-1 text-xs text-white" onClick={() => saveEdit(p.id)}>Save</button>
                  <button className="rounded bg-gray-200 px-3 py-1 text-xs text-black" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="mt-1 text-xs text-zinc-600">Slug: {p.slug}</div>
                  <div className="mt-1 text-xs text-zinc-600">Category: {p.category?.name || "None"}</div>
                </div>
                <button 
                  className="text-xs text-blue-600 underline" 
                  onClick={() => {
                    setEditingId(p.id);
                    setEditData({ name: p.name, slug: p.slug, price: p.price, category_id: p.category_id, image_url: p.image_url });
                    setEditImageFile(null);
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

