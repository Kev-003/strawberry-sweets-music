import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const { results } = await env.DB.prepare(
      `SELECT * FROM songs ORDER BY created_at DESC`
    ).all();
    return NextResponse.json(results);
  } catch (e) {
    console.error("songs GET error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const body = await request.json() as any;

  const {
    title, album_id, cover_art, banner_webp, banner_gif,
    title_webp, title_effect_webp, track_number, spotify_id,
    release_date, description, presave_link, links,
    video_url, featured_link_type,
  } = body;

  const result = await env.DB.prepare(
    `INSERT INTO songs (
      title, album_id, cover_art, banner_webp, banner_gif,
      title_webp, title_effect_webp, track_number, spotify_id,
      release_date, description, presave_link, links,
      video_url, featured_link_type, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    RETURNING *`
  )
    .bind(
      title, album_id ?? null, cover_art ?? null, banner_webp ?? null, banner_gif ?? null,
      title_webp ?? null, title_effect_webp ?? null, track_number ?? null, spotify_id ?? null,
      release_date ?? null, description ?? null, presave_link ?? null,
      links ? JSON.stringify(links) : null, video_url ?? null, featured_link_type ?? null
    )
    .first();

  return NextResponse.json(result, { status: 201 });
}