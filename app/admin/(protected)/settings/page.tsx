"use client";

import { useState, useEffect, useRef } from "react";
import { X, Video, CheckCircle2, Loader2 } from "lucide-react";
import { upload } from "@vercel/blob/client";

interface Settings {
  dailyRate: number;
  weekendRate: number;
  weeklyRate: number;
  bondAmount: number;
  deliveryFee: number;
  deliveryRadius: number;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  pickupSuburb: string;
  pickupAddress: string;
  pickupInstructions: string;
  returnInstructions: string;
  heroVideoUrl: string | null;
}

/** Convert a private blob URL to our streaming proxy path */
function proxyUrl(blobUrl: string) {
  return `/api/hero-video?url=${encodeURIComponent(blobUrl)}`;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false); });
  }, []);

  function set(field: keyof Settings, value: string | number | null) {
    setSettings((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleVideoUpload(file: File) {
    setVideoUploading(true);
    setVideoError(null);

    try {
      const filename = `hero-video-${Date.now()}.${file.name.split(".").pop() || "mp4"}`;
      const blob = await upload(filename, file, {
        access: "private",
        handleUploadUrl: "/api/upload/hero-video",
        contentType: file.type,
      });

      // Save the blob URL to settings state and DB
      setSettings((prev) => prev ? { ...prev, heroVideoUrl: blob.url } : prev);
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroVideoUrl: blob.url }),
      });
    } catch (err) {
      setVideoError((err as Error).message || "Upload failed");
    } finally {
      setVideoUploading(false);
    }
  }

  async function removeVideo() {
    setSettings((prev) => prev ? { ...prev, heroVideoUrl: null } : prev);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroVideoUrl: null }),
    });
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (!settings) return null;

  const s = settings as Settings;

  function numField(label: string, field: keyof Settings, prefix = "$") {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
          {prefix && (
            <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">{prefix}</span>
          )}
          <input
            type="number"
            value={s[field] as number}
            onChange={(e) => set(field, parseFloat(e.target.value))}
            className="flex-1 px-3 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>
    );
  }

  function textField(label: string, field: keyof Settings, placeholder?: string) {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <input
          type="text"
          value={s[field] as string}
          onChange={(e) => set(field, e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    );
  }

  function textareaField(label: string, field: keyof Settings) {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <textarea
          value={s[field] as string}
          onChange={(e) => set(field, e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1
        className="text-3xl font-extrabold uppercase text-gray-900 mb-6"
        style={{ fontFamily: "var(--font-barlow), sans-serif" }}
      >
        Settings
      </h1>

      <div className="space-y-6">
        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            {numField("Daily Rate", "dailyRate")}
            {numField("Weekend Rate (Fri–Sun)", "weekendRate")}
            {numField("Weekly Rate (7 days)", "weeklyRate")}
            {numField("Security Bond", "bondAmount")}
            {numField("Delivery Fee", "deliveryFee")}
            {numField("Delivery Radius (km)", "deliveryRadius", "")}
          </div>
        </div>

        {/* Business */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Business Details</h2>
          <div className="space-y-4">
            {textField("Business Name", "businessName")}
            {textField("Contact Email", "contactEmail", "brett@splitithire.com.au")}
            {textField("Contact Phone", "contactPhone", "0414 601 836")}
            {textField("Pickup Suburb", "pickupSuburb", "Mudgeeraba")}
            {textField("Pickup Address (sent in reminder email)", "pickupAddress", "3 Carrama Court, Mudgeeraba QLD 4213")}
          </div>
        </div>

        {/* Hero Video */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-1">Hero Video</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload an 8–10 second video to display in the homepage hero section. MP4, MOV or WebM. Max 200 MB.
          </p>

          {s.heroVideoUrl ? (
            <div className="space-y-3">
              {/* Preview via proxy (private blob needs token) */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-gray-200">
                <video
                  src={proxyUrl(s.heroVideoUrl)}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <CheckCircle2 size={16} className="text-green-600" />
                  Video active on homepage
                </div>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Replace
                </button>
                <button
                  onClick={removeVideo}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  <X size={14} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div>
              {videoUploading ? (
                <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50">
                  <Loader2 size={32} className="mx-auto mb-3 text-green-600 animate-spin" />
                  <p className="text-sm font-semibold text-green-700">Uploading video...</p>
                  <p className="text-xs text-green-500 mt-1">This may take a moment for large files</p>
                </div>
              ) : (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-colors group"
                >
                  <Video size={32} className="mx-auto mb-3 text-gray-300 group-hover:text-green-500 transition-colors" />
                  <p className="text-sm font-semibold text-gray-600 group-hover:text-green-700">
                    Click to upload hero video
                  </p>
                  <p className="text-xs text-gray-400 mt-1">MP4 · MOV · WebM · Max 200 MB</p>
                </button>
              )}
              {videoError && (
                <p className="mt-2 text-sm text-red-600">{videoError}</p>
              )}
            </div>
          )}

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/mov"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleVideoUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Customer Instructions</h2>
          <div className="space-y-4">
            {textareaField("Pickup Instructions (sent in reminder email)", "pickupInstructions")}
            {textareaField("Return Instructions (sent on return day)", "returnInstructions")}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-colors text-lg"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
