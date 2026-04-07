"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "confirmed", "active", "completed", "cancelled", "disputed"];

interface Props {
  bookingId: string;
  currentStatus: string;
}

export default function BookingStatusControl({ bookingId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    setLoading(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="font-bold text-gray-900 mb-3">Booking Status</h2>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-3 capitalize"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
      >
        {loading ? "Saving..." : saved ? "Saved ✓" : "Update Status"}
      </button>
    </div>
  );
}
