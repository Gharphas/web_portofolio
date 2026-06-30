"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "@/hooks/use-utils";

export function HeroBackground({ children }: { children?: React.ReactNode }) {
  const performanceTier = usePerformanceTier();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // === PERF: Only load video on desktop, lazy-load via IntersectionObserver ===
  useEffect(() => {
    if (performanceTier === "mobile") return; // Skip video entirely on mobile

    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [performanceTier]);

  // Pause video when tab is hidden
  useEffect(() => {
    if (!shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [shouldLoadVideo]);

  const isMobile = performanceTier === "mobile";

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-background text-foreground transition-colors duration-300"
    >
      {/* Lapisan 1: Video background (desktop only) / Gradient fallback (mobile) — Hanya untuk dark mode */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden dark:block">
        {isMobile ? (
          /* Mobile: lightweight CSS gradient instead of video */
          <div className="w-full h-full bg-gradient-to-br from-background via-secondary to-background" />
        ) : shouldLoadVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-25 dark:opacity-75 transition-opacity duration-300"
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          /* Placeholder while video loads */
          <div className="w-full h-full bg-gradient-to-br from-background via-secondary to-background" />
        )}

        {/* Lapisan 2: Gradient overlay agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
      </div>

      {/* Lapisan 3: Grid lines tipis — only on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none opacity-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px bg-border/40"
              style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px bg-border/40"
              style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }}
            />
          ))}
        </div>
      )}

      {/* Konten Anda, di atas semua background */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
