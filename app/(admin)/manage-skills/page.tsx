"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Cpu, Loader2, AlertCircle, CheckCircle2, Plus, X } from "lucide-react";
import { publicApi, adminApi } from "@/lib/api";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function ManageSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getSkills();
      if (res.success && res.data) {
        setSkills(res.data as any[]);
      }
    } catch (err) {
      setError("Gagal menghubungi server. Menggunakan mode luring.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setName(skill.name);
    setIconUrl(skill.icon_url || "");
    setError(null);
    setIsModalOpen(true); // Buka modal popup saat edit
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setIconUrl("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    setError(null);

    const payload = {
      name,
      icon_url: iconUrl || null,
      category: "Frontend", // Kolom wajib di database schema
      proficiency: 100, // Kolom wajib di database schema
      is_featured: false,
      color: "#38bdf8", // Default glow warna biru neon
    };

    try {
      if (editingId) {
        const res = await adminApi.updateSkill(editingId, payload);
        if (res.success) {
          setSkills((prev) =>
            prev.map((s) => (s.id === editingId ? { ...s, name, icon_url: iconUrl } : s))
          );
          showSuccessMsg("Keahlian berhasil diperbarui!");
          handleCancel();
        } else {
          throw new Error(res.error?.message || "Gagal memperbarui keahlian");
        }
      } else {
        const res = await adminApi.createSkill(payload);
        if (res.success && res.data) {
          setSkills((prev) => [(res.data as any), ...prev]);
          showSuccessMsg("Keahlian baru berhasil ditambahkan!");
          setName("");
          setIconUrl("");
          setIsModalOpen(false);
        } else {
          throw new Error(res.error?.message || "Gagal menyimpan keahlian baru");
        }
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus keahlian ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deleteSkill(id);
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        showSuccessMsg("Keahlian berhasil dihapus!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus keahlian");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus keahlian dari server.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            KELOLA KEAHLIAN
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Tambahkan, perbarui, atau hapus keahlian dan teknologi di portofolio Anda.
          </p>
        </div>

        <GlowButton
          onClick={() => {
            setEditingId(null);
            setName("");
            setIconUrl("");
            setError(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 font-heading text-xs py-2 px-4 shadow-lg self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>TAMBAHKAN KEAHLIAN</span>
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

      {/* Skills Grid List - Full Width */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold text-foreground">
          KEAHLIAN SAAT INI ({skills.length})
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] text-muted-foreground font-heading tracking-wider uppercase">Memuat keahlian...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <GlassCard key={skill.id} className="p-4 border-border/40 flex justify-between gap-4 items-center hover:border-primary/30 transition-all duration-300">
                <div className="flex gap-3 items-center">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/40 flex-shrink-0 bg-secondary/20 flex items-center justify-center">
                    {skill.icon_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={skill.icon_url} alt={skill.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Cpu className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-foreground line-clamp-1">
                      {skill.name}
                    </h4>
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-1.5 rounded bg-secondary/30 text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary cursor-pointer select-none transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white cursor-pointer select-none transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {!isLoading && skills.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border/40 rounded-xl bg-secondary/5">
            <Cpu className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-60" />
            <p className="text-xs text-muted-foreground font-sans">Belum ada keahlian yang ditambahkan.</p>
          </div>
        )}
      </div>

      {/* POPUP MODAL TAMBAH/EDIT KEAHLIAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
            <GlassCard className="p-6 border-primary/20 relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary/40 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4" />
                  <span>{editingId ? "EDIT KEAHLIAN" : "TAMBAH KEAHLIAN BARU"}</span>
                </h3>

                {error && (
                  <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Logo / Icon Keahlian</label>
                    <ImageUploader
                      bucket="logos"
                      value={iconUrl}
                      onChange={setIconUrl}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Nama Keahlian</label>
                    <Input
                      placeholder="Misal: React.js"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary/20 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <GlowButton
                    type="button"
                    onClick={handleCancel}
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
                    {isSaving ? "MENYIMPAN..." : editingId ? "PERBARUI" : "SIMPAN"}
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
