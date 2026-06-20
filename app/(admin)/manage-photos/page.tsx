"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Camera, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
}

export default function ManagePhotosPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80",
      title: "Workspace Setup",
      caption: "Tempat ide-ide kreatif dan baris kode ditulis.",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80",
      title: "Coding Sessions",
      caption: "Menganalisis arsitektur aplikasi dan mengoptimalkan performa.",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80",
      title: "UI Design Workflow",
      caption: "Merancang wireframe interaktif dan visual prototype.",
    },
  ]);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const newPhoto = {
      id: Math.random().toString(),
      url,
      title,
      caption,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setTitle("");
    setUrl("");
    setCaption("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          KELOLA GALERI FOTO
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Tambahkan link foto dokumentasi, pameran, atau setup workspace Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 border-border/40">
            <form onSubmit={handleAdd} className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>UNGGAH FOTO BARU</span>
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Judul Foto</label>
                  <Input
                    placeholder="Workspace setup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-secondary/20 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Unggah Foto</label>
                  <ImageUploader
                    bucket="photos"
                    value={url}
                    onChange={setUrl}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Deskripsi / Keterangan</label>
                  <Input
                    placeholder="Ditulis saat merancang dashboard"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-secondary/20 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <GlowButton type="submit" variant="primary" size="sm" className="w-full">
                  SIMPAN FOTO
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Photos grid list */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-heading text-sm font-bold text-foreground">
            FOTO SAAT INI
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map((p) => (
              <GlassCard key={p.id} className="p-4 border-border/40 space-y-3">
                <div className="relative aspect-video w-full bg-secondary/80 rounded-lg overflow-hidden border border-border/20">
                  <Image
                    src={p.url}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-heading text-xs font-bold text-foreground">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-sans leading-normal">
                      {p.caption}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1 rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white cursor-pointer select-none transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
