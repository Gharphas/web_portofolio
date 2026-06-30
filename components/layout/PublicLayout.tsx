"use client";

import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const SideRays = dynamic(() => import("../ui/SideRays"), {
  ssr: false,
});

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
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
        {/* WebGL SideRays background in dark mode */}
        <div className="absolute inset-0 hidden dark:block opacity-45">
          <SideRays
            speed={2.5}
            rayColor1="#EAB308"
            rayColor2="#96c8ff"
            intensity={2}
            spread={2}
            origin="top-right"
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={1.0}
          />
        </div>
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
