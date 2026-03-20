"use client";

import { useState } from "react";
import { Product, apiFetch } from "@/lib/api";

export default function OrderForm({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
        }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-green-800">Order Placed Successfully!</h3>
        <p className="mt-2 text-sm text-green-700 leading-relaxed">
          Thank you for ordering <strong>{product.name}</strong>. Our team will process your order and contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Place an Order</h3>
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">{error}</div>}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full rounded-md border p-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-md border p-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0123 456 789"
            className="w-full rounded-md border p-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Delivery Address</label>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your detailed address..."
            rows={3}
            className="w-full rounded-md border p-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black resize-none"
          />
        </div>
      </div>
      
      <div className="pt-4 mt-4 border-t flex justify-between items-center">
        <div className="font-medium text-lg text-black">
          Total: {product.currency} {(product.price * quantity).toFixed(2)}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
        >
          {loading ? "Processing..." : "Order Now"}
        </button>
      </div>
    </form>
  );
}
