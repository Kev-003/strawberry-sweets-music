import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest, 
  context: RouteContext
) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  
  const song = await env.DB.prepare(`SELECT * FROM songs WHERE id = ?`)
    .bind(id).first();
  if (!song) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  return NextResponse.json(song);
}

export async function PUT(
  request: NextRequest, 
  context: RouteContext
) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  const body = await request.json() as any;

  const {
    title, album_id, cover_art, banner_webp, banner_gif,
    title_webp, title_effect_webp, track_number, spotify_id,
    release_date, description, presave_link, links,
    video_url, featured_link_type, is_featured,
  } = body;

  await env.DB.prepare(
    `UPDATE songs SET
      title = ?, album_id = ?, cover_art = ?, banner_webp = ?, banner_gif = ?,
      title_webp = ?, title_effect_webp = ?, track_number = ?, spotify_id = ?,
      release_date = ?, description = ?, presave_link = ?, links = ?,
      video_url = ?, featured_link_type = ?, is_featured = ?, updated_at = datetime('now')
    WHERE id = ?`
  )
    .bind(
      title, album_id ?? null, cover_art ?? null, banner_webp ?? null, banner_gif ?? null,
      title_webp ?? null, title_effect_webp ?? null, track_number ?? null, spotify_id ?? null,
      release_date ?? null, description ?? null, presave_link ?? null,
      links ? JSON.stringify(links) : null, video_url ?? null, featured_link_type ?? null,
      is_featured ?? 0, id
    )
    .run();

  const updated = await env.DB.prepare(`SELECT * FROM songs WHERE id = ?`)
    .bind(id).first();
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest, 
  context: RouteContext
) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  
  await env.DB.prepare(`DELETE FROM songs WHERE id = ?`).bind(id).run();
  
  return NextResponse.json({ ok: true });
}