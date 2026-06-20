"use client";

import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { projectsData } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { ExternalLink, Github, ArrowLeft, Search, Layers } from "lucide-react";
import Link from "next/link";
const NextLink = Link;
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <PublicLayout>
      <div className="section-padding min-h-screen pt-28 md:pt-32">
        <div className="container-custom">
          {/* Back button */}
          <div className="mb-6">
            <NextLink
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>KEMBALI KE BERANDA</span>
            </NextLink>
          </div>

          <SectionHeading
            title="Semua Proyek"
            subtitle="Jelajahi seluruh karya, kontribusi, dan eksperimen pemrograman yang telah saya selesaikan."
            badge="Archive"
            align="left"
          />

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-10">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Cari proyek atau teknologi..."
                className="pl-10 bg-secondary/30 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-full text-xs py-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter buttons */}
            <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-start md:justify-end">
              {PROJECT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-heading font-bold tracking-wider uppercase rounded-full border transition-all duration-300 cursor-pointer select-none",
                    selectedCategory === category
                      ? "bg-primary border-transparent text-white shadow-[0_0_10px_var(--crimson-glow)]"
                      : "bg-secondary/40 backdrop-blur-sm border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <GlassCard className="h-full flex flex-col overflow-hidden group border-border/40" glow={project.isFeatured}>
                    {/* Thumbnail placeholder */}
                    <div className="relative aspect-video w-full bg-secondary/60 flex items-center justify-center overflow-hidden border-b border-border/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-70" />
                      <Layers className="h-8 w-8 text-primary/45 group-hover:scale-110 transition-transform duration-500" />
                      
                      {project.isFeatured && (
                        <span className="absolute top-3 left-3 z-20 text-[9px] font-heading font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded shadow-[0_0_10px_var(--crimson-glow)]">
                          Featured
                        </span>
                      )}

                      <span className="absolute bottom-3 right-3 z-20 text-[9px] font-heading font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm text-foreground px-2.5 py-0.5 rounded border border-border/40">
                        {project.category}
                      </span>
                    </div>

                    {/* Content */}
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

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.techStack.map((tech) => (
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

                        <NextLink
                          href={`/projects/${project.slug}`}
                          className="ml-auto text-xs font-heading font-bold tracking-wide text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <span>DETAIL</span>
                        </NextLink>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state search result */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-muted-foreground font-sans">
                Tidak ada proyek yang sesuai dengan kata kunci atau filter pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
