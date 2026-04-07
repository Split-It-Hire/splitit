import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";

export async function GET() {
  try {
    const availability = await getAvailability(90);
    return NextResponse.json(availability);
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
