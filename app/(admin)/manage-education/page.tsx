"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { educationData } from "@/lib/mock-data";
import { Plus, Trash2, Edit2, Check, X, GraduationCap, Calendar, Loader2, AlertCircle, CheckCircle2, Award } from "lucide-react";
import { publicApi, adminApi } from "@/lib/api";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
  grade?: string;
}

export default function ManageEducationPage() {
  const [eduList, setEduList] = useState<EducationItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form input states
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  const fetchEducation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getEducation();
      if (res.success && res.data) {
        const mappedData = (res.data as any[]).map((item) => ({
          id: item.id,
          institution: item.institution,
          degree: item.degree || "",
          fieldOfStudy: item.field_of_study || item.fieldOfStudy || "",
          startDate: item.start_date || item.startDate || "",
          endDate: item.end_date || item.endDate || "",
          isCurrent: item.is_current ?? item.isCurrent ?? false,
          description: item.description || "",
          grade: item.grade || "",
        }));
        setEduList(mappedData);
      } else {
        setEduList(educationData);
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal menghubungi server. Menggunakan data lokal (offline).");
      setEduList(educationData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const startEdit = (edu: EducationItem) => {
    setEditingId(edu.id);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy);
    setStartDate(edu.startDate);
    setEndDate(edu.isCurrent ? "" : edu.endDate);
    setGrade(edu.grade || "");
    setDescription(edu.description);
    setIsCurrent(edu.isCurrent || false);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    if (!institution.trim() || !degree.trim() || !startDate) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        institution,
        degree,
        field_of_study: fieldOfStudy,
        start_date: startDate,
        end_date: isCurrent ? null : endDate || null,
        is_current: isCurrent,
        grade: grade || null,
        description,
      };

      const res = await adminApi.updateEducation(id, payload);
      if (res.success) {
        setEduList((prev) =>
          prev.map((edu) =>
            edu.id === id
              ? {
                  ...edu,
                  institution,
                  degree,
                  fieldOfStudy,
                  startDate,
                  endDate: isCurrent ? "" : endDate,
                  isCurrent,
                  grade: grade || undefined,
                  description,
                }
              : edu
          )
        );
        setEditingId(null);
        showSuccessMsg("Riwayat pendidikan berhasil diperbarui!");
      } else {
        throw new Error(res.error?.message || "Gagal memperbarui pendidikan");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEdu = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus riwayat pendidikan ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deleteEducation(id);
      if (res.success) {
        setEduList((prev) => prev.filter((edu) => edu.id !== id));
        showSuccessMsg("Riwayat pendidikan berhasil dihapus!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus riwayat pendidikan");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus data dari server.");
    }
  };

  const addEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim() || !startDate) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        institution,
        degree,
        field_of_study: fieldOfStudy,
        start_date: startDate,
        end_date: isCurrent ? null : endDate || null,
        is_current: isCurrent,
        grade: grade || null,
        description,
      };

      const res = await adminApi.createEducation(payload);
      if (res.success && res.data) {
        const newEdu: EducationItem = {
          id: (res.data as any).id,
          institution,
          degree,
          fieldOfStudy,
          startDate,
          endDate: isCurrent ? "" : endDate,
          isCurrent,
          grade: grade || undefined,
          description,
        };
        setEduList((prev) => [newEdu, ...prev]);

        // Reset states
        setInstitution("");
        setDegree("");
        setFieldOfStudy("");
        setStartDate("");
        setEndDate("");
        setGrade("");
        setDescription("");
        setIsCurrent(false);
        setShowAddForm(false);
        showSuccessMsg("Riwayat pendidikan baru berhasil ditambahkan!");
      } else {
        throw new Error(res.error?.message || "Gagal menambahkan pendidikan");
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
            KELOLA PENDIDIKAN
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Tambahkan, perbarui, atau hapus sejarah pendidikan dan latar akademis Anda.
          </p>
        </div>

        <GlowButton
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer select-none"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setInstitution("");
            setDegree("");
            setFieldOfStudy("");
            setStartDate("");
            setEndDate("");
            setGrade("");
            setDescription("");
            setIsCurrent(false);
          }}
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "TUTUP" : "TAMBAH PENDIDIKAN"}</span>
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

      {/* Add Education Form */}
      {showAddForm && (
        <GlassCard className="p-6 border-primary/30 max-w-xl">
          <form onSubmit={addEdu} className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>PENDIDIKAN BARU</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Institusi</label>
                <Input
                  placeholder="Misal: Universitas Indonesia"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Gelar</label>
                <Input
                  placeholder="Misal: S1 / Bachelor"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Bidang Studi</label>
                <Input
                  placeholder="Misal: Teknik Informatika"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">IPK / Grade (Opsional)</label>
                <Input
                  placeholder="Misal: 3.85/4.00"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              {!isCurrent && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Selesai / Lulus</label>
                  <Input
                    type="date"
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
                id="isCurrentEdu"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary bg-background"
              />
              <label htmlFor="isCurrentEdu" className="text-xs text-muted-foreground font-sans select-none">
                Saya saat ini sedang belajar di institusi ini
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Deskripsi / Pencapaian</label>
              <Textarea
                placeholder="Deskripsi kegiatan, organisasi, atau prestasi di kampus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/20 text-xs resize-none"
                rows={3}
              />
            </div>

            <div className="pt-2 flex gap-3">
              <GlowButton type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? "MENYIMPAN..." : "SIMPAN PENDIDIKAN"}
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
          <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat pendidikan...</p>
        </div>
      ) : (
        /* Education List */
        <div className="grid grid-cols-1 gap-4 max-w-3xl">
          {eduList.map((edu) => (
            <GlassCard key={edu.id} className="p-6 border-border/40 hover:border-primary/20 transition-all">
              {editingId === edu.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-muted-foreground">Institusi</label>
                      <Input value={institution} onChange={(e) => setInstitution(e.target.value)} className="bg-secondary/20 text-xs py-1" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-muted-foreground">Gelar</label>
                      <Input value={degree} onChange={(e) => setDegree(e.target.value)} className="bg-secondary/20 text-xs py-1" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-muted-foreground">Bidang Studi</label>
                      <Input value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className="bg-secondary/20 text-xs py-1" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-muted-foreground">IPK / Grade</label>
                      <Input value={grade} onChange={(e) => setGrade(e.target.value)} className="bg-secondary/20 text-xs py-1" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-muted-foreground">Tanggal Mulai</label>
                      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-secondary/20 text-xs py-1" required />
                    </div>
                    {!isCurrent && (
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-semibold text-muted-foreground">Tanggal Selesai</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-secondary/20 text-xs py-1" required />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="editIsCurrentEdu"
                      checked={isCurrent}
                      onChange={(e) => setIsCurrent(e.target.checked)}
                      className="h-4 w-4 rounded accent-primary"
                    />
                    <label htmlFor="editIsCurrentEdu" className="text-[11px] text-muted-foreground select-none">
                      Saat ini sedang belajar di sini
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">Deskripsi</label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary/20 text-xs resize-none" rows={3} />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => saveEdit(edu.id)}
                      disabled={isSaving}
                      className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-sm font-bold text-foreground">
                        {edu.degree} — {edu.fieldOfStudy}
                      </h3>
                      {edu.grade && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary font-mono border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full">
                          IPK: {edu.grade}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground font-semibold">
                      {edu.institution}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{edu.startDate} - {edu.isCurrent ? "Present" : edu.endDate}</span>
                    </div>

                    <p className="text-xs text-muted-foreground font-sans leading-relaxed pt-1">
                      {edu.description}
                    </p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(edu)}
                      className="p-1.5 rounded-lg border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteEdu(edu.id)}
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

      {/* Empty State */}
      {!isLoading && eduList.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground font-sans">Belum ada data riwayat pendidikan.</p>
        </div>
      )}
    </div>
  );
}
