import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await prisma.wikiCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { pages: { orderBy: { sortOrder: "asc" }, select: { id: true, title: true, sortOrder: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const count = await prisma.wikiCategory.count();
  const category = await prisma.wikiCategory.create({ data: { name: name.trim(), sortOrder: count } });
  return NextResponse.json(category);
}
