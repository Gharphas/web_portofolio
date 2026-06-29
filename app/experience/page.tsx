import { PublicLayout } from "@/components/layout/PublicLayout";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";

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
    return null;
  }
}

export default async function ExperiencePage() {
  const [experience, education, achievements] = await Promise.all([
    fetchFromApi("/experience"),
    fetchFromApi("/education"),
    fetchFromApi("/achievements"),
  ]);

  return (
    <PublicLayout>
      <div className="pt-28 md:pt-32 min-h-screen">
        {/* Experience & Education switcher section */}
        <ExperienceSection experience={experience} education={education} />

        {/* Certifications & Achievements section */}
        <AchievementsSection achievements={achievements} />
      </div>
    </PublicLayout>
  );
}
