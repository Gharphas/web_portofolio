"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { aboutData } from "@/lib/mock-data";
import { Award, Briefcase, GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  const stats = [
    { label: "Pengalaman Kerja", value: "3+ Tahun", icon: Briefcase },
    { label: "Proyek Selesai", value: "15+ Proyek", icon: Award },
    { label: "Edukasi IT", value: "Sarjana UI", icon: GraduationCap },
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-background/50">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Tentang Saya"
          subtitle="Kenali lebih dekat siapa saya, apa latar belakang saya, dan bagaimana saya bekerja."
          badge="About Me"
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Profile Photo Area */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-[280px] h-[350px] rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.15)]"
            >
              {/* Glass frame */}
              <div className="absolute inset-0 border border-primary/20 rounded-2xl z-20 pointer-events-none group-hover:border-primary/50 transition-colors duration-500" />
              
              {/* Profile Image - using a placeholder image */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none opacity-60" />
              <div className="w-full h-full bg-secondary/80 flex items-center justify-center text-muted-foreground relative">
                {/* Visual placeholder or real image if exist */}
                <Image
                  src={aboutData.photoUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"}
                  alt="Rian Profile"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Tagline float */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/40">
                <p className="text-[10px] uppercase font-heading font-semibold text-primary tracking-wider">
                  Status
                </p>
                <p className="text-xs text-foreground font-semibold">
                  Open for Opportunities
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bio & Details Area */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                Saya <span className="text-primary font-bold">Rian</span>, Seorang {aboutData.title}
              </h3>
              
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed font-sans space-y-4 whitespace-pre-line">
                {aboutData.bioFull}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80 font-sans pt-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Bekerja dari: {aboutData.location}</span>
              </div>
            </motion.div>

            {/* Stats Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <GlassCard className="p-5 flex flex-col items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(255,23,68,0.1)]">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-heading text-lg font-bold text-foreground">
                          {stat.value}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
