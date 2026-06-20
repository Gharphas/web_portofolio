"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectsData } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { Plus, Edit2, Trash2, Check, X, Star } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  techStack: string[];
  category: string;
  status: string;
  isFeatured: boolean;
  startDate: string;
  endDate: string;
}

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(projectsData);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web");
  const [status, setStatus] = useState("completed");
  const [description, setDescription] = useState("");
  const [techStackText, setTechStackText] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  const startEdit = (proj: ProjectItem) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setCategory(proj.category);
    setStatus(proj.status);
    setDescription(proj.description);
    setTechStackText(proj.techStack.join(", "));
    setLiveUrl(proj.liveUrl);
    setGithubUrl(proj.githubUrl);
    setIsFeatured(proj.isFeatured);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              title,
              category,
              status,
              description,
              techStack: techStackText.split(",").map((s) => s.trim()).filter(Boolean),
              liveUrl,
              githubUrl,
              isFeatured,
            }
          : p
      )
    );
    setEditingId(null);
  };

  const deleteProject = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: ProjectItem = {
      id: Math.random().toString(),
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description,
      liveUrl,
      githubUrl,
      techStack: techStackText.split(",").map((s) => s.trim()).filter(Boolean),
      category,
      status,
      isFeatured,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    };

    setProjects((prev) => [newProject, ...prev]);

    // Reset Form
    setTitle("");
    setCategory("Web");
    setStatus("completed");
    setDescription("");
    setTechStackText("");
    setLiveUrl("");
    setGithubUrl("");
    setIsFeatured(false);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            KELOLA PROYEK
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Kelola data dan unggahan proyek portofolio Anda secara real-time.
          </p>
        </div>

        <GlowButton
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer select-none"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setTitle("");
          }}
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "TUTUP" : "TAMBAH PROYEK"}</span>
        </GlowButton>
      </div>

      {/* Add Project Form overlay */}
      {showAddForm && (
        <GlassCard className="p-6 border-primary/30">
          <form onSubmit={handleAddProject} className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary">
              PROYEK BARU
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Judul Proyek</label>
                <Input
                  placeholder="Misal: Dashboard Real-time"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-secondary/20 border border-border/50 text-foreground rounded-lg p-2.5 text-xs outline-none focus:border-primary/50"
                >
                  {PROJECT_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Status Pengerjaan</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-secondary/20 border border-border/50 text-foreground rounded-lg p-2.5 text-xs outline-none focus:border-primary/50"
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Teknologi (Pisahkan Koma)</label>
                <Input
                  placeholder="Misal: React, Next.js, Tailwinds"
                  value={techStackText}
                  onChange={(e) => setTechStackText(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Live URL</label>
                <Input
                  placeholder="https://example.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">GitHub URL</label>
                <Input
                  placeholder="https://github.com/username/project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Deskripsi Singkat</label>
              <Textarea
                placeholder="Tulis ringkasan penjelasan proyek..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/20 text-xs resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <label htmlFor="isFeatured" className="text-xs text-muted-foreground font-sans select-none">
                Tampilkan di bagian Proyek Pilihan (Featured Projects)
              </label>
            </div>

            <div className="pt-2 flex gap-3">
              <GlowButton type="submit" variant="primary" size="sm">
                SIMPAN PROYEK
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

      {/* Projects List Card */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <GlassCard key={proj.id} className="p-6 border-border/40 hover:border-primary/25">
            {editingId === proj.id ? (
              // Edit Form Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs bg-secondary/20" placeholder="Title" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-secondary/20 text-xs p-2.5 rounded border border-border/50 text-foreground">
                    {PROJECT_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-secondary/20 text-xs p-2.5 rounded border border-border/50 text-foreground">
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                  <Input value={techStackText} onChange={(e) => setTechStackText(e.target.value)} className="text-xs bg-secondary/20" placeholder="Tech stack (comma-separated)" />
                  <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="text-xs bg-secondary/20" placeholder="Live Url" />
                  <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="text-xs bg-secondary/20" placeholder="Github Url" />
                </div>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-xs bg-secondary/20 resize-none" placeholder="Description" rows={3} />
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`feat-${proj.id}`} checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-primary" />
                  <label htmlFor={`feat-${proj.id}`} className="text-xs text-muted-foreground select-none">Tampilkan di Proyek Pilihan</label>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => saveEdit(proj.id)} className="px-4 py-2 rounded bg-emerald-600 text-white text-xs font-semibold cursor-pointer">SAVE</button>
                  <button onClick={cancelEdit} className="px-4 py-2 rounded bg-secondary text-muted-foreground text-xs font-semibold border border-border cursor-pointer">CANCEL</button>
                </div>
              </div>
            ) : (
              // Display mode
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {proj.title}
                    </h3>
                    <span className="text-[9px] uppercase tracking-wider bg-secondary border border-border/40 px-2 py-0.5 rounded text-muted-foreground font-mono">
                      {proj.category}
                    </span>
                    {proj.isFeatured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground font-sans line-clamp-2">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((t) => (
                      <span key={t} className="text-[9px] font-mono text-muted-foreground bg-secondary/40 border border-border/20 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions column */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border/10 justify-end">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => startEdit(proj)}
                      className="p-2 rounded-lg border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="p-2 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
