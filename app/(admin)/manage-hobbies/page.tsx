"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { hobbiesData } from "@/lib/mock-data";
import { Gamepad2, Trash2, Loader2, AlertCircle, CheckCircle2, Plus, X } from "lucide-react";
import { publicApi, adminApi } from "@/lib/api";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface HobbyItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
}

export default function ManageHobbiesPage() {
  const [hobbies, setHobbies] = useState<HobbyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchHobbies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getHobbies();
      if (res.success && res.data) {
        const mapped = (res.data as any[]).map((h) => ({
          id: h.id,
          name: h.name,
          description: h.description || "",
          icon: h.icon_name || h.icon || "Gamepad2",
          imageUrl: h.image_url || "",
        }));
        setHobbies(mapped);
      } else {
        setHobbies(getDefaultHobbies());
      }
    } catch (err) {
      setError("Gagal menghubungi server. Menggunakan data lokal (offline).");
      setHobbies(getDefaultHobbies());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultHobbies = () => {
    return hobbiesData.map((h) => ({
      id: h.id,
      name: h.name,
      description: h.description,
      icon: h.icon,
      imageUrl: "",
    }));
  };

  useEffect(() => {
    fetchHobbies();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        name,
        description,
        icon_name: "Gamepad2",
        image_url: imageUrl || null,
      };

      const res = await adminApi.createHobby(payload);
      if (res.success && res.data) {
        const newHobby = {
          id: (res.data as any).id,
          name,
          description,
          icon: "Gamepad2",
          imageUrl: imageUrl || "",
        };

        setHobbies((prev) => [newHobby, ...prev]);
        setName("");
        setDescription("");
        setImageUrl("");
        setIsModalOpen(false); // Tutup popup setelah berhasil
        showSuccessMsg("Hobi baru berhasil ditambahkan!");
      } else {
        throw new Error(res.error?.message || "Gagal menyimpan hobi baru");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus hobi ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deleteHobby(id);
      if (res.success) {
        setHobbies((prev) => prev.filter((h) => h.id !== id));
        showSuccessMsg("Hobi berhasil dihapus!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus hobi");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus hobi dari server.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            KELOLA HOBI
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Tambahkan hobi, minat, atau aktivitas menarik lainnya yang Anda sukai.
          </p>
        </div>

        <GlowButton
          onClick={() => {
            setName("");
            setDescription("");
            setImageUrl("");
            setError(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 font-heading text-xs py-2 px-4 shadow-lg self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>TAMBAHKAN HOBI</span>
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

      {/* Hobbies Grid List - Full Width */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold text-foreground">
          HOBI SAAT INI ({hobbies.length})
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] text-muted-foreground font-heading tracking-wider uppercase">Memuat hobi...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {hobbies.map((h) => (
              <GlassCard key={h.id} className="p-4 border-border/40 flex flex-col justify-between gap-4 hover:border-primary/30 transition-all duration-300 group">
                <div className="space-y-3">
                  {h.imageUrl ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border/20 bg-secondary/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={h.imageUrl}
                        alt={h.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border/10 bg-secondary/20 flex items-center justify-center text-muted-foreground opacity-60">
                      <Gamepad2 className="h-8 w-8" />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <h4 className="font-heading text-xs font-bold text-foreground line-clamp-1">
                      {h.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-sans leading-normal line-clamp-3">
                      {h.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/10">
                  <span className="text-[9px] text-muted-foreground font-sans uppercase tracking-wider">Aktivitas</span>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="p-1.5 rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white cursor-pointer select-none transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {!isLoading && hobbies.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border/40 rounded-xl bg-secondary/5">
            <Gamepad2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-60" />
            <p className="text-xs text-muted-foreground font-sans">Belum ada hobi yang ditambahkan.</p>
          </div>
        )}
      </div>

      {/* POPUP MODAL TAMBAH HOBI */}
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
                  <Gamepad2 className="h-4 w-4" />
                  <span>TAMBAH HOBI BARU</span>
                </h3>

                {error && (
                  <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Foto / Gambar Hobi</label>
                    <ImageUploader
                      bucket="photos"
                      value={imageUrl}
                      onChange={setImageUrl}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Nama Aktivitas</label>
                    <Input
                      placeholder="Misal: Gaming"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary/20 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Penjelasan Ringkas</label>
                    <Input
                      placeholder="Competitive & casual gaming"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-secondary/20 text-xs"
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
                    disabled={isSaving || !name}
                  >
                    {isSaving ? "MENYIMPAN..." : "SIMPAN HOBI"}
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
