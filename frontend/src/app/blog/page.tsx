import Link from "next/link";

import { apiFetch, Post } from "@/lib/api";

export default async function BlogPage() {
  const posts = await apiFetch<Post[]>("/api/posts");

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">Blog</h1>
          <p className="text-sm text-zinc-600">Posts from the backend.</p>
        </div>
        <Link className="text-sm underline" href="/admin/posts">
          Admin manage
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.id}`} className="block rounded-xl border bg-white overflow-hidden hover:border-black transition-colors focus:ring-2 focus:ring-black focus:outline-none flex flex-col sm:flex-row gap-0 sm:gap-4">
            {p.cover_image_url && (
              <div className="w-full sm:w-48 aspect-video sm:aspect-[4/3] bg-zinc-50 border-r-0 sm:border-r border-b sm:border-b-0 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 sm:p-5 flex-1">
              <div className="text-lg font-medium">{p.title}</div>
              <div className="mt-2 text-sm text-zinc-600 line-clamp-2">{p.excerpt ?? p.slug}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

