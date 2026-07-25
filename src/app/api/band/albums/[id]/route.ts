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
  
  const album = await env.DB.prepare(`SELECT * FROM albums WHERE id = ?`)
    .bind(id).first();
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { results: songs } = await env.DB.prepare(
    `SELECT songs.* FROM songs
     INNER JOIN song_albums sa ON sa.song_id = songs.id
     WHERE sa.album_id = ?
     ORDER BY songs.track_number ASC`
  ).bind(id).all();

  return NextResponse.json({ ...album, songs });
}

export async function PUT(
  request: NextRequest, 
  context: RouteContext
) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  const body = await request.json() as any;

  const {
    title, release_date, cover_art, banner_webp, banner_gif,
    title_webp, title_effect_webp, spotify_id, description,
    presave_link, links, featured_link_type, is_featured, song_ids,
  } = body;

  await env.DB.prepare(
    `UPDATE albums SET
      title = ?, release_date = ?, cover_art = ?, banner_webp = ?, banner_gif = ?,
      title_webp = ?, title_effect_webp = ?, spotify_id = ?, description = ?,
      presave_link = ?, links = ?, featured_link_type = ?, is_featured = ?,
      updated_at = datetime('now')
    WHERE id = ?`
  )
    .bind(
      title, release_date ?? null, cover_art ?? null, banner_webp ?? null, banner_gif ?? null,
      title_webp ?? null, title_effect_webp ?? null, spotify_id ?? null, description ?? null,
      presave_link ?? null, links ? JSON.stringify(links) : null, featured_link_type ?? null,
      is_featured ?? 0, id
    )
    .run();

  // Sync song_albums junction table
  if (Array.isArray(song_ids)) {
    // Remove all existing associations for this album
    await env.DB.prepare(`DELETE FROM song_albums WHERE album_id = ?`).bind(id).run();
    // Re-insert selected songs
    for (const songId of song_ids) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO song_albums (song_id, album_id) VALUES (?, ?)`
      ).bind(songId, id).run();
    }
  }

  const updated = await env.DB.prepare(`SELECT * FROM albums WHERE id = ?`)
    .bind(id).first();
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest, 
  context: RouteContext
) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  
  // Junction table rows will cascade-delete via FK
  await env.DB.prepare(`DELETE FROM song_albums WHERE album_id = ?`).bind(id).run();
  await env.DB.prepare(`DELETE FROM albums WHERE id = ?`).bind(id).run();
  
  return NextResponse.json({ ok: true });
}