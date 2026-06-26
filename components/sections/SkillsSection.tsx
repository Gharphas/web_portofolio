"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillsConstellation } from "@/components/ui/SkillsConstellation";

interface SkillsSectionProps {
  skills?: any[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="relative overflow-hidden bg-background pt-20 md:pt-28 lg:pt-32">
      <div className="container-custom relative z-10">
        <SectionHeading
          title="Keahlian & Teknologi"
          subtitle="Teknologi dan tools yang saya gunakan sehari-hari untuk mengembangkan aplikasi berkualitas tinggi."
          badge="Skills"
          align="center"
          showBadge={false}
        />
      </div>

      {/* Constellation Skill Map — full width, no container constraint */}
      <div className="relative z-10 mt-4 md:mt-8">
        <SkillsConstellation />
      </div>
    </section>
  );
}
