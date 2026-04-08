export const runtime = "edge";

import { put } from "@vercel/blob";

export async function POST(request: Request): Promise<Response> {
  try {
    const contentType = request.headers.get("content-type") || "video/mp4";
    const ext = contentType.includes("quicktime") || contentType.includes("mov")
      ? "mov"
      : contentType.includes("webm")
      ? "webm"
      : "mp4";

    const blob = await put(`hero-video-${Date.now()}.${ext}`, request.body!, {
      access: "public",
      contentType,
    });

    return Response.json({ url: blob.url });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400 });
  }
}
