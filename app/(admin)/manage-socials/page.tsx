"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Input } from "@/components/ui/input";
import { socialLinksData } from "@/lib/mock-data";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Link,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Facebook,
  MessageCircle,
  Music2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { publicApi, adminApi } from "@/lib/api";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  isVisible: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Facebook,
  WhatsApp: MessageCircle,
  TikTok: Music2,
};

const PLATFORMS = [
  "Github",
  "Linkedin",
  "Twitter",
  "Instagram",
  "Youtube",
  "Globe",
  "Facebook",
  "WhatsApp",
  "TikTok"
];

export default function ManageSocialsPage() {
  const [socials, setSocials] = useState<SocialLinkItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form input states
  const [platform, setPlatform] = useState("Github");
  const [url, setUrl] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const fetchSocials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await publicApi.getSocialLinks();
      if (res.success && res.data) {
        const mapped = (res.data as any[]).map((item) => ({
          id: item.id,
          platform: item.platform,
          url: item.url,
          icon: item.icon_name || item.platform,
          isVisible: item.is_visible ?? true,
        }));
        setSocials(mapped);
      } else {
        setSocials(getDefaultSocials());
      }
    } catch (err) {
      setError("Gagal menghubungi server. Menggunakan data lokal (offline).");
      setSocials(getDefaultSocials());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultSocials = () => {
    return socialLinksData.map((item) => ({
      id: item.id,
      platform: item.platform,
      url: item.url,
      icon: item.icon,
      isVisible: true,
    }));
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const startEdit = (item: SocialLinkItem) => {
    setEditingId(item.id);
    setPlatform(item.platform);
    setUrl(item.url);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    if (!url.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        platform,
        url,
        icon_name: platform,
        is_visible: true,
      };

      const res = await adminApi.updateSocialLink(id, payload);
      if (res.success) {
        setSocials((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  platform,
                  url,
                  icon: platform,
                }
              : item
          )
        );
        setEditingId(null);
        showSuccessMsg("Tautan sosial berhasil diperbarui!");
      } else {
        throw new Error(res.error?.message || "Gagal memperbarui tautan sosial");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSocial = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tautan sosial ini?")) return;
    setError(null);
    try {
      const res = await adminApi.deleteSocialLink(id);
      if (res.success) {
        setSocials((prev) => prev.filter((item) => item.id !== id));
        showSuccessMsg("Tautan sosial berhasil dihapus!");
      } else {
        throw new Error(res.error?.message || "Gagal menghapus tautan sosial");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus tautan sosial dari server.");
    }
  };

  const addSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        platform,
        url,
        icon_name: platform,
        is_visible: true,
      };

      const res = await adminApi.createSocialLink(payload);
      if (res.success && res.data) {
        const newSocial: SocialLinkItem = {
          id: (res.data as any).id,
          platform,
          url,
          icon: platform,
          isVisible: true,
        };

        setSocials((prev) => [...prev, newSocial]);
        setPlatform("Github");
        setUrl("");
        setShowAddForm(false);
        showSuccessMsg("Tautan sosial baru berhasil ditambahkan!");
      } else {
        throw new Error(res.error?.message || "Gagal menambahkan tautan sosial");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data ke server.");
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
            KELOLA TAUTAN SOSIAL
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Tambahkan, perbarui, atau hapus tautan sosial media dan jejaring profesional Anda.
          </p>
        </div>

        <GlowButton
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer select-none"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setPlatform("Github");
            setUrl("");
          }}
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "TUTUP" : "TAMBAH TAUTAN"}</span>
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

      {/* Add Social Form */}
      {showAddForm && (
        <GlassCard className="p-6 border-primary/30 max-w-xl">
          <form onSubmit={addSocial} className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>TAUTAN SOSIAL BARU</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-secondary/20 border border-border/50 text-foreground rounded-lg p-2.5 text-xs outline-none focus:border-primary/50"
                >
                  {PLATFORMS.map((plat) => (
                    <option key={plat} value={plat} className="bg-background">
                      {plat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">URL Profil</label>
                <Input
                  placeholder="Misal: https://github.com/username"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <GlowButton type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? "MENYIMPAN..." : "SIMPAN TAUTAN"}
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
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat tautan sosial...</p>
        </div>
      ) : (
        /* Social List Table */
        <GlassCard className="overflow-x-auto border-border/40">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/10">
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground w-[20%]">Platform</th>
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground w-[65%]">URL Profil</th>
                <th className="p-4 font-heading font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-right w-[15%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {socials.map((item) => {
                const IconComponent = iconMap[item.platform] || Globe;
                return (
                  <tr key={item.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="p-4 font-semibold text-foreground">
                      {editingId === item.id ? (
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                          className="bg-secondary/20 border border-border/50 text-foreground rounded p-1 text-xs outline-none"
                        >
                          {PLATFORMS.map((plat) => (
                            <option key={plat} value={plat}>
                              {plat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <span>{item.platform}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-muted-foreground font-mono text-[11px] truncate max-w-[200px]">
                      {editingId === item.id ? (
                        <Input
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="bg-secondary/20 text-xs w-full py-1"
                        />
                      ) : (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">
                          {item.url}
                        </a>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {editingId === item.id ? (
                        <div className="flex justify-end gap-1.5">
                          <ShimmerButton
                            className="p-1.5 text-emerald-500 cursor-pointer"
                            onClick={() => saveEdit(item.id)}
                            disabled={isSaving}
                            shimmerColor="#10b981"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </ShimmerButton>
                          <ShimmerButton
                            className="p-1.5 text-muted-foreground cursor-pointer"
                            onClick={cancelEdit}
                            shimmerColor="#888888"
                          >
                            <X className="h-3.5 w-3.5" />
                          </ShimmerButton>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          <ShimmerButton
                            className="p-1.5 text-muted-foreground cursor-pointer"
                            onClick={() => startEdit(item)}
                            shimmerColor="#888888"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </ShimmerButton>
                          <ShimmerButton
                            className="p-1.5 text-destructive cursor-pointer"
                            onClick={() => deleteSocial(item.id)}
                            shimmerColor="#ef4444"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </ShimmerButton>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
