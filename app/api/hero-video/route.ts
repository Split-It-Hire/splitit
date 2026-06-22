import { getDownloadUrl } from "@vercel/blob";
import { NextRequest } from "next/server";

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

  const downloadUrl = await getDownloadUrl(blobUrl);
  const signedUrl = typeof downloadUrl === "string" ? downloadUrl : (downloadUrl as { url: string }).url;

  return Response.redirect(signedUrl, 302);
}
