"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { aboutData } from "@/lib/mock-data";
import { User, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function ManageAboutPage() {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [location, setLocation] = useState("");
  const [bioShort, setBioShort] = useState("");
  const [bioFull, setBioFull] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/about`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }
        const resData = await response.json();
        
        if (resData.success && resData.data) {
          const data = resData.data;
          setTitle(data.title || "");
          setTagline(data.tagline || data.subtitle || "");
          setLocation(data.location || "");
          setBioShort(data.bio_short || "");
          setBioFull(data.bio_full || "");
          setPhotoUrl(data.photo_url || "");
        } else {
          // Fallback to mock data if empty database
          setTitle(aboutData.title);
          setTagline(aboutData.tagline);
          setLocation(aboutData.location);
          setBioShort(aboutData.bioShort);
          setBioFull(aboutData.bioFull);
          setPhotoUrl(aboutData.photoUrl || "");
        }
      } catch (err: any) {
        console.error("Gagal memuat data:", err);
        setError("Gagal menghubungi server. Menggunakan data cadangan (offline).");
        // Fallback to mock data on error
        setTitle(aboutData.title);
        setTagline(aboutData.tagline);
        setLocation(aboutData.location);
        setBioShort(aboutData.bioShort);
        setBioFull(aboutData.bioFull);
        setPhotoUrl(aboutData.photoUrl || "");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, [apiUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("rianpedia_admin_token");

    try {
      const response = await fetch(`${apiUrl}/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          title,
          tagline,
          location,
          bio_short: bioShort,
          bio_full: bioFull,
          photo_url: photoUrl,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error?.message || "Gagal menyimpan perubahan");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error("Gagal menyimpan data:", err);
      setError(err.message || "Gagal menyimpan perubahan. Pastikan backend aktif.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          KELOLA TENTANG SAYA
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Perbarui data biografi, deskripsi profil, dan lokasi Anda secara permanen di database.
        </p>
      </div>

      <GlassCard className="p-6 md:p-8 border-border/40 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>DATA PROFIL BIO</span>
          </h3>

          {success && (
            <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Perubahan profil berhasil disimpan di database!</span>
            </div>
          )}

          {error && (
            <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Foto Profil Utama</label>
            <ImageUploader
              bucket="avatars"
              value={photoUrl}
              onChange={setPhotoUrl}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Jabatan / Role</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/20 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Lokasi Kerja</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-secondary/20 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tagline Promosi</label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="bg-secondary/20 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Bio Singkat</label>
            <Textarea
              value={bioShort}
              onChange={(e) => setBioShort(e.target.value)}
              className="bg-secondary/20 text-xs resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Bio Lengkap (Markdown Support)</label>
            <Textarea
              value={bioFull}
              onChange={(e) => setBioFull(e.target.value)}
              className="bg-secondary/20 text-xs resize-none"
              rows={8}
            />
          </div>

          <div className="pt-2">
            <GlowButton type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>MENYIMPAN...</span>
                </span>
              ) : (
                <span>SIMPAN PROFIL</span>
              )}
            </GlowButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
