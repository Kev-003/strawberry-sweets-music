import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  const { results: albums } = await env.DB.prepare(
    `SELECT * FROM albums ORDER BY created_at DESC`
  ).all();

  const albumsWithSongs = await Promise.all(
    albums.map(async (album: any) => {
      const { results: songs } = await env.DB.prepare(
        `SELECT songs.* FROM songs
         INNER JOIN song_albums sa ON sa.song_id = songs.id
         WHERE sa.album_id = ?
         ORDER BY songs.track_number ASC`
      ).bind(album.id).all();
      return { ...album, songs };
    })
  );

  return NextResponse.json(albumsWithSongs);
}

// albums/route.ts — POST
export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    if (!env || !env.DB) {
      console.error("D1 DB binding is missing.");
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    const body = await request.json() as any;

    const {
      title, release_date, cover_art, banner_webp, banner_gif,
      title_webp, title_effect_webp, spotify_id, description,
      presave_link, links, featured_link_type, is_featured,
      song_ids,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const result = await env.DB.prepare(
      `INSERT INTO albums (
        title, release_date, cover_art, banner_webp, banner_gif,
        title_webp, title_effect_webp, spotify_id, description,
        presave_link, links, featured_link_type, is_featured, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *`
    )
      .bind(
        title, release_date ?? null, cover_art ?? null, banner_webp ?? null, banner_gif ?? null,
        title_webp ?? null, title_effect_webp ?? null, spotify_id ?? null, description ?? null,
        presave_link ?? null, links ? JSON.stringify(links) : null, featured_link_type ?? null,
        is_featured ?? 0
      )
      .first() as any;

    // Assign songs via junction table if provided
    if (result && Array.isArray(song_ids) && song_ids.length > 0) {
      for (const songId of song_ids) {
        await env.DB.prepare(
          `INSERT OR IGNORE INTO song_albums (song_id, album_id) VALUES (?, ?)`
        ).bind(songId, result.id).run();
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Album creation error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}