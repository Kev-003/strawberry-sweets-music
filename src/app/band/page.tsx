"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/layout/AppSidebar";
import { AppHeader } from "@/layout/AppHeader";
import { Backdrop } from "@/layout/Backdrop";

type Featured = {
  type: "song" | "album";
  id: number;
  item: any;
} | null;

type Stats = {
  songs: number;
  albums: number;
};

export default function BandDashboard() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [stats, setStats] = useState<Stats>({ songs: 0, albums: 0 });
  const [featured, setFeatured] = useState<Featured>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [featuredType, setFeaturedType] = useState<"song" | "album">("song");
  const [featuredId, setFeaturedId] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  useEffect(() => {
    async function load() {
      const [songsRes, albumsRes, featuredRes] = await Promise.all([
        fetch("/api/band/songs"),
        fetch("/api/band/albums"),
        fetch("/api/band/featured"),
      ]);
      const songsData = await songsRes.json();
      const albumsData = await albumsRes.json();
      const featuredData = await featuredRes.json();

      setSongs(songsData);
      setAlbums(albumsData);
      setStats({ songs: songsData.length, albums: albumsData.length });

      if (featuredData.type) {
        setFeatured(featuredData);
        setFeaturedType(featuredData.type);
        setFeaturedId(featuredData.id);
      }
    }
    load();
  }, []);

  async function saveFeatured() {
    if (!featuredId) return;
    setSaving(true);
    await fetch("/api/band/featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: featuredType, id: featuredId }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const options = featuredType === "song" ? songs : albums;

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <p className="text-theme-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Songs
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.songs}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <p className="text-theme-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Albums
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.albums}
              </p>
            </div>
          </div>

          {/* Featured Selector */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Featured
            </h2>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400 mb-5">
              Select one song or album to feature on the public site.
            </p>

            {/* Current featured */}
            {featured?.item && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 px-4 py-3">
                {featured.item.cover_art && (
                  <img
                    src={featured.item.cover_art}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="text-theme-xs text-brand-500 font-medium uppercase tracking-wide">
                    Currently Featured {featured.type}
                  </p>
                  <p className="text-theme-sm font-semibold text-gray-900 dark:text-white">
                    {featured.item.title}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Type toggle */}
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {(["song", "album"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setFeaturedType(t);
                      setFeaturedId("");
                    }}
                    className={`px-4 py-2 text-theme-sm font-medium capitalize transition-colors ${
                      featuredType === t
                        ? "bg-brand-500 text-white"
                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Item selector */}
              <select
                value={featuredId}
                onChange={(e) => setFeaturedId(Number(e.target.value))}
                className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">Select a {featuredType}…</option>
                {options.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>

              <button
                onClick={saveFeatured}
                disabled={!featuredId || saving}
                className="px-5 py-2 rounded-lg bg-brand-500 text-white text-theme-sm font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving…" : saved ? "Saved!" : "Set Featured"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
