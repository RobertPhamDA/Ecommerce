import Link from "next/link";

import { apiFetch, Product, Category } from "@/lib/api";

export default async function ProductsPage({ searchParams }: { searchParams: { category_id?: string } }) {
  const q = searchParams.category_id ? `?category_id=${searchParams.category_id}` : "";
  const products = await apiFetch<Product[]>(`/api/products${q}`);
  const categories = await apiFetch<Category[]>("/api/categories");

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-zinc-600">Browse the catalog.</p>
        </div>
        <Link className="text-sm underline" href="/admin/products">
          Admin manage
        </Link>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
        <Link href="/products" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!searchParams.category_id ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}>
          All
        </Link>
        {categories.map(c => (
          <Link key={c.id} href={`/products?category_id=${c.id}`} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${searchParams.category_id === String(c.id) ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}>
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="flex flex-col rounded-xl border bg-white overflow-hidden hover:border-black transition-colors focus:ring-2 focus:ring-black focus:outline-none">
            <div className="aspect-[4/3] w-full bg-zinc-100 border-b flex flex-col justify-center items-center text-zinc-400 shrink-0">
              {p.image_url ? (
                 <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                 <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </div>
            <div className="p-4 flex flex-col">
              <h3 className="text-sm font-medium leading-snug line-clamp-2">{p.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{p.category?.name ?? "Uncategorized"}</p>
              {p.description && (
                <p className="mt-2 text-xs text-zinc-600 line-clamp-2">{p.description}</p>
              )}
              <div className="mt-3">
                <span className="text-base font-semibold">{p.currency} {p.price.toFixed(2)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

