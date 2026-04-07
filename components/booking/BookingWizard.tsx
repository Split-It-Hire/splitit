"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle, ChevronRight } from "lucide-react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import CustomerDetailsForm from "./CustomerDetailsForm";
import TermsStep from "./TermsStep";
// Stripe.js loaded for future use (e.g., Elements); redirect uses session URL directly.

interface Rates {
  daily: number;
  weekend: number;
  weekly: number;
}

interface PriceResult {
  hireType: "daily" | "weekend" | "weekly";
  numberOfDays: number;
  hireRate: number;
  hireFeeTotal: number;
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

interface TermsAcceptance {
  agreed: boolean;
  signatureDataUrl: string;
  isAdult: boolean;
  acceptsResponsibility: boolean;
}

const STEPS = [
  { id: 1, label: "Dates" },
  { id: 2, label: "Details" },
  { id: 3, label: "Terms" },
  { id: 4, label: "Payment" },
];

export default function BookingWizard({
  rates,
  bondAmount,
  deliveryFee,
}: {
  rates: Rates;
  bondAmount: number;
  deliveryFee: number;
}) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [price, setPrice] = useState<PriceResult | null>(null);
  const [details, setDetails] = useState<CustomerDetails | null>(null);
  const [terms, setTerms] = useState<TermsAcceptance | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDateSelect(start: Date, end: Date, p: PriceResult) {
    setStartDate(start);
    setEndDate(end);
    setPrice(p);
  }

  function proceedFromDates() {
    if (!startDate || !price) {
      setError("Please select your hire dates.");
      return;
    }
    // If user only clicked one date (endDate still null), treat as 1-day hire.
    if (!endDate) setEndDate(startDate);
    setError(null);
    setStep(2);
  }

  function proceedFromDetails(d: CustomerDetails) {
    setDetails(d);
    setError(null);
    setStep(3);
  }

  function proceedFromTerms(t: TermsAcceptance) {
    setTerms(t);
    setError(null);
    setStep(4);
  }

  async function handlePayment() {
    if (!startDate || !price || !details || !terms) return;
    const effectiveEndDate = endDate ?? startDate;

    setSubmitting(true);
    setError(null);

    const delivery =
      details.deliveryOption === "delivery" ? deliveryFee : 0;

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: effectiveEndDate.toISOString(),
          price,
          details,
          terms,
          deliveryFee: delivery,
          bondAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Redirect to Stripe Checkout using the session URL
      if (!data.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const totalAmount =
    price && details
      ? price.hireFeeTotal +
        (details.deliveryOption === "delivery" ? deliveryFee : 0)
      : null;

  return (
    <div>
      {/* Step progress */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.id
                    ? "bg-green-600 text-white"
                    : step === s.id
                    ? "bg-green-700 text-white ring-4 ring-green-100"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.id ? <CheckCircle size={16} /> : s.id}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  step >= s.id ? "text-green-700" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  step > s.id ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Dates */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 text-xl mb-1"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
            Select Your Hire Dates
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Click a start date, then an end date. Price calculates automatically.
          </p>
          <AvailabilityCalendar onSelect={handleDateSelect} rates={rates} />

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {/* Bond info */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-amber-800 mb-1">Security Bond</p>
            <p className="text-amber-700">
              A <strong>${bondAmount}</strong> bond will be held on your card — not charged —
              as a security deposit. It&apos;s released after the machine is returned in good
              condition.
            </p>
          </div>

          <button
            onClick={proceedFromDates}
            className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Continue to Your Details
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && startDate && endDate && price && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 text-xl mb-1"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
            Your Details
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm mb-6">
            <span className="font-semibold text-green-800">
              {format(startDate, "d MMM")} – {format(endDate, "d MMM yyyy")}
            </span>
            <span className="text-green-700">
              {" "}&nbsp;·&nbsp; {price.numberOfDays} day{price.numberOfDays !== 1 ? "s" : ""} &nbsp;·&nbsp;{" "}
              <strong>${price.hireFeeTotal}</strong> hire fee
            </span>
          </div>

          <CustomerDetailsForm
            deliveryFee={deliveryFee}
            onSubmit={proceedFromDetails}
            onBack={() => setStep(1)}
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      )}

      {/* Step 3: Terms */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 text-xl mb-1"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
            Terms of Hire
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Please read the full terms below and sign to confirm your acceptance.
          </p>
          <TermsStep onAccept={proceedFromTerms} onBack={() => setStep(2)} />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      )}

      {/* Step 4: Payment review */}
      {step === 4 && startDate && endDate && price && details && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 text-xl mb-4"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
            Review &amp; Pay
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hire dates</span>
              <span className="font-semibold">
                {format(startDate, "d MMM")} – {format(endDate, "d MMM yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Hire fee ({price.numberOfDays} day{price.numberOfDays !== 1 ? "s" : ""})
              </span>
              <span className="font-semibold">${price.hireFeeTotal.toFixed(2)}</span>
            </div>
            {details.deliveryOption === "delivery" && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery fee</span>
                <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
              <span>Total charged now</span>
              <span className="text-xl text-green-700">${totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              <span>Bond held (not charged)</span>
              <span className="font-semibold">${bondAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm space-y-1">
            <p><strong>Name:</strong> {details.name}</p>
            <p><strong>Email:</strong> {details.email}</p>
            <p><strong>Phone:</strong> {details.phone}</p>
            <p><strong>Collection:</strong> {details.deliveryOption === "delivery" ? `Delivery to ${details.deliveryAddress}` : "Self-collection from Mudgeeraba"}</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500 mb-4">
            By clicking &ldquo;Pay Now&rdquo; you will be redirected to Stripe&apos;s secure checkout.
            Your hire fee is charged immediately. The bond is a hold only.
          </p>

          <button
            onClick={handlePayment}
            disabled={submitting}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
          >
            {submitting ? "Redirecting to payment..." : `Pay $${totalAmount?.toFixed(2)} Now`}
          </button>

          <button
            onClick={() => setStep(3)}
            className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
