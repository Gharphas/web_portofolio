"use client";

import { useState, useEffect } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projectsData } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import Link from "next/link";
const NextLink = Link;
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { publicApi } from "@/lib/api";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  techStack: string[];
  category: string;
  status: string;
  isFeatured: boolean;
  thumbnailUrl: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await publicApi.getProjects();
        if (res.success && res.data) {
          const mapped = (res.data as any[]).map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description,
            liveUrl: p.live_url || "",
            githubUrl: p.github_url || "",
            techStack: p.tech_stack || [],
            category: p.category,
            status: p.status || "completed",
            isFeatured: p.is_featured ?? false,
            thumbnailUrl: p.thumbnail_url || "",
          }));
          setProjects(mapped);
        } else {
          setProjects(getDefaultProjects());
        }
      } catch (err) {
        console.error(err);
        setProjects(getDefaultProjects());
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getDefaultProjects = () => {
    return projectsData.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      techStack: p.techStack || [],
      category: p.category,
      status: p.status || "completed",
      isFeatured: p.isFeatured ?? false,
      thumbnailUrl: p.thumbnail || "",
    }));
  };

  const filteredProjects = projects.filter((project) => {
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
      <div className="min-h-screen pt-20 pb-16 md:pt-24 md:pb-24 px-4 md:px-6 lg:px-8">
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
            className="mb-4 md:mb-6"
            staticTitle={true}
          />

          {/* Search Control */}
          <div className="max-w-md mx-auto w-full mb-10 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Cari proyek atau teknologi..."
              className="pl-10 bg-secondary/30 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-full text-xs py-5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat proyek...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty state search result */}
          {!isLoading && filteredProjects.length === 0 && (
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
