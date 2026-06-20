"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { experienceData, educationData } from "@/lib/mock-data";
import { Plus, Trash2, Calendar, MapPin, Briefcase, GraduationCap } from "lucide-react";

export default function ManageExperiencePage() {
  const [workList, setWorkList] = useState(experienceData);
  const [eduList, setEduList] = useState(educationData);

  // New Work State
  const [wTitle, setWTitle] = useState("");
  const [wCompany, setWCompany] = useState("");
  const [wLoc, setWLoc] = useState("");
  const [wDesc, setWDesc] = useState("");
  const [wDates, setWDates] = useState("");

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wTitle.trim() || !wCompany.trim()) return;
    
    const newWork = {
      id: Math.random().toString(),
      type: "work",
      title: wTitle,
      company: wCompany,
      location: wLoc,
      description: wDesc,
      startDate: wDates.split("-")[0]?.trim() || "2026",
      endDate: wDates.split("-")[1]?.trim() || "Present",
      isCurrent: wDates.toLowerCase().includes("present"),
      logoUrl: "",
    };

    setWorkList((prev) => [newWork, ...prev]);
    setWTitle("");
    setWCompany("");
    setWLoc("");
    setWDesc("");
    setWDates("");
  };

  const deleteWork = (id: string) => {
    if (confirm("Hapus item ini?")) {
      setWorkList((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const deleteEdu = (id: string) => {
    if (confirm("Hapus item ini?")) {
      setEduList((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          PENGALAMAN & EDUKASI
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Kelola riwayat pekerjaan profesional dan sejarah akademis Anda.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Work Experience list */}
        <div className="space-y-6">
          <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>PENGALAMAN KERJA</span>
          </h3>

          {/* Form */}
          <GlassCard className="p-5 border-border/40">
            <form onSubmit={handleAddWork} className="space-y-3">
              <Input placeholder="Jabatan (e.g. Frontend Developer)" value={wTitle} onChange={(e) => setWTitle(e.target.value)} className="bg-secondary/20 text-xs" />
              <Input placeholder="Perusahaan" value={wCompany} onChange={(e) => setWCompany(e.target.value)} className="bg-secondary/20 text-xs" />
              <Input placeholder="Lokasi" value={wLoc} onChange={(e) => setWLoc(e.target.value)} className="bg-secondary/20 text-xs" /> {/* Wait, Target.value -> e.target.value */}
              {/* Corrected: target.value to e.target.value */}
              <Input placeholder="Rentang Tanggal (e.g. 2025 - Present)" value={wDates} onChange={(e) => setWDates(e.target.value)} className="bg-secondary/20 text-xs" />
              <Textarea placeholder="Deskripsi pekerjaan..." value={wDesc} onChange={(e) => setWDesc(e.target.value)} className="bg-secondary/20 text-xs resize-none" rows={3} />
              <GlowButton type="submit" variant="primary" size="sm" className="w-full">
                TAMBAH KERJA
              </GlowButton>
            </form>
          </GlassCard>

          {/* List */}
          <div className="space-y-3">
            {workList.map((w) => (
              <GlassCard key={w.id} className="p-4 border-border/40 flex justify-between gap-4 items-start">
                <div className="space-y-1">
                  <h4 className="font-heading text-xs font-bold text-foreground">{w.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{w.company} • {w.location}</p>
                  <p className="text-[10px] text-primary font-mono">{w.startDate} - {w.isCurrent ? "Present" : w.endDate}</p>
                </div>
                <button onClick={() => deleteWork(w.id)} className="p-1 rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white cursor-pointer select-none">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right: Education list */}
        <div className="space-y-6">
          <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>SEJARAH PENDIDIKAN</span>
          </h3>

          <div className="space-y-3">
            {eduList.map((edu) => (
              <GlassCard key={edu.id} className="p-5 border-border/40 flex justify-between gap-4 items-start">
                <div className="space-y-1">
                  <h4 className="font-heading text-xs font-bold text-foreground">{edu.degree} — {edu.fieldOfStudy}</h4>
                  <p className="text-[10px] text-muted-foreground">{edu.institution}</p>
                  <p className="text-[10px] text-primary font-mono">{edu.startDate} - {edu.endDate}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">{edu.description}</p>
                </div>
                <button onClick={() => deleteEdu(edu.id)} className="p-1 rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white cursor-pointer select-none">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
