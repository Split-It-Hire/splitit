import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/emails";
import Stripe from "stripe";

// In Next.js App Router, request body is read as a stream by default — no config needed.

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        const bondAmount = parseFloat(session.metadata?.bondAmount || "500");

        if (!bookingId) break;

        // Update booking to confirmed
        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "confirmed",
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
          },
        });

        // Create bond pre-authorisation PaymentIntent
        // Get customer's payment method from the session
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );

        const paymentMethodId = paymentIntent.payment_method as string;
        const customerId = paymentIntent.customer as string;

        if (paymentMethodId) {
          try {
            const bondIntent = await stripe.paymentIntents.create({
              amount: Math.round(bondAmount * 100),
              currency: "aud",
              customer: customerId || undefined,
              payment_method: paymentMethodId,
              capture_method: "manual",
              confirm: true,
              description: `Security bond for booking ${bookingId}`,
              metadata: { bookingId, type: "bond" },
              return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?bookingId=${bookingId}`,
              off_session: true,
            });

            await prisma.booking.update({
              where: { id: bookingId },
              data: {
                stripeBondIntentId: bondIntent.id,
                bondStatus: "held",
              },
            });
          } catch (bondErr) {
            console.error("Bond pre-auth failed:", bondErr);
            // Bond failure is non-fatal — booking still confirmed
            await prisma.booking.update({
              where: { id: bookingId },
              data: { adminNotes: "Bond pre-auth failed — collect manually" },
            });
          }
        }

        // Send confirmation email
        await sendBookingConfirmation({
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

        break;
      }

      case "payment_intent.canceled": {
        const pi = event.data.object as Stripe.PaymentIntent;
        if (pi.metadata?.type === "bond") {
          await prisma.booking.updateMany({
            where: { stripeBondIntentId: pi.id },
            data: { bondStatus: "released" },
          });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        if (pi.metadata?.type === "bond") {
          await prisma.booking.updateMany({
            where: { stripeBondIntentId: pi.id },
            data: { bondStatus: "captured_full" },
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
