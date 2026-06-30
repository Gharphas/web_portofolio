"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectsData } from "@/lib/mock-data";
import { Plus, Edit2, Trash2, Check, X, Star, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { publicApi, adminApi } from "@/lib/api";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  liveUrl: string;
  githubUrl: string;
  techStack: string[];
  category: string;
  status: string;
  isFeatured: boolean;
  startDate: string;
  endDate: string;
  thumbnail: string;
  mobileImage?: string;
}

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Other");
  const [status, setStatus] = useState("completed");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [techStackText, setTechStackText] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getProjects();
      if (res.success && res.data) {
        const mappedData = (res.data as any[]).map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          longDescription: p.long_description || "",
          liveUrl: p.live_url || "",
          githubUrl: p.github_url || "",
          techStack: p.tech_stack || [],
          category: p.category,
          status: p.status || "completed",
          isFeatured: p.is_featured ?? false,
          startDate: p.start_date || "",
          endDate: p.end_date || "",
          thumbnail: p.thumbnail_url || "",
          mobileImage: p.mobile_image_url || "",
        }));
        setProjects(mappedData);
      } else {
        const fallback = projectsData.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          longDescription: "",
          liveUrl: p.liveUrl || "",
          githubUrl: p.githubUrl || "",
          techStack: p.techStack || [],
          category: p.category,
          status: p.status || "completed",
          isFeatured: p.isFeatured ?? false,
          startDate: p.startDate || "",
          endDate: p.endDate || "",
          thumbnail: p.thumbnail || "",
          mobileImage: (p as any).mobileImageUrl || "",
        }));
        setProjects(fallback);
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal menghubungi server. Menggunakan data lokal (offline).");
      const fallback = projectsData.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        longDescription: "",
        liveUrl: p.liveUrl || "",
        githubUrl: p.githubUrl || "",
        techStack: p.techStack || [],
        category: p.category,
        status: p.status || "completed",
        isFeatured: p.isFeatured ?? false,
        startDate: p.startDate || "",
        endDate: p.endDate || "",
        thumbnail: p.thumbnail || "",
        mobileImage: (p as any).mobileImageUrl || "",
      }));
      setProjects(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const startEdit = (proj: ProjectItem) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setCategory(proj.category);
    setStatus(proj.status);
    setDescription(proj.description);
    setLongDescription(proj.longDescription);
    setTechStackText(proj.techStack.join(", "));
    setLiveUrl(proj.liveUrl);
    setGithubUrl(proj.githubUrl);
    setIsFeatured(proj.isFeatured);
    setThumbnailUrl(proj.thumbnail);
    setMobileImageUrl(proj.mobileImage || "");
    setStartDate(proj.startDate);
    setEndDate(proj.endDate);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    if (!title.trim() || !description.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = {
        title,
        slug,
        description,
        long_description: longDescription || null,
        live_url: liveUrl || null,
        github_url: githubUrl || null,
        tech_stack: techStackText.split(",").map((s) => s.trim()).filter(Boolean),
        category,
        status,
        is_featured: isFeatured,
        start_date: startDate || null,
        end_date: endDate || null,
        thumbnail_url: thumbnailUrl || null,
        mobile_image_url: mobileImageUrl || null,
      };

      const res = await adminApi.updateProject(id, payload);
      if (res.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  title,
                  slug,
                  description,
                  longDescription,
                  liveUrl,
                  githubUrl,
                  techStack: payload.tech_stack,
                  category,
                  status,
                  isFeatured,
                  thumbnail: thumbnailUrl,
                  mobileImage: mobileImageUrl,
                  startDate,
                  endDate,
                }
              : p
          )
        );
        setEditingId(null);
        showSuccessMsg("Proyek berhasil diperbarui!");
      } else {
        throw new Error(res.error?.message || "Gagal memperbarui proyek");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deleteProject(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showSuccessMsg("Proyek berhasil dihapus!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus proyek");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus proyek dari server.");
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = {
        title,
        slug,
        description,
        long_description: longDescription || null,
        live_url: liveUrl || null,
        github_url: githubUrl || null,
        tech_stack: techStackText.split(",").map((s) => s.trim()).filter(Boolean),
        category,
        status,
        is_featured: isFeatured,
        start_date: startDate || null,
        end_date: endDate || null,
        thumbnail_url: thumbnailUrl || null,
        mobile_image_url: mobileImageUrl || null,
      };

      const res = await adminApi.createProject(payload);
      if (res.success && res.data) {
        const newProject: ProjectItem = {
          id: (res.data as any).id,
          title,
          slug,
          description,
          longDescription,
          liveUrl,
          githubUrl,
          techStack: payload.tech_stack,
          category,
          status,
          isFeatured,
          startDate,
          endDate,
          thumbnail: thumbnailUrl,
          mobileImage: mobileImageUrl,
        };

        setProjects((prev) => [newProject, ...prev]);
        
        // Reset Form
        setTitle("");
        setCategory("Other");
        setStatus("completed");
        setDescription("");
        setLongDescription("");
        setTechStackText("");
        setLiveUrl("");
        setGithubUrl("");
        setIsFeatured(false);
        setThumbnailUrl("");
        setMobileImageUrl("");
        setStartDate("");
        setEndDate("");
        setShowAddForm(false);
        showSuccessMsg("Proyek baru berhasil ditambahkan!");
      } else {
        throw new Error(res.error?.message || "Gagal menambahkan proyek baru");
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
            setCategory("Other");
            setStatus("completed");
            setDescription("");
            setLongDescription("");
            setTechStackText("");
            setLiveUrl("");
            setGithubUrl("");
            setIsFeatured(false);
            setThumbnailUrl("");
            setMobileImageUrl("");
            setStartDate("");
            setEndDate("");
          }}
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "TUTUP" : "TAMBAH PROYEK"}</span>
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

      {/* Add Project Form */}
      {showAddForm && (
        <GlassCard className="p-6 border-primary/30">
          <form onSubmit={handleAddProject} className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary">
              PROYEK BARU
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tampilan Desktop (Thumbnail)</label>
                <ImageUploader
                  bucket="projects"
                  value={thumbnailUrl}
                  onChange={setThumbnailUrl}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tampilan Mobile (Opsional)</label>
                <ImageUploader
                  bucket="projects"
                  value={mobileImageUrl}
                  onChange={setMobileImageUrl}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Judul Proyek</label>
                <Input
                  placeholder="Misal: Dashboard Real-time"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
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
                  <option value="archived">Archived</option>
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
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Selesai (Opsional)</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Deskripsi Panjang (Markdown / Opsional)</label>
              <Textarea
                placeholder="Tulis detail proyek, fitur, tantangan, dan arsitektur..."
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className="bg-secondary/20 text-xs resize-none"
                rows={5}
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
              <GlowButton type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? "MENYIMPAN..." : "SIMPAN PROYEK"}
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
          <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat proyek...</p>
        </div>
      ) : (
        /* Projects List Card */
        <div className="space-y-4">
          {projects.map((proj) => (
            <GlassCard key={proj.id} className="p-6 border-border/40 hover:border-primary/25">
              {editingId === proj.id ? (
                // Edit Form Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tampilan Desktop (Thumbnail)</label>
                      <ImageUploader
                        bucket="projects"
                        value={thumbnailUrl}
                        onChange={setThumbnailUrl}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tampilan Mobile (Opsional)</label>
                      <ImageUploader
                        bucket="projects"
                        value={mobileImageUrl}
                        onChange={setMobileImageUrl}
                      />
                    </div>
                    
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Judul Proyek</label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs bg-secondary/20" placeholder="Title" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Status Pengerjaan</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-secondary/20 text-xs p-2.5 rounded border border-border/50 text-foreground">
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Teknologi</label>
                      <Input value={techStackText} onChange={(e) => setTechStackText(e.target.value)} className="text-xs bg-secondary/20" placeholder="Tech stack (comma-separated)" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Mulai</label>
                      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs bg-secondary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tanggal Selesai</label>
                      <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs bg-secondary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Live URL</label>
                      <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="text-xs bg-secondary/20" placeholder="Live Url" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">GitHub URL</label>
                      <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="text-xs bg-secondary/20" placeholder="Github Url" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Deskripsi Singkat</label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-xs bg-secondary/20 resize-none" placeholder="Description" rows={3} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Deskripsi Panjang (Markdown / Opsional)</label>
                    <Textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} className="text-xs bg-secondary/20 resize-none" placeholder="Long Description" rows={5} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`feat-${proj.id}`} checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-primary" />
                    <label htmlFor={`feat-${proj.id}`} className="text-xs text-muted-foreground select-none">Tampilkan di Proyek Pilihan</label>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(proj.id)} disabled={isSaving} className="px-4 py-2 rounded bg-emerald-600 text-white text-xs font-semibold cursor-pointer">
                      {isSaving ? "SAVING..." : "SAVE"}
                    </button>
                    <button onClick={cancelEdit} className="px-4 py-2 rounded bg-secondary text-muted-foreground text-xs font-semibold border border-border cursor-pointer">CANCEL</button>
                  </div>
                </div>
              ) : (
                // Display mode
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 w-full">
                  <div className="flex flex-col sm:flex-row items-start gap-4 flex-grow w-full">
                    {proj.thumbnail && (
                      <div className="relative w-full sm:w-28 aspect-video sm:aspect-square rounded-lg overflow-hidden border border-border/40 flex-shrink-0 bg-secondary/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading text-base font-bold text-foreground">
                          {proj.title}
                        </h3>
                        <span className="text-[9px] uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary font-mono">
                          {proj.status}
                        </span>
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
                  </div>

                  {/* Actions column */}
                  <div className="flex sm:flex-row md:flex-col items-center justify-end gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border/10">
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
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground font-sans">Belum ada data proyek.</p>
        </div>
      )}
    </div>
  );
}
