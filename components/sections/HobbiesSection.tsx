"use client";

import { useMemo } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CraftsCards } from "@/components/ui/CraftsCards";
import { hobbiesData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

/** Dynamic styling presets for sequential fallback */
const presetsList = [
  {
    gradient: "from-orange-600 to-orange-600/40",
    bgClass: "bg-orange-500 [&_h2]:text-white",
    y: -20,
    rotate: -15,
  },
  {
    gradient: "from-red-600 to-red-600/40",
    bgClass: "bg-red-500 [&_h2]:text-white",
    y: 25,
    rotate: 8,
  },
  {
    gradient: "from-blue-600 to-blue-600/40",
    bgClass: "bg-blue-500 [&_h2]:text-white",
    y: -70,
    rotate: -5,
  },
  {
    gradient: "from-purple-600 to-purple-600/40",
    bgClass: "bg-purple-500 [&_h2]:text-white",
    y: 20,
    rotate: 12,
  },
  {
    gradient: "from-emerald-600 to-emerald-600/40",
    bgClass: "bg-emerald-500 [&_h2]:text-white",
    y: -35,
    rotate: -8,
  },
  {
    gradient: "from-teal-600 to-teal-600/40",
    bgClass: "bg-teal-500 [&_h2]:text-white",
    y: 30,
    rotate: 6,
  },
];

/** Fallback preset for unknown hobbies if list presets fail */
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
        imageUrl: h.image_url || h.imageUrl || "",
      }))
    : hobbiesData.map((h) => ({
        ...h,
        imageUrl: "",
      }));

  const cards = useMemo(() =>
    resolvedHobbies.map((hobby, index) => {
      const nameKey = hobby.name.toLowerCase().trim();
      let preset = cardPresets[hobby.name];

      // Match Indonesian names / alternate names to standard English presets
      if (!preset) {
        const aliasMap: Record<string, string> = {
          "eksplorasi ai": "Photography",
          "game online": "Gaming",
          "gaming": "Gaming",
          "badminton": "Reading",
          "musik": "Music",
          "music": "Music",
          "reading": "Reading",
          "photography": "Photography",
          "coding": "Coding",
          "traveling": "Traveling",
        };
        const matchedName = aliasMap[nameKey];
        if (matchedName) {
          preset = cardPresets[matchedName];
        }
      }

      // If still not matched, use sequential preset from list
      const selectedPreset = preset || presetsList[index % presetsList.length];

      const config = {
        y: selectedPreset.config?.y ?? (selectedPreset as any).y,
        x: index * 180,
        rotate: selectedPreset.config?.rotate ?? (selectedPreset as any).rotate,
        zIndex: index + 2,
      };

      return {
        title: hobby.name,
        description: hobby.description,
        skeleton: hobby.imageUrl ? (
          <div className="h-36 lg:h-52 w-full rounded-2xl overflow-hidden relative border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={hobby.imageUrl} 
              alt={hobby.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
            />
          </div>
        ) : (
          <div className={`h-36 lg:h-52 w-full rounded-2xl bg-gradient-to-r ${selectedPreset.gradient}`} />
        ),
        className: selectedPreset.bgClass,
        config: config,
      };
    }),
    [resolvedHobbies]
  );

  return (
    <SectionWrapper id="hobbies" className="section-padding pt-10 md:pt-14 lg:pt-16 pb-10 md:pb-14 lg:pb-16 relative overflow-hidden perf-section">
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none hidden" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none hidden" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Hobi & Ketertarikan"
          subtitle="Aktivitas di luar pekerjaan yang mengisi waktu luang saya dan membantu menjaga kreativitas."
          badge="Interests"
          align="center"
        />

        <CraftsCards cards={cards} cardSpacing={145} activeScale={1.08} />
      </div>
    </SectionWrapper>
  );
}

