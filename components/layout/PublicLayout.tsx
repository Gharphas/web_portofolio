"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const LineWaves = dynamic(() => import("../ui/LineWaves"), {
  ssr: false,
});

const LiquidChrome = dynamic(() => import("../ui/LiquidChrome"), {
  ssr: false,
});

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const refreshGSAP = () => {
      ScrollTrigger.refresh();
    };

    // Jalankan refresh di berbagai interval untuk mengantisipasi pemuatan model 3D lambat
    const timers = [
      setTimeout(refreshGSAP, 500),
      setTimeout(refreshGSAP, 1500),
      setTimeout(refreshGSAP, 3000),
      setTimeout(refreshGSAP, 5000),
    ];

    window.addEventListener("load", refreshGSAP);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refreshGSAP);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Lightweight CSS-only animated background — zero GPU cost vs WebGL Ballpit */}
      <div className="fixed inset-0 z-0 pointer-events-none perf-isolate">
        <div className="absolute inset-0 bg-background" />
        {/* WebGL background conditional rendering based on resolved theme */}
        {mounted && (
          resolvedTheme === "dark" ? (
            <div className="absolute inset-0 opacity-45">
              <LineWaves
                speed={0.1}
                innerLineCount={32}
                outerLineCount={36}
                warpIntensity={1.0}
                rotation={-45}
                edgeFadeWidth={0.0}
                colorCycleSpeed={1.0}
                brightness={0.2}
                color1="#d7d6d6"
                color2="#9a0505"
                color3="#040000"
                enableMouseInteraction={true}
                mouseInfluence={2.0}
              />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-30">
              <LiquidChrome
                baseColor={[0.7568627450980392, 0.7490196078431373, 0.7490196078431373]}
                speed={0.13}
                amplitude={0.61}
                interactive={false}
              />
            </div>
          )
        )}
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.04] dark:opacity-[0.06] bg-primary animate-[float_18s_ease-in-out_infinite] hidden dark:block" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.03] dark:opacity-[0.05] bg-crimson animate-[float_22s_ease-in-out_infinite_reverse] hidden dark:block" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.02] dark:opacity-[0.03] bg-accent animate-[float_25s_ease-in-out_infinite] hidden dark:block" />
      </div>
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
