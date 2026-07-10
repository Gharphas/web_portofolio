"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { GlowButton } from "@/components/ui/GlowButton";
import { TypewriterText } from "@/components/ui/AnimatedText";
import { ArrowRight, Download, MapPin, Loader2 } from "lucide-react";
import { aboutData } from "@/lib/mock-data";
import { useLenis } from "@/components/providers/LenisProvider";
import { HeroBackground } from "@/components/ui/HeroBackground";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    ),
  }
);

interface HeroSectionProps {
  about?: {
    title?: string;
    tagline?: string;
    subtitle?: string;
    bio_short?: string;
    location?: string;
    resume_url?: string;
  };
}

export function HeroSection({ about }: HeroSectionProps) {
  const lenis = useLenis();
  const phrases = about?.subtitle
    ? about.subtitle.split(",").map((s) => s.trim()).filter(Boolean)
    : [
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
      className="relative w-full min-h-screen overflow-hidden -mt-14"
    >
      <HeroBackground>
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-center relative z-10 w-full pt-20 pb-10 md:pt-24 md:pb-28">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 md:gap-6 order-2 lg:order-1">

            {/* Heading */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1]"
              >
                Halo, Saya <span className="text-gradient text-glow">Jemi Arian</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-2xl md:text-3xl font-heading font-semibold text-muted-foreground"
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
              className="text-xs sm:text-base md:text-lg text-gray-800 dark:text-gray-100 max-w-xl font-normal font-sans"
            >
              {currentTagline} {currentBioShort}
            </motion.p>

            {/* Location info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 font-sans w-full lg:w-auto"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>{currentLoc}</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start"
            >
              <GlowButton
                variant="primary"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-sm px-2.5 sm:px-6 py-1.5 sm:py-3"
                onClick={() => {
                  const el = document.getElementById("projects");
                  if (el && lenis) {
                    lenis.scrollTo(el, { offset: -80, duration: 1.2 });
                  } else if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <span>Lihat Proyek</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </GlowButton>

              <GlowButton
                variant="secondary"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-sm px-2.5 sm:px-6 py-1.5 sm:py-3"
                href={currentResume}
                download="Jemi_Arian_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Unduh CV</span>
              </GlowButton>
            </motion.div>
          </div>

          {/* Right 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 h-[280px] sm:h-[450px] lg:h-[650px] flex items-center justify-center overflow-visible relative w-full lg:-mr-16 xl:-mr-20 order-1 lg:order-2"
          >
            <HeroScene />
          </motion.div>
        </div>
      </HeroBackground>
    </section>
  );
}
