"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { hobbiesData } from "@/lib/mock-data";
import { Code2, Gamepad2, Camera, Music, BookOpen, Plane, HelpCircle } from "lucide-react";

// Icon mapping helper
const iconMap: Record<string, React.ComponentType<any>> = {
  Code2,
  Gamepad2,
  Camera,
  Music,
  BookOpen,
  Plane,
};

export function HobbiesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section id="hobbies" className="section-padding relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Hobi & Ketertarikan"
          subtitle="Aktivitas di luar pekerjaan yang mengisi waktu luang saya dan membantu menjaga kreativitas."
          badge="Interests"
          align="center"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {hobbiesData.map((hobby) => {
            const IconComponent = iconMap[hobby.icon] || HelpCircle;
            return (
              <motion.div key={hobby.id} variants={itemVariants}>
                <GlassCard className="p-6 h-full flex items-start gap-4 border-border/40 hover:border-primary/30">
                  {/* Icon Wrapper */}
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex flex-shrink-0 items-center justify-center text-primary shadow-[0_0_10px_rgba(255,23,68,0.1)]">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1">
                    <h3 className="font-heading text-sm font-bold text-foreground">
                      {hobby.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                      {hobby.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
