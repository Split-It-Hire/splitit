import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where = status ? { status } : {};

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      status: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      startDate: true,
      endDate: true,
      numberOfDays: true,
      hireType: true,
      deliveryOption: true,
      hireFeeTotal: true,
      deliveryFee: true,
      bondAmount: true,
      totalCharged: true,
      bondStatus: true,
      bondCapturedAmount: true,
      stripeBondIntentId: true,
      createdAt: true,
    },
  });

  return NextResponse.json(bookings);
}
