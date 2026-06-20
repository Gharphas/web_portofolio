"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { ZoomIn, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import Image from "next/image";

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

export function PhotoGallery() {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => {
    setActivePhotoIdx(idx);
  };

  const closeLightbox = () => {
    setActivePhotoIdx(null);
  };

  const prevPhoto = () => {
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev === 0 ? GALLERY_PHOTOS.length - 1 : prev! - 1));
  };

  const nextPhoto = () => {
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev === GALLERY_PHOTOS.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section id="gallery" className="section-padding relative overflow-hidden bg-background/50">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Galeri Foto"
          subtitle="Kumpulan momen visual dari aktivitas coding, workspace, dan dokumentasi menarik lainnya."
          badge="Gallery"
          align="center"
        />

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <GlassCard
                className="group relative overflow-hidden aspect-square border-border/40 cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                {/* Photo Image wrapper */}
                <div className="relative w-full h-full">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-primary">
                        View Details
                      </span>
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-heading text-sm font-bold text-foreground">
                        {photo.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground leading-normal font-sans">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer select-none transition-colors z-50"
              aria-label="Close image"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer select-none transition-colors z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer select-none transition-colors z-50"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Lightbox Content wrapper */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full aspect-video flex flex-col justify-center items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[60vh] rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={GALLERY_PHOTOS[activePhotoIdx].url}
                  alt={GALLERY_PHOTOS[activePhotoIdx].title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Photo Meta Details */}
              <div className="text-center text-white space-y-1 max-w-md">
                <h4 className="font-heading text-lg font-bold text-gradient">
                  {GALLERY_PHOTOS[activePhotoIdx].title.toUpperCase()}
                </h4>
                <p className="text-xs text-zinc-400 font-sans">
                  {GALLERY_PHOTOS[activePhotoIdx].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
