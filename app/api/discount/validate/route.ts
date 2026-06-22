import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, total } = await req.json();

  if (!code || typeof total !== "number") {
    return NextResponse.json({ valid: false, message: "Invalid request" }, { status: 400 });
  }

  const discount = await prisma.discountCode.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!discount || !discount.active) {
    return NextResponse.json({ valid: false, message: "Invalid or expired code" });
  }

  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, message: "This code has expired" });
  }

  if (discount.maxUses !== null && discount.usageCount >= discount.maxUses) {
    return NextResponse.json({ valid: false, message: "This code has reached its usage limit" });
  }

  const discountAmount =
    discount.discountType === "percentage"
      ? Math.min((discount.discountValue / 100) * total, total)
      : Math.min(discount.discountValue, total);

  return NextResponse.json({
    valid: true,
    discountAmount: Math.round(discountAmount * 100) / 100,
    discountType: discount.discountType,
    discountValue: discount.discountValue,
    message:
      discount.discountType === "percentage"
        ? `${discount.discountValue}% off applied`
        : `$${discount.discountValue.toFixed(2)} off applied`,
  });
}
