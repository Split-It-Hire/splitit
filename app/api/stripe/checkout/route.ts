import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { format, parseISO } from "date-fns";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, endDate, price, details, terms, deliveryFee, bondAmount } = body;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const totalAmount = price.hireFeeTotal + (deliveryFee || 0);

    // Build line items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineItems: any[] = [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: `Log Splitter Hire — ${format(start, "d MMM")} to ${format(end, "d MMM yyyy")}`,
            description: `${price.numberOfDays} day${price.numberOfDays !== 1 ? "s" : ""} · ${price.hireType} rate · Self-collection from Mudgeeraba`,
          },
          unit_amount: Math.round(price.hireFeeTotal * 100),
        },
        quantity: 1,
      },
    ];

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "aud",
          product_data: {
            name: "Delivery Fee",
            description: `Delivery to ${details.deliveryAddress}`,
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Create a pending booking record first
    const booking = await prisma.booking.create({
      data: {
        status: "pending",
        customerName: details.name,
        customerEmail: details.email,
        customerPhone: details.phone,
        customerAddress: details.address,
        howHeard: details.howHeard || null,
        idPhotoFrontUrl: details.idPhotoFrontUrl,
        idPhotoBackUrl: details.idPhotoBackUrl,
        startDate: start,
        endDate: end,
        numberOfDays: price.numberOfDays,
        hireType: price.hireType,
        deliveryOption: details.deliveryOption,
        deliveryAddress: details.deliveryAddress || null,
        hireRate: price.hireRate,
        hireFeeTotal: price.hireFeeTotal,
        deliveryFee: deliveryFee || 0,
        bondAmount: bondAmount,
        totalCharged: totalAmount,
        termsAcceptedAt: new Date(),
        signatureDataUrl: terms.signatureDataUrl,
        bondStatus: "pending",
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: details.email,
      metadata: {
        bookingId: booking.id,
        bondAmount: bondAmount.toString(),
      },
      success_url: `${siteUrl}/confirmation?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/book?cancelled=1`,
      payment_intent_data: {
        metadata: {
          bookingId: booking.id,
        },
      },
    });

    // Save session ID to booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
