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

async function getAboutData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  try {
    const res = await fetch(`${apiUrl}/about`, {
      next: { revalidate: 60 } // Cache fetch for 60 seconds
    });
    if (!res.ok) return null;
    const resData = await res.json();
    return resData.success ? resData.data : null;
  } catch (err) {
    console.error("Gagal mengambil data about dari API:", err);
    return null;
  }
}

export default async function Home() {
  const about = await getAboutData();

  return (
    <PublicLayout>
      {/* Home Page Sections */}
      <HeroSection about={about} />
      <AboutSection about={about} />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <AchievementsSection />
      <PhotoGallery />
      <HobbiesSection />
      <ContactSection />
    </PublicLayout>
  );
}
