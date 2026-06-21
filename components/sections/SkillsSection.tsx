"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { skillsData } from "@/lib/mock-data";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { SkillSphere } from "@/components/three/SkillSphere";
import { cn } from "@/lib/utils";

interface SkillsSectionProps {
  skills?: any[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const resolvedSkills = (skills && skills.length > 0)
    ? skills.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        color: s.color || "#FF1744",
        isFeatured: s.is_featured ?? s.isFeatured ?? false,
      }))
    : skillsData;

  const filteredSkills = resolvedSkills.filter((skill) => {
    if (selectedCategory === "All") return true;
    return skill.category === selectedCategory;
  });

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
        />

        {/* Split Grid for 3D Sphere & Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mt-8">
          {/* Left Column: 3D Word Cloud Sphere (desktop/tablet only or dynamic) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <SkillSphere />
          </div>

          {/* Right Column: Category filter and skills listing */}
          <div className="lg:col-span-7 space-y-8">
            {/* Filter Categories */}
            <div className="flex flex-wrap gap-2">
              {SKILL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-heading font-semibold tracking-wider uppercase rounded-full border transition-all duration-300 cursor-pointer select-none",
                    selectedCategory === category
                      ? "bg-primary border-transparent text-white shadow-[0_0_10px_var(--crimson-glow)]"
                      : "bg-secondary/40 backdrop-blur-sm border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <GlassCard
                      className="p-5 flex flex-col gap-4 group cursor-pointer"
                      glow={skill.isFeatured}
                    >
                      {/* Skill Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse"
                            style={{ color: skill.color || "var(--crimson)", backgroundColor: skill.color || "var(--crimson)" }}
                          />
                          <span className="font-heading text-xs font-bold text-foreground">
                            {skill.name}
                          </span>
                        </div>
                        {skill.isFeatured && (
                          <span className="text-[8px] uppercase tracking-wider font-heading font-semibold text-primary px-1.5 py-0.5 rounded border border-primary/20 bg-primary/5">
                            Core
                          </span>
                        )}
                      </div>

                      {/* Skill Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-muted-foreground">Proficiency</span>
                          <span className="font-heading font-bold text-foreground">{skill.proficiency}%</span>
                        </div>
                        
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-crimson to-accent rounded-full"
                          />
                        </div>
                      </div>

                      {/* Subtle info footer */}
                      <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 border-t border-border/10 pt-2 group-hover:text-muted-foreground transition-colors duration-300">
                        <span>{skill.category}</span>
                        <span>Pro Level</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
