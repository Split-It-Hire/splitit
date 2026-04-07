import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyOwnerReturn } from "@/lib/emails";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, type, photos, items, fuelLevel, notes } = body;

    if (!bookingId || !type || !["pickup", "return"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const checklist = {
      photos: photos || [],
      items: items || {},
      ...(fuelLevel ? { fuelLevel } : {}),
      ...(notes ? { notes } : {}),
      submittedAt: new Date().toISOString(),
    };

    if (type === "pickup") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          pickupChecklist: JSON.stringify(checklist),
          status: "active",
        },
      });
    } else {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          returnChecklist: JSON.stringify(checklist),
          status: "completed",
        },
      });

      // Notify owner
      await notifyOwnerReturn({
        id: booking.id,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        startDate: booking.startDate,
        endDate: booking.endDate,
        numberOfDays: booking.numberOfDays,
        hireType: booking.hireType,
        hireFeeTotal: booking.hireFeeTotal,
        deliveryFee: booking.deliveryFee,
        bondAmount: booking.bondAmount,
        totalCharged: booking.totalCharged,
        deliveryOption: booking.deliveryOption,
        deliveryAddress: booking.deliveryAddress,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Checklist error:", error);
    return NextResponse.json({ error: "Failed to save checklist" }, { status: 500 });
  }
}
