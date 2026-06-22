import { get } from "@vercel/blob";
import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return new Response("Forbidden", { status: 403 });
  }

  const blobUrl = request.nextUrl.searchParams.get("url");
  if (!blobUrl) return new Response("Not found", { status: 404 });

  try {
    const parsed = new URL(blobUrl);
    if (!parsed.hostname.endsWith(".blob.vercel-storage.com")) {
      return new Response("Forbidden", { status: 403 });
    }
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const result = await get(blobUrl, { access: "private" });

  if (!result || !result.stream) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", result.blob.contentType || "image/jpeg");
  headers.set("Cache-Control", "private, max-age=3600");

  return new Response(result.stream as ReadableStream, {
    status: result.statusCode,
    headers,
  });
}
