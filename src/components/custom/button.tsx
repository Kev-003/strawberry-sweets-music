"use client";
import StreamingIconCycler from "@/components/custom/streaming-icon-cycler";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

interface StreamingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function StreamingButton({
  label = "Coming Soon",
  className,
  onClick,
  ...props
}: StreamingButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useGSAP(
    () => {
      const targets = [
        arrowRef.current,
        circleRef.current,
        textRef.current,
        iconWrapRef.current,
      ];
      gsap.killTweensOf(targets);

      if (hovered) {
        gsap.to(arrowRef.current, {
          x: -24,
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
        });
        gsap.to(circleRef.current, {
          scale: 18,
          duration: 0.45,
          ease: "power2.out",
        });
        gsap.to(textRef.current, { x: 15, duration: 0.3, ease: "power2.out" });
        gsap.to(iconWrapRef.current, {
          opacity: 1,
          x: 4,
          duration: 0.3,
          delay: 0.15,
          ease: "power2.out",
        });
      } else {
        gsap.to(arrowRef.current, {
          x: 2,
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        });
        gsap.to(circleRef.current, {
          scale: 1,
          duration: 0.35,
          ease: "power2.inOut",
        });
        gsap.to(textRef.current, { x: -7, duration: 0.25, ease: "power2.out" });
        gsap.to(iconWrapRef.current, {
          opacity: 0,
          x: -8,
          duration: 0.15,
          ease: "power2.in",
        });
      }
    },
    { scope: containerRef, dependencies: [hovered] },
  );

  const hasPosition = /\b(absolute|fixed|sticky|static|relative)\b/.test(
    className ?? "",
  );

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${hasPosition ? "" : "relative"} inline-flex items-center overflow-hidden rounded-full border border-white/20 bg-black/30 px-5 py-2.5 backdrop-blur-md hover:bg-transparent ${className ?? ""}`}
      {...props}
    >
      <div
        ref={circleRef}
        className="absolute right-2.5 h-7 w-7 rounded-full bg-brand-500"
        style={{ transformOrigin: "center", zIndex: 0 }}
      />
      <div
        ref={iconWrapRef}
        className="relative z-10 text-white text-lg"
        style={{ opacity: 0, transform: "translateX(-10px)" }}
      >
        <StreamingIconCycler />
      </div>
      <span
        ref={textRef}
        className="relative z-10 text-[10px] font-bold tracking-[0.4em] text-white uppercase"
      >
        {label}
      </span>
      <div
        ref={arrowRef}
        className="relative z-10 mr-[-5px] flex h-7 w-7 items-center justify-center rounded-full"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6h8M7 3l3 3-3 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
}
