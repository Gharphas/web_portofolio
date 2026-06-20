"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { aboutData } from "@/lib/mock-data";
import { User, CheckCircle2 } from "lucide-react";

export default function ManageAboutPage() {
  const [title, setTitle] = useState(aboutData.title);
  const [tagline, setTagline] = useState(aboutData.tagline);
  const [location, setLocation] = useState(aboutData.location);
  const [bioShort, setBioShort] = useState(aboutData.bioShort);
  const [bioFull, setBioFull] = useState(aboutData.bioFull);
  
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          KELOLA TENTANG SAYA
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Perbarui data biografi, deskripsi profil, dan lokasi Anda.
        </p>
      </div>

      <GlassCard className="p-6 md:p-8 border-border/40 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>DATA PROFIL BIO</span>
          </h3>

          {success && (
            <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Perubahan profil berhasil disimpan!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Jabatan / Role</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/20 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Lokasi Kerja</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-secondary/20 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tagline Promosi</label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="bg-secondary/20 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Bio Singkat</label>
            <Textarea
              value={bioShort}
              onChange={(e) => setBioShort(e.target.value)}
              className="bg-secondary/20 text-xs resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Bio Lengkap (Markdown Support)</label>
            <Textarea
              value={bioFull}
              onChange={(e) => setBioFull(e.target.value)}
              className="bg-secondary/20 text-xs resize-none"
              rows={8}
            />
          </div>

          <div className="pt-2">
            <GlowButton type="submit" variant="primary" size="sm">
              SIMPAN PROFIL
            </GlowButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
