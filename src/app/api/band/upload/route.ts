import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    if (!env || !env.BUCKET) {
      console.error("R2 BUCKET binding is missing.");
      return NextResponse.json({ error: "Storage configuration error." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) ?? "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const key = `${folder}/${crypto.randomUUID()}.${ext}`;
    
    // Cloudflare workerd often rejects Next.js polyfilled ArrayBuffers. Convert to native Uint8Array.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await env.BUCKET.put(key, buffer, {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    // Fallback if R2_PUBLIC_URL isn't configured in production
    const publicUrl = env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || "";
    const url = publicUrl ? `${publicUrl.replace(/\/$/, "")}/${key}` : `/${key}`;

    return NextResponse.json({ key, url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}