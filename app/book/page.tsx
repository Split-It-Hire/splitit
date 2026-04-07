import type { Metadata } from "next";
import BookingWizard from "@/components/booking/BookingWizard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Book Your Log Splitter",
  description: "Check availability and book your hydraulic log splitter hire online. Select dates, upload ID, pay securely via Stripe.",
};

async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "default" } });
  }
  return settings;
}

export default async function BookPage() {
  const settings = await getSettings();

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-extrabold uppercase text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Book Your Hire
          </h1>
          <p className="text-gray-500 text-sm">Complete all steps below — takes about 5 minutes.</p>
        </div>

        <BookingWizard
          rates={{
            daily: settings.dailyRate,
            weekend: settings.weekendRate,
            weekly: settings.weeklyRate,
          }}
          bondAmount={settings.bondAmount}
          deliveryFee={settings.deliveryFee}
        />
      </div>
    </div>
  );
}
