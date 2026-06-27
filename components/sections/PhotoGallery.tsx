"use client";

import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import dynamic from "next/dynamic";

const DomeGallery = dynamic(() => import("@/components/ui/DomeGallery"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium text-sm animate-pulse">
      Mempersiapkan Galeri 3D Interaktif...
    </div>
  ),
});

// Mock photos list for the gallery
const GALLERY_PHOTOS = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    title: "Workspace Setup",
    caption: "Tempat ide-ide kreatif dan baris kode ditulis.",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    title: "Coding Sessions",
    caption: "Menganalisis arsitektur aplikasi dan mengoptimalkan performa.",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
    title: "UI Design Workflow",
    caption: "Merancang wireframe interaktif dan visual prototype.",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    title: "Tech Conferences",
    caption: "Berbagi wawasan developer dan mengikuti tren industri global.",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    title: "Team Collaboration",
    caption: "Brainstorming solusi digital terbaik bersama tim.",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    title: "Server Deployment",
    caption: "Mengkonfigurasi arsitektur cloud server yang aman.",
  },
];

interface PhotoGalleryProps {
  photos?: any[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [shouldMount, setShouldMount] = useState(false);
  const [galleryRef, setGalleryRef] = useState<HTMLDivElement | null>(null);

  const resolvedPhotos = (photos && photos.length > 0)
    ? photos.map((p: any) => ({
        id: p.id,
        url: p.url,
        title: p.title || "Momen Portofolio",
        caption: p.caption || "",
      }))
    : GALLERY_PHOTOS;

  // Map resolvedPhotos to DomeGallery image items format
  const domeImages = resolvedPhotos.map((photo) => ({
    src: photo.url,
    alt: photo.title || photo.caption || "Foto Portfolio",
  }));

  // Only mount DomeGallery WebGL when section is near viewport
  useEffect(() => {
    if (!galleryRef) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 }
    );
    obs.observe(galleryRef);
    return () => obs.disconnect();
  }, [galleryRef]);

  return (
    <section id="gallery" className="pt-20 md:pt-28 lg:pt-32 pb-0 relative overflow-hidden bg-background/50 perf-section">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Galeri Foto"
          subtitle="Kumpulan momen visual dari aktivitas coding, workspace, dan dokumentasi menarik lainnya."
          badge="Gallery"
          align="center"
        />
      </div>

      {/* Interactive 3D Dome Gallery — full width edge to edge, viewport-guarded */}
      <div
        ref={setGalleryRef}
        className="relative z-10 w-full h-[550px] md:h-[650px] overflow-hidden mt-8"
      >
        {shouldMount ? (
          <DomeGallery
            images={domeImages}
            fit={1}
            minRadius={700}
            maxVerticalRotationDeg={13}
            segments={40}
            dragDampening={1.6}
            grayscale={true}
            autoRotate={true}
            autoRotateSpeed={0.015}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium text-sm">
            Mempersiapkan Galeri 3D Interaktif...
          </div>
        )}
      </div>
    </section>
  );
}
