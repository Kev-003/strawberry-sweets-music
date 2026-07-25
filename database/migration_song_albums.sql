-- Migration: Add song_albums junction table for many-to-many song<->album relationship
-- Run via: wrangler d1 execute strawberry-sweets --file=database/migration_song_albums.sql

CREATE TABLE IF NOT EXISTS "song_albums" (
  "song_id" integer NOT NULL,
  "album_id" integer NOT NULL,
  PRIMARY KEY ("song_id", "album_id"),
  FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE CASCADE,
  FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE
);

-- Backfill from existing song.album_id FK so no data is lost
INSERT OR IGNORE INTO song_albums (song_id, album_id)
SELECT id, album_id FROM songs WHERE album_id IS NOT NULL;
