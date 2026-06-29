"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { GLBModel } from "./GLBModel";
import { Spinner } from "@/components/ui/Spinner";

import { usePerformanceTier, useIsInViewport } from "@/hooks/use-utils";
import type { WebGLRenderer } from "three";

// No props needed since customization was removed

const THEME_COLORS = {
  crimson: { primary: "#FF1744", secondary: "#D50000" },
};

function CanvasLoader() {
  const { active } = useProgress();
  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent z-30 pointer-events-none">
      <Spinner className="h-10 w-10 text-primary" />
    </div>
  );
}

export function HeroScene() {
  const { ref, isInViewport: inViewport } = useIsInViewport(0.15);
  const [hasBeenInViewport, setHasBeenInViewport] = useState(false);
  const performanceTier = usePerformanceTier();
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const glRef = useRef<WebGLRenderer | null>(null);

  useEffect(() => {
    if (inViewport) {
      setHasBeenInViewport(true);
    }
  }, [inViewport]);

  const isInViewport = hasBeenInViewport || inViewport;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    // Cek ketersediaan WebGL di sisi klien
    // PENTING: Jangan gunakan canvas.getContext('webgl') di sini karena akan
    // mengkonsumsi salah satu slot WebGL context browser yang terbatas (~8-16).
    // Cukup cek apakah API tersedia, biarkan Canvas R3F yang membuat context.
    try {
      const isSupported = !!window.WebGLRenderingContext;
      setWebglSupported(isSupported);
    } catch (e) {
      setWebglSupported(false);
    }

    return () => clearTimeout(timer);
  }, []);

  // === PERF: Skip 3D entirely on mobile — 28MB GLB is too heavy ===
  if (performanceTier === "mobile") {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_rgba(255,23,68,0.25)] bg-gradient-to-br from-primary/10 via-zinc-900 to-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profil.png"
            alt="Jemi Arian"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  // Hanya gunakan fallback jika WebGL benar-benar tidak didukung atau terjadi context lost permanen
  const showFallback = webglSupported === false;

  if (showFallback) {
    return (
      <div className="w-full h-[320px] sm:h-[400px] md:h-full" />
    );
  }

  const colors = THEME_COLORS.crimson;

  return (
    <div ref={ref} className="w-full h-[350px] sm:h-[450px] md:h-full relative select-none">
      {isInViewport ? (
        <>
          {/* 3D Loading Progress Indicator */}
          <CanvasLoader />

          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="h-8 w-8 text-primary" />
              </div>
            }
          >
            <Canvas
              camera={{ position: [0.5, 0, 9.0], fov: 50 }}
              dpr={[1, performanceTier === 'desktop' ? 1.5 : 1.25]}
              frameloop={inViewport ? "always" : "demand"}
              gl={{ antialias: performanceTier === 'desktop', alpha: true, powerPreference: 'high-performance' }}
              className="w-full h-full"
              onCreated={({ gl }) => {
                glRef.current = gl;
                const handleContextLost = (event: Event) => {
                  event.preventDefault();
                  console.warn("WebGL context lost in HeroScene. Falling back to 2D image.");
                  setWebglSupported(false);
                };
                gl.domElement.addEventListener("webglcontextlost", handleContextLost);
              }}
            >
              {/* Dynamic light setup based on active theme */}
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 8, 5]} intensity={2.5} color={colors.primary} />
              <directionalLight position={[-5, 5, -5]} intensity={1.2} color="#ffffff" />
              <pointLight position={[0, 4, 3]} intensity={3.5} color="#ffffff" distance={10} decay={1.5} />
              <pointLight position={[-2.5, -2, 3]} intensity={2.5} color={colors.secondary} distance={8} decay={2} />

              {/* Render Only Model 2 */}
              <GLBModel 
                url="/3d-2.glb" 
                wireframe={false} 
                color={colors.primary} 
              />
            </Canvas>
          </Suspense>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      )}
    </div>
  );
}

