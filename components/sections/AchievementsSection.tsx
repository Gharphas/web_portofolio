"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { achievementsData } from "@/lib/mock-data";
import { ShieldCheck, Calendar, Trophy, Award, ArrowRight, ExternalLink } from "lucide-react";
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
    <div className={cn("relative flex items-center justify-center rounded-lg bg-gradient-to-br h-20 sm:h-28 md:h-36 overflow-hidden", c.from, c.to)}>
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
    <section id="achievements" className="section-padding relative overflow-hidden bg-background/50 perf-section">
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

        <BentoGrid className="max-w-7xl grid-cols-2 md:grid-cols-2 md:auto-rows-[20rem]">
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
              <div className="relative w-full h-20 sm:h-28 md:h-36 rounded-lg overflow-hidden border border-white/5 bg-secondary/20 flex items-center justify-center">
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
              >
                <BentoGridItem
                  title={
                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-tight line-clamp-2 leading-tight block">{item.title}</span>
                  }
                  description={
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] font-mono font-bold text-primary uppercase tracking-wide leading-none">
                        {item.issuer}
                      </p>
                      <p className="hidden sm:block text-muted-foreground/80 leading-relaxed">
                        {item.description}
                      </p>
                      {/* Footer */}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 pt-1.5 md:pt-2">
                        <div className="flex items-center gap-1 text-[8px] sm:text-[9px] md:text-[10px] font-mono text-muted-foreground/50">
                          <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="line-clamp-1">{item.dateReceived}</span>
                        </div>
                        {item.certificateUrl && (
                          <a
                            href={item.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-0.5 text-[8px] sm:text-[9px] md:text-[10px] font-mono font-bold text-primary hover:text-accent transition-colors w-fit"
                          >
                            <span className="hidden xs:inline">VERIFY</span>
                            <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  }
                  header={header}
                  icon={
                    variant === "trophy"
                      ? <Trophy className="h-4 w-4 text-yellow-500" />
                      : variant === "cert"
                        ? <ShieldCheck className="h-4 w-4 text-blue-500" />
                        : <Award className="h-4 w-4 text-primary" />
                  }
                />
              </motion.div>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
