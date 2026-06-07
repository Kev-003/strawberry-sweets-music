import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

// Define the Next.js 15 route context parameter type
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// 1. Updated GET Method with context argument
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  // We don't need to await context.params since it's unused,
  // but it must be present in the signature to satisfy the constraint.
  
  const { env } = await getCloudflareContext({ async: true });
  const { results: albums } = await env.DB.prepare(
    `SELECT * FROM albums ORDER BY created_at DESC`
  ).all();

  const albumsWithSongs = await Promise.all(
    albums.map(async (album: any) => {
      const { results: songs } = await env.DB.prepare(
        `SELECT * FROM songs WHERE album_id = ? ORDER BY track_number ASC`
      ).bind(album.id).all();
      return { ...album, songs };
    })
  );

  return NextResponse.json(albumsWithSongs);
}

// 2. Updated POST Method with context argument
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { env } = await getCloudflareContext({ async: true });
  const body = await request.json();

  const {
    title, release_date, cover_art, banner_webp, banner_gif,
    title_webp, title_effect_webp, spotify_id, description,
    presave_link, links, featured_link_type,
  } = body;

  const result = await env.DB.prepare(
    `INSERT INTO albums (
      title, release_date, cover_art, banner_webp, banner_gif,
      title_webp, title_effect_webp, spotify_id, description,
      presave_link, links, featured_link_type, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    RETURNING *`
  )
    .bind(
      title, release_date ?? null, cover_art ?? null, banner_webp ?? null, banner_gif ?? null,
      title_webp ?? null, title_effect_webp ?? null, spotify_id ?? null, description ?? null,
      presave_link ?? null, links ? JSON.stringify(links) : null, featured_link_type ?? null
    )
    .first();

  return NextResponse.json(result, { status: 201 });
}