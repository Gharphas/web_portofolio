"use client";

import { useEffect, useState, useCallback } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

// ─── 3D Performance Tier ───
export type PerformanceTier = "mobile" | "tablet" | "desktop";

export function usePerformanceTier(): PerformanceTier {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
}

// ─── Mouse Position ───
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return position;
}

// ─── Scroll Animation (IntersectionObserver) ───
export function useScrollAnimation(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackRef = useCallback((node: HTMLElement | null) => {
    setRef(node);
  }, []);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: callbackRef, isVisible };
}

// ─── Scroll Progress ───
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Use Lenis scroll event when available, fallback to native scroll
    let lenisInstance: any = null;
    let lenisHandler: ((e: any) => void) | null = null;

    const getLenis = () => {
      // Access Lenis instance from the DOM element attribute (set by Lenis lib)
      // or fallback to window scroll
      try {
        const htmlEl = document.documentElement;
        if (htmlEl.classList.contains("lenis")) {
          // Lenis is active — use requestAnimationFrame polling for smoothness
          let rafId: number;
          const poll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
              document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
            rafId = requestAnimationFrame(poll);
          };
          rafId = requestAnimationFrame(poll);
          return () => cancelAnimationFrame(rafId);
        }
      } catch {}

      // Fallback: native scroll listener
      const handler = () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      };
      window.addEventListener("scroll", handler, { passive: true });
      return () => window.removeEventListener("scroll", handler);
    };

    const cleanup = getLenis();
    return cleanup;
  }, []);

  return progress;
}

// ─── Active Viewport Observation ───
export function useIsInViewport(threshold = 0.05) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  const callbackRef = useCallback((node: HTMLElement | null) => {
    setRef(node);
  }, []);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: callbackRef, isInViewport };
}

// ─── 3D Viewport Observer — mount/unmount heavy WebGL components ───
// Uses a generous rootMargin to preload components before they enter viewport.
// When the element leaves the expanded viewport area, shouldMount becomes false
// so the WebGL context can be freed.
export function useInViewport3D(rootMargin = "200px 0px 200px 0px") {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);

  const callbackRef = useCallback((node: HTMLElement | null) => {
    setRef(node);
  }, []);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldMount(entry.isIntersecting);
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return { ref: callbackRef, shouldMount };
}

