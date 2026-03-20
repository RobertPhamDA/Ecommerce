"use client";

import { useEffect, useState } from "react";

import { apiFetch, Booking } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function BookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [service, setService] = useState("Consultation");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    const items = await apiFetch<Booking[]>("/api/bookings", { token });
    setBookings(items);
  };

  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const create = async () => {
    setErr(null);
    if (!token) {
      setErr("Login required.");
      return;
    }
    const created = await apiFetch<Booking>("/api/bookings", {
      method: "POST",
      token,
      body: JSON.stringify({
        service_name: service,
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString()
      })
    });
    setBookings([created, ...bookings]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Bookings</h1>
        <p className="text-sm text-zinc-600">Create and manage your bookings.</p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="rounded-md border px-3 py-2 text-sm"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Service name"
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
        </div>
        <button className="mt-3 rounded-md bg-black px-4 py-2 text-sm text-white" onClick={create}>
          Create booking
        </button>
        {err ? <div className="mt-2 text-xs text-red-600">{err}</div> : null}
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-xl border bg-white p-4">
            <div className="flex justify-between text-sm">
              <div className="font-medium">{b.service_name}</div>
              <div className="text-xs text-zinc-600">{b.status}</div>
            </div>
            <div className="mt-2 text-xs text-zinc-600">
              {new Date(b.start_at).toLocaleString()} → {new Date(b.end_at).toLocaleString()}
            </div>
            {b.notes ? <div className="mt-2 text-sm">{b.notes}</div> : null}
          </div>
        ))}
        {!token ? (
          <div className="rounded-xl border bg-white p-4 text-sm text-zinc-600">
            Login to view/create bookings.
          </div>
        ) : null}
      </div>
    </div>
  );
}

