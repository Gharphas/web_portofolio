"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Lightweight CSS-only animated background — zero GPU cost vs WebGL Ballpit */}
      <div className="fixed inset-0 z-0 pointer-events-none perf-isolate">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.04] dark:opacity-[0.06] bg-primary animate-[float_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.03] dark:opacity-[0.05] bg-crimson animate-[float_22s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.02] dark:opacity-[0.03] bg-accent animate-[float_25s_ease-in-out_infinite]" />
      </div>
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
