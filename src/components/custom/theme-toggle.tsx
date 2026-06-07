"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function ThemeToggle() {
  const containerRef = useRef<HTMLButtonElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const sunRaysRef = useRef<(HTMLSpanElement | null)[]>([]);
  const moonRef = useRef<HTMLDivElement>(null);

  const [dark, setDark] = useState(false);

  // Init from localStorage / system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useGSAP(
    () => {
      gsap.killTweensOf([
        knobRef.current,
        moonRef.current,
        ...sunRaysRef.current,
      ]);

      if (dark) {
        gsap.to(knobRef.current, {
          x: 24,
          backgroundColor: "#1a0a0d",
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(sunRaysRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          stagger: { each: 0.02, from: "random" },
          ease: "power2.in",
        });
        gsap.to(moonRef.current, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.35,
          delay: 0.15,
          ease: "power2.out",
        });
      } else {
        gsap.to(knobRef.current, {
          x: 0,
          backgroundColor: "#fff8f0",
          duration: 0.4,
          ease: "power3.out",
        });
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo(
          sunRaysRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1.5,
            opacity: 1,
            duration: 0.2,
            stagger: { each: 0.015, from: "center" },
            ease: "power2.out",
          },
        ).to(sunRaysRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.25,
          stagger: { each: 0.015, from: "edges" },
          ease: "power2.in",
        });
        gsap.to(moonRef.current, {
          opacity: 0,
          scale: 0.6,
          rotation: -30,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    },
    { scope: containerRef, dependencies: [dark] },
  );

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <button
      ref={containerRef}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-8 w-14 cursor-pointer items-center rounded-full border border-black/10 bg-black/10 px-1 backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-black/20"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full transition-colors duration-500"
        style={{
          background: dark ? "hsla(240,20%,10%,0.4)" : "hsla(35,80%,85%,0.25)",
        }}
      />
      <div
        ref={knobRef}
        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md"
        style={{ backgroundColor: "#fff8f0", willChange: "transform" }}
      >
        <div className="absolute h-2.5 w-2.5 rounded-full bg-amber-400" />
        {RAY_ANGLES.map((angle, i) => (
          <span
            key={angle}
            ref={(el) => {
              sunRaysRef.current[i] = el;
            }}
            className="absolute h-1 w-0.5 rounded-full bg-amber-400"
            style={{
              transformOrigin: "center 14px",
              transform: `rotate(${angle}deg) translateY(-6px)`,
              top: "50%",
              left: "50%",
              marginLeft: "-1px",
              marginTop: "-14px",
            }}
          />
        ))}
        <div
          ref={moonRef}
          className="absolute h-3.5 w-3.5 rounded-full"
          style={{
            opacity: 0,
            scale: "0.6",
            background: "hsl(240, 30%, 85%)",
            boxShadow: "inset -2px -1px 0 2px hsl(240,20%,60%)",
          }}
        />
      </div>
    </button>
  );
}
