export type TokenResponse = { access_token: string; token_type: string };

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  image_url?: string | null;
  category_id?: number | null;
  category?: Category | null;
  created_at: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  published: boolean;
  created_at: string;
};

export type Comment = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content: string;
  created_at: string;
};

export type Booking = {
  id: number;
  user_id?: number | null;
  service_name: string;
  notes?: string | null;
  status: string;
  start_at: string;
  end_at: string;
  created_at: string;
};

export type Order = {
  id: number;
  user_id?: number | null;
  product_id: number;
  quantity: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: string;
  created_at: string;
  product?: Product | null;
};

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
}

export function apiBaseUrl() {
  return baseUrl();
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const headers = new Headers(opts.headers);
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);

  const res = await fetch(`${baseUrl()}${path}`, { ...opts, headers, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

