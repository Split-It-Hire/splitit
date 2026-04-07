import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format, addDays } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  function icsDate(d: Date): string {
    return format(d, "yyyyMMdd");
  }

  const startStr = icsDate(booking.startDate);
  const endStr = icsDate(addDays(booking.endDate, 1)); // all-day: end is exclusive

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Split It Gold Coast//Log Splitter Hire//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.id}@splitit.com.au`,
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
    `DTSTART;VALUE=DATE:${startStr}`,
    `DTEND;VALUE=DATE:${endStr}`,
    `SUMMARY:Log Splitter Hire — Split It Gold Coast`,
    `DESCRIPTION:Booking ref: ${booking.id}\\nReturn by 5pm on ${format(booking.endDate, "d MMM yyyy")}\\nContact: 0400 000 000`,
    `LOCATION:Mudgeeraba QLD 4213`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="log-splitter-hire-${booking.id}.ics"`,
    },
  });
}
