"use client";

import { useMemo } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowButton } from "@/components/ui/GlowButton";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projectsData } from "@/lib/mock-data";

interface ProjectsSectionProps {
  projects?: any[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
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

  // Menampilkan proyek pilihan (featured) maksimal 6 item. Jika yang ditandai featured kurang dari 6, isi dengan proyek lainnya hingga genap maksimal 6 item.
  const featuredProjects = useMemo(() => {
    const featured = resolvedProjects.filter((project) => project.isFeatured);
    if (featured.length >= 6) {
      return featured.slice(0, 6);
    }
    
    // Gabungkan proyek pilihan dengan proyek non-pilihan untuk melengkapi 6 card
    const nonFeatured = resolvedProjects.filter((project) => !project.isFeatured);
    const combined = [...featured, ...nonFeatured];
    return combined.slice(0, 6);
  }, [resolvedProjects]);

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

        {/* Projects Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {featuredProjects.map((project, index) => (
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

