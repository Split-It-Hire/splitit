export const runtime = "edge";

// Streams the private hero video blob to the browser.
// Edge runtime has no response size limit so large videos stream correctly.
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const blobUrl = searchParams.get("url");

  // Only allow Vercel Blob URLs
  if (!blobUrl) {
    return new Response("Not found", { status: 404 });
  }
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
  const fetchHeaders: Record<string, string> = {
    Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
  };
  if (range) fetchHeaders["Range"] = range;

  const upstream = await fetch(blobUrl, { headers: fetchHeaders });

  const responseHeaders = new Headers();
  responseHeaders.set(
    "Content-Type",
    upstream.headers.get("Content-Type") || "video/mp4"
  );
  responseHeaders.set("Cache-Control", "public, max-age=3600");
  responseHeaders.set("Accept-Ranges", "bytes");

  const contentLength = upstream.headers.get("Content-Length");
  if (contentLength) responseHeaders.set("Content-Length", contentLength);

  const contentRange = upstream.headers.get("Content-Range");
  if (contentRange) responseHeaders.set("Content-Range", contentRange);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
