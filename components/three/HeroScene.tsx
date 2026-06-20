"use client";

import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FloatingShapes } from "./FloatingShapes";
import { Loader2 } from "lucide-react";

export function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] sm:h-[450px] md:h-full relative select-none">
      {/* Dynamic 3D canvas */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <FloatingShapes />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </Suspense>

      {/* Decorative pointer info overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase font-heading tracking-widest text-muted-foreground/60 pointer-events-none bg-background/40 backdrop-blur-[2px] px-3 py-1 rounded-full border border-border/10 select-none">
        Drag to Rotate 3D Objects
      </div>
    </div>
  );
}
