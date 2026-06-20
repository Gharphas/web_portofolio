"use client";

import Link from "next/link";
import { GlowButton } from "@/components/ui/GlowButton";
import { ParticleNetwork } from "@/components/three/ParticleNetwork";
import { ShieldAlert, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
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
        {/* Warning Icon Box */}
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_var(--crimson-glow)] animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-5xl font-extrabold text-gradient text-glow">
            404
          </h1>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau sedang tidak tersedia untuk sementara waktu.
          </p>
        </div>

        {/* Home Link CTA */}
        <div className="pt-2">
          <GlowButton href="/" variant="primary" size="md" className="w-full flex justify-center items-center gap-2">
            <Home className="h-4 w-4" />
            <span>KEMBALI KE BERANDA</span>
          </GlowButton>
        </div>
      </motion.div>
    </div>
  );
}
