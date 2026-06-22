"use client";

import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useProgress } from "@react-three/drei";
import { GLBModel } from "./GLBModel";
import { Loader2 } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const colors = THEME_COLORS.crimson;

  return (
    <div className="w-full h-[350px] sm:h-[450px] md:h-full relative select-none">
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
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
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

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
