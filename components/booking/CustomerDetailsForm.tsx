"use client";

import { useState } from "react";
import { ChevronRight, Upload, Info } from "lucide-react";

interface Props {
  deliveryFee: number;
  onSubmit: (data: CustomerDetails) => void;
  onBack: () => void;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  howHeard: string;
  deliveryOption: "self_collection" | "delivery";
  deliveryAddress?: string;
  idPhotoFrontUrl: string;
  idPhotoBackUrl: string;
}

export default function CustomerDetailsForm({ deliveryFee, onSubmit, onBack }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    howHeard: "",
    deliveryOption: "self_collection" as "self_collection" | "delivery",
    deliveryAddress: "",
  });
  const [idFront, setIdFront] = useState<string>("");
  const [idBack, setIdBack] = useState<string>("");
  const [uploading, setUploading] = useState<"front" | "back" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function uploadFile(file: File, side: "front" | "back") {
    setUploading(side);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("side", side);

      const res = await fetch("/api/upload/id", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (side === "front") setIdFront(data.url);
      else setIdBack(data.url);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [side === "front" ? "idFront" : "idBack"]: "Upload failed. Please try again.",
      }));
    } finally {
      setUploading(null);
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim() || !form.email.includes("@")) newErrors.email = "Valid email is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!idFront) newErrors.idFront = "Please upload the front of your driver's licence.";
    if (!idBack) newErrors.idBack = "Please upload the back of your driver's licence.";
    if (form.deliveryOption === "delivery" && !form.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      idPhotoFrontUrl: idFront,
      idPhotoBackUrl: idBack,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="As it appears on your ID"
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="your@email.com"
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="04XX XXX XXX"
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.phone ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Home Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Street, Suburb, QLD, Postcode"
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.address ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* How heard */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            How did you hear about us?
          </label>
          <select
            value={form.howHeard}
            onChange={(e) => set("howHeard", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select an option</option>
            <option value="google">Google Search</option>
            <option value="facebook">Facebook</option>
            <option value="word_of_mouth">Word of Mouth</option>
            <option value="gumtree">Gumtree</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Collection or delivery */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Collection Method <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "self_collection", label: "Self-Collection", sub: "Mudgeeraba (free)" },
              { value: "delivery", label: "Delivery", sub: `+$${deliveryFee} within 30 km` },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("deliveryOption", opt.value)}
                className={`border-2 rounded-xl p-4 text-left transition-all ${
                  form.deliveryOption === opt.value
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-sm text-gray-900">{opt.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {form.deliveryOption === "delivery" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.deliveryAddress}
              onChange={(e) => set("deliveryAddress", e.target.value)}
              placeholder="Full delivery address"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.deliveryAddress ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>
            )}
          </div>
        )}

        {/* ID Upload */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-2 mb-3">
            <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700">
              <strong>Why we need your ID:</strong> Your driver&apos;s licence is required to
              verify your identity and is stored securely. It is only accessible to the business
              owner and is not shared with third parties.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(["front", "back"] as const).map((side) => {
              const url = side === "front" ? idFront : idBack;
              const errorKey = side === "front" ? "idFront" : "idBack";
              return (
                <div key={side}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 capitalize">
                    Licence {side === "front" ? "Front" : "Back"} <span className="text-red-500">*</span>
                  </label>
                  <label
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
                      url
                        ? "border-green-400 bg-green-50"
                        : errors[errorKey]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={`ID ${side}`} className="w-full h-16 object-cover rounded-lg" />
                    ) : uploading === side ? (
                      <div className="text-xs text-gray-500">Uploading...</div>
                    ) : (
                      <>
                        <Upload size={20} className="text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Tap to upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadFile(file, side);
                      }}
                    />
                  </label>
                  {errors[errorKey] && (
                    <p className="text-red-500 text-xs mt-1">{errors[errorKey]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Continue to Terms
          <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
}
