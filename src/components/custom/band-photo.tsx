import { useIsMobile } from "@/hooks/useMobile";
import { useEffect, useRef, useState } from "react";

interface Member {
  name: string;
  role: string;
  x: number;
  y: number;
  darkPhoto?: string;
}

const MEMBERS: Member[] = [
  {
    name: "Renz",
    role: "vocals",
    x: 51,
    y: 50,
    darkPhoto: "renz-sleeping.webp",
  },
  {
    name: "Myles",
    role: "guitar",
    x: 65,
    y: 53,
    darkPhoto: "myles-sleeping.webp",
  },
  {
    name: "Joemarie",
    role: "guitar",
    x: 92,
    y: 56,
    darkPhoto: "joemarie-sleeping.webp",
  },
  { name: "Rod", role: "bass", x: 40, y: 53, darkPhoto: "rod-sleeping.webp" },
  { name: "Ian", role: "keys", x: 27, y: 50, darkPhoto: "ian-sleeping.webp" },
  { name: "Kevs", role: "drums", x: 10, y: 54, darkPhoto: "kev-sleeping.webp" },
];

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default function BandIntro({
  photo,
  storageUrl,
}: {
  photo: string;
  storageUrl: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = useDarkMode();

  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-full">
      <p className="font-brand text-brand mt-4 mb-5 text-center text-xl md:mt-10 md:mb-30 md:text-4xl">
        from a school stage to here
      </p>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-sm md:rounded-xl"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Layer 1 — always desaturated and blurred (base) */}
        <img
          src={`${storageUrl}/${photo}`}
          alt="The band"
          loading="lazy"
          className="h-auto w-full object-cover"
          style={
            isMobile
              ? undefined
              : { filter: "grayscale(80%) blur(2px)", willChange: "filter" }
          }
        />

        {/* Darkening overlay — appears when any square is hovered */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-500"
          style={{
            backgroundColor: "rgba(0,0,0,0.45)",
            opacity: hoveredIndex !== null ? 1 : 0,
            zIndex: 0,
          }}
        />
        {MEMBERS.map((member, i) => {
          const isHovered = hoveredIndex === i;
          const swapPhoto = isDark && !!member.darkPhoto;

          return (
            <div
              key={i}
              className="hidden md:absolute md:block"
              style={{
                left: `${member.x}%`,
                top: `${member.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="relative cursor-pointer transition-all duration-300"
                style={{ width: "180px", height: "180px" }}
              >
                {/* Square border */}
                <div
                  className="absolute inset-0 rounded-sm border-2 transition-all duration-300"
                  style={{
                    borderColor: isHovered
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.35)",
                    backgroundColor: isHovered
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    zIndex: 3,
                  }}
                />

                {/* Vignette */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
                    zIndex: 2,
                  }}
                />

                {/* Preview inside square */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-sm"
                  style={{ zIndex: 1 }}
                >
                  <img
                    src={
                      swapPhoto
                        ? `${storageUrl}/${member.darkPhoto}`
                        : `${storageUrl}/${photo}`
                    }
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-500"
                    style={{
                      objectPosition: `${member.x}% ${member.y}%`,
                      filter: isHovered
                        ? "grayscale(0%) blur(0px)"
                        : swapPhoto
                          ? "grayscale(100%) blur(1.5px)"
                          : "grayscale(0%) blur(1px)",
                      transform: "scale(3)",
                      transformOrigin: `${member.x}% ${member.y}%`,
                      left: `-${(member.x / 100) * (containerRef.current?.offsetWidth ?? 800) - 90}px`,
                      top: `-${(member.y / 100) * (containerRef.current?.offsetHeight ?? 500) - 90}px`,
                      willChange: "filter, transform",
                    }}
                  />
                </div>

                {/* Light mode spotlight on hover */}
                {!swapPhoto && isHovered && (
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
                    style={{ zIndex: 4 }}
                  >
                    <img
                      src={`${storageUrl}/${photo}`}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="absolute h-auto object-cover"
                      style={{
                        filter: "grayscale(0%) blur(0px)",
                        width: containerRef.current?.offsetWidth ?? "100%",
                        left: `-${(member.x / 100) * (containerRef.current?.offsetWidth ?? 0) - 40}px`,
                        top: `-${(member.y / 100) * (containerRef.current?.offsetHeight ?? 0) - 40}px`,
                      }}
                    />
                  </div>
                )}

                {/* Dark mode swap photo overlay on hover */}
                {swapPhoto && isHovered && (
                  <div
                    className="pointer-events-none absolute overflow-hidden rounded-sm transition-all duration-500"
                    style={{
                      inset: "-60px",
                      opacity: 1,
                      zIndex: 3,
                    }}
                  >
                    <img
                      src={`${storageUrl}/${member.darkPhoto}`}
                      alt={member.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: "center top",
                        filter: "grayscale(0%) blur(0px)",
                      }}
                    />
                  </div>
                )}

                {/* Name + role label */}
                <div
                  className="pointer-events-none absolute transition-all duration-300"
                  style={{
                    bottom: "-48px",
                    right: "-8px",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? "rotate(-6deg) translateY(0px)"
                      : "rotate(-6deg) translateY(6px)",
                    transformOrigin: "bottom right",
                    zIndex: 10,
                  }}
                >
                  <span className="font-brand block text-right text-6xl leading-tight text-white drop-shadow-lg">
                    {member.name}
                  </span>
                  <span className="font-brand block text-right text-2xl leading-tight text-white/70 drop-shadow-lg">
                    {isDark && member.darkPhoto ? "💤" : member.role}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
