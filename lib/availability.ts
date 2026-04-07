import { prisma } from "@/lib/prisma";
import { startOfDay, addDays, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TZ = "Australia/Brisbane";

export type DateStatus = "available" | "booked" | "blocked" | "buffer";

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  status: DateStatus;
}

/**
 * Fetch availability for a rolling window of days.
 */
export async function getAvailability(days = 90): Promise<CalendarDay[]> {
  const now = toZonedTime(new Date(), TZ);
  const today = startOfDay(now);

  const windowEnd = addDays(today, days);

  // Fetch all confirmed/active bookings that overlap the window
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["confirmed", "active"] },
      endDate: { gte: today },
      startDate: { lte: windowEnd },
    },
    select: { startDate: true, endDate: true },
  });

  // Fetch all blocked dates in window
  const blocked = await prisma.blockedDate.findMany({
    where: {
      date: { gte: today, lte: windowEnd },
    },
    select: { date: true },
  });

  const bookedSet = new Set<string>();
  const bufferSet = new Set<string>();
  const blockedSet = new Set<string>();

  for (const b of bookings) {
    let d = startOfDay(b.startDate);
    while (d <= startOfDay(b.endDate)) {
      bookedSet.add(format(d, "yyyy-MM-dd"));
      d = addDays(d, 1);
    }
    // 1-day buffer after booking
    const bufferDay = addDays(startOfDay(b.endDate), 1);
    bufferSet.add(format(bufferDay, "yyyy-MM-dd"));
  }

  for (const b of blocked) {
    blockedSet.add(format(startOfDay(b.date), "yyyy-MM-dd"));
  }

  const result: CalendarDay[] = [];
  let current = today;
  while (current <= windowEnd) {
    const key = format(current, "yyyy-MM-dd");
    let status: DateStatus = "available";
    if (bookedSet.has(key)) status = "booked";
    else if (blockedSet.has(key)) status = "blocked";
    else if (bufferSet.has(key)) status = "buffer";
    result.push({ date: key, status });
    current = addDays(current, 1);
  }

  return result;
}
