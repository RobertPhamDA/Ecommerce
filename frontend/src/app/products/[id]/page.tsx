import { apiFetch, Product, Comment } from "@/lib/api";
import Link from "next/link";
import OrderForm from "./order-form";
import CommentsClient from "@/app/blog/[id]/comments-client";

export const revalidate = 0; // Dynamic route

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  const p = await apiFetch<Product>(`/api/products/${productId}`);
  const comments = await apiFetch<Comment[]>(`/api/comments?product_id=${productId}`);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/products" className="text-sm text-zinc-600 hover:text-black hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {p.image_url && (
            <div className="aspect-[4/3] w-full bg-zinc-50 border rounded-xl overflow-hidden mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <div className="text-sm text-zinc-500">{p.category?.name ?? "Uncategorized"}</div>
          <div className="text-2xl font-semibold">
            {p.currency} {p.price.toFixed(2)}
          </div>
          {p.description && (
            <div className="mt-4 text-zinc-700 whitespace-pre-wrap text-sm leading-relaxed">
              {p.description}
            </div>
          )}
        </div>
        <div>
          <OrderForm product={p} />
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        <CommentsClient productId={productId} initial={comments} />
      </div>
    </div>
  );
}
