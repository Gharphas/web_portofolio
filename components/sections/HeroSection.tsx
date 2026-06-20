"use client";

import { motion } from "framer-motion";
import { HeroScene } from "@/components/three/HeroScene";
import { GlowButton } from "@/components/ui/GlowButton"; // Wait, it's components/ui/GlowButton.tsx, check case
// Wait, we saved it as GlowButton.tsx so we must use components/ui/GlowButton
import { TypewriterText } from "@/components/ui/AnimatedText";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { aboutData } from "@/lib/mock-data";

export function HeroSection() {
  const phrases = [
    "Full Stack Developer",
    "Next.js Specialist",
    "UI/UX Enthusiast",
    "3D Web Pioneer",
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 md:pt-28 overflow-hidden"
    >
      {/* Background radial overlay */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">
        {/* Left Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-4 md:gap-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary font-heading shadow-[0_0_10px_var(--crimson-glow)]"
          >
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>WELCOME TO RIANPEDIA v2.0</span>
          </motion.div>

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
            {aboutData.tagline} {aboutData.bioShort}
          </motion.p>

          {/* Location info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80 font-sans"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span>{aboutData.location}</span>
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
              href={aboutData.resumeUrl}
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
          className="lg:col-span-5 h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center rounded-2xl overflow-hidden glass border border-border/10 relative shadow-[0_0_40px_rgba(255,23,68,0.05)]"
        >
          <HeroScene />
        </motion.div>
      </div>

      {/* Animated scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none">
        <span className="text-[10px] tracking-[0.25em] font-heading font-medium text-muted-foreground/50 uppercase">
          Scroll Down
        </span>
        <div className="w-[18px] h-[30px] rounded-full border border-muted-foreground/30 flex justify-center p-1.5">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </div>
    </section>
  );
}
