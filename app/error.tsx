"use client";

import { useEffect } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { ParticleNetwork } from "@/components/three/ParticleNetwork";
import { AlertCircle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an external tracking service if available
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-background">
      <ParticleNetwork />

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-crimson-glow/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glass p-8 rounded-2xl border border-border/40 text-center relative z-10 space-y-6 shadow-[0_0_50px_rgba(255,23,68,0.05)]"
      >
        {/* Error icon box */}
        <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Terjadi Kesalahan Sistem
          </h1>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            Aplikasi mengalami kendala teknis saat memuat data. Silakan coba muat ulang komponen halaman.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/60 bg-secondary/30 p-1.5 rounded mt-2 select-all">
              ID Error: {error.digest}
            </p>
          )}
        </div>

        {/* Action button reset */}
        <div className="pt-2">
          <GlowButton
            variant="primary"
            size="md"
            className="w-full flex justify-center items-center gap-2 cursor-pointer select-none"
            onClick={() => reset()}
          >
            <RotateCcw className="h-4 w-4" />
            <span>COBA LAGI</span>
          </GlowButton>
        </div>
      </motion.div>
    </div>
  );
}
