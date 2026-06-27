"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experienceData, educationData } from "@/lib/mock-data";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Building2,
  Award,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface ExperienceSectionProps {
  experience?: any[];
  education?: any[];
}

/** Magnetic hover card - shifts subtly toward cursor position */
function MagneticCard({ children, className, index, isCurrent }: {
  children: React.ReactNode;
  className?: string;
  index: number;
  isCurrent?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.03);
    y.set((e.clientY - cy) * 0.03);
  };

  const handleLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full overflow-hidden">
        <motion.div
          className={cn("w-full h-full", isCurrent ? "bg-primary" : "bg-muted-foreground/20")}
          initial={{ scaleY: 0, originY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.12 + 0.2, ease: "easeOut" }}
        />
        {hovered && (
          <motion.div
            className="absolute inset-0 bg-primary/60"
            layoutId="accent-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Card body */}
      <motion.div
        className={cn(
          "relative rounded-r-xl rounded-l-sm bg-card/80 backdrop-blur-sm border border-border/20 pl-5 pr-5 py-5 transition-all duration-300",
          hovered && "border-primary/20 bg-card shadow-[0_4px_30px_rgba(0,0,0,0.15)]",
          isCurrent && "border-primary/15"
        )}
      >
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 0.04 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(255,23,68,0.5), transparent 60%)" }}
        />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </motion.div>
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
          degree: edu.degree,
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

  const formatDate = (date: string) => {
    if (!date) return "";
    const parts = date.split("-");
    if (parts.length >= 2) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
    }
    return date;
  };

  const getYear = (date: string) => {
    if (!date) return "";
    return date.split("-")[0];
  };

  return (
    <section id="experience" className="section-padding relative overflow-hidden bg-background perf-section">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Pengalaman & Edukasi"
          subtitle="Jejak profesional dan akademis yang membentuk keahlian saya dalam rekayasa perangkat lunak."
          badge="Journey"
          align="center"
        />

        {/* Tab Switcher */}
        <div className="flex justify-center mb-14">
          <div className="relative flex gap-4">
            <ShimmerButton
              shimmerColor={activeTab === "work" ? "#FF1744" : "#555555"}
              className={cn(
                "flex items-center gap-2 text-sm font-heading font-bold uppercase tracking-wider cursor-pointer select-none",
                activeTab === "work" ? "text-white" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("work")}
            >
              <Briefcase className="h-4 w-4" />
              <span>Pekerjaan</span>
            </ShimmerButton>

            <ShimmerButton
              shimmerColor={activeTab === "education" ? "#FF1744" : "#555555"}
              className={cn(
                "flex items-center gap-2 text-sm font-heading font-bold uppercase tracking-wider cursor-pointer select-none",
                activeTab === "education" ? "text-white" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("education")}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Pendidikan</span>
            </ShimmerButton>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "work" ? (
              <motion.div
                key="work"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {resolvedExperience.map((exp, idx) => (
                  <div key={exp.id} className="flex gap-5 md:gap-8 items-stretch">
                    {/* Step number column */}
                    <div className="hidden sm:flex flex-col items-center gap-2 pt-4 flex-shrink-0 w-16">
                      <motion.span
                        className="text-3xl font-heading font-black text-primary/15 leading-none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.12 + 0.1, duration: 0.5, type: "spring" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </motion.span>
                      <motion.span
                        className="text-[10px] font-mono font-bold text-muted-foreground/50"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.12 + 0.3, duration: 0.4 }}
                      >
                        {getYear(exp.startDate)}
                      </motion.span>

                      {/* Dashed connector to next */}
                      {idx < resolvedExperience.length - 1 && (
                        <motion.div
                          className="w-[1px] flex-grow border-l border-dashed border-border/40 mt-2"
                          initial={{ scaleY: 0, originY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: idx * 0.1 + 0.4 }}
                        />
                      )}
                    </div>

                    {/* Card */}
                    <div className="flex-grow">
                      <MagneticCard index={idx} isCurrent={exp.isCurrent}>
                        <div className="space-y-2.5">
                          {/* Top: badges row */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                                exp.isCurrent
                                  ? "text-primary bg-primary/10 border border-primary/25"
                                  : "text-muted-foreground/70 bg-secondary/50 border border-border/30"
                              )}>
                                {exp.type === "internship" ? (
                                  <Award className="h-2.5 w-2.5" />
                                ) : (
                                  <Briefcase className="h-2.5 w-2.5" />
                                )}
                                {exp.type || "Full-time"}
                              </span>

                              {exp.isCurrent && (
                                <motion.span
                                  className="text-[9px] font-mono font-bold uppercase text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1"
                                  animate={{ borderColor: ["rgba(255,23,68,0.2)", "rgba(255,23,68,0.5)", "rgba(255,23,68,0.2)"] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <motion.span
                                    className="w-1.5 h-1.5 rounded-full bg-primary"
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                  Currently
                                </motion.span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/60">
                              <Calendar className="h-3 w-3" />
                              {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-heading text-base md:text-lg font-bold text-foreground leading-snug">
                            {exp.title}
                          </h3>

                          {/* Company + Location */}
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                              <Building2 className="h-3.5 w-3.5 text-primary/50" />
                              {exp.company}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5 text-muted-foreground/70">
                              <MapPin className="h-3 w-3 text-primary/50" />
                              {exp.location}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground/80 font-sans leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </MagneticCard>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {resolvedEducation.map((edu, idx) => (
                  <div key={edu.id} className="flex gap-5 md:gap-8 items-stretch">
                    {/* Step number column */}
                    <div className="hidden sm:flex flex-col items-center gap-2 pt-4 flex-shrink-0 w-16">
                      <motion.span
                        className="text-3xl font-heading font-black text-primary/15 leading-none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.12 + 0.1, duration: 0.5, type: "spring" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </motion.span>
                      <motion.span
                        className="text-[10px] font-mono font-bold text-muted-foreground/50"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.12 + 0.3, duration: 0.4 }}
                      >
                        {getYear(edu.startDate)}
                      </motion.span>

                      {idx < resolvedEducation.length - 1 && (
                        <motion.div
                          className="w-[1px] flex-grow border-l border-dashed border-border/40 mt-2"
                          initial={{ scaleY: 0, originY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: idx * 0.1 + 0.4 }}
                        />
                      )}
                    </div>

                    {/* Card */}
                    <div className="flex-grow">
                      <MagneticCard index={idx} isCurrent={edu.isCurrent}>
                        <div className="space-y-2.5">
                          {/* Top badges */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-muted-foreground/70 bg-secondary/50 border border-border/30">
                              <BookOpen className="h-2.5 w-2.5" />
                              {edu.degree}
                            </span>

                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/60">
                              <Calendar className="h-3 w-3" />
                              {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                            </div>
                          </div>

                          {/* Degree title */}
                          <h3 className="font-heading text-base md:text-lg font-bold text-foreground leading-snug">
                            {edu.degree} — {edu.fieldOfStudy}
                          </h3>

                          {/* Institution */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <GraduationCap className="h-3.5 w-3.5 text-primary/50" />
                            {edu.institution}
                          </div>

                          {/* GPA */}
                          {edu.grade && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              whileInView={{ opacity: 1, width: "auto" }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 + 0.5, duration: 0.5 }}
                              className="overflow-hidden"
                            >
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full">
                                <Award className="h-3 w-3" />
                                IPK: {edu.grade}
                              </span>
                            </motion.div>
                          )}

                          {/* Description */}
                          <p className="text-xs text-muted-foreground/80 font-sans leading-relaxed">
                            {edu.description}
                          </p>
                        </div>
                      </MagneticCard>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
