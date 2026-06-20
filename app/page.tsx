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

export default function Home() {
  return (
    <PublicLayout>
      {/* Home Page Sections */}
      <HeroSection />
      <AboutSection />
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
