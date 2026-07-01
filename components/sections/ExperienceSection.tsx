"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { experienceData, educationData } from "@/lib/mock-data";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Building2,
  Award,
  BookOpen,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumTimelineCard, PremiumCardIcon, useCardHover } from "@/components/ui/PremiumTimelineCard";

interface ExperienceSectionProps {
  experience?: any[];
  education?: any[];
}

interface ExperienceCardItemProps {
  exp: any;
  formatDateShort: (date: string) => string;
}

function ExperienceCardItem({ exp, formatDateShort }: ExperienceCardItemProps) {
  const { isHovered } = useCardHover();

  return (
    <PremiumTimelineCard className="w-full">
      <div className="relative p-5 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start z-10">
        {/* Icon Block */}
        <div className="shrink-0 relative hidden sm:block">
          <PremiumCardIcon>
            <Briefcase className="w-8 h-8 text-primary/60 transition-colors duration-500" />
          </PremiumCardIcon>
        </div>

        {/* Content Block */}
        <div className="flex-1 w-full space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2 sm:hidden">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border/50">
                  <Briefcase className="w-5 h-5 text-primary/80" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wide uppercase">
                  <Calendar className="w-3 h-3" />
                  {formatDateShort(exp.startDate)} — {exp.isCurrent ? "Sekarang" : formatDateShort(exp.endDate)}
                </div>
              </div>
              <motion.h3 
                className="text-xl sm:text-2xl font-bold font-heading text-foreground transition-colors duration-300"
                animate={{
                  textShadow: isHovered ? "0 2px 8px rgba(99, 102, 241, 0.4)" : "none",
                  color: isHovered ? "rgb(168, 85, 247)" : "rgb(255, 255, 255)",
                }}
                transition={{ duration: 0.3 }}
              >
                {exp.title}
              </motion.h3>
              <div className="flex items-center flex-wrap gap-2 mt-1.5 text-sm font-medium text-muted-foreground">
                <Building2 className="w-4 h-4 text-primary/60" />
                <span className="text-foreground/90">{exp.company}</span>
                {exp.location && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <span>{exp.location}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Date Badge (Desktop) */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase shrink-0">
               <Calendar className="w-3.5 h-3.5" />
               {formatDateShort(exp.startDate)} — {exp.isCurrent ? "Sekarang" : formatDateShort(exp.endDate)}
            </div>
          </div>

          {/* Description */}
          <motion.p 
            className="text-sm sm:text-base text-gray-300 leading-relaxed font-light"
            animate={{
              opacity: isHovered ? 0.95 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            {exp.description}
          </motion.p>

          {/* Footer Tags */}
          <div className="pt-3 flex flex-wrap gap-2">
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-xs font-semibold tracking-wider text-muted-foreground uppercase group-hover:border-primary/30 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                {exp.type || "Full-time"}
             </span>
          </div>
        </div>
      </div>
    </PremiumTimelineCard>
  );
}

interface EducationCardItemProps {
  edu: any;
  formatYear: (date: string) => string;
}

function EducationCardItem({ edu, formatYear }: EducationCardItemProps) {
  const { isHovered } = useCardHover();

  return (
    <PremiumTimelineCard className="w-full">
      <div className="relative p-5 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start z-10">
        {/* Icon Block */}
        <div className="shrink-0 relative hidden sm:block">
          <PremiumCardIcon>
            <GraduationCap className="w-8 h-8 text-primary/60 transition-colors duration-500" />
          </PremiumCardIcon>
        </div>

        {/* Content Block */}
        <div className="flex-1 w-full space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2 sm:hidden">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border/50">
                   <GraduationCap className="w-5 h-5 text-primary/80" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wide uppercase">
                  <Calendar className="w-3 h-3" />
                  {formatYear(edu.startDate)} — {edu.isCurrent ? "Sekarang" : formatYear(edu.endDate)}
                </div>
              </div>
              <motion.h3 
                className="text-xl sm:text-2xl font-bold font-heading text-foreground transition-colors duration-300"
                animate={{
                  textShadow: isHovered ? "0 2px 8px rgba(99, 102, 241, 0.4)" : "none",
                  color: isHovered ? "rgb(168, 85, 247)" : "rgb(255, 255, 255)",
                }}
                transition={{ duration: 0.3 }}
              >
                {edu.degree && edu.fieldOfStudy
                  ? `${edu.degree} di ${edu.fieldOfStudy}`
                  : edu.degree || edu.fieldOfStudy || "Pendidikan"}
              </motion.h3>
              <div className="flex items-center flex-wrap gap-2 mt-1.5 text-sm font-medium text-muted-foreground">
                <BookOpen className="w-4 h-4 text-primary/60" />
                <span className="text-foreground/90">{edu.institution}</span>
              </div>
            </div>
            
            {/* Date Badge (Desktop) */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase shrink-0">
               <Calendar className="w-3.5 h-3.5" />
               {formatYear(edu.startDate)} — {edu.isCurrent ? "Sekarang" : formatYear(edu.endDate)}
            </div>
          </div>

          {/* Description */}
          <motion.p 
            className="text-sm sm:text-base text-gray-300 leading-relaxed font-light"
            animate={{
              opacity: isHovered ? 0.95 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            {edu.description}
          </motion.p>

          {/* Footer Tags */}
          {edu.grade && (
            <div className="pt-3 flex flex-wrap gap-2">
               <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-xs font-semibold tracking-wider text-muted-foreground uppercase group-hover:border-primary/30 transition-colors">
                  <Award className="w-3.5 h-3.5 text-yellow-500" />
                  IPK: {edu.grade}
               </span>
            </div>
          )}
        </div>
      </div>
    </PremiumTimelineCard>
  );
}

export function ExperienceSection({ experience, education }: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");

  const resolvedExperience = useMemo(() =>
    (experience && experience.length > 0)
      ? experience.map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        location: exp.location || "",
        description: exp.description || "",
        startDate: exp.start_date || exp.startDate || "",
        endDate: exp.end_date || exp.endDate || "",
        isCurrent: exp.is_current ?? exp.isCurrent ?? false,
        type: exp.type || "work",
      }))
      : experienceData,
    [experience]
  );

  const resolvedEducation = useMemo(() =>
    (education && education.length > 0)
      ? education.map((edu: any) => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree || "",
        fieldOfStudy: edu.field_of_study || edu.fieldOfStudy || "",
        startDate: edu.start_date || edu.startDate || "",
        endDate: edu.end_date || edu.endDate || "",
        isCurrent: edu.is_current ?? edu.isCurrent ?? false,
        description: edu.description || "",
        grade: edu.grade || "",
      }))
      : educationData,
    [education]
  );

  const formatYear = (date: string) => {
    if (!date) return "";
    const parts = date.split("-");
    return parts[0];
  };

  const formatDateShort = (date: string) => {
      if (!date) return "";
      const parts = date.split("-");
      if (parts.length >= 2) {
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
      }
      return date;
  };

  return (
    <SectionWrapper id="experience" className="section-padding relative perf-section">
      {/* Dynamic Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen hidden" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen hidden" />
      </div>

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Pengalaman & Edukasi"
          subtitle="Perjalanan karir dan pendidikan yang membentuk dedikasi serta keahlian saya."
          badge="Jejak Langkah"
          align="center"
        />

        {/* Tab Switcher - Futuristic Pill */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="relative p-1.5 bg-background/60 backdrop-blur-xl rounded-full border border-border/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] inline-flex">
            <button
              onClick={() => setActiveTab("work")}
              className={cn(
                "relative flex items-center gap-2.5 px-8 py-3 text-sm font-bold rounded-full transition-all duration-500",
                activeTab === "work" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === "work" && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-rose-500 rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Briefcase className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Pekerjaan</span>
            </button>
            <button
              onClick={() => setActiveTab("education")}
              className={cn(
                "relative flex items-center gap-2.5 px-8 py-3 text-sm font-bold rounded-full transition-all duration-500",
                activeTab === "education" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === "education" && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-rose-500 rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <GraduationCap className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Pendidikan</span>
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "work" ? (
              <motion.div
                key="work"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, staggerChildren: 0.1 }}
                className="space-y-6 sm:space-y-8"
              >
                {resolvedExperience.map((exp, idx) => (
                  <motion.div 
                    key={exp.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ExperienceCardItem exp={exp} formatDateShort={formatDateShort} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, staggerChildren: 0.1 }}
                className="space-y-6 sm:space-y-8"
              >
                {resolvedEducation.map((edu, idx) => (
                  <motion.div 
                    key={edu.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <EducationCardItem edu={edu} formatYear={formatYear} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
