import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { HobbiesSection } from "@/components/sections/HobbiesSection";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { ContactSection } from "@/components/sections/ContactSection";

export const revalidate = 60; // Revalidate page at most every 60 seconds (ISR)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function fetchFromApi(endpoint: string) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const resData = await res.json();
    return resData.success ? resData.data : null;
  } catch (err) {
    // Silently fail — sections will use mock data as fallback
    return null;
  }
}

export default async function Home() {
  // Fetch all section data in parallel for performance
  const [about, skills, projects, experience, education, achievements, hobbies, photos, socialLinks] =
    await Promise.all([
      fetchFromApi("/about"),
      fetchFromApi("/skills"),
      fetchFromApi("/projects"),
      fetchFromApi("/experience"),
      fetchFromApi("/education"),
      fetchFromApi("/achievements"),
      fetchFromApi("/hobbies"),
      fetchFromApi("/photos"),
      fetchFromApi("/social-links"),
    ]);

  return (
    <PublicLayout>
      {/* Home Page Sections — PRD Section Order */}
      <HeroSection about={about} />
      <AboutSection about={about} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experience={experience} education={education} />
      <AchievementsSection achievements={achievements} />
      <HobbiesSection hobbies={hobbies} />
      <PhotoGallery photos={photos} />
      <ContactSection socialLinks={socialLinks} />
    </PublicLayout>
  );
}
