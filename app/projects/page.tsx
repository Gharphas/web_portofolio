"use client";

import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projectsData } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
const NextLink = Link;
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </div>

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
