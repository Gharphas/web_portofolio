"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { hobbiesData } from "@/lib/mock-data";
import { Gamepad2, Plus, Trash2 } from "lucide-react";

interface HobbyItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function ManageHobbiesPage() {
  const [hobbies, setHobbies] = useState<HobbyItem[]>(hobbiesData);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHobby = {
      id: Math.random().toString(),
      name,
      description,
      icon: "Gamepad2", // Default icon
    };

    setHobbies((prev) => [newHobby, ...prev]);
    setName("");
    setDescription("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus hobi ini?")) {
      setHobbies((prev) => prev.filter((h) => h.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          KELOLA HOBI
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Tambahkan hobi, minat, atau aktivitas menarik lainnya yang Anda sukai.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 border-border/40">
            <form onSubmit={handleAdd} className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                <span>TAMBAH HOBI BARU</span>
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Nama Aktivitas</label>
                  <Input
                    placeholder="Misal: Gaming"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary/20 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Penjelasan Ringkas</label>
                  <Input
                    placeholder="Competitive & casual gaming"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-secondary/20 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <GlowButton type="submit" variant="primary" size="sm" className="w-full">
                  SIMPAN HOBI
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-heading text-sm font-bold text-foreground">
            HOBI SAAT INI
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hobbies.map((h) => (
              <GlassCard key={h.id} className="p-5 border-border/40 flex justify-between gap-4 items-start">
                <div className="space-y-1">
                  <h4 className="font-heading text-xs font-bold text-foreground">
                    {h.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-sans leading-normal">
                    {h.description}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="p-1 rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white cursor-pointer select-none transition-colors"
                >
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
