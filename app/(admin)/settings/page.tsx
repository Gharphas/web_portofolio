"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONFIG } from "@/lib/constants";
import { Settings, CheckCircle2, Globe, Share2, Shield } from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState(SITE_CONFIG.name);
  const [siteTitle, setSiteTitle] = useState(SITE_CONFIG.title);
  const [siteDesc, setSiteDesc] = useState(SITE_CONFIG.description);
  const [siteUrl, setSiteUrl] = useState(SITE_CONFIG.url);

  // Social Links mock inputs
  const [githubUrl, setGithubUrl] = useState("https://github.com/rian");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/rian");
  const [twitterUrl, setTwitterUrl] = useState("https://twitter.com/rian");

  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          PENGATURAN SITUS
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Kelola nama situs, tag meta SEO, dan integrasi tautan media sosial eksternal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          {success && (
            <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold font-sans">
              <CheckCircle2 className="h-4 w-4" />
              <span>Pengaturan situs berhasil disimpan!</span>
            </div>
          )}

          {/* SEO Settings Card */}
          <GlassCard className="p-6 md:p-8 border-border/40 space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>SETTING SEO & GENERAL</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Nama Situs</label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Judul Utama SEO</label>
                <Input
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Site URL</label>
              <Input
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="bg-secondary/20 text-xs"
              />
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Meta Deskripsi</label>
              <Textarea
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="bg-secondary/20 text-xs resize-none"
                rows={3}
              />
            </div>
          </GlassCard>

          {/* Social settings Card */}
          <GlassCard className="p-6 md:p-8 border-border/40 space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>TAUTAN MEDIA SOSIAL</span>
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">GitHub</label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">LinkedIn</label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Twitter / X</label>
                <Input
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>
            </div>
          </GlassCard>

          <div>
            <GlowButton type="submit" variant="primary" size="sm">
              SIMPAN PENGATURAN
            </GlowButton>
          </div>
        </form>

        {/* Security / System Card */}
        <div className="lg:col-span-4">
          <GlassCard className="p-6 border-border/40 space-y-4">
            <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>SYSTEM CONTROL</span>
            </h3>

            <div className="space-y-2 text-xs text-muted-foreground font-sans leading-relaxed">
              <p>
                Platform CMS RianPedia saat ini terhubung menggunakan kunci autentikasi mock lokal.
              </p>
              <p className="text-[10px] text-muted-foreground/60 border-t border-border/10 pt-2">
                Versi Aplikasi: 2.0.0
              </p>
              <p className="text-[10px] text-muted-foreground/60">
                Mode Lingkungan: Production Build
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
