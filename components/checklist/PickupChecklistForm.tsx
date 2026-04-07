"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Loader2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Machine is clean and free of debris",
  "No visible damage to the machine body",
  "Hydraulic fluid level is correct",
  "Safety guard is intact and secure",
  "All accessories are present (safety glasses, gloves)",
  "Fuel tank is full",
  "Engine starts and runs correctly",
];

const PHOTO_LABELS = ["Front", "Back", "Left side", "Right side"];

interface Props {
  bookingId: string;
}

export default function PickupChecklistForm({ bookingId }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [items, setItems] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function uploadPhoto(file: File, idx: number) {
    setUploadingIdx(idx);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("side", `pickup-${idx}`);

    const res = await fetch("/api/upload/id", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingIdx(null);

    if (!res.ok) {
      setError("Photo upload failed. Please try again.");
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
      setError("Please upload all 4 photos of the machine.");
      return;
    }

    const unchecked = CHECKLIST_ITEMS.filter((item) => !items[item]);
    if (unchecked.length > 0) {
      setError("Please tick all checklist items before submitting.");
      return;
    }

    if (!confirmed) {
      setError("Please confirm the condition statement.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/checklists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        type: "pickup",
        photos: photos.filter(Boolean),
        items,
      }),
    });

    if (!res.ok) {
      setError("Submission failed. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(`/checklist/pickup/${bookingId}/done`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photos */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-1">Machine Photos (required)</h2>
        <p className="text-xs text-gray-500 mb-4">Take 4 photos — one from each side of the machine.</p>
        <div className="grid grid-cols-2 gap-3">
          {PHOTO_LABELS.map((label, idx) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
                  photos[idx]
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {photos[idx] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photos[idx]}
                    alt={label}
                    className="w-full h-20 object-cover rounded-lg"
                  />
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
        <h2 className="font-bold text-gray-900 mb-4">Condition Checklist</h2>
        <div className="space-y-3">
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
      </div>

      {/* Confirmation */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700 font-medium">
            I confirm the machine is in the condition shown in the photos above and all checklist items have been verified.
          </span>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
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
            Submit Pickup Checklist
          </>
        )}
      </button>
    </form>
  );
}
