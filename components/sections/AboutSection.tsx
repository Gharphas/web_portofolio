"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { aboutData } from "@/lib/mock-data";
import { Award, Briefcase, GraduationCap, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useInViewport3D, usePerformanceTier } from "@/hooks/use-utils";

const Lanyard = dynamic<{ frontImage?: string | null; backImage?: string | null; lanyardWidth?: number; className?: string }>(
  () => import("../three/Lanyard"),
  {
    ssr: false,
    loading: () => (
      <div className="w-[280px] h-[380px] rounded-2xl bg-secondary/30 animate-pulse border border-border/50 flex items-center justify-center text-muted-foreground text-xs font-medium">
        Loading 3D Interactive Card...
      </div>
    ),
  }
);

interface AboutSectionProps {
  about?: any;
}

export function AboutSection({ about }: AboutSectionProps) {
  const { ref: lanyardContainerRef, shouldMount } = useInViewport3D("300px 0px 300px 0px");
  const [lanyardWidth, setLanyardWidth] = useState(1.5);

  useEffect(() => {
    const handleResize = () => {
      setLanyardWidth(window.innerWidth < 1024 ? 1.8 : 1.5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const performanceTier = usePerformanceTier();
  const isMobile = performanceTier === "mobile";
  const shouldMountLanyard = shouldMount;

  const currentPhoto = about?.photo_url || aboutData.photoUrl;
  const currentTitle = about?.title || aboutData.title;
  const currentBioFull = about?.bio_full || aboutData.bioFull;
  const currentLoc = about?.location || aboutData.location;

  return (
    <SectionWrapper id="about" className="section-padding relative min-h-[750px] perf-section" style={{ overflow: 'visible' }}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none hidden" />

      {/* Lanyard 3D — hangs from top of About, placed behind text but interactive */}
      <div
        ref={lanyardContainerRef}
        className="absolute top-0 left-0 w-full h-[550px] lg:h-full z-10 pointer-events-auto"
        style={{ overflow: 'visible' }}
      >
        {shouldMountLanyard && !isMobile && (
          <Lanyard
            frontImage={currentPhoto}
            backImage={currentPhoto}
            lanyardWidth={lanyardWidth}
            className="w-full h-full"
          />
        )}
      </div>

      <div className="container-custom relative z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <SectionHeading
            title="Tentang Saya"
            subtitle="Kenali lebih dekat siapa saya, apa latar belakang saya, dan bagaimana saya bekerja."
            badge="About Me"
            align="center"
            showLine={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Spacer or static profile photo on mobile */}
          <div className="lg:col-span-4 w-full flex justify-center items-center py-6 lg:py-0">
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-[200px] h-[270px] rounded-2xl overflow-hidden relative border border-border/40 shadow-2xl glass flex items-center justify-center p-3 pointer-events-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
                <img
                  src={currentPhoto}
                  alt={currentTitle}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
              </motion.div>
            ) : (
              <div className="min-h-[420px] lg:min-h-[580px] w-full" />
            )}
          </div>

          {/* Bio & Details Area */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8 pointer-events-auto text-center lg:text-left items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 w-full"
            >
              <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                Saya <span className="text-primary font-bold">Jemi Arian</span>, Seorang {currentTitle}
              </h3>
              
              <div className="text-xs md:text-base text-muted-foreground leading-relaxed font-sans space-y-4 whitespace-pre-line text-justify lg:text-left">
                {currentBioFull}
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-muted-foreground/80 font-sans pt-2 w-full">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Bekerja dari: {currentLoc}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
