import { PublicLayout } from "@/components/layout/PublicLayout";
import { ContactSection } from "@/components/sections/ContactSection";

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="pt-28 md:pt-32 min-h-screen">
        {/* Contact details & Form section */}
        <ContactSection />
      </div>
    </PublicLayout>
  );
}
