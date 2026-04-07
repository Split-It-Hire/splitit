"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Loader2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Machine has been cleaned",
  "No new damage observed",
  "Safety guard is intact",
  "All accessories are being returned",
];

const PHOTO_LABELS = ["Front", "Back", "Left side", "Right side"];

const FUEL_OPTIONS = ["Full", "3/4", "Half", "1/4", "Empty"];

interface Props {
  bookingId: string;
  bondAmount: number;
}

export default function ReturnChecklistForm({ bookingId, bondAmount }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [items, setItems] = useState<Record<string, boolean>>({});
  const [fuelLevel, setFuelLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function uploadPhoto(file: File, idx: number) {
    setUploadingIdx(idx);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("side", `return-${idx}`);

    const res = await fetch("/api/upload/id", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingIdx(null);

    if (!res.ok) {
      setError("Photo upload failed.");
      return;
    }

    setPhotos((prev) => {
      const next = [...prev];
      next[idx] = data.url;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (photos.filter(Boolean).length < 4) {
      setError("Please upload all 4 photos.");
      return;
    }
    if (!fuelLevel) {
      setError("Please select the fuel level.");
      return;
    }
    if (!confirmed) {
      setError("Please confirm the return condition.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/checklists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        type: "return",
        photos: photos.filter(Boolean),
        items,
        fuelLevel,
        notes,
      }),
    });

    if (!res.ok) {
      setError("Submission failed. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(`/checklist/return/${bookingId}/done`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photos */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-1">Machine Photos</h2>
        <p className="text-xs text-gray-500 mb-4">4 photos — one from each side.</p>
        <div className="grid grid-cols-2 gap-3">
          {PHOTO_LABELS.map((label, idx) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
                  photos[idx] ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {photos[idx] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photos[idx]} alt={label} className="w-full h-20 object-cover rounded-lg" />
                ) : uploadingIdx === idx ? (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 size={14} className="animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-gray-300 mb-1" />
                    <span className="text-xs text-gray-400">Take photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto(file, idx);
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Return Checklist</h2>
        <div className="space-y-3 mb-4">
          {CHECKLIST_ITEMS.map((item) => (
            <label key={item} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!items[item]}
                onChange={(e) => setItems((prev) => ({ ...prev, [item]: e.target.checked }))}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>

        {/* Fuel level */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fuel Level on Return <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {FUEL_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFuelLevel(opt)}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  fuelLevel === opt
                    ? "bg-green-700 border-green-700 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {fuelLevel !== "Full" && fuelLevel && (
            <p className="text-xs text-amber-600 mt-2">
              Note: A fuel levy applies for machines returned with less than a full tank.
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Any issues to report? (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Minor scratch on left panel (was there at pickup), ran out of fuel once..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Confirm */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700 font-medium">
            I confirm the machine is in the condition shown in the photos above and I am returning it as described.
          </span>
        </label>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        After we review the return, your <strong>${bondAmount.toFixed(2)} bond hold</strong> will
        be released (or partially captured if there are charges). You&apos;ll receive an email confirmation.
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle size={18} />
            Submit Return Checklist
          </>
        )}
      </button>
    </form>
  );
}
