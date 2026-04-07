import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Admin: release or capture bond
export async function POST(req: NextRequest) {
  try {
    // Verify admin
    const authHeader = req.headers.get("x-admin-token");
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, action, captureAmount, reason } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.stripeBondIntentId) {
      return NextResponse.json({ error: "No bond payment intent found" }, { status: 400 });
    }

    if (action === "release") {
      await stripe.paymentIntents.cancel(booking.stripeBondIntentId);
      await prisma.booking.update({
        where: { id: bookingId },
        data: { bondStatus: "released" },
      });
      return NextResponse.json({ success: true, action: "released" });
    }

    if (action === "capture") {
      const amount = captureAmount ? Math.round(captureAmount * 100) : undefined;
      await stripe.paymentIntents.capture(booking.stripeBondIntentId, {
        amount_to_capture: amount,
      });
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          bondStatus: amount && amount < booking.bondAmount * 100 ? "captured_partial" : "captured_full",
          bondCapturedAmount: captureAmount || booking.bondAmount,
          bondCaptureReason: reason || null,
        },
      });
      return NextResponse.json({ success: true, action: "captured" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Bond action error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bond action failed" },
      { status: 500 }
    );
  }
}
