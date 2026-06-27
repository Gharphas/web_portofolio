"use client";

import { useState, useMemo, useCallback } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowButton } from "@/components/ui/GlowButton";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projectsData } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface ProjectsSectionProps {
  projects?: any[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const resolvedProjects = useMemo(() => (projects && projects.length > 0)
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
    : projectsData, [projects]);

  const filteredProjects = useMemo(() => resolvedProjects
    .filter((project) => {
      if (selectedCategory === "All") return true;
      return project.category === selectedCategory;
    })
    .slice(0, 6), [resolvedProjects, selectedCategory]);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <section id="projects" className="section-padding relative overflow-hidden bg-background/50 perf-section">
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
            <ShimmerButton
              key={category}
              onClick={() => handleCategoryClick(category)}
              shimmerColor={selectedCategory === category ? "#FF1744" : "#555555"}
              className={cn(
                "px-5 py-2 text-xs font-heading font-semibold tracking-wider uppercase cursor-pointer select-none",
                selectedCategory === category
                  ? "text-white"
                  : "text-muted-foreground"
              )}
            >
              {category}
            </ShimmerButton>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

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
