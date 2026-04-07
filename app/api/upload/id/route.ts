import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const side = formData.get("side") as string | null;

    if (!file || !side) {
      return NextResponse.json({ error: "Missing file or side" }, { status: 400 });
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, or WEBP image." },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10 MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `id-${side}-${randomUUID()}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
