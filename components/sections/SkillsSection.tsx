"use client";

import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Loader2 } from "lucide-react";

// Dynamic import SkillSphere — Three.js bundle (~500KB+) hanya dimuat saat section ini dirender
const SkillSphere = dynamic(
  () => import("@/components/three/SkillSphere").then((mod) => mod.SkillSphere),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] sm:h-[480px] md:h-[580px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    ),
  }
);

interface SkillsSectionProps {
  skills?: any[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="section-padding relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Keahlian & Teknologi"
          subtitle="Teknologi dan tools yang saya gunakan sehari-hari untuk mengembangkan aplikasi berkualitas tinggi."
          badge="Skills"
          align="center"
          showBadge={true}
        />

        {/* Centered 3D/2D Skill Sphere Animation */}
        <div className="flex justify-center items-center mt-12 w-full">
          <SkillSphere />
        </div>
      </div>
    </section>
  );
}
