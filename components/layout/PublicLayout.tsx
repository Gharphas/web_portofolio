"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { ParticleNetwork } from "@/components/three/ParticleNetwork";
import { CursorTrail } from "@/components/three/CursorTrail";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Global Background Grid Pattern (Tron-style) */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />
      <ScrollProgress />
      <ParticleNetwork />
      <CursorTrail />
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
