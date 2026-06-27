"use client";

import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { usePerformanceTier } from "@/hooks/use-utils";

const Ballpit = dynamic(
  () => import("@/components/three/Ballpit"),
  { ssr: false }
);

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const performanceTier = usePerformanceTier();
  const [mountBallpit, setMountBallpit] = useState(false);

  // Defer Ballpit mounting until after page is idle — reduces initial GPU load
  useEffect(() => {
    const timer = setTimeout(() => setMountBallpit(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Global Interactive Ballpit Background — deferred for performance */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-15 perf-isolate">
        {mountBallpit && (
          <Ballpit
            count={performanceTier === "mobile" ? 60 : 100}
            gravity={0.06}
            friction={0.993}
            wallBounce={0.88}
            followCursor={true}
            hideCursorSphere={true}
            colors={[0x6366f1, 0x3b82f6, 0x808080, 0xffffff, 0x111118]}
            minSize={0.4}
            maxSize={0.85}
          />
        )}
      </div>
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

