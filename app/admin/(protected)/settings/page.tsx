"use client";

import { useState, useEffect } from "react";

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
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false); });
  }, []);

  function set(field: keyof Settings, value: string | number) {
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

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (!settings) return null;

  // settings is non-null here, but TypeScript doesn't narrow through closures
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
