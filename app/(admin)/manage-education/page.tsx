"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { educationData } from "@/lib/mock-data";
import { Plus, Trash2, Edit2, Check, X, GraduationCap, Calendar, Award } from "lucide-react";

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
  const [eduList, setEduList] = useState<EducationItem[]>(educationData);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form input states
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const startEdit = (edu: EducationItem) => {
    setEditingId(edu.id);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy);
    setStartDate(edu.startDate);
    setEndDate(edu.endDate);
    setGrade(edu.grade || "");
    setDescription(edu.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    setEduList((prev) =>
      prev.map((edu) =>
        edu.id === id
          ? {
              ...edu,
              institution,
              degree,
              fieldOfStudy,
              startDate,
              endDate,
              grade: grade || undefined,
              description,
            }
          : edu
      )
    );
    setEditingId(null);
  };

  const deleteEdu = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat pendidikan ini?")) {
      setEduList((prev) => prev.filter((edu) => edu.id !== id));
    }
  };

  const addEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) return;

    const newEdu: EducationItem = {
      id: Math.random().toString(),
      institution,
      degree,
      fieldOfStudy,
      startDate: startDate || "2020",
      endDate: endDate || "2024",
      grade: grade || undefined,
      description,
    };

    setEduList((prev) => [newEdu, ...prev]);

    // Reset Form inputs
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartDate("");
    setEndDate("");
    setGrade("");
    setDescription("");
    setShowAddForm(false);
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
          }}
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "TUTUP" : "TAMBAH PENDIDIKAN"}</span>
        </GlowButton>
      </div>

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
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Gelar</label>
                <Input
                  placeholder="Misal: S1 / Bachelor"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Bidang Studi</label>
                <Input
                  placeholder="Misal: Teknik Informatika"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="bg-secondary/20 text-xs"
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
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tahun Mulai</label>
                <Input
                  placeholder="Misal: 2020-08-01"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tahun Selesai / Lulus</label>
                <Input
                  placeholder="Misal: 2024-07-31"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>
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
              <GlowButton type="submit" variant="primary" size="sm">
                SIMPAN PENDIDIKAN
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

      {/* Education List */}
      <div className="grid grid-cols-1 gap-4">
        {eduList.map((edu) => (
          <GlassCard key={edu.id} className="p-6 border-border/40 hover:border-primary/20 transition-all">
            {editingId === edu.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">Institusi</label>
                    <Input value={institution} onChange={(e) => setInstitution(e.target.value)} className="bg-secondary/20 text-xs py-1" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">Gelar</label>
                    <Input value={degree} onChange={(e) => setDegree(e.target.value)} className="bg-secondary/20 text-xs py-1" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">Bidang Studi</label>
                    <Input value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className="bg-secondary/20 text-xs py-1" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">IPK / Grade</label>
                    <Input value={grade} onChange={(e) => setGrade(e.target.value)} className="bg-secondary/20 text-xs py-1" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">Tanggal Mulai</label>
                    <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-secondary/20 text-xs py-1" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">Tanggal Selesai</label>
                    <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-secondary/20 text-xs py-1" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-semibold text-muted-foreground">Deskripsi</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary/20 text-xs resize-none" rows={3} />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => saveEdit(edu.id)}
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
                    <span>{edu.startDate} - {edu.endDate}</span>
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
    </div>
  );
}
