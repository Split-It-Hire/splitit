import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import PickupChecklistForm from "@/components/checklist/PickupChecklistForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pickup Condition Checklist",
  robots: { index: false },
};

interface Props {
  params: Promise<{ bookingId: string }>;
}

export default async function PickupChecklistPage({ params }: Props) {
  const { bookingId } = await params;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || !["confirmed", "active"].includes(booking.status)) {
    notFound();
  }

  if (booking.pickupChecklist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-sm">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="font-bold text-gray-900 mb-2">Pickup checklist already submitted</h1>
          <p className="text-sm text-gray-500">
            The pickup condition checklist for booking {bookingId} has already been completed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1
            className="text-2xl font-extrabold uppercase text-gray-900 mb-1"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Pickup Condition Checklist
          </h1>
          <p className="text-sm text-gray-500">
            Hi {booking.customerName} — please complete this checklist before leaving with the machine.
          </p>
          <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
            <strong>Booking:</strong> {format(booking.startDate, "d MMM")} – {format(booking.endDate, "d MMM yyyy")}
          </div>
        </div>

        <PickupChecklistForm bookingId={bookingId} />
      </div>
    </div>
  );
}
