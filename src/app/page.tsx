import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import Welcome from "@/components/custom/welcome";
import type { AlbumFilter, SongItem } from "@/components/custom/song-list";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Strawberry Sweets",
  description:
    "Strawberry Sweets is an indie band from Balanga, Bataan. Making songs that capture fleeting feelings and dreamlike moments.",
  keywords:
    "Strawberry Sweets, indie band, Balanga, Bataan, Filipino indie, OPM",
  openGraph: {
    title: "Strawberry Sweets",
    description:
      "Making songs that capture fleeting feelings and dreamlike moments.",
    type: "website",
    url: "https://strawberry-sweets-music.cc",
    images: [{ url: "https://pub-19202e96198a4f7ba7bbc7f311350d8a.r2.dev/band.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strawberry Sweets",
    description:
      "Making songs that capture fleeting feelings and dreamlike moments.",
    images: ["https://pub-19202e96198a4f7ba7bbc7f311350d8a.r2.dev/band.webp"],
  },
};

export default async function Page() {
  const { env } = await getCloudflareContext({ async: true });

  // Songs (with album id + title via junction table)
  const { results: rawSongs } = await env.DB.prepare(
    `SELECT songs.*,
            sa.album_id AS joined_album_id,
            albums.title AS album_title
     FROM songs
     LEFT JOIN song_albums sa ON sa.song_id = songs.id
     LEFT JOIN albums ON albums.id = sa.album_id
     GROUP BY songs.id
     ORDER BY songs.created_at DESC`,
  ).all();

  const songs: SongItem[] = rawSongs.map((s: any) => ({
    ...s,
    links: s.links ? JSON.parse(s.links) : null,
    album: s.album_title
      ? { id: s.joined_album_id, title: s.album_title }
      : null,
  }));

  // Albums (for filter list)
  const { results: rawAlbums } = await env.DB.prepare(
    `SELECT id, title FROM albums ORDER BY created_at DESC`,
  ).all();

  const albums: AlbumFilter[] = rawAlbums.map((a: any) => ({
    id: a.id,
    title: a.title,
  }));

  // Featured item
  const featuredType = await env.DB.prepare(
    `SELECT value FROM settings WHERE key = 'featured_type'`,
  ).first<{ value: string }>();

  const featuredId = await env.DB.prepare(
    `SELECT value FROM settings WHERE key = 'featured_id'`,
  ).first<{ value: string }>();

  let featuredSong = undefined;
  let featuredAlbum = undefined;

  if (featuredType && featuredId) {
    if (featuredType.value === "song") {
      const raw = await env.DB.prepare(`SELECT * FROM songs WHERE id = ?`)
        .bind(featuredId.value)
        .first<any>();
      if (raw)
        featuredSong = {
          ...raw,
          links: raw.links ? JSON.parse(raw.links) : null,
        };
    } else {
      const raw = await env.DB.prepare(`SELECT * FROM albums WHERE id = ?`)
        .bind(featuredId.value)
        .first<any>();
      if (raw)
        featuredAlbum = {
          ...raw,
          links: raw.links ? JSON.parse(raw.links) : null,
        };
    }
  }

  // Auth — read band_session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get("band_session");
  const isAuthenticated = !!session?.value;

  const storageUrl = (env as any).R2_PUBLIC_URL ?? process.env.STORAGE_URL ?? "";

  return (
    <Welcome
      songs={songs}
      albums={albums}
      featuredSong={featuredSong}
      featuredAlbum={featuredAlbum}
      storageUrl={storageUrl}
      isAuthenticated={isAuthenticated}
    />
  );
}
