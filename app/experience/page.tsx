import { PublicLayout } from "@/components/layout/PublicLayout";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";

export default function ExperiencePage() {
  return (
    <PublicLayout>
      <div className="pt-28 md:pt-32 min-h-screen">
        {/* Experience & Education switcher section */}
        <ExperienceSection />

        {/* Certifications & Achievements section */}
        <AchievementsSection />
      </div>
    </PublicLayout>
  );
}
