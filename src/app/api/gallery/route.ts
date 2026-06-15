import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder");

  if (!folder) {
    return NextResponse.json({ error: "Folder is required" }, { status: 400 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });

    const listed = await env.BUCKET.list({ prefix: `gallery/${folder}/` });

    const urls = listed.objects
      .map((obj) => obj.key)
      .filter((key) => !key.endsWith("/"))
      .map((key) => `${env.R2_PUBLIC_URL}/${key}`);

    return NextResponse.json(urls);
  } catch (error) {
    console.error("R2 listing failed:", error);
    return NextResponse.json([], { status: 500 });
  }
}