"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  bookingId: string;
  bondStatus: string;
  bondAmount: number;
  stripeBondIntentId: string | null;
}

export default function BondActions({
  bookingId,
  bondStatus,
  bondAmount,
  stripeBondIntentId,
}: Props) {
  const [loading, setLoading] = useState<"release" | "capture" | null>(null);
  const [captureAmount, setCaptureAmount] = useState(bondAmount.toString());
  const [reason, setReason] = useState("");
  const [showCapture, setShowCapture] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  if (!stripeBondIntentId || bondStatus === "released" || bondStatus === "captured_full") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-2">Bond</h2>
        <div className={`text-sm px-3 py-2 rounded-lg ${
          bondStatus === "released" ? "bg-green-50 text-green-700" :
          bondStatus === "captured_full" ? "bg-red-50 text-red-700" :
          "bg-gray-50 text-gray-600"
        }`}>
          Bond status: <strong>{bondStatus.replace("_", " ")}</strong>
          {bondStatus === "captured_full" && ` — $${bondAmount.toFixed(2)} charged`}
        </div>
        {!stripeBondIntentId && (
          <p className="text-xs text-gray-400 mt-2">No bond payment intent — collect manually if needed.</p>
        )}
      </div>
    );
  }

  async function handleAction(action: "release" | "capture") {
    setLoading(action);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/stripe/bond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": document.cookie
          .split("; ")
          .find((r) => r.startsWith("admin_token="))
          ?.split("=")[1] || "",
      },
      body: JSON.stringify({
        bookingId,
        action,
        captureAmount: action === "capture" ? parseFloat(captureAmount) : undefined,
        reason: action === "capture" ? reason : undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Action failed");
    } else {
      setSuccess(action === "release" ? "Bond released successfully." : "Bond captured successfully.");
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="font-bold text-gray-900 mb-1">Bond Management</h2>
      <p className="text-xs text-gray-400 mb-4">
        ${bondAmount.toFixed(2)} held · Status: <strong>{bondStatus.replace("_", " ")}</strong>
      </p>

      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 rounded-lg p-3">{error}</div>
      )}
      {success && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 rounded-lg p-3">{success}</div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => handleAction("release")}
          disabled={loading !== null}
          className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors"
        >
          {loading === "release" ? "Releasing..." : "Release Bond (No Charge)"}
        </button>

        {!showCapture ? (
          <button
            onClick={() => setShowCapture(true)}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors"
          >
            Capture Bond (Charge Customer)
          </button>
        ) : (
          <div className="bg-red-50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-red-800">Capture Bond</p>
            <div>
              <label className="text-xs text-red-700 font-medium">Amount to capture ($)</label>
              <input
                type="number"
                value={captureAmount}
                onChange={(e) => setCaptureAmount(e.target.value)}
                max={bondAmount}
                min={0}
                step={0.01}
                className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="text-xs text-red-700 font-medium">Reason (required)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="e.g. Damage to hydraulic hose — repair cost $150"
                className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowCapture(false); setReason(""); }}
                className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction("capture")}
                disabled={!reason.trim() || loading !== null}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold text-sm py-2 rounded-lg transition-colors"
              >
                {loading === "capture" ? "Capturing..." : "Confirm Capture"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
