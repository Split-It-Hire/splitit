import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";
import { CheckCircle, Calendar, MapPin, Clock, Download } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ bookingId?: string; session_id?: string }>;
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const params = await searchParams;
  const { bookingId } = params;

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking not found</h1>
          <Link href="/book" className="text-green-700 hover:underline">Make a new booking</Link>
        </div>
      </div>
    );
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || (booking.status !== "confirmed" && booking.status !== "active" && booking.status !== "completed")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking not confirmed yet</h1>
          <p className="text-gray-500 mb-4">If you just paid, it may take a moment to process. Check your email for confirmation.</p>
          <Link href="/" className="text-green-700 hover:underline">Go to homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-green-600" />
          </div>
          <h1
            className="text-3xl font-extrabold uppercase text-gray-900 mb-1"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            You&apos;re Booked!
          </h1>
          <p className="text-gray-500">
            Confirmation sent to <strong>{booking.customerEmail}</strong>
          </p>
        </div>

        {/* Booking card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-green-700 px-6 py-4">
            <div className="text-green-200 text-xs font-semibold mb-0.5">Booking Reference</div>
            <div className="text-white font-mono font-bold text-lg">{booking.id}</div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Hire Period</div>
                <div className="text-sm text-gray-600">
                  {format(booking.startDate, "EEEE d MMMM yyyy")} –{" "}
                  {format(booking.endDate, "EEEE d MMMM yyyy")}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {booking.numberOfDays} day{booking.numberOfDays !== 1 ? "s" : ""} ·{" "}
                  <span className="capitalize">{booking.hireType} rate</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Collection</div>
                <div className="text-sm text-gray-600">
                  {booking.deliveryOption === "delivery"
                    ? `Delivery to ${booking.deliveryAddress}`
                    : "Self-collection from Mudgeeraba — full address in your reminder email 24 hrs before pickup"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Return by</div>
                <div className="text-sm text-gray-600">
                  {format(booking.endDate, "EEEE d MMMM yyyy")} · 5:00 PM
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hire fee</span>
              <span className="font-semibold">${booking.hireFeeTotal.toFixed(2)}</span>
            </div>
            {booking.deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery fee</span>
                <span className="font-semibold">${booking.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span>Total charged</span>
              <span className="text-green-700">${booking.totalCharged.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-amber-700">
              <span>Bond held (not charged)</span>
              <span className="font-semibold">${booking.bondAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Add to calendar */}
        <a
          href={`/api/bookings/ics?bookingId=${booking.id}`}
          className="flex items-center justify-center gap-2 w-full border-2 border-green-700 text-green-700 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors mb-4"
        >
          <Download size={18} />
          Add to Calendar (.ics)
        </a>

        {/* Next steps */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-3">What happens next</h2>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="bg-green-100 text-green-700 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">1</span>
              <span>Check your email for this booking confirmation (including what to bring).</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-green-100 text-green-700 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">2</span>
              <span>24 hours before pickup, you&apos;ll receive another email with the full pickup address and a link to the condition checklist.</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-green-100 text-green-700 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">3</span>
              <span>On your return date, complete the return checklist — we&apos;ll then release your bond.</span>
            </li>
          </ol>
        </div>

        <div className="text-center text-sm text-gray-500">
          Questions? Email{" "}
          <a href="mailto:brett@splitithire.com.au" className="text-green-700 hover:underline">
            brett@splitithire.com.au
          </a>{" "}
          or call{" "}
          <a href="tel:+61414601836" className="text-green-700 hover:underline">
            0414 601 836
          </a>
        </div>
      </div>
    </div>
  );
}
