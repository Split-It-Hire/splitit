import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { startOfDay } from "date-fns";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(dates);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { date, reason } = await req.json();
  const created = await prisma.blockedDate.create({
    data: { date: startOfDay(new Date(date)), reason: reason || null },
  });
  return NextResponse.json(created);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  await prisma.blockedDate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
