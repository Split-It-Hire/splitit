import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, body, youtubeUrl, categoryId } = await req.json();
  if (!title?.trim() || !categoryId) return NextResponse.json({ error: "Title and category required" }, { status: 400 });
  const count = await prisma.wikiPage.count({ where: { categoryId } });
  const page = await prisma.wikiPage.create({
    data: { title: title.trim(), body: body || "", youtubeUrl: youtubeUrl || null, categoryId, sortOrder: count },
  });
  return NextResponse.json(page);
}
