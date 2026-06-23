import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { format } from "date-fns";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://splitithire.com.au";

  const lineItems = [
    {
      price_data: {
        currency: "aud",
        product_data: {
          name: `Log Splitter Hire — ${format(booking.startDate, "d MMM")} to ${format(booking.endDate, "d MMM yyyy")}`,
          description: `${booking.numberOfDays} day${booking.numberOfDays !== 1 ? "s" : ""} · ${booking.hireType} rate`,
        },
        unit_amount: Math.round(booking.totalCharged * 100),
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    customer_email: booking.customerEmail,
    metadata: {
      bookingId: booking.id,
      bondAmount: booking.bondAmount.toString(),
    },
    success_url: `${siteUrl}/confirmation?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/book?cancelled=1`,
    payment_intent_data: {
      metadata: { bookingId: booking.id },
    },
  });

  await prisma.booking.update({
    where: { id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
