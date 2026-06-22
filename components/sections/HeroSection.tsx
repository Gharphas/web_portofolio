"use client";

import { motion } from "framer-motion";
import { HeroScene } from "@/components/three/HeroScene";
import { GlowButton } from "@/components/ui/GlowButton";
import { TypewriterText } from "@/components/ui/AnimatedText";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { aboutData } from "@/lib/mock-data";

interface HeroSectionProps {
  about?: {
    title?: string;
    tagline?: string;
    bio_short?: string;
    location?: string;
    resume_url?: string;
  };
}

export function HeroSection({ about }: HeroSectionProps) {
  const phrases = [
    "Full Stack Developer",
    "Next.js Specialist",
    "UI/UX Enthusiast",
    "3D Web Pioneer",
  ];

  const currentTagline = about?.tagline || aboutData.tagline;
  const currentBioShort = about?.bio_short || aboutData.bioShort;
  const currentLoc = about?.location || aboutData.location;
  const currentResume = about?.resume_url || aboutData.resumeUrl;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden"
    >
      {/* Background radial overlay */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">
        {/* Left Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-4 md:gap-6">


          {/* Heading */}
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1]"
            >
              Halo, Saya <span className="text-gradient text-glow">Rian</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-muted-foreground"
            >
              Saya adalah seorang{" "}
              <TypewriterText
                phrases={phrases}
                className="text-primary font-bold border-b border-primary/30 pb-0.5"
              />
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl font-sans"
          >
            {currentTagline} {currentBioShort}
          </motion.p>

          {/* Location info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80 font-sans"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span>{currentLoc}</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <GlowButton
              variant="primary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={() => {
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>Lihat Proyek</span>
              <ArrowRight className="h-4 w-4" />
            </GlowButton>

            <GlowButton
              variant="secondary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              href={currentResume}
              download
            >
              <Download className="h-4 w-4" />
              <span>Unduh CV</span>
            </GlowButton>
          </motion.div>
        </div>

        {/* Right 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 h-[400px] sm:h-[500px] lg:h-[650px] flex items-center justify-center overflow-hidden relative w-full"
        >
          <HeroScene />
        </motion.div>
      </div>
    </section>
  );
}
