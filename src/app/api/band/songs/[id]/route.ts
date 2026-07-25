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

  const { results: albumRows } = await env.DB.prepare(
    `SELECT album_id FROM song_albums WHERE song_id = ?`
  ).bind(id).all();

  return NextResponse.json({ ...song, album_ids: albumRows.map((r: any) => r.album_id) });
}

export async function PUT(
  request: NextRequest, 
  context: RouteContext
) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  const body = await request.json() as any;

  const {
    title, album_ids, cover_art, banner_webp, banner_gif,
    title_webp, title_effect_webp, track_number, spotify_id,
    release_date, description, presave_link, links,
    video_url, featured_link_type, is_featured,
  } = body;

  // Determine primary album_id (first of list for backward compat)
  const primaryAlbumId = Array.isArray(album_ids) && album_ids.length > 0 ? album_ids[0] : null;

  await env.DB.prepare(
    `UPDATE songs SET
      title = ?, album_id = ?, cover_art = ?, banner_webp = ?, banner_gif = ?,
      title_webp = ?, title_effect_webp = ?, track_number = ?, spotify_id = ?,
      release_date = ?, description = ?, presave_link = ?, links = ?,
      video_url = ?, featured_link_type = ?, is_featured = ?, updated_at = datetime('now')
    WHERE id = ?`
  )
    .bind(
      title, primaryAlbumId ?? null, cover_art ?? null, banner_webp ?? null, banner_gif ?? null,
      title_webp ?? null, title_effect_webp ?? null, track_number ?? null, spotify_id ?? null,
      release_date ?? null, description ?? null, presave_link ?? null,
      links ? JSON.stringify(links) : null, video_url ?? null, featured_link_type ?? null,
      is_featured ?? 0, id
    )
    .run();

  // Sync junction table if album_ids provided
  if (Array.isArray(album_ids)) {
    await env.DB.prepare(`DELETE FROM song_albums WHERE song_id = ?`).bind(id).run();
    for (const albumId of album_ids) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO song_albums (song_id, album_id) VALUES (?, ?)`
      ).bind(id, albumId).run();
    }
  }

  const updated = await env.DB.prepare(`SELECT * FROM songs WHERE id = ?`)
    .bind(id).first();

  const { results: albumRows } = await env.DB.prepare(
    `SELECT album_id FROM song_albums WHERE song_id = ?`
  ).bind(id).all();

  return NextResponse.json({ ...updated, album_ids: albumRows.map((r: any) => r.album_id) });
}

export async function DELETE(
  request: NextRequest, 
  context: RouteContext
) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  
  await env.DB.prepare(`DELETE FROM song_albums WHERE song_id = ?`).bind(id).run();
  await env.DB.prepare(`DELETE FROM songs WHERE id = ?`).bind(id).run();
  
  return NextResponse.json({ ok: true });
}