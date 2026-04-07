import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReturnChecklistForm from "@/components/checklist/ReturnChecklistForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Return Condition Checklist",
  robots: { index: false },
};

interface Props {
  params: Promise<{ bookingId: string }>;
}

export default async function ReturnChecklistPage({ params }: Props) {
  const { bookingId } = await params;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || !["confirmed", "active", "completed"].includes(booking.status)) {
    notFound();
  }

  if (booking.returnChecklist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-sm">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="font-bold text-gray-900 mb-2">Return checklist submitted</h1>
          <p className="text-sm text-gray-500">
            Thanks for completing the return checklist. We&apos;ll review it and release your bond shortly.
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
            Return Condition Checklist
          </h1>
          <p className="text-sm text-gray-500">
            Hi {booking.customerName} — please complete this before returning the machine.
          </p>
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
            <strong>Return by:</strong> {format(booking.endDate, "EEEE d MMMM yyyy")} at 5:00 PM
          </div>
        </div>

        <ReturnChecklistForm bookingId={bookingId} bondAmount={booking.bondAmount} />
      </div>
    </div>
  );
}
