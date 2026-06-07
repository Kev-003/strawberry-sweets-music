"use client";

import AppLogo from "@/components/app-logo";
import AboutPhrase from "@/components/custom/about-phrase";
import BandPhoto from "@/components/custom/band-photo";
import StreamingButton from "@/components/custom/button";
import Footer from "@/components/custom/footer";
import GalleryStrip from "@/components/custom/marquee-row";
import SongList, {
  type AlbumFilter,
  type SongItem,
} from "@/components/custom/song-list";
import ThemeToggle from "@/components/custom/theme-toggle";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FeaturedItem {
  title: string;
  description: string | null;
  cover_art: string | null;
  banner_webp: string | null;
  banner_gif?: string | null;
  title_webp: string | null;
  title_effect_webp: string | null;
  release_date: string | null;
  presave_link: string | null;
  video_url?: string | null;
  featured_link_type?: string | null;
  links: {
    spotify?: string;
    youtube?: string;
    apple_music?: string;
  } | null;
  [key: string]: unknown;
}

function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
  return null;
}

function resolveFeaturedLink(featured: FeaturedItem): string | null {
  const type = featured.featured_link_type ?? "auto";
  if (type === "spotify") return featured.links?.spotify ?? null;
  if (type === "youtube") return featured.links?.youtube ?? null;
  if (type === "apple_music") return featured.links?.apple_music ?? null;
  if (type === "presave") return featured.presave_link ?? null;
  return (
    featured.presave_link ||
    featured.links?.spotify ||
    featured.links?.youtube ||
    featured.links?.apple_music ||
    null
  );
}

interface WelcomeProps {
  featuredSong?: FeaturedItem;
  featuredAlbum?: FeaturedItem;
  songs: SongItem[];
  albums: AlbumFilter[];
  storageUrl: string;
  isAuthenticated: boolean;
}

