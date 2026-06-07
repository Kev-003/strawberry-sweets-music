import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });

  const type = await env.DB.prepare(
    `SELECT value FROM settings WHERE key = 'featured_type'`
  ).first<{ value: string }>();

  const id = await env.DB.prepare(
    `SELECT value FROM settings WHERE key = 'featured_id'`
  ).first<{ value: string }>();

  if (!type || !id) return NextResponse.json({ featured: null });

  const table = type.value === "song" ? "songs" : "albums";
  const item = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`)
    .bind(id.value).first();

  return NextResponse.json({ type: type.value, id: id.value, item });
}

export async function PUT(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const { type, id } = await request.json();

  if (!["song", "album"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  await env.DB.prepare(
    `INSERT INTO settings (key, value, created_at, updated_at)
     VALUES ('featured_type', ?, datetime('now'), datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
  ).bind(type).run();

  await env.DB.prepare(
    `INSERT INTO settings (key, value, created_at, updated_at)
     VALUES ('featured_id', ?, datetime('now'), datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
  ).bind(String(id)).run();

  await env.DB.prepare(`UPDATE songs SET is_featured = 0`).run();
  await env.DB.prepare(`UPDATE albums SET is_featured = 0`).run();

  if (type === "song") {
    await env.DB.prepare(`UPDATE songs SET is_featured = 1 WHERE id = ?`).bind(id).run();
  } else {
    await env.DB.prepare(`UPDATE albums SET is_featured = 1 WHERE id = ?`).bind(id).run();
  }

  return NextResponse.json({ ok: true });
}