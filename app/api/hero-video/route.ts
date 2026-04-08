import { get } from "@vercel/blob";
import { NextRequest } from "next/server";

// Use Node.js runtime — the @vercel/blob `get()` function needs undici (Node.js HTTP client)
// Streaming response bypasses the 4.5 MB serverless body limit
export async function GET(request: NextRequest): Promise<Response> {
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

  // Forward Range header so the browser can seek
  const range = request.headers.get("range");

  const result = await get(blobUrl, {
    access: "private",
    ...(range ? { headers: { Range: range } } : {}),
  });

  if (!result || !result.stream) {
    return new Response("Not found", { status: 404 });
  }

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", result.blob.contentType || "video/mp4");
  responseHeaders.set("Cache-Control", "public, max-age=3600");
  responseHeaders.set("Accept-Ranges", "bytes");

  const contentLength = result.headers.get("Content-Length");
  if (contentLength) responseHeaders.set("Content-Length", contentLength);

  const contentRange = result.headers.get("Content-Range");
  if (contentRange) responseHeaders.set("Content-Range", contentRange);

  return new Response(result.stream as ReadableStream, {
    status: result.statusCode,
    headers: responseHeaders,
  });
}