export default function Welcome({
  featuredSong,
  featuredAlbum,
  songs,
  albums,
  storageUrl,
  isAuthenticated,
}: WelcomeProps) {
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);

  useEffect(() => {
    const featured = featuredSong || featuredAlbum;
    const titleSvg = featured?.title_webp;
    const titleEffectSvg = featured?.title_effect_webp;

    const mediaToPreload = [
      titleSvg ? `${storageUrl}/${titleSvg}` : null,
      titleEffectSvg ? `${storageUrl}/${titleEffectSvg}` : null,
    ].filter(Boolean) as string[];

    const preloadImage = (src: string) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });

    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 300));
    const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 3000));

    Promise.race([
      Promise.all([...mediaToPreload.map(preloadImage), minimumDelay]),
      safetyTimeout,
    ]).then(() => {
      document.getElementById("loading-screen")?.classList.add("hidden");
    });
  }, [featuredSong, featuredAlbum, songs, storageUrl]);

  const featured = featuredSong || featuredAlbum;
  const bannerImage =
    featured?.banner_gif || featured?.banner_webp || featured?.cover_art;
  const titleSvg = featured?.title_webp;
  const titleEffectSvg = featured?.title_effect_webp;
  const releaseDate = featured?.release_date;
  const isComingSoon = releaseDate ? new Date(releaseDate) > new Date() : false;
  const hasReleaseDate = !!releaseDate;

  const infoTitle = selectedSong
    ? (selectedSong.title ?? null)
    : (featured?.title ?? null);
  const infoCover = selectedSong
    ? (selectedSong.cover_art ?? null)
    : featured?.cover_art || featured?.banner_webp || null;
  const infoDescription = selectedSong
    ? (selectedSong.description ?? null)
    : (featured?.description ?? null);
  const infoReleaseDate = selectedSong
    ? (selectedSong.release_date ?? null)
    : (releaseDate ?? null);
  const infoAlbum = selectedSong ? (selectedSong.album?.title ?? null) : null;
  const infoIsComingSoon = infoReleaseDate
    ? new Date(infoReleaseDate) > new Date()
    : false;
  const infoVideoUrl = selectedSong
    ? (selectedSong.video_url ?? null)
    : (featured?.video_url ?? null);
  const embedUrl = toEmbedUrl(infoVideoUrl);

  const [ambientColor, setAmbientColor] = useState<string>("transparent");

  useEffect(() => {
    if (!infoCover) {
      setAmbientColor("transparent");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `${storageUrl}/${infoCover}`;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 4;
      canvas.height = 4;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 4, 4);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      setAmbientColor(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => setAmbientColor("transparent");
  }, [infoCover, storageUrl]);

  return (
    <>
      <div className="bg-background text-foreground dark:bg-background flex min-h-screen flex-col items-center">
        {/* ── Header ── */}
        <div className="bg-background sticky top-0 z-50 w-full max-w-full px-4 py-6 lg:px-8">
          <header className="flex w-full items-center justify-between text-sm not-has-[nav]:hidden">
            <AppLogo />
            <nav className="flex items-center justify-end gap-4">
              {isAuthenticated && (
                <Link
                  href="/band"
                  className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                  Dashboard
                </Link>
              )}
              <ThemeToggle />
            </nav>
          </header>
        </div>

        {/* ── Featured Banner ── */}
        <div className="relative w-full opacity-100 transition-opacity duration-750 starting:opacity-0">
          {bannerImage ? (
            <div className="relative h-[33.33vh] w-full overflow-visible">
              <img
                src={`${storageUrl}/${bannerImage}`}
                alt={featured?.title || "Featured Release"}
                className="h-full w-full object-cover"
              />

              {(titleSvg || titleEffectSvg) && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      {titleEffectSvg && (
                        <img
                          src={`${storageUrl}/${titleEffectSvg}`}
                          alt="Title Effect"
                          className="title-effect-anim absolute inset-0 h-full w-full scale-100 opacity-80"
                        />
                      )}
                      <div className="relative flex flex-col items-center">
                        {titleSvg && (
                          <img
                            src={`${storageUrl}/${titleSvg}`}
                            alt={`${featured?.title} Text Logo`}
                            className="relative z-10 h-auto w-64 lg:w-130"
                          />
                        )}
                        {!titleSvg && titleEffectSvg && (
                          <img
                            src={`${storageUrl}/${titleEffectSvg}`}
                            alt="Title Effect Placeholder"
                            className="invisible h-auto w-64 lg:w-120"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hasReleaseDate && (
                <StreamingButton
                  label={isComingSoon ? "Coming Soon" : "Out Now"}
                  className="absolute top-1/2 left-1/2 z-20 mt-6 -translate-x-1/2 translate-y-1/2 rounded-full border border-white/20 bg-black/30 px-4 py-1 text-[10px] font-bold tracking-[0.4em] whitespace-nowrap text-white uppercase shadow-2xl backdrop-blur-md"
                  onClick={() => {
                    const link = featured
                      ? resolveFeaturedLink(featured)
                      : null;
                    if (link) window.open(link, "_blank");
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex h-[33.33vh] w-full items-center justify-center border-b border-dashed border-[#dcdcdb] bg-white/5 p-12 text-center text-gray-500 dark:border-[#3E3E3A]">
              No featured banner set. Head to the Band Panel to upload one!
            </div>
          )}
        </div>

        {/* ── Discography ── */}
        <div className="w-full max-w-full px-4 pt-16 pb-12 lg:px-8">
          <main>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
              {/* Left Zone — Song List */}
              <section className="flex flex-col gap-4 self-start">
                <h2 className="font-display text-foreground text-lg font-semibold tracking-tight">
                  Songs
                </h2>
                <SongList
                  songs={songs}
                  albums={albums}
                  selectedId={
                    selectedSong?.id ??
                    (featuredSong
                      ? (songs.find((s) => s.id === featuredSong.id)?.id ??
                        null)
                      : null)
                  }
                  onSelect={(song) =>
                    setSelectedSong((prev) =>
                      prev?.id === song.id ? null : song,
                    )
                  }
                  storageUrl={storageUrl}
                />
              </section>

              {/* Right Zone — Active Track Panel */}
              <div className="relative self-start w-full max-w-4xl z-0">
                <div
                  className="absolute -right-8 sm:-right-16 top-1/2 -translate-y-1/2 w-[90%] md:w-[75%] h-[120%] rounded-[100%] opacity-70 dark:opacity-50 blur-3xl transition-all duration-700 pointer-events-none -z-10"
                  style={{ backgroundColor: ambientColor }}
                />

                {infoTitle ? (
                  <section className="relative self-start flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shadow-xl bg-background transition-all duration-300">
                    {embedUrl ? (
                      <div className="w-full md:w-[480px] shrink-0 bg-black flex items-center justify-center">
                        <div className="relative w-full aspect-video">
                          <iframe
                            src={embedUrl}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : infoCover ? (
                      <img
                        src={`${storageUrl}/${infoCover}`}
                        alt={infoTitle}
                        className="w-full md:w-64 object-cover shrink-0 aspect-square md:aspect-auto"
                      />
                    ) : null}

                    <div className="flex flex-col gap-3 p-6 justify-center flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="font-display text-foreground text-2xl md:text-3xl font-bold leading-tight truncate">
                          {infoTitle}
                        </h2>
                        {embedUrl && (
                          <span className="text-brand text-[10px] font-bold tracking-[0.3em] uppercase shrink-0">
                            MV
                          </span>
                        )}
                      </div>

                      {infoAlbum && (
                        <p className="text-muted-foreground text-sm">
                          {infoAlbum}
                        </p>
                      )}

                      {infoReleaseDate && (
                        <p className="text-brand text-xs font-medium tracking-widest uppercase">
                          {infoIsComingSoon ? "🗓 Coming Soon" : "🎵 Out Now"}{" "}
                          &middot;{" "}
                          {new Date(infoReleaseDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      )}

                      {infoDescription ? (
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed break-words">
                          {infoDescription}
                        </p>
                      ) : (
                        <p className="text-muted-foreground/40 text-sm md:text-base italic">
                          No description yet.
                        </p>
                      )}

                      <div className="mt-2">
                        <StreamingLinks
                          song={selectedSong ?? featuredSong ?? null}
                        />
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="self-start hidden flex-col gap-4 md:flex">
                    <p className="text-muted-foreground text-sm">
                      Set a featured song or album in the Band Panel.
                    </p>
                  </section>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* ── About ── */}
        <div className="relative flex w-full max-w-full items-center justify-center px-4 py-4 md:py-10 lg:px-8">
          <AboutPhrase />
          <p className="text-foreground text-md relative bottom-5 z-10 mx-2 leading-relaxed md:absolute md:mx-70 md:translate-y-1/2 md:text-3xl">
            Strawberry Sweets is an indie band from Balanga, Bataan, that
            started from a school event where a one-time performance turned into
            real chemistry. What began as a simple collab soon grew into a
            shared love for making songs that capture fleeting feelings and
            dreamlike moments.
          </p>
        </div>

        <div className="relative mt-3 flex w-full max-w-full items-center justify-center px-4 py-4 md:mt-30 md:py-10 lg:px-8">
          <GalleryStrip folders={["dhvsu", "prod", "candid"]} />
        </div>

        {/* ── Band Photo ── */}
        <div className="relative flex w-full max-w-full items-center justify-center px-4 py-4 md:py-10 lg:px-8">
          <BandPhoto photo="band.webp" storageUrl={storageUrl} />
        </div>

        {/* ── Footer ── */}
        <div className="relative flex w-full max-w-full items-center justify-center px-4 py-4 md:py-10 lg:px-8">
          <Footer />
        </div>
      </div>
    </>
  );
}

function StreamingLinks({ song }: { song: SongItem | FeaturedItem | null }) {
  if (!song?.links) return null;

  const links = [
    {
      key: "spotify",
      href: song.links.spotify,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.302c-.215.353-.675.465-1.028.249-2.858-1.746-6.457-2.14-10.697-1.171-.403.092-.81-.157-.902-.56-.092-.403.157-.81.56-.902 4.637-1.06 8.624-.601 11.818 1.35.353.216.465.675.249 1.028zm1.466-3.266c-.27.441-.849.58-1.29.31-3.272-2.012-8.259-2.593-12.128-1.418-.496.15-1.022-.128-1.172-.625-.15-.496.128-1.022.625-1.172 4.42-1.341 9.91-.689 13.655 1.611.441.27.58.849.31 1.29zm.126-3.411c-3.924-2.33-10.392-2.545-14.154-1.403-.602.183-1.238-.163-1.421-.765-.183-.602.163-1.238.765-1.421 4.318-1.311 11.458-1.055 15.993 1.638.54.32.715 1.02.395 1.56-.32.54-1.02.715-1.56.395z" />
        </svg>
      ),
      hoverClass: "hover:text-[#1DB954]",
    },
    {
      key: "youtube",
      href: song.links.youtube,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      hoverClass: "hover:text-[#FF0000]",
    },
    {
      key: "apple_music",
      href: song.links.apple_music,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.825 8.351a6.685 6.685 0 0 1-.806-.039 5.863 5.863 0 0 0-.256-4.509 2.502 2.502 0 0 1 1.761 1.761 2.501 2.501 0 0 1-.699 2.787zm-4.706-4.9c-.312.437-.589.907-.824 1.399a.401.401 0 0 0 .151.492c.321.161.64.324.953.498.406.225.823.148 1.1-.237a6.29 6.29 0 0 0 .841-3.152.091.091 0 0 0-.104-.093c-1.01.125-1.741.528-2.117 1.093zM21.571 16.35c-.173.473-.374.935-.6 1.385a11.97 11.97 0 0 1-1.353 2.175c-.482.607-.984.629-1.579.256-.479-.301-1-.444-1.564-.448-.567 0-1.088.163-1.564.448-.595.357-1.083.351-1.564-.007-.156-.116-.312-.228-.475-.327a14.49 14.49 0 0 0-1.25-.668c-.682-.317-1.39-.413-2.112-.259-.283.06-.566.12-.849.18-1.127.24-2.072-.257-2.731-1.25-.97-1.464-1.436-3.08-1.549-4.839-.063-.984.116-1.928.535-2.822.446-.957 1.12-1.7 2.053-2.222a4.57 4.57 0 0 1 2.376-.595 5.17 5.17 0 0 1 1.706.335c.249.098.503.184.755.269.835.281 1.631.309 2.456-.007a4.912 4.912 0 0 1 1.677-.384c1.121-.082 2.11.231 2.949.969.833.733 1.25 1.666 1.373 2.766-.021.037-.042.062-.058.093a5.405 5.405 0 0 0-.583 3.033 5.258 5.258 0 0 0 2.508 4.293z" />
        </svg>
      ),
      hoverClass: "hover:text-[#FB2441]",
    },
  ].filter((l) => !!l.href);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2 shrink-0">
      {links.map(({ key, href, icon, hoverClass }) => (
        <a
          key={key}
          href={href!}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/70 transition-colors ring-1 ring-black/5 dark:ring-white/10 ${hoverClass}`}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
