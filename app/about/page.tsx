import { PublicLayout } from "@/components/layout/PublicLayout";
import { AboutSection } from "@/components/sections/AboutSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { aboutData } from "@/lib/mock-data";
import { ShieldCheck, Heart, Coffee, Globe } from "lucide-react";

export default function AboutPage() {
  const qualities = [
    { title: "Kode Bersih & Terstandar", desc: "Mengutamakan readability, modularitas, dan best practices dalam penulisan kode.", icon: ShieldCheck },
    { title: "Berorientasi Pengguna", desc: "Setiap antarmuka dirancang agar intuitif, mudah digunakan, dan memiliki performa tinggi.", icon: Heart },
    { title: "Pembelajar Cepat", desc: "Selalu mengikuti perkembangan teknologi terbaru dan mengintegrasikannya ke proyek.", icon: Coffee },
    { title: "Kolaboratif", desc: "Terbiasa bekerja dalam tim lintas fungsional dengan komunikasi yang transparan.", icon: Globe },
  ];

  return (
    <PublicLayout>
      <div className="pt-28 md:pt-32 min-h-screen">
        {/* Main section */}
        <AboutSection />

        {/* Vision & Mission */}
        <SectionWrapper id="vision" className="section-padding relative overflow-hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none hidden" />

          <div className="container-custom relative z-10 max-w-4xl">
            <SectionHeading
              title="Visi & Karakter Kerja"
              subtitle="Prinsip dasar dan keyakinan saya dalam merancang solusi perangkat lunak terbaik."
              badge="Values"
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {qualities.map((q, idx) => {
                const Icon = q.icon;
                return (
                  <GlassCard key={idx} className="p-6 border-border/40 hover:border-primary/30">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex flex-shrink-0 items-center justify-center text-primary shadow-[0_0_10px_rgba(255,23,68,0.1)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading text-sm font-bold text-foreground">
                          {q.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                          {q.desc}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </SectionWrapper>
      </div>
    </PublicLayout>
  );
}
