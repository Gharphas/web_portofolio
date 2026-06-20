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
      <ScrollProgress />
      <ParticleNetwork />
      <CursorTrail />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
