"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { projectsData } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { ExternalLink, Github, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectsSectionProps {
  projects?: any[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const resolvedProjects = (projects && projects.length > 0)
    ? projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        longDescription: p.long_description,
        thumbnailUrl: p.thumbnail_url,
        liveUrl: p.live_url,
        githubUrl: p.github_url,
        techStack: p.tech_stack || [],
        category: p.category,
        status: p.status || "completed",
        isFeatured: p.is_featured ?? p.isFeatured ?? false,
      }))
    : projectsData;

  const filteredProjects = resolvedProjects
    .filter((project) => {
      if (selectedCategory === "All") return true;
      return project.category === selectedCategory;
    })
    .slice(0, 6); // Show max 6 in home page

  return (
    <section id="projects" className="section-padding relative overflow-hidden bg-background/50">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Proyek Pilihan"
          subtitle="Koleksi proyek yang menunjukkan pemecahan masalah, penulisan kode bersih, dan perancangan UI interaktif."
          badge="Portfolio"
          align="center"
        />

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10 md:mb-12">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-5 py-2 text-xs font-heading font-semibold tracking-wider uppercase rounded-full border transition-all duration-300 cursor-pointer select-none",
                selectedCategory === category
                  ? "bg-primary border-transparent text-white shadow-[0_0_15px_var(--crimson-glow)]"
                  : "bg-secondary/40 backdrop-blur-sm border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="h-full flex flex-col overflow-hidden group border-border/40" glow={project.isFeatured}>
                  {/* Thumbnail area */}
                  <div className="relative aspect-video w-full bg-secondary/60 flex items-center justify-center overflow-hidden border-b border-border/20">
                    {/* Visual Placeholder grid */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-70" />
                    <Layers className="h-8 w-8 text-primary/45 group-hover:scale-110 transition-transform duration-500" />
                    
                    {/* Featured label */}
                    {project.isFeatured && (
                      <span className="absolute top-3 left-3 z-20 text-[9px] font-heading font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded shadow-[0_0_10px_var(--crimson-glow)]">
                        Featured
                      </span>
                    )}

                    {/* Project Category badge */}
                    <span className="absolute bottom-3 right-3 z-20 text-[9px] font-heading font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm text-foreground px-2.5 py-0.5 rounded border border-border/40">
                      {project.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        {project.status.replace("_", " ")}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground font-sans line-clamp-3 leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.techStack.map((tech: string) => (
                        <span
                          key={tech}
                          className="text-[9px] font-mono text-muted-foreground border border-border/40 px-2 py-0.5 rounded bg-secondary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 border-t border-border/10 pt-4 mt-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-heading font-bold tracking-wide text-primary hover:text-accent transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>LIVE DEMO</span>
                        </a>
                      )}
                      
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-heading font-bold tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>REPOSITORI</span>
                        </a>
                      )}

                      {/* Detail page link */}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="ml-auto text-xs font-heading font-bold tracking-wide text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                      >
                        <span>DETAIL</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All projects CTA */}
        <div className="mt-12 text-center">
          <GlowButton href="/projects" variant="outline" size="md">
            <span>LIHAT SEMUA PROYEK</span>
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
