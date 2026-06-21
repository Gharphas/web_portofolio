"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { experienceData, educationData } from "@/lib/mock-data";
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
  experience?: any[];
  education?: any[];
}

export function ExperienceSection({ experience, education }: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");

  const resolvedExperience = (experience && experience.length > 0)
    ? experience.map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        location: exp.location || "",
        description: exp.description || "",
        startDate: exp.start_date || exp.startDate || "",
        endDate: exp.end_date || exp.endDate || "",
        isCurrent: exp.is_current ?? exp.isCurrent ?? false,
        logoUrl: exp.logo_url || exp.logoUrl || "",
      }))
    : experienceData;

  const resolvedEducation = (education && education.length > 0)
    ? education.map((edu: any) => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.field_of_study || edu.fieldOfStudy || "",
        startDate: edu.start_date || edu.startDate || "",
        endDate: edu.end_date || edu.endDate || "",
        isCurrent: edu.is_current ?? edu.isCurrent ?? false,
        description: edu.description || "",
        grade: edu.grade || "",
      }))
    : educationData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: activeTab === "work" ? -30 : 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <section id="experience" className="section-padding relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Pengalaman & Edukasi"
          subtitle="Jejak profesional dan akademis saya dalam dunia teknologi perangkat lunak."
          badge="History"
          align="center"
        />

        {/* Tab Selector */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("work")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-heading font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none",
              activeTab === "work"
                ? "bg-primary border-transparent text-white shadow-[0_0_15px_var(--crimson-glow)]"
                : "bg-secondary/40 backdrop-blur-sm border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
            )}
          >
            <Briefcase className="h-4 w-4" />
            <span>Pekerjaan</span>
          </button>
          
          <button
            onClick={() => setActiveTab("education")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-heading font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none",
              activeTab === "education"
                ? "bg-primary border-transparent text-white shadow-[0_0_15px_var(--crimson-glow)]"
                : "bg-secondary/40 backdrop-blur-sm border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
            )}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Pendidikan</span>
          </button>
        </div>

        {/* Timeline Content */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line indicator */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-border/50 to-transparent -translate-x-1/2 hidden sm:block" />

          <AnimatePresence mode="wait">
            {activeTab === "work" ? (
              <motion.div
                key="work-timeline"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8 relative"
              >
                {resolvedExperience.map((exp, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div
                      key={exp.id}
                      variants={itemVariants}
                      className={cn(
                        "flex flex-col sm:flex-row items-start sm:justify-between w-full relative pl-8 sm:pl-0",
                        isEven ? "sm:flex-row-reverse" : ""
                      )}
                    >
                      {/* Timeline center dot */}
                      <div className="absolute left-4 sm:left-1/2 h-5 w-5 rounded-full border-4 border-background bg-primary -translate-x-1/2 shadow-[0_0_10px_var(--crimson-glow)] z-10" />

                      {/* Card Content wrapper */}
                      <div className={cn("w-full sm:w-[45%]", isEven ? "sm:text-right" : "sm:text-left")}>
                        <GlassCard className="p-6 border-border/40 hover:border-primary/30">
                          {/* Calendar badge */}
                          <div className={cn("flex items-center gap-1.5 text-xs text-primary font-mono mb-2 justify-start", isEven ? "sm:justify-end" : "justify-start")}>
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                            </span>
                          </div>

                          <h3 className="font-heading text-lg font-bold text-foreground">
                            {exp.title}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground font-semibold mb-3">
                            {exp.company} — {exp.location}
                          </p>

                          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                            {exp.description}
                          </p>
                        </GlassCard>
                      </div>

                      {/* Empty spacer space to balance layout */}
                      <div className="hidden sm:block w-[45%]" />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="edu-timeline"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8 relative"
              >
                {resolvedEducation.map((edu, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div
                      key={edu.id}
                      variants={itemVariants}
                      className={cn(
                        "flex flex-col sm:flex-row items-start sm:justify-between w-full relative pl-8 sm:pl-0",
                        isEven ? "sm:flex-row-reverse" : ""
                      )}
                    >
                      {/* Timeline center dot */}
                      <div className="absolute left-4 sm:left-1/2 h-5 w-5 rounded-full border-4 border-background bg-primary -translate-x-1/2 shadow-[0_0_10px_var(--crimson-glow)] z-10" />

                      {/* Card Content wrapper */}
                      <div className={cn("w-full sm:w-[45%]", isEven ? "sm:text-right" : "sm:text-left")}>
                        <GlassCard className="p-6 border-border/40 hover:border-primary/30">
                          {/* Calendar badge */}
                          <div className={cn("flex items-center gap-1.5 text-xs text-primary font-mono mb-2 justify-start", isEven ? "sm:justify-end" : "justify-start")}>
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {edu.startDate} - {edu.endDate}
                            </span>
                          </div>

                          <h3 className="font-heading text-lg font-bold text-foreground">
                            {edu.degree} — {edu.fieldOfStudy}
                          </h3>

                          <p className="text-xs text-muted-foreground font-semibold mb-2">
                            {edu.institution}
                          </p>

                          {edu.grade && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary font-mono border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full mb-3">
                              GPA: {edu.grade}
                            </span>
                          )}

                          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                            {edu.description}
                          </p>
                        </GlassCard>
                      </div>

                      {/* Empty spacer space to balance layout */}
                      <div className="hidden sm:block w-[45%]" />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
