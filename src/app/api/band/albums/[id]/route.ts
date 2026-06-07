import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { env } = await getCloudflareContext({ async: true });
  const album = await env.DB.prepare(`SELECT * FROM albums WHERE id = ?`)
    .bind(params.id).first();
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { results: songs } = await env.DB.prepare(
    `SELECT * FROM songs WHERE album_id = ? ORDER BY track_number ASC`
  ).bind(params.id).all();

  return NextResponse.json({ ...album, songs });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { env } = await getCloudflareContext({ async: true });
  const body = await request.json();

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
      is_featured ?? 0, params.id
    )
    .run();

  if (Array.isArray(song_ids)) {
    if (song_ids.length > 0) {
      await env.DB.prepare(
        `UPDATE songs SET album_id = NULL WHERE album_id = ? AND id NOT IN (${song_ids.map(() => "?").join(",")})`
      ).bind(params.id, ...song_ids).run();
      for (const songId of song_ids) {
        await env.DB.prepare(`UPDATE songs SET album_id = ? WHERE id = ?`)
          .bind(params.id, songId).run();
      }
    } else {
      await env.DB.prepare(`UPDATE songs SET album_id = NULL WHERE album_id = ?`)
        .bind(params.id).run();
    }
  }

  const updated = await env.DB.prepare(`SELECT * FROM albums WHERE id = ?`)
    .bind(params.id).first();
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { env } = await getCloudflareContext({ async: true });
  await env.DB.prepare(`UPDATE songs SET album_id = NULL WHERE album_id = ?`)
    .bind(params.id).run();
  await env.DB.prepare(`DELETE FROM albums WHERE id = ?`).bind(params.id).run();
  return NextResponse.json({ ok: true });
}