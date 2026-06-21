"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { experienceData } from "@/lib/mock-data";
import { Plus, Trash2, Calendar, MapPin, Briefcase, X, Edit2, Check, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { publicApi, adminApi } from "@/lib/api";

interface ExperienceItem {
  id: string;
  type: string;
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  logoUrl?: string;
}

export default function ManageExperiencePage() {
  const [workList, setWorkList] = useState<ExperienceItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const fetchExperience = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getExperience();
      if (res.success && res.data) {
        const mappedData = (res.data as any[]).map((item) => ({
          id: item.id,
          type: item.type || "work",
          title: item.title,
          company: item.company,
          location: item.location || "",
          description: item.description || "",
          startDate: item.start_date || item.startDate || "",
          endDate: item.end_date || item.endDate || "",
          isCurrent: item.is_current ?? item.isCurrent ?? false,
          logoUrl: item.logo_url || item.logoUrl || "",
        }));
        setWorkList(mappedData);
      } else {
        setWorkList(experienceData);
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal menghubungi server. Menggunakan data lokal (offline).");
      setWorkList(experienceData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const startEdit = (item: ExperienceItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCompany(item.company);
    setLocation(item.location);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setIsCurrent(item.isCurrent || false);
    setDescription(item.description);
    setLogoUrl(item.logoUrl || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    if (!title.trim() || !company.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        company,
        location,
        start_date: startDate,
        end_date: isCurrent ? "Present" : endDate,
        is_current: isCurrent,
        description,
        logo_url: logoUrl,
        type: "work",
      };

      const res = await adminApi.updateExperience(id, payload);
      if (res.success) {
        setWorkList((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title,
                  company,
                  location,
                  startDate,
                  endDate: isCurrent ? "Present" : endDate,
                  isCurrent,
                  description,
                  logoUrl,
                }
              : item
          )
        );
        setEditingId(null);
        showSuccessMsg("Pengalaman kerja berhasil diperbarui!");
      } else {
        throw new Error(res.error?.message || "Gagal memperbarui pengalaman kerja");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteWork = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengalaman kerja ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deleteExperience(id);
      if (res.success) {
        setWorkList((prev) => prev.filter((w) => w.id !== id));
        showSuccessMsg("Pengalaman kerja berhasil dihapus!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus pengalaman kerja");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus data dari server.");
    }
  };

  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        company,
        location,
        start_date: startDate || "2026",
        end_date: isCurrent ? "Present" : endDate || "Present",
        is_current: isCurrent,
        description,
        logo_url: logoUrl,
        type: "work",
      };

      const res = await adminApi.createExperience(payload);
      if (res.success && res.data) {
        const newItem: ExperienceItem = {
          id: (res.data as any).id,
          type: "work",
          title,
          company,
          location,
          description,
          startDate: startDate || "2026",
          endDate: isCurrent ? "Present" : endDate || "Present",
          isCurrent,
          logoUrl,
        };
        setWorkList((prev) => [newItem, ...prev]);
        
        // Reset states
        setTitle("");
        setCompany("");
        setLocation("");
        setStartDate("");
        setEndDate("");
        setIsCurrent(false);
        setDescription("");
        setLogoUrl("");
        setShowAddForm(false);
        showSuccessMsg("Pengalaman kerja baru berhasil ditambahkan!");
      } else {
        throw new Error(res.error?.message || "Gagal menambahkan pengalaman kerja baru");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan data ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            KELOLA PENGALAMAN KERJA
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Tambahkan, perbarui, atau hapus sejarah pekerjaan profesional Anda secara permanen.
          </p>
        </div>

        <GlowButton
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer select-none"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setTitle("");
            setCompany("");
            setLocation("");
            setStartDate("");
            setEndDate("");
            setIsCurrent(false);
            setDescription("");
            setLogoUrl("");
          }}
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "TUTUP" : "TAMBAH PENGALAMAN"}</span>
        </GlowButton>
      </div>

      {success && (
        <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold font-sans">
          <CheckCircle2 className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <GlassCard className="p-6 border-primary/30 max-w-xl">
          <form onSubmit={handleAddWork} className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>PENGALAMAN BARU</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Jabatan / Role</label>
                <Input
                  placeholder="Misal: Senior Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Nama Perusahaan</label>
                <Input
                  placeholder="Misal: GoTo Group"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Lokasi</label>
                <Input
                  placeholder="Misal: Jakarta, Indonesia (Hybrid)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Mulai</label>
                <Input
                  placeholder="Misal: Jan 2025"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              {!isCurrent && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Selesai</label>
                  <Input
                    placeholder="Misal: Des 2025"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-secondary/20 text-xs"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isCurrent"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary bg-background"
              />
              <label htmlFor="isCurrent" className="text-xs text-muted-foreground font-sans select-none">
                Saya saat ini bekerja di posisi ini
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Deskripsi Pekerjaan</label>
              <Textarea
                placeholder="Tuliskan kontribusi, pencapaian, dan tech stack yang digunakan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/20 text-xs resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Logo Perusahaan (Opsional)</label>
              <ImageUploader
                bucket="logos"
                value={logoUrl}
                onChange={setLogoUrl}
              />
            </div>

            <div className="pt-2 flex gap-3">
              <GlowButton type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? "MENYIMPAN..." : "SIMPAN"}
              </GlowButton>
              <GlowButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                BATAL
              </GlowButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat pengalaman...</p>
        </div>
      ) : (
        /* Work Experience List */
        <div className="grid grid-cols-1 gap-4 max-w-3xl">
          {workList.map((w) => (
            <GlassCard
              key={w.id}
              className="p-6 border-border/40 hover:border-primary/20 transition-all"
            >
              {editingId === w.id ? (
                // Inline Edit Form
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-secondary/20 text-xs font-bold"
                      placeholder="Jabatan"
                    />
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-secondary/20 text-xs"
                      placeholder="Perusahaan"
                    />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-secondary/20 text-xs"
                      placeholder="Lokasi"
                    />
                    <Input
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-secondary/20 text-xs"
                      placeholder="Tanggal Mulai"
                    />
                    {!isCurrent && (
                      <Input
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-secondary/20 text-xs"
                        placeholder="Tanggal Selesai"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="editIsCurrent"
                      checked={isCurrent}
                      onChange={(e) => setIsCurrent(e.target.checked)}
                      className="h-4 w-4 rounded accent-primary"
                    />
                    <label htmlFor="editIsCurrent" className="text-[11px] text-muted-foreground select-none">
                      Saat ini bekerja di sini
                    </label>
                  </div>

                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-secondary/20 text-xs resize-none"
                    rows={3}
                    placeholder="Deskripsi"
                  />

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">Logo Perusahaan</label>
                    <ImageUploader bucket="logos" value={logoUrl} onChange={setLogoUrl} />
                  </div>

                  <div className="flex justify-end gap-1.5 pt-2">
                    <button
                      onClick={() => saveEdit(w.id)}
                      disabled={isSaving}
                      className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-grow">
                    <h3 className="font-heading text-sm font-bold text-foreground">
                      {w.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {w.company} • {w.location}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{w.startDate} - {w.isCurrent ? "Present" : w.endDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed pt-1 whitespace-pre-line">
                      {w.description}
                    </p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(w)}
                      className="p-1.5 rounded-lg border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteWork(w.id)}
                      className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && workList.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground font-sans">Belum ada data pengalaman kerja.</p>
        </div>
      )}
    </div>
  );
}
