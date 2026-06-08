"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/layout/AppSidebar";
import { AppHeader } from "@/layout/AppHeader";
import { Backdrop } from "@/layout/Backdrop";

type Song = {
  id: number;
  title: string;
  track_number: number | null;
  cover_art: string | null;
  album_id: number | null;
};

type Album = {
  id: number;
  title: string;
  release_date: string | null;
  cover_art: string | null;
  banner_webp: string | null;
  banner_gif: string | null;
  description: string | null;
  spotify_id: string | null;
  presave_link: string | null;
  is_featured: number;
  songs: Song[];
};

const emptyForm = {
  title: "",
  release_date: "",
  description: "",
  spotify_id: "",
  presave_link: "",
};

export default function AlbumsPage() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [selectedSongIds, setSelectedSongIds] = useState<number[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bannerWebpFile, setBannerWebpFile] = useState<File | null>(null);
  const [bannerGifFile, setBannerGifFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [expandedAlbum, setExpandedAlbum] = useState<number | null>(null);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  async function load() {
    const [albumsRes, songsRes] = await Promise.all([
      fetch("/api/band/albums"),
      fetch("/api/band/songs"),
    ]);
    setAlbums(await albumsRes.json());
    setAllSongs(await songsRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadFile(file: File, folder: string): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/band/upload", { method: "POST", body: fd });
    const data = (await res.json()) as { url: string };
    return data.url;
  }

  async function handleSave() {
    setSaving(true);
    const body: any = {
      title: form.title,
      release_date: form.release_date || null,
      description: form.description || null,
      spotify_id: form.spotify_id || null,
      presave_link: form.presave_link || null,
      song_ids: selectedSongIds,
    };

    if (coverFile)
      body.cover_art = await uploadFile(coverFile, "albums/covers");
    if (bannerWebpFile)
      body.banner_webp = await uploadFile(bannerWebpFile, "albums/banners");
    if (bannerGifFile)
      body.banner_gif = await uploadFile(bannerGifFile, "albums/banners");

    if (editId) {
      await fetch(`/api/band/albums/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      const res = await fetch("/api/band/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // Assign songs to the newly created album
      if (selectedSongIds.length > 0) {
        const newAlbum = (await res.json()) as any;
        await fetch(`/api/band/albums/${newAlbum.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, song_ids: selectedSongIds }),
        });
      }
    }

    await load();
    resetForm();
    setSaving(false);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/band/albums/${id}`, { method: "DELETE" });
    await load();
    setDeleteId(null);
  }

  function openEdit(album: Album) {
    setEditId(album.id);
    setForm({
      title: album.title,
      release_date: album.release_date ?? "",
      description: album.description ?? "",
      spotify_id: album.spotify_id ?? "",
      presave_link: album.presave_link ?? "",
    });
    setSelectedSongIds(album.songs.map((s) => s.id));
    setShowForm(true);
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditId(null);
    setShowForm(false);
    setSelectedSongIds([]);
    setCoverFile(null);
    setBannerWebpFile(null);
    setBannerGifFile(null);
  }

  function toggleSong(id: number) {
    setSelectedSongIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Albums
            </h1>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white text-theme-sm font-medium hover:bg-brand-600 transition-colors"
            >
              + Add Album
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editId ? "Edit Album" : "New Album"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title *">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Album title"
                  />
                </Field>
                <Field label="Release Date">
                  <input
                    type="date"
                    value={form.release_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, release_date: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Spotify ID">
                  <input
                    value={form.spotify_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, spotify_id: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Spotify album ID"
                  />
                </Field>
                <Field label="Presave Link">
                  <input
                    value={form.presave_link}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, presave_link: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="https://..."
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className={inputCls + " h-24 resize-none"}
                  placeholder="About this album..."
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileField
                  label="Cover Art"
                  accept="image/*"
                  onChange={setCoverFile}
                  file={coverFile}
                />
                <FileField
                  label="Banner (WebP)"
                  accept="image/webp,image/*"
                  onChange={setBannerWebpFile}
                  file={bannerWebpFile}
                />
                <FileField
                  label="Banner (GIF)"
                  accept="image/gif"
                  onChange={setBannerGifFile}
                  file={bannerGifFile}
                />
              </div>

              {/* Song Assignment */}
              <div>
                <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Songs in this album
                </label>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 max-h-60 overflow-y-auto">
                  {allSongs.length === 0 ? (
                    <p className="px-4 py-3 text-theme-sm text-gray-400">
                      No songs available.
                    </p>
                  ) : (
                    allSongs.map((song) => (
                      <label
                        key={song.id}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSongIds.includes(song.id)}
                          onChange={() => toggleSong(song.id)}
                          className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {song.cover_art && (
                            <img
                              src={song.cover_art}
                              alt=""
                              className="w-6 h-6 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <span className="text-theme-sm text-gray-900 dark:text-white truncate">
                            {song.title}
                          </span>
                        </div>
                        {song.album_id && song.album_id !== editId && (
                          <span className="text-theme-xs text-gray-400 flex-shrink-0">
                            In another album
                          </span>
                        )}
                      </label>
                    ))
                  )}
                </div>
                <p className="mt-1.5 text-theme-xs text-gray-400">
                  {selectedSongIds.length} song
                  {selectedSongIds.length !== 1 ? "s" : ""} selected
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!form.title || saving}
                  className="px-5 py-2 rounded-lg bg-brand-500 text-white text-theme-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : editId ? "Save Changes" : "Add Album"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-theme-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Albums List */}
          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center text-gray-400">
                Loading…
              </div>
            ) : albums.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center text-gray-400">
                No albums yet. Add your first one!
              </div>
            ) : (
              albums.map((album) => (
                <div
                  key={album.id}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                >
                  {/* Album Row */}
                  <div className="flex items-center gap-4 p-4">
                    {album.cover_art ? (
                      <img
                        src={album.cover_art}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-theme-sm font-semibold text-gray-900 dark:text-white truncate">
                          {album.title}
                        </p>
                        {album.is_featured === 1 && (
                          <span className="text-theme-xs text-brand-500 font-medium flex-shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-theme-xs text-gray-400">
                        {album.release_date ?? "No release date"} ·{" "}
                        {album.songs.length} song
                        {album.songs.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          setExpandedAlbum(
                            expandedAlbum === album.id ? null : album.id,
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-theme-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {expandedAlbum === album.id ? "Hide Songs" : "Songs"}
                      </button>
                      <button
                        onClick={() => openEdit(album)}
                        className="px-3 py-1.5 rounded-lg text-theme-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(album.id)}
                        className="px-3 py-1.5 rounded-lg text-theme-xs font-medium text-error-600 dark:text-error-400 border border-error-200 dark:border-error-800 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded Songs */}
                  {expandedAlbum === album.id && album.songs.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                      {album.songs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 px-4 py-2.5"
                        >
                          <span className="text-theme-xs text-gray-400 w-5 text-right flex-shrink-0">
                            {song.track_number ?? "—"}
                          </span>
                          {song.cover_art ? (
                            <img
                              src={song.cover_art}
                              alt=""
                              className="w-7 h-7 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                          )}
                          <span className="text-theme-sm text-gray-900 dark:text-white">
                            {song.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedAlbum === album.id && album.songs.length === 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 text-theme-sm text-gray-400">
                      No songs in this album yet.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Delete Confirm */}
          {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Album?
                </h3>
                <p className="text-theme-sm text-gray-500 dark:text-gray-400 mb-5">
                  The album will be deleted. Songs in it will be unlinked but
                  not deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 py-2 rounded-lg bg-error-500 text-white text-theme-sm font-medium hover:bg-error-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-theme-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function FileField({
  label,
  accept,
  onChange,
  file,
}: {
  label: string;
  accept: string;
  onChange: (f: File | null) => void;
  file: File | null;
}) {
  return (
    <Field label={label}>
      <label className="flex flex-col items-center justify-center w-full h-24 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <span className="text-theme-xs text-gray-500 dark:text-gray-400 text-center px-2">
          {file ? file.name : "Click to upload"}
        </span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </Field>
  );
}
