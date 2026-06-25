"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { GLBModel } from "./GLBModel";
import { Loader2 } from "lucide-react";

import { usePerformanceTier, useIsInViewport } from "@/hooks/use-utils";
import type { WebGLRenderer } from "three";

// No props needed since customization was removed

const THEME_COLORS = {
  crimson: { primary: "#FF1744", secondary: "#D50000" },
};

function CanvasLoader() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-30 transition-all duration-300">
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <span className="absolute text-[10px] font-bold text-primary font-heading">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-heading font-semibold tracking-wide text-foreground">
            Memuat Model 3D...
          </p>
          <p className="text-[11px] text-muted-foreground font-sans">
            File 3D berukuran besar (~25MB), harap tunggu beberapa saat.
          </p>
        </div>
        <div className="w-48 h-1 bg-border/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
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

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
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
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 0, 8.0], fov: 45 }}
              dpr={[1, performanceTier === 'desktop' ? 2 : 1.5]}
              gl={{ antialias: performanceTier === 'desktop', alpha: true }}
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
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}

