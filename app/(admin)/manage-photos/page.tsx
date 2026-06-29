"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Trash2, Camera, Loader2, AlertCircle, CheckCircle2, Plus, X } from "lucide-react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { publicApi, adminApi } from "@/lib/api";

interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
}

export default function ManagePhotosPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [url, setUrl] = useState("");

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getPhotos();
      if (res.success && res.data) {
        setPhotos(res.data as PhotoItem[]);
      }
    } catch (err) {
      setError("Gagal menghubungi server. Menggunakan mode luring.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsSaving(true);
    setError(null);

    const payload = {
      title: "Foto", // Kolom wajib NOT NULL di database
      url,
      caption: "",
    };

    try {
      const res = await adminApi.createPhoto(payload);
      if (res.success && res.data) {
        setPhotos((prev) => [(res.data as PhotoItem), ...prev]);
        setUrl("");
        setIsModalOpen(false); // Tutup popup setelah berhasil menyimpan
        showSuccessMsg("Foto berhasil ditambahkan ke galeri!");
      } else {
        throw new Error(res.error?.message || "Gagal menyimpan foto baru");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deletePhoto(id);
      if (res.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        showSuccessMsg("Foto berhasil dihapus dari galeri!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus foto");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus foto dari server.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            KELOLA GALERI FOTO
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Tambahkan foto dokumentasi, pameran, atau setup workspace Anda.
          </p>
        </div>

        <GlowButton
          onClick={() => {
            setUrl("");
            setError(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 font-heading text-xs py-2 px-4 shadow-lg self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>TAMBAHKAN FOTO</span>
        </GlowButton>
      </div>

      {success && (
        <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold font-sans">
          <CheckCircle2 className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}

      {error && !isModalOpen && (
        <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Photos Grid List - Full Width */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold text-foreground">
          FOTO SAAT INI ({photos.length})
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] text-muted-foreground font-heading tracking-wider uppercase">Memuat galeri...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((p) => (
              <GlassCard key={p.id} className="p-3 border-border/40 space-y-3 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group">
                <div className="relative aspect-video w-full bg-secondary/80 rounded-lg overflow-hidden border border-border/20">
                  <Image
                    src={p.url}
                    alt={p.title || "Foto Galeri"}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[10px] text-muted-foreground font-sans">Unggah sukses</span>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white cursor-pointer select-none transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {!isLoading && photos.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border/40 rounded-xl bg-secondary/5">
            <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-60" />
            <p className="text-xs text-muted-foreground font-sans">Belum ada foto di galeri.</p>
          </div>
        )}
      </div>

      {/* POPUP MODAL TAMBAH FOTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
            <GlassCard className="p-6 border-primary/20 relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary/40 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <form onSubmit={handleAdd} className="space-y-4">
                <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4" />
                  <span>UNGGAH FOTO BARU</span>
                </h3>

                {error && (
                  <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Pilih File Foto</label>
                    <ImageUploader
                      bucket="photos"
                      value={url}
                      onChange={setUrl}
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <GlowButton
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    size="sm"
                    className="w-1/3"
                  >
                    BATAL
                  </GlowButton>
                  <GlowButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-2/3"
                    disabled={isSaving || !url}
                  >
                    {isSaving ? "MENYIMPAN..." : "SIMPAN FOTO"}
                  </GlowButton>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
