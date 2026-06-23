"use client";

import { useState } from "react";
import { Link, Copy, Check } from "lucide-react";

export default function PaymentLinkButton({
  bookingId,
  customerEmail,
}: {
  bookingId: string;
  customerEmail: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/bookings/${bookingId}/payment-link`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      setUrl(data.url);
    } else {
      setError(data.error || "Failed to generate link");
    }
    setLoading(false);
  }

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="font-bold text-gray-900 mb-2">Payment Link</h2>
      <p className="text-sm text-gray-500 mb-3">
        Generate a Stripe checkout link to send to {customerEmail}.
      </p>

      {!url ? (
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 w-full justify-center bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
        >
          <Link size={15} />
          {loading ? "Generating..." : "Generate Payment Link"}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-600 truncate flex-1 font-mono">{url}</span>
            <button
              onClick={copy}
              className="shrink-0 text-gray-400 hover:text-green-700 transition-colors"
            >
              {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            {copied ? "Copied!" : "Copy and send this link to the customer."}
          </p>
          <button
            onClick={generate}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Regenerate
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
