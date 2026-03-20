import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">Full‑stack Ecommerce Starter</h1>
        <p className="mt-2 text-sm text-zinc-600">
        </p>
        <div className="mt-4 flex gap-3">
          <Link className="rounded-md bg-black px-4 py-2 text-sm text-white" href="/products">
            Browse products
          </Link>
          <Link className="rounded-md border px-4 py-2 text-sm" href="/blog">
            Read blog
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link className="rounded-xl border bg-white p-5 hover:bg-zinc-50" href="/bookings">
          <div className="text-sm font-medium">Booking system</div>
          <div className="mt-1 text-xs text-zinc-600">Create and manage bookings.</div>
        </Link>
        <Link className="rounded-xl border bg-white p-5 hover:bg-zinc-50" href="/admin">
          <div className="text-sm font-medium">Admin dashboard</div>
          <div className="mt-1 text-xs text-zinc-600">CRUD products, categories, posts.</div>
        </Link>
      </div>
    </div>
  );
}

