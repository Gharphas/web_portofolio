"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { achievementsData } from "@/lib/mock-data";
import { ShieldCheck, Calendar, ExternalLink } from "lucide-react";

export function AchievementsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="achievements" className="section-padding relative overflow-hidden bg-background/50">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Prestasi & Sertifikasi"
          subtitle="Pengakuan profesional, sertifikasi industri, dan pencapaian kompetisi yang telah saya raih."
          badge="Credentials"
          align="center"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {achievementsData.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <GlassCard className="p-6 h-full flex items-start gap-4 border-border/40 hover:border-primary/30">
                {/* Visual Icon Box */}
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex flex-shrink-0 items-center justify-center text-primary shadow-[0_0_15px_rgba(255,23,68,0.1)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                {/* Details Content */}
                <div className="flex-grow space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    
                    {/* Date received badge */}
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.dateReceived}</span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
                    {item.issuer}
                  </p>

                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    {item.description}
                  </p>

                  {/* Verification URL Link */}
                  {item.certificateUrl && (
                    <div className="pt-2">
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-primary hover:text-accent transition-colors"
                      >
                        <span>VERIFIKASI KREDENSIAL</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
