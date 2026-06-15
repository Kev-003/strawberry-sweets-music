"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/layout/AppSidebar";
import { AppHeader } from "@/layout/AppHeader";
import { Backdrop } from "@/layout/Backdrop";

type Song = {
  id: number;
  title: string;
  album_id: number | null;
  cover_art: string | null;
  banner_webp: string | null;
  banner_gif: string | null;
  track_number: number | null;
  release_date: string | null;
  description: string | null;
  spotify_id: string | null;
  presave_link: string | null;
  video_url: string | null;
  links: string | null;
  is_featured: number;
};

const emptyForm = {
  title: "",
  album_id: "",
  track_number: "",
  release_date: "",
  description: "",
  spotify_id: "",
  presave_link: "",
  video_url: "",
  link_spotify: "",
  link_youtube: "",
  link_apple_music: "",
};

export default function SongsPage() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bannerWebpFile, setBannerWebpFile] = useState<File | null>(null);
  const [bannerGifFile, setBannerGifFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  async function load() {
    const [songsRes, albumsRes] = await Promise.all([
      fetch("/api/band/songs"),
      fetch("/api/band/albums"),
    ]);
    setSongs(await songsRes.json());
    setAlbums(await albumsRes.json());
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

    const links: Record<string, string> = {};
    if (form.link_spotify.trim()) links.spotify = form.link_spotify.trim();
    if (form.link_youtube.trim()) links.youtube = form.link_youtube.trim();
    if (form.link_apple_music.trim())
      links.apple_music = form.link_apple_music.trim();

    const body: any = {
      title: form.title,
      album_id: form.album_id ? Number(form.album_id) : null,
      track_number: form.track_number ? Number(form.track_number) : null,
      release_date: form.release_date || null,
      description: form.description || null,
      spotify_id: form.spotify_id || null,
      presave_link: form.presave_link || null,
      video_url: form.video_url || null,
      links: Object.keys(links).length > 0 ? links : null,
    };

    if (coverFile) body.cover_art = await uploadFile(coverFile, "songs/covers");
    if (bannerWebpFile)
      body.banner_webp = await uploadFile(bannerWebpFile, "songs/banners");
    if (bannerGifFile)
      body.banner_gif = await uploadFile(bannerGifFile, "songs/banners");

    if (editId) {
      await fetch(`/api/band/songs/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/band/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    await load();
    resetForm();
    setSaving(false);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/band/songs/${id}`, { method: "DELETE" });
    await load();
    setDeleteId(null);
  }

  function openEdit(song: Song) {
    let parsedLinks: {
      spotify?: string;
      youtube?: string;
      apple_music?: string;
    } = {};
    if (song.links) {
      try {
        parsedLinks = JSON.parse(song.links);
      } catch {
        parsedLinks = {};
      }
    }

    setEditId(song.id);
    setForm({
      title: song.title,
      album_id: song.album_id ? String(song.album_id) : "",
      track_number: song.track_number ? String(song.track_number) : "",
      release_date: song.release_date ?? "",
      description: song.description ?? "",
      spotify_id: song.spotify_id ?? "",
      presave_link: song.presave_link ?? "",
      video_url: song.video_url ?? "",
      link_spotify: parsedLinks.spotify ?? "",
      link_youtube: parsedLinks.youtube ?? "",
      link_apple_music: parsedLinks.apple_music ?? "",
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditId(null);
    setShowForm(false);
    setCoverFile(null);
    setBannerWebpFile(null);
    setBannerGifFile(null);
  }

  const albumMap = Object.fromEntries(albums.map((a: any) => [a.id, a.title]));

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
              Songs
            </h1>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white text-theme-sm font-medium hover:bg-brand-600 transition-colors"
            >
              + Add Song
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editId ? "Edit Song" : "New Song"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title *">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Song title"
                  />
                </Field>
                <Field label="Album">
                  <select
                    value={form.album_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, album_id: e.target.value }))
                    }
                    className={inputCls}
                  >
                    <option value="">No album</option>
                    {albums.map((a: any) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Track Number">
                  <input
                    type="number"
                    value={form.track_number}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, track_number: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="1"
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
                    placeholder="Spotify track ID"
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
                <Field label="Video URL">
                  <input
                    value={form.video_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, video_url: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="https://youtube.com/..."
                  />
                </Field>
              </div>

              {/* Streaming Links */}
              <div>
                <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Streaming Links
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Spotify Link">
                    <input
                      value={form.link_spotify}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, link_spotify: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="https://open.spotify.com/track/..."
                    />
                  </Field>
                  <Field label="YouTube Link">
                    <input
                      value={form.link_youtube}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, link_youtube: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="https://youtu.be/..."
                    />
                  </Field>
                  <Field label="Apple Music Link">
                    <input
                      value={form.link_apple_music}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          link_apple_music: e.target.value,
                        }))
                      }
                      className={inputCls}
                      placeholder="https://music.apple.com/..."
                    />
                  </Field>
                </div>
              </div>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className={inputCls + " h-24 resize-none"}
                  placeholder="About this song..."
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
                  accept="image/webp"
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

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!form.title || saving}
                  className="px-5 py-2 rounded-lg bg-brand-500 text-white text-theme-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : editId ? "Save Changes" : "Add Song"}
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

          {/* Songs List */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading…</div>
            ) : songs.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No songs yet. Add your first one!
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">
                      Album
                    </th>
                    <th className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">
                      Released
                    </th>
                    <th className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {songs.map((song) => (
                    <tr
                      key={song.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-theme-sm text-gray-400">
                        {song.track_number ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {song.cover_art ? (
                            <img
                              src={song.cover_art}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800" />
                          )}
                          <div>
                            <p className="text-theme-sm font-medium text-gray-900 dark:text-white">
                              {song.title}
                            </p>
                            {song.is_featured === 1 && (
                              <span className="text-theme-xs text-brand-500 font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {song.album_id ? (albumMap[song.album_id] ?? "—") : "—"}
                      </td>
                      <td className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {song.release_date ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(song)}
                            className="px-3 py-1.5 rounded-lg text-theme-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(song.id)}
                            className="px-3 py-1.5 rounded-lg text-theme-xs font-medium text-error-600 dark:text-error-400 border border-error-200 dark:border-error-800 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Delete Confirm */}
          {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Song?
                </h3>
                <p className="text-theme-sm text-gray-500 dark:text-gray-400 mb-5">
                  This cannot be undone.
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
        <span className="text-theme-xs text-gray-500 dark:text-gray-400">
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
