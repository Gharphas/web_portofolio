import { PublicLayout } from "@/components/layout/PublicLayout";
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
    return null;
  }
}

export default async function ContactPage() {
  const socialLinks = await fetchFromApi("/social-links");

  return (
    <PublicLayout>
      <div className="pt-28 md:pt-32 min-h-screen">
        {/* Contact details & Form section */}
        <ContactSection socialLinks={socialLinks} />
      </div>
    </PublicLayout>
  );
}
