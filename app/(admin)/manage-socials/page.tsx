"use client";

import { useState } from "react";
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
} from "lucide-react";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Facebook,
};

const PLATFORMS = ["Github", "Linkedin", "Twitter", "Instagram", "Youtube", "Globe", "Facebook"];

export default function ManageSocialsPage() {
  const [socials, setSocials] = useState<SocialLinkItem[]>(socialLinksData);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form input states
  const [platform, setPlatform] = useState("Github");
  const [url, setUrl] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const startEdit = (item: SocialLinkItem) => {
    setEditingId(item.id);
    setPlatform(item.platform);
    setUrl(item.url);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    setSocials((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              platform,
              url,
              icon: platform, // Use platform name as icon name
            }
          : item
      )
    );
    setEditingId(null);
  };

  const deleteSocial = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus tautan sosial ini?")) {
      setSocials((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const addSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const newSocial: SocialLinkItem = {
      id: Math.random().toString(),
      platform,
      url,
      icon: platform,
    };

    setSocials((prev) => [...prev, newSocial]);

    // Reset Form inputs
    setPlatform("Github");
    setUrl("");
    setShowAddForm(false);
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
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <GlowButton type="submit" variant="primary" size="sm">
                SIMPAN TAUTAN
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

      {/* Social List Table */}
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
    </div>
  );
}
