import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const { results } = await env.DB.prepare(
      `SELECT * FROM songs ORDER BY created_at DESC`
    ).all();

    // Attach album_ids (from junction table) to each song
    const songsWithAlbums = await Promise.all(
      (results as any[]).map(async (song) => {
        const { results: albumRows } = await env.DB.prepare(
          `SELECT album_id FROM song_albums WHERE song_id = ?`
        ).bind(song.id).all();
        return {
          ...song,
          album_ids: albumRows.map((r: any) => r.album_id),
        };
      })
    );

    return NextResponse.json(songsWithAlbums);
  } catch (e) {
    console.error("songs GET error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const body = await request.json() as any;

  const {
    title, album_ids, cover_art, banner_webp, banner_gif,
    title_webp, title_effect_webp, track_number, spotify_id,
    release_date, description, presave_link, links,
    video_url, featured_link_type,
  } = body;

  // Determine primary album_id (first of the list, for backward compatibility)
  const primaryAlbumId = Array.isArray(album_ids) && album_ids.length > 0 ? album_ids[0] : null;

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
      title, primaryAlbumId ?? null, cover_art ?? null, banner_webp ?? null, banner_gif ?? null,
      title_webp ?? null, title_effect_webp ?? null, track_number ?? null, spotify_id ?? null,
      release_date ?? null, description ?? null, presave_link ?? null,
      links ? JSON.stringify(links) : null, video_url ?? null, featured_link_type ?? null
    )
    .first() as any;

  // Insert into junction table
  if (result && Array.isArray(album_ids)) {
    for (const albumId of album_ids) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO song_albums (song_id, album_id) VALUES (?, ?)`
      ).bind(result.id, albumId).run();
    }
  }

  return NextResponse.json({ ...result, album_ids: album_ids ?? [] }, { status: 201 });
}