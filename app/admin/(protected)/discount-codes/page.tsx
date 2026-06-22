"use client";

import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight, Plus } from "lucide-react";

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  active: boolean;
  usageCount: number;
  maxUses: number | null;
  expiresAt: string | null;
  createdAt: string;
}

const emptyForm = {
  code: "",
  description: "",
  discountType: "fixed",
  discountValue: "",
  maxUses: "",
  expiresAt: "",
};

export default function DiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/discount-codes");
    setCodes(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.discountValue) {
      setError("Code and discount value are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/discount-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(emptyForm);
      await load();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create code");
    }
    setSaving(false);
  }

  async function toggleActive(code: DiscountCode) {
    await fetch("/api/admin/discount-codes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: code.id, active: !code.active }),
    });
    await load();
  }

  async function deleteCode(id: string) {
    if (!confirm("Delete this discount code?")) return;
    await fetch("/api/admin/discount-codes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <div className="max-w-3xl">
      <h1
        className="text-3xl font-extrabold uppercase text-gray-900 mb-6"
        style={{ fontFamily: "var(--font-barlow), sans-serif" }}
      >
        Discount Codes
      </h1>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Create New Code</h2>
        <form onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. TESTPAY"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Internal test code"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Type *</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="fixed">Fixed ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {form.discountType === "fixed" ? "Amount ($) *" : "Percentage (%) *"}
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "fixed" ? "e.g. 179" : "e.g. 10"}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Max Uses (optional)</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Leave blank for unlimited"
                min="1"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Expires (optional)</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <Plus size={16} />
            {saving ? "Creating..." : "Create Code"}
          </button>
        </form>
      </div>

      {/* Code list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <h2 className="font-bold text-gray-900 p-5 border-b border-gray-100">Existing Codes</h2>
        {loading ? (
          <div className="p-5 text-sm text-gray-400">Loading...</div>
        ) : codes.length === 0 ? (
          <div className="p-5 text-sm text-gray-400">No discount codes yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Code</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Discount</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Used</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {codes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-gray-900">{c.code}</span>
                    {c.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {c.discountType === "fixed"
                      ? `$${c.discountValue.toFixed(2)} off`
                      : `${c.discountValue}% off`}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {c.usageCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(c)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        c.active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {c.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {c.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => deleteCode(c.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
