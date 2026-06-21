"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { skillsData } from "@/lib/mock-data";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { Plus, Edit2, Trash2, Check, X, Star, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { publicApi, adminApi } from "@/lib/api";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  color: string;
  is_featured: boolean;
}

export default function ManageSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form input states
  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Frontend");
  const [proficiencyInput, setProficiencyInput] = useState(80);
  const [colorInput, setColorInput] = useState("#FF1744");
  const [featuredInput, setFeaturedInput] = useState(false);

  // New Skill form state
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getSkills();
      if (res.success && res.data) {
        // Map database properties (is_featured) to UI state
        const mappedData = (res.data as any[]).map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          proficiency: item.proficiency,
          color: item.color || "#FF1744",
          is_featured: item.is_featured ?? item.isFeatured ?? false,
        }));
        setSkills(mappedData);
      } else {
        // Fallback to mock data if empty
        const fallbackData = skillsData.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          proficiency: item.proficiency,
          color: item.color,
          is_featured: item.isFeatured,
        }));
        setSkills(fallbackData);
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal menghubungi server. Menggunakan data lokal (offline).");
      const fallbackData = skillsData.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        proficiency: item.proficiency,
        color: item.color,
        is_featured: item.isFeatured,
      }));
      setSkills(fallbackData);
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

  const startEdit = (skill: SkillItem) => {
    setEditingId(skill.id);
    setNameInput(skill.name);
    setCategoryInput(skill.category);
    setProficiencyInput(skill.proficiency);
    setColorInput(skill.color);
    setFeaturedInput(skill.is_featured);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    if (!nameInput.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        name: nameInput,
        category: categoryInput,
        proficiency: Number(proficiencyInput),
        color: colorInput,
        is_featured: featuredInput,
      };

      const res = await adminApi.updateSkill(id, payload);
      if (res.success) {
        setSkills((prev) =>
          prev.map((skill) =>
            skill.id === id
              ? {
                  ...skill,
                  ...payload,
                }
              : skill
          )
        );
        setEditingId(null);
        showSuccessMsg("Keahlian berhasil diperbarui!");
      } else {
        throw new Error(res.error?.message || "Gagal memperbarui keahlian");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus keahlian ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deleteSkill(id);
      if (res.success) {
        setSkills((prev) => prev.filter((skill) => skill.id !== id));
        showSuccessMsg("Keahlian berhasil dihapus!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus keahlian");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus keahlian dari server.");
    }
  };

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        name: nameInput,
        category: categoryInput,
        proficiency: Number(proficiencyInput),
        color: colorInput,
        is_featured: featuredInput,
      };

      const res = await adminApi.createSkill(payload);
      if (res.success && res.data) {
        const createdSkill: SkillItem = {
          id: (res.data as any).id,
          name: nameInput,
          category: categoryInput,
          proficiency: Number(proficiencyInput),
          color: colorInput,
          is_featured: featuredInput,
        };
        setSkills((prev) => [createdSkill, ...prev]);
        
        // Reset Form inputs
        setNameInput("");
        setCategoryInput("Frontend");
        setProficiencyInput(80);
        setColorInput("#FF1744");
        setFeaturedInput(false);
        setShowAddForm(false);
        showSuccessMsg("Keahlian baru berhasil ditambahkan!");
      } else {
        throw new Error(res.error?.message || "Gagal menambahkan keahlian baru");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan keahlian ke server.");
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
            KELOLA KEAHLIAN
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Tambahkan, perbarui, atau hapus keahlian dan teknologi di portofolio Anda.
          </p>
        </div>

        <GlowButton
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer select-none"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setNameInput("");
            setCategoryInput("Frontend");
            setProficiencyInput(80);
            setColorInput("#FF1744");
            setFeaturedInput(false);
          }}
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "TUTUP" : "TAMBAH KEAHLIAN"}</span>
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

      {/* Add Skill Form overlay */}
      {showAddForm && (
        <GlassCard className="p-6 border-primary/30 max-w-xl">
          <form onSubmit={addSkill} className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary">
              KEAHLIAN BARU
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Nama Keahlian</label>
                <Input
                  placeholder="Misal: React"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Kategori</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-secondary/20 border border-border/50 text-foreground rounded-lg p-2.5 text-xs outline-none focus:border-primary/50"
                >
                  {SKILL_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat} className="bg-background">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Kemampuan (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={proficiencyInput}
                  onChange={(e) => setProficiencyInput(Number(e.target.value))}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Kode Warna Hex</label>
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={featuredInput}
                onChange={(e) => setFeaturedInput(e.target.checked)}
                className="h-4 w-4 border-border rounded accent-primary bg-background"
              />
              <label htmlFor="isFeatured" className="text-xs text-muted-foreground font-sans select-none">
                Tandai sebagai Keahlian Inti (Core Skill)
              </label>
            </div>

            <div className="pt-2 flex gap-3">
              <GlowButton type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? "MENYIMPAN..." : "SIMPAN KEAHLIAN"}
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

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat keahlian...</p>
        </div>
      ) : (
        /* Skills Table List */
        <GlassCard className="overflow-x-auto border-border/40">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/10">
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Nama</th>
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Kategori</th>
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Proficiency</th>
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Core</th>
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="p-4 font-semibold text-foreground">
                    {editingId === skill.id ? (
                      <Input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="bg-secondary/20 text-xs w-full max-w-[150px] py-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: skill.color }} />
                        {skill.name}
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {editingId === skill.id ? (
                      <select
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className="bg-secondary/20 border border-border/50 text-foreground rounded p-1 text-xs outline-none"
                      >
                        {SKILL_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    ) : (
                      skill.category
                    )}
                  </td>

                  <td className="p-4">
                    {editingId === skill.id ? (
                      <Input
                        type="number"
                        value={proficiencyInput}
                        onChange={(e) => setProficiencyInput(Number(e.target.value))}
                        className="bg-secondary/20 text-xs w-20 py-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span>{skill.proficiency}%</span>
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    {editingId === skill.id ? (
                      <input
                        type="checkbox"
                        checked={featuredInput}
                        onChange={(e) => setFeaturedInput(e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                    ) : skill.is_featured ? (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ) : (
                      <span className="text-muted-foreground/40">-</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {editingId === skill.id ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => saveEdit(skill.id)}
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
                    ) : (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => startEdit(skill)}
                          className="p-1.5 rounded-lg border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* Empty State */}
      {!isLoading && skills.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground font-sans">Belum ada data keahlian.</p>
        </div>
      )}
    </div>
  );
}
