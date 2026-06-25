"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { usePerformanceTier } from "@/hooks/use-utils";

// const CursorTrail = dynamic(
//   () => import("@/components/three/CursorTrail").then((mod) => mod.CursorTrail),
//   { ssr: false }
// );

const Ballpit = dynamic(
  () => import("@/components/three/Ballpit"),
  { ssr: false }
);

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const performanceTier = usePerformanceTier();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Global Interactive Ballpit Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-15">
        <Ballpit
          count={100}
          gravity={0.06}
          friction={0.993}
          wallBounce={0.88}
          followCursor={true}
          hideCursorSphere={true}
          colors={[0x6366f1, 0x3b82f6, 0x808080, 0xffffff, 0x111118]}
          minSize={0.4}
          maxSize={0.85}
        />
      </div>
      <ScrollProgress />
      {/* {performanceTier === "desktop" && <CursorTrail />} */}
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

