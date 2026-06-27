"use client";

import { useMemo } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CraftsCards } from "@/components/ui/CraftsCards";
import { hobbiesData } from "@/lib/mock-data";

interface HobbiesSectionProps {
  hobbies?: any[];
}

/** Card color & config presets for each hobby */
const cardPresets: Record<string, {
  gradient: string;
  bgClass: string;
  config: { y: number; x: number; rotate: number; zIndex: number };
}> = {
  Coding: {
    gradient: "from-orange-600 to-orange-600/40",
    bgClass: "bg-orange-500 [&_h2]:text-white",
    config: { y: -20, x: 0, rotate: -15, zIndex: 2 },
  },
  Gaming: {
    gradient: "from-red-600 to-red-600/40",
    bgClass: "bg-red-500 [&_h2]:text-white",
    config: { y: 25, x: 180, rotate: 8, zIndex: 3 },
  },
  Photography: {
    gradient: "from-blue-600 to-blue-600/40",
    bgClass: "bg-blue-500 [&_h2]:text-white",
    config: { y: -70, x: 360, rotate: -5, zIndex: 4 },
  },
  Music: {
    gradient: "from-purple-600 to-purple-600/40",
    bgClass: "bg-purple-500 [&_h2]:text-white",
    config: { y: 20, x: 540, rotate: 12, zIndex: 5 },
  },
  Reading: {
    gradient: "from-emerald-600 to-emerald-600/40",
    bgClass: "bg-emerald-500 [&_h2]:text-white",
    config: { y: -35, x: 720, rotate: -8, zIndex: 6 },
  },
  Traveling: {
    gradient: "from-teal-600 to-teal-600/40",
    bgClass: "bg-teal-500 [&_h2]:text-white",
    config: { y: 30, x: 900, rotate: 6, zIndex: 7 },
  },
};

/** Fallback preset for unknown hobbies */
const fallbackPreset = {
  gradient: "from-neutral-600 to-neutral-600/40",
  bgClass: "bg-neutral-500 [&_h2]:text-white",
  config: { y: 0, x: 0, rotate: 0, zIndex: 2 },
};

export function HobbiesSection({ hobbies }: HobbiesSectionProps) {
  const resolvedHobbies = (hobbies && hobbies.length > 0)
    ? hobbies.map((h: any) => ({
        id: h.id,
        name: h.name,
        description: h.description || "",
        icon: h.icon_name || h.icon || "",
      }))
    : hobbiesData;

  const cards = useMemo(() =>
    resolvedHobbies.map((hobby) => {
      const preset = cardPresets[hobby.name] || fallbackPreset;
      return {
        title: hobby.name,
        description: hobby.description,
        skeleton: (
          <div className={`h-50 w-full rounded-xl bg-gradient-to-r ${preset.gradient}`} />
        ),
        className: preset.bgClass,
        config: preset.config,
      };
    }),
    [resolvedHobbies]
  );

  return (
    <section id="hobbies" className="section-padding pt-10 md:pt-14 lg:pt-16 pb-10 md:pb-14 lg:pb-16 relative overflow-hidden bg-background perf-section">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Hobi & Ketertarikan"
          subtitle="Aktivitas di luar pekerjaan yang mengisi waktu luang saya dan membantu menjaga kreativitas."
          badge="Interests"
          align="center"
        />

        <CraftsCards cards={cards} cardSpacing={145} activeScale={1.08} />
      </div>
    </section>
  );
}
