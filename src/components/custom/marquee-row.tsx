"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

interface MarqueeRowProps {
  photos: string[];
  direction: "left" | "right";
  speed?: number;
}

function MarqueeRow({ photos, direction, speed = 40 }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const extendedPhotos = useMemo(() => {
    if (!photos.length) return [];
    const multiplier = Math.max(4, Math.ceil(50 / photos.length));
    return Array(multiplier).fill(photos).flat();
  }, [photos]);

  const { contextSafe } = useGSAP({ scope: trackRef });

  const initAnimation = contextSafe(() => {
    const track = trackRef.current;
    if (!track || photos.length === 0) return;
    const children = track.children;
    if (children.length < photos.length * 2) return;
    const firstItem = children[0] as HTMLElement;
    const cloneItem = children[photos.length] as HTMLElement;
    const dist = cloneItem.offsetLeft - firstItem.offsetLeft;
    if (dist <= 0) return;
    gsap.killTweensOf(track);
    if (direction === "left") {
      gsap.fromTo(
        track,
        { x: 0 },
        { x: -dist, duration: dist / speed, ease: "none", repeat: -1 },
      );
    } else {
      gsap.fromTo(
        track,
        { x: -dist },
        { x: 0, duration: dist / speed, ease: "none", repeat: -1 },
      );
    }
  });

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;
    let ob: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ob = new ResizeObserver(initAnimation);
      ob.observe(track);
    } else {
      window.addEventListener("resize", initAnimation);
    }
    initAnimation();
    const fallbackTimer = setTimeout(initAnimation, 1000);
    return () => {
      if (ob) ob.disconnect();
      window.removeEventListener("resize", initAnimation);
      clearTimeout(fallbackTimer);
      gsap.killTweensOf(track);
    };
  }, [photos, direction, speed]);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={trackRef}
        className="relative flex w-max gap-2"
        style={{ willChange: "transform" }}
      >
        {extendedPhotos.map((src: string, i: number) => (
          <img
            key={i}
            src={src}
            alt=""
            onLoad={() => initAnimation()}
            onError={() => initAnimation()}
            className="h-48 w-auto flex-shrink-0 rounded-sm object-cover grayscale-[30%]"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

interface GalleryStripProps {
  storageUrl: string;
  folders: string[];
}

export default function GalleryStrip({
  storageUrl,
  folders,
}: GalleryStripProps) {
  const [rows, setRows] = useState<string[][]>([[], [], []]);
  const foldersString = JSON.stringify(folders);

  useEffect(() => {
    Promise.all(
      folders.map((folder) =>
        fetch(`${storageUrl}/gallery/${folder}`)
          .then((r) => r.json())
          .catch(() => [] as string[]),
      ),
    ).then((results) => setRows(results as string[][]));
  }, [foldersString]);

  const directions: Array<"left" | "right"> = ["left", "right", "left"];

  return (
    <section className="flex w-full flex-col gap-4 overflow-hidden py-8">
      {rows.map((photos, i) =>
        photos.length > 0 ? (
          <MarqueeRow
            key={folders[i]}
            photos={photos}
            direction={directions[i]}
            speed={35 + i * 5}
          />
        ) : null,
      )}
    </section>
  );
}
