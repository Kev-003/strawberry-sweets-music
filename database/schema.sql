BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "albums" (
	"id"	integer NOT NULL,
	"title"	varchar NOT NULL,
	"release_date"	date,
	"cover_art"	varchar,
	"banner_webp"	varchar,
	"title_webp"	varchar,
	"is_featured"	tinyint(1) NOT NULL DEFAULT '0',
	"spotify_id"	varchar,
	"created_at"	datetime,
	"updated_at"	datetime,
	"title_effect_webp"	varchar,
	"description"	text,
	"presave_link"	varchar,
	"links"	text,
	"banner_gif"	varchar,
	"featured_link_type"	varchar,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "cache" (
	"key"	varchar NOT NULL,
	"value"	text NOT NULL,
	"expiration"	integer NOT NULL,
	PRIMARY KEY("key")
);
CREATE TABLE IF NOT EXISTS "cache_locks" (
	"key"	varchar NOT NULL,
	"owner"	varchar NOT NULL,
	"expiration"	integer NOT NULL,
	PRIMARY KEY("key")
);
CREATE TABLE IF NOT EXISTS "failed_jobs" (
	"id"	integer NOT NULL,
	"uuid"	varchar NOT NULL,
	"connection"	text NOT NULL,
	"queue"	text NOT NULL,
	"payload"	text NOT NULL,
	"exception"	text NOT NULL,
	"failed_at"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "job_batches" (
	"id"	varchar NOT NULL,
	"name"	varchar NOT NULL,
	"total_jobs"	integer NOT NULL,
	"pending_jobs"	integer NOT NULL,
	"failed_jobs"	integer NOT NULL,
	"failed_job_ids"	text NOT NULL,
	"options"	text,
	"cancelled_at"	integer,
	"created_at"	integer NOT NULL,
	"finished_at"	integer,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "jobs" (
	"id"	integer NOT NULL,
	"queue"	varchar NOT NULL,
	"payload"	text NOT NULL,
	"attempts"	integer NOT NULL,
	"reserved_at"	integer,
	"available_at"	integer NOT NULL,
	"created_at"	integer NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "migrations" (
	"id"	integer NOT NULL,
	"migration"	varchar NOT NULL,
	"batch"	integer NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"email"	varchar NOT NULL,
	"token"	varchar NOT NULL,
	"created_at"	datetime,
	PRIMARY KEY("email")
);
CREATE TABLE IF NOT EXISTS "sessions" (
	"id"	varchar NOT NULL,
	"user_id"	integer,
	"ip_address"	varchar,
	"user_agent"	text,
	"payload"	text NOT NULL,
	"last_activity"	integer NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "settings" (
	"id"	integer NOT NULL,
	"key"	varchar NOT NULL,
	"value"	text,
	"created_at"	datetime,
	"updated_at"	datetime,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "songs" (
	"id"	integer NOT NULL,
	"album_id"	integer,
	"title"	varchar NOT NULL,
	"audio_file"	varchar,
	"cover_art"	varchar,
	"is_featured"	tinyint(1) NOT NULL DEFAULT '0',
	"track_number"	integer,
	"spotify_id"	varchar,
	"created_at"	datetime,
	"updated_at"	datetime,
	"banner_webp"	varchar,
	"title_webp"	varchar,
	"title_effect_webp"	varchar,
	"release_date"	date,
	"description"	text,
	"presave_link"	varchar,
	"links"	text,
	"video_url"	varchar,
	"banner_gif"	varchar,
	"featured_link_type"	varchar,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("album_id") REFERENCES "albums"("id") on delete set null
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	integer NOT NULL,
	"name"	varchar NOT NULL,
	"email"	varchar NOT NULL,
	"email_verified_at"	datetime,
	"password"	varchar NOT NULL,
	"remember_token"	varchar,
	"created_at"	datetime,
	"updated_at"	datetime,
	"theme"	varchar NOT NULL DEFAULT 'system',
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "cache" VALUES ('livewire-rate-limiter:16d36dff9abd246c67dfac3e63b993a169af77e6:timer','i:1773829785;',1773829785);
INSERT INTO "cache" VALUES ('livewire-rate-limiter:16d36dff9abd246c67dfac3e63b993a169af77e6','i:1;',1773829785);
INSERT INTO "cache" VALUES ('5c785c036466adea360111aa28563bfd556b5fba:timer','i:1774082816;',1774082816);
INSERT INTO "cache" VALUES ('5c785c036466adea360111aa28563bfd556b5fba','i:9;',1774082816);
INSERT INTO "cache" VALUES ('gallery_files_dhvsu','TzoyOToiSWxsdW1pbmF0ZVxTdXBwb3J0XENvbGxlY3Rpb24iOjI6e3M6ODoiACoAaXRlbXMiO2E6MzU6e2k6MDtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDI1NC53ZWJwIjtpOjE7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAyNTYud2VicCI7aToyO3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMjYxLndlYnAiO2k6MztzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDI2Mi53ZWJwIjtpOjQ7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAyNjQud2VicCI7aTo1O3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMjY3LndlYnAiO2k6NjtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDI3Ny53ZWJwIjtpOjc7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAyODIud2VicCI7aTo4O3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMjkxLndlYnAiO2k6OTtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDI5Mi53ZWJwIjtpOjEwO3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMjk1LndlYnAiO2k6MTE7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzMDUud2VicCI7aToxMjtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDMwNi53ZWJwIjtpOjEzO3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzA4LndlYnAiO2k6MTQ7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzMTQud2VicCI7aToxNTtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDMxNi53ZWJwIjtpOjE2O3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzE4LndlYnAiO2k6MTc7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzMjEud2VicCI7aToxODtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDMyNC53ZWJwIjtpOjE5O3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzI1LndlYnAiO2k6MjA7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzMjYud2VicCI7aToyMTtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDMyNy53ZWJwIjtpOjIyO3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzMxLndlYnAiO2k6MjM7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzMzQud2VicCI7aToyNDtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDMzNS53ZWJwIjtpOjI1O3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzM3LndlYnAiO2k6MjY7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzNDAud2VicCI7aToyNztzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDM0My53ZWJwIjtpOjI4O3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzQ0LndlYnAiO2k6Mjk7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzNDYud2VicCI7aTozMDtzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDM0OC53ZWJwIjtpOjMxO3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzUxLndlYnAiO2k6MzI7czo3OToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvZGh2c3UvSU1HXzAzNTQud2VicCI7aTozMztzOjc5OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9kaHZzdS9JTUdfMDM1Ny53ZWJwIjtpOjM0O3M6Nzk6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2RodnN1L0lNR18wMzU5LndlYnAiO31zOjI4OiIAKgBlc2NhcGVXaGVuQ2FzdGluZ1RvU3RyaW5nIjtiOjA7fQ==',1780073552);
INSERT INTO "cache" VALUES ('gallery_files_prod','TzoyOToiSWxsdW1pbmF0ZVxTdXBwb3J0XENvbGxlY3Rpb24iOjI6e3M6ODoiACoAaXRlbXMiO2E6Njp7aTowO3M6NzE6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L3Byb2QvMi53ZWJwIjtpOjE7czo3MToiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvcHJvZC8zLndlYnAiO2k6MjtzOjcxOiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9wcm9kLzQud2VicCI7aTozO3M6NzE6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L3Byb2QvNS53ZWJwIjtpOjQ7czo3ODoiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvcHJvZC9EU0NfNTIyNC53ZWJwIjtpOjU7czo3ODoiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvcHJvZC9EU0NfNTIyNi53ZWJwIjt9czoyODoiACoAZXNjYXBlV2hlbkNhc3RpbmdUb1N0cmluZyI7YjowO30=',1780073560);
INSERT INTO "cache" VALUES ('gallery_files_candid','TzoyOToiSWxsdW1pbmF0ZVxTdXBwb3J0XENvbGxlY3Rpb24iOjI6e3M6ODoiACoAaXRlbXMiO2E6Njp7aTowO3M6ODY6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2NhbmRpZC9waG90by1vdXRwdXRfMC53ZWJwIjtpOjE7czo4NjoiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvY2FuZGlkL3Bob3RvLW91dHB1dF8xLndlYnAiO2k6MjtzOjg2OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9jYW5kaWQvcGhvdG8tb3V0cHV0XzIud2VicCI7aTozO3M6ODY6Imh0dHBzOi8vcHViLTE5MjAyZTk2MTk4YTRmN2JhN2JiYzdmMzExMzUwZDhhLnIyLmRldi9nYWxsZXJ5L2NhbmRpZC9waG90by1vdXRwdXRfMy53ZWJwIjtpOjQ7czo4NjoiaHR0cHM6Ly9wdWItMTkyMDJlOTYxOThhNGY3YmE3YmJjN2YzMTEzNTBkOGEucjIuZGV2L2dhbGxlcnkvY2FuZGlkL3Bob3RvLW91dHB1dF80LndlYnAiO2k6NTtzOjg2OiJodHRwczovL3B1Yi0xOTIwMmU5NjE5OGE0ZjdiYTdiYmM3ZjMxMTM1MGQ4YS5yMi5kZXYvZ2FsbGVyeS9jYW5kaWQvcGhvdG8tb3V0cHV0XzUud2VicCI7fXM6Mjg6IgAqAGVzY2FwZVdoZW5DYXN0aW5nVG9TdHJpbmciO2I6MDt9',1780073560);
INSERT INTO "cache" VALUES ('356a192b7913b04c54574d18c28d46e6395428ab:timer','i:1780072281;',1780072281);
INSERT INTO "cache" VALUES ('356a192b7913b04c54574d18c28d46e6395428ab','i:42;',1780072281);
INSERT INTO "migrations" VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO "migrations" VALUES (2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO "migrations" VALUES (3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO "migrations" VALUES (4,'2026_03_18_094956_create_albums_table',2);
INSERT INTO "migrations" VALUES (5,'2026_03_18_095106_create_songs_table',2);
INSERT INTO "migrations" VALUES (6,'2026_03_18_105213_create_settings_table',3);
INSERT INTO "migrations" VALUES (7,'2026_03_18_110941_add_featured_graphics_to_albums_and_songs_tables',4);
INSERT INTO "migrations" VALUES (8,'2026_03_20_044420_add_themes_to_users_table',5);
INSERT INTO "migrations" VALUES (9,'2026_03_19_021106_add_release_date_to_songs_and_albums_tables',6);
INSERT INTO "migrations" VALUES (10,'2026_03_20_060000_add_description_to_songs_and_albums_tables',6);
INSERT INTO "migrations" VALUES (11,'2026_03_21_073039_add_links_and_presave_to_albums_and_songs_tables',7);
INSERT INTO "migrations" VALUES (12,'2026_03_29_183643_rename_svg_columns_to_webp_in_albums_and_songs',8);
INSERT INTO "migrations" VALUES (13,'2026_05_29_000000_add_video_url_to_songs_table',8);
INSERT INTO "migrations" VALUES (14,'2026_05_29_000001_add_banner_gif_and_featured_link_type_to_songs_and_albums',9);
INSERT INTO "sessions" VALUES ('oAs4gr56mk8d6CzfQVTzwWURn46S4Te8NwbnpfIP',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiajNLaHQwakgxbmtrZTNOd0FGTmlaZklYdkx4UmE4eDB5T1VUb0RpNiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2dhbGxlcnkvcHJvZCI7czo1OiJyb3V0ZSI7czoxNDoiZ2FsbGVyeS5mb2xkZXIiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1780067592);
INSERT INTO "sessions" VALUES ('KAqt69LdcUaEG22Lq1d4XLNp1EGvX5AGfTqh4Znl',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiZFdKYVVnbUR3Ym5vUXVobFBFUkpaZVkwakFYRzNsYlNwQmlnbGVKYiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNToiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2dhbGxlcnkvZGh2c3UiO3M6NToicm91dGUiO3M6MTQ6ImdhbGxlcnkuZm9sZGVyIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1780067592);
INSERT INTO "sessions" VALUES ('bFyBTR4i5wT9RNumoOt4IpGBe9Lfma0CcKipsWxz',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoienkwZHp6d2hieERGTlNIYk1mOXgwTm1venRnWkpNdjhXaE1GYTJ4TyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNjoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2dhbGxlcnkvY2FuZGlkIjtzOjU6InJvdXRlIjtzOjE0OiJnYWxsZXJ5LmZvbGRlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1780067592);
INSERT INTO "sessions" VALUES ('MZkW89D3r6JKTljjeeIE0R8dq47pyxX5NKjd2QXs',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoibWx1UDNSVWxzV2ZQQlR6MmI3OG9uZGdpVEY1d1cyT2VyTEg3bWhYRyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2dhbGxlcnkvcHJvZCI7czo1OiJyb3V0ZSI7czoxNDoiZ2FsbGVyeS5mb2xkZXIiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1780067593);
INSERT INTO "sessions" VALUES ('2wh6yeku54fye7Bjgnsrb5h6tIBTZMJn27bgQSxw',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiUXhtRUlTUFpaTFBQSzFIMzk1SFlBbGxxZkRmOU9pMkkyVTlHTEZBSyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNToiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2dhbGxlcnkvZGh2c3UiO3M6NToicm91dGUiO3M6MTQ6ImdhbGxlcnkuZm9sZGVyIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1780067594);
INSERT INTO "sessions" VALUES ('KLMqfShFOf7JxihpYc7MtzIePaAJyDffWrtTGuZA',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTo3OntzOjY6Il90b2tlbiI7czo0MDoiMlB2TVlvenJFM0ozeENLRU9XaWo4dUR2VkxpZFFEdTFpT1ZBamttRSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNjoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2dhbGxlcnkvY2FuZGlkIjtzOjU6InJvdXRlIjtzOjE0OiJnYWxsZXJ5LmZvbGRlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiJhZTc1OWYzY2E2MzkxMTA4ZGY1ZDYzNTI0ZjA2OWFhOTgzYzZiZDAyNTAwZmYxNjg3ZDU5YWUwNGIwNGIzMTA4IjtzOjg6ImZpbGFtZW50IjthOjA6e31zOjY6InRhYmxlcyI7YToxOntzOjQwOiI1YTQ1ZjczNzA4NTQ4Njc2MDM2YTM4YzY4NDZlMGVjZl9jb2x1bW5zIjthOjEyOntpOjA7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTE6ImFsYnVtLnRpdGxlIjtzOjU6ImxhYmVsIjtzOjU6IkFsYnVtIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo1OiJ0aXRsZSI7czo1OiJsYWJlbCI7czo1OiJUaXRsZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjI7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6ImF1ZGlvX2ZpbGUiO3M6NToibGFiZWwiO3M6NToiQXVkaW8iO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjk6ImNvdmVyX2FydCI7czo1OiJsYWJlbCI7czo5OiJDb3ZlciBhcnQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo0O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjExOiJiYW5uZXJfd2VicCI7czo1OiJsYWJlbCI7czo2OiJCYW5uZXIiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo1O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJ0aXRsZV93ZWJwIjtzOjU6ImxhYmVsIjtzOjEwOiJUaXRsZSBXZWJQIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxNzoidGl0bGVfZWZmZWN0X3dlYnAiO3M6NToibGFiZWwiO3M6MTc6IlRpdGxlIEVmZmVjdCBXZWJQIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NzthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMToiaXNfZmVhdHVyZWQiO3M6NToibGFiZWwiO3M6MTE6IklzIGZlYXR1cmVkIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6ODthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMjoidHJhY2tfbnVtYmVyIjtzOjU6ImxhYmVsIjtzOjEyOiJUcmFjayBudW1iZXIiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo5O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJzcG90aWZ5X2lkIjtzOjU6ImxhYmVsIjtzOjEwOiJTcG90aWZ5IGlkIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTA7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6ImNyZWF0ZWRfYXQiO3M6NToibGFiZWwiO3M6MTA6IkNyZWF0ZWQgYXQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjowO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjoxO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7YjoxO31pOjExO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJ1cGRhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjEwOiJVcGRhdGVkIGF0IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9fX19',1780072247);
INSERT INTO "settings" VALUES (1,'featured_song_id','2','2026-03-18 12:20:46','2026-05-29 23:56:38');
INSERT INTO "settings" VALUES (2,'featured_album_id',NULL,'2026-03-18 12:20:46','2026-03-18 12:20:46');
INSERT INTO "songs" VALUES (1,NULL,'Agos Ng Sandali',NULL,'assets/agos-ng-sandali/01KM0E5FPSB94MYR3BST6T7TAH.png',1,2,NULL,'2026-03-18 12:19:13','2026-03-21 07:39:30','assets/agos-ng-sandali/01KM0E5FS8B33266H2ZA6BEQF6.webp','assets/agos-ng-sandali/01KM0E5FSMFRMA4A1DRNWKDGS0.svg','assets/agos-ng-sandali/01KM0E5FSWAN4VES7BXQETKM5R.svg','2026-03-27 00:00:00','The first stop on Memorylane.','https://onerpm.link/251135471588','{"spotify":null,"youtube":null,"apple_music":null}',NULL,NULL,NULL);
INSERT INTO "songs" VALUES (2,NULL,'Panaginip',NULL,'assets/panaginip/01KM4X088KZ1K81R12SEJM80ZE.jpg',0,1,NULL,'2026-03-20 05:55:28','2026-05-29 23:56:13',NULL,NULL,NULL,'2025-10-10 00:00:00',NULL,NULL,'{"spotify":"https:\/\/open.spotify.com\/track\/0nb7gv8PR2o0EceaZByL6Q?si=e9f16ba2936840ed","youtube":"https:\/\/youtu.be\/LJiZswHfdvU?si=YoU32WECmBwxwEco","apple_music":"https:\/\/music.apple.com\/us\/album\/panaginip-single\/1839849042"}','https://www.youtube.com/watch?v=MHM0eAVHpSs','assets/panaginip/01KST7633FJXEMXNFSFC4D800Q.gif',NULL);
INSERT INTO "users" VALUES (1,'Kevern','kevern920@gmail.com',NULL,'$2y$12$E98RXhQfvMpZ68FK4lLAgOP9fbs0eKzsiKk67Qe5tmNWWlze1JNEq','yooaWagWTvZ93uqKNtimLbIpuMNT1bbMnb6uxJXXoexgJDnmgZvgFxZ2CtOr','2026-03-18 10:27:46','2026-05-30 00:20:51','light');
INSERT INTO "users" VALUES (2,'Myles','mylsamr@gmail.com',NULL,'$2y$12$FaC4nZcxwj22lhWeG8Xe5ehvj8lv7AtRTh09v4Jp.4nLgKl6CQrDe',NULL,'2026-03-18 10:27:46','2026-03-18 10:27:46','system');
INSERT INTO "users" VALUES (3,'Rod','christianrod099@gmail.com',NULL,'$2y$12$UHyiGHKYjEjz/GDNeWlFQ.NN/m/6/0ZwGNIckVeDVcYANqvGwwRSW',NULL,'2026-03-18 10:27:46','2026-03-18 10:27:46','system');
INSERT INTO "users" VALUES (4,'Strawberry Sweets','strwbrryswtsmusic@gmail.com',NULL,'$2y$12$cOoFBOesTfod/OUQ5gl59eepvWgjn2amjmFoO2.ZA/x/UJFKhy6V6',NULL,'2026-03-18 10:27:47','2026-03-18 10:27:47','system');
CREATE UNIQUE INDEX IF NOT EXISTS "failed_jobs_uuid_unique" ON "failed_jobs" (
	"uuid"
);
CREATE INDEX IF NOT EXISTS "jobs_queue_index" ON "jobs" (
	"queue"
);
CREATE INDEX IF NOT EXISTS "sessions_last_activity_index" ON "sessions" (
	"last_activity"
);
CREATE INDEX IF NOT EXISTS "sessions_user_id_index" ON "sessions" (
	"user_id"
);
CREATE UNIQUE INDEX IF NOT EXISTS "settings_key_unique" ON "settings" (
	"key"
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" (
	"email"
);
COMMIT;
