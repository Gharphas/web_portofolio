"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { achievementsData } from "@/lib/mock-data";
import { ShieldCheck, Calendar, Trophy, Award, ArrowRight, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementsSectionProps {
  achievements?: any[];
}

/** Animated skeleton header for each bento card */
function Skeleton({ variant }: { variant: "trophy" | "cert" | "award" }) {
  const colors = {
    trophy: { from: "from-yellow-500/20", to: "to-amber-600/5", ring: "ring-yellow-500/15", text: "text-yellow-500" },
    cert: { from: "from-blue-500/20", to: "to-indigo-600/5", ring: "ring-blue-500/15", text: "text-blue-500" },
    award: { from: "from-primary/20", to: "to-primary/5", ring: "ring-primary/15", text: "text-primary" },
  };
  const c = colors[variant];

  return (
    <div className={cn("relative flex items-center justify-center rounded-xl bg-gradient-to-br aspect-[16/9] w-full overflow-hidden border border-white/5", c.from, c.to)}>
      {/* Decorative ring */}
      <div className={cn("absolute h-24 w-24 rounded-full border-2 ring-1 opacity-20", c.ring)} />
      <div className={cn("absolute h-16 w-16 rounded-full border opacity-10", c.ring)} />

      {/* Floating dots */}
      <motion.div
        className={cn("absolute h-1.5 w-1.5 rounded-full", c.text.replace("text-", "bg-"))}
        animate={{ y: [-3, 3, -3], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "20%", left: "25%" }}
      />
      <motion.div
        className={cn("absolute h-1 w-1 rounded-full", c.text.replace("text-", "bg-"))}
        animate={{ y: [2, -4, 2], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ bottom: "25%", right: "30%" }}
      />

      {/* Icon */}
      {variant === "trophy" && <Trophy className={cn("relative z-10 h-8 w-8", c.text)} />}
      {variant === "cert" && <ShieldCheck className={cn("relative z-10 h-8 w-8", c.text)} />}
      {variant === "award" && <Award className={cn("relative z-10 h-8 w-8", c.text)} />}
    </div>
  );
}

function getVariant(title: string): "trophy" | "cert" | "award" {
  const t = title.toLowerCase();
  if (t.includes("winner") || t.includes("hackathon") || t.includes("juara")) return "trophy";
  if (t.includes("certif") || t.includes("certified") || t.includes("professional")) return "cert";
  return "award";
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);

  const resolvedAchievements = useMemo(() =>
    (achievements && achievements.length > 0)
      ? achievements.map((item: any) => ({
          id: item.id,
          title: item.title,
          issuer: item.issuer,
          description: item.description || "",
          dateReceived: item.date_received || item.dateReceived || "",
          certificateUrl: item.certificate_url || item.certificateUrl || "",
          badgeUrl: item.badge_url || item.badgeUrl || "",
        }))
      : achievementsData,
    [achievements]
  );

  return (
    <SectionWrapper id="achievements" className="section-padding relative overflow-hidden perf-section">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Prestasi & Sertifikasi"
          subtitle="Pengakuan profesional, sertifikasi industri, dan pencapaian kompetisi yang telah saya raih."
          badge="Credentials"
          align="center"
        />

        <BentoGrid className="max-w-4xl mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:auto-rows-auto">
          {resolvedAchievements.map((item, index) => {
            const variant = getVariant(item.title);

            const isImageUrl = (url?: string) => {
              if (!url) return false;
              return (
                url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) != null ||
                url.includes("/storage/v1/object/public/")
              );
            };

            const imageUrl = isImageUrl(item.badgeUrl)
              ? item.badgeUrl
              : isImageUrl(item.certificateUrl)
              ? item.certificateUrl
              : null;

            const header = imageUrl ? (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/5 bg-zinc-900/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <Skeleton variant={variant} />
            );

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full flex"
              >
                <BentoGridItem
                  className="w-full h-full flex flex-col justify-between"
                  title={
                    <div className="flex items-start gap-2 pt-1">
                      <span className="mt-0.5 shrink-0">
                        {variant === "trophy" ? (
                          <Trophy className="h-4 w-4 text-amber-500" />
                        ) : variant === "cert" ? (
                          <ShieldCheck className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Award className="h-4 w-4 text-primary" />
                        )}
                      </span>
                      <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground line-clamp-2 leading-snug">
                        {item.title}
                      </span>
                    </div>
                  }
                  description={
                    <div className="space-y-4 mt-2 w-full flex flex-col justify-between flex-1">
                      {/* Issuer */}
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-muted-foreground/75 tracking-wide uppercase font-mono">
                        <span className="h-1 w-1 rounded-full bg-primary/70" />
                        <span className="line-clamp-1">{item.issuer}</span>
                      </div>

                      {/* Spacer to push footer to bottom */}
                      <div className="flex-1" />

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/5 w-full gap-2">
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-muted-foreground/50">
                          <Calendar className="h-3 w-3" />
                          <span className="line-clamp-1">{item.dateReceived}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedAchievement(item);
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-[9px] sm:text-[10px] font-bold text-foreground bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                          >
                            <span>Detail</span>
                            <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                          {item.certificateUrl && (
                            <a
                              href={item.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-0.5 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>Verify</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                  header={header}
                  icon={null}
                />
              </motion.div>
            );
          })}
        </BentoGrid>
      </div>

      {/* Modal Popup for Details */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedAchievement(null)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-6 shadow-2xl z-10 md:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Header Image or Skeleton */}
                <div className="overflow-hidden rounded-xl border border-white/5 bg-secondary/10">
                  {(() => {
                    const variant = getVariant(selectedAchievement.title);
                    const isImageUrl = (url?: string) => {
                      if (!url) return false;
                      return (
                        url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) != null ||
                        url.includes("/storage/v1/object/public/")
                      );
                    };

                    const imageUrl = isImageUrl(selectedAchievement.badgeUrl)
                      ? selectedAchievement.badgeUrl
                      : isImageUrl(selectedAchievement.certificateUrl)
                      ? selectedAchievement.certificateUrl
                      : null;

                    return imageUrl ? (
                      <div className="relative w-full aspect-video flex items-center justify-center bg-black/25">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={selectedAchievement.title}
                          className="max-h-56 w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="p-4">
                        <Skeleton variant={variant} />
                      </div>
                    );
                  })()}
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const variant = getVariant(selectedAchievement.title);
                      return variant === "trophy" ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : variant === "cert" ? (
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Award className="h-5 w-5 text-primary" />
                      );
                    })()}
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wide">
                      {selectedAchievement.issuer}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                    {selectedAchievement.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/75 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Perolehan: {selectedAchievement.dateReceived}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2 font-mono">
                    Deskripsi / Pencapaian
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line font-light">
                    {selectedAchievement.description || "Tidak ada deskripsi tersedia."}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="px-4 py-2 text-xs font-mono font-bold border border-white/10 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    TUTUP
                  </button>
                  {selectedAchievement.certificateUrl && (
                    <a
                      href={selectedAchievement.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg transition-colors cursor-pointer"
                    >
                      <span>VERIFIKASI</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
