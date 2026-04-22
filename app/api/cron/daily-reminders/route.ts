import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPickupReminder, sendReturnReminder } from "@/lib/emails";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for sending multiple emails

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.splitithire.com.au";

// Vercel calls this route on schedule and passes CRON_SECRET in the Authorization header.
// We reject any request that doesn't carry it so the endpoint can't be abused publicly.
function isAuthorised(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

// Returns a UTC date range covering the entire calendar day of `date` in AEST (UTC+10).
// Queensland does not observe daylight saving — offset is always +10.
function aestDayBoundsUtc(date: Date): { start: Date; end: Date } {
  const AEST_OFFSET_MS = 10 * 60 * 60 * 1000;
  const aestTime = new Date(date.getTime() + AEST_OFFSET_MS);

  const aestMidnight = new Date(Date.UTC(
    aestTime.getUTCFullYear(),
    aestTime.getUTCMonth(),
    aestTime.getUTCDate(),
  ));

  const start = new Date(aestMidnight.getTime() - AEST_OFFSET_MS); // midnight AEST in UTC
  const end   = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1); // 23:59:59.999 AEST in UTC
  return { start, end };
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const now = new Date();

  // ── PICKUP REMINDERS ───────────────────────────────────────────────────────
  // Find confirmed bookings whose start date is tomorrow (AEST) and whose
  // pickup reminder has not already been sent.
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowBounds = aestDayBoundsUtc(tomorrow);

  const pickupBookings = await prisma.booking.findMany({
    where: {
      status: "confirmed",
      pickupReminderSentAt: null,
      startDate: { gte: tomorrowBounds.start, lte: tomorrowBounds.end },
    },
  });

  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  const pickupAddress = settings?.pickupAddress || "3 Carrama Court, Mudgeeraba QLD 4213";

  const pickupResults: { id: string; status: string }[] = [];

  for (const booking of pickupBookings) {
    try {
      await sendPickupReminder({
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
        pickupAddress,
        pickupChecklistUrl: `${SITE_URL}/checklist/pickup/${booking.id}`,
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { pickupReminderSentAt: new Date() },
      });

      pickupResults.push({ id: booking.id, status: "sent" });
    } catch (err) {
      console.error(`Pickup reminder failed for ${booking.id}:`, err);
      pickupResults.push({ id: booking.id, status: "error" });
    }
  }

  // ── RETURN REMINDERS ───────────────────────────────────────────────────────
  // Find confirmed bookings whose end date is today (AEST) and whose
  // return reminder has not already been sent.
  const todayBounds = aestDayBoundsUtc(now);

  const returnBookings = await prisma.booking.findMany({
    where: {
      status: "confirmed",
      returnReminderSentAt: null,
      endDate: { gte: todayBounds.start, lte: todayBounds.end },
    },
  });

  const returnResults: { id: string; status: string }[] = [];

  for (const booking of returnBookings) {
    try {
      await sendReturnReminder({
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
        returnChecklistUrl: `${SITE_URL}/checklist/return/${booking.id}`,
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { returnReminderSentAt: new Date() },
      });

      returnResults.push({ id: booking.id, status: "sent" });
    } catch (err) {
      console.error(`Return reminder failed for ${booking.id}:`, err);
      returnResults.push({ id: booking.id, status: "error" });
    }
  }

  return NextResponse.json({
    ok: true,
    ranAt: now.toISOString(),
    pickupReminders: pickupResults,
    returnReminders: returnResults,
  });
}
