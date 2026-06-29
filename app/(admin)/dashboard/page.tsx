"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  skillsData,
  projectsData,
  experienceData,
  contactMessagesData,
} from "@/lib/mock-data";
import {
  LayoutDashboard,
  Wrench,
  FolderOpen,
  Briefcase,
  Mail,
  Gamepad2,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { publicApi, adminApi } from "@/lib/api";

export default function DashboardPage() {
  const [projectCount, setProjectCount] = useState(projectsData.length);
  const [skillCount, setSkillCount] = useState(skillsData.length);
  const [expCount, setExpCount] = useState(experienceData.length);
  const [msgCount, setMsgCount] = useState(contactMessagesData.length);

  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        // Load data in parallel
        const [projRes, skillRes, expRes, msgRes] = await Promise.all([
          publicApi.getProjects().catch(() => ({ success: false, data: null })),
          publicApi.getSkills().catch(() => ({ success: false, data: null })),
          publicApi.getExperience().catch(() => ({ success: false, data: null })),
          adminApi.getMessages().catch(() => ({ success: false, data: null })),
        ]);

        if (projRes.success && projRes.data) {
          setProjectCount((projRes.data as any[]).length);
        }
        if (skillRes.success && skillRes.data) {
          setSkillCount((skillRes.data as any[]).length);
        }
        if (expRes.success && expRes.data) {
          setExpCount((expRes.data as any[]).length);
        }
        if (msgRes.success && msgRes.data) {
          setMsgCount((msgRes.data as any[]).length);
          const mappedMessages = (msgRes.data as any[]).slice(0, 3).map((msg) => ({
            id: msg.id,
            name: msg.name,
            email: msg.email,
            subject: msg.subject || "",
            message: msg.message,
            isRead: msg.is_read ?? msg.isRead ?? false,
            isStarred: msg.is_starred ?? msg.isStarred ?? false,
          }));
          setRecentMessages(mappedMessages);
        } else {
          setRecentMessages(contactMessagesData.slice(0, 3));
        }
      } catch (err) {
        console.error("Gagal memuat statistik dashboard:", err);
        setRecentMessages(contactMessagesData.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    { label: "Total Proyek", value: projectCount, icon: FolderOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Keahlian", value: skillCount, icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Pengalaman Kerja", value: expCount, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pesan Masuk", value: msgCount, icon: Mail, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            DASHBOARD
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Statistik dan ringkasan data portofolio pribadi Anda dari database.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-full shadow-[0_0_10px_var(--crimson-glow)]">
          <Sparkles className="h-4 w-4 animate-spin" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <GlassCard key={idx} className="p-6 border-border/40 hover:border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                    {stat.label}
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-foreground mt-1">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      stat.value
                    )}
                  </h3>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color} ${stat.bg}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Dual Columns Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-foreground">
              PESAN TERBARU
            </h3>
            <Link
              href="/manage-contact"
              className="text-xs font-heading font-bold text-primary hover:text-accent flex items-center gap-1"
            >
              <span>Semua Pesan</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 border border-border/10 rounded-xl bg-secondary/5">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Memuat pesan...</p>
              </div>
            ) : recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <GlassCard
                  key={msg.id}
                  className="p-5 border-border/40 hover:border-primary/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-sm font-bold text-foreground">
                          {msg.name}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {msg.email}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-bold">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {msg.isStarred && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                      {msg.isRead ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-border/40 rounded-xl">
                <Mail className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-sans">Tidak ada pesan masuk.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Shortcut Column */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-heading text-sm font-bold text-foreground">
            SHORTCUT KONTEN
          </h3>

          <GlassCard className="p-6 border-border/40 space-y-4">
            <p className="text-xs text-muted-foreground">
              Kelola bagian konten portofolio Anda secara instan.
            </p>

            <div className="flex flex-col gap-2">
              <Link href="/manage-about" className="w-full">
                <button className="w-full py-2.5 px-4 bg-secondary/30 hover:bg-primary/10 border border-border/40 hover:border-primary/30 rounded-lg text-left text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer select-none">
                  Tentang Saya
                </button>
              </Link>
              <Link href="/manage-skills" className="w-full">
                <button className="w-full py-2.5 px-4 bg-secondary/30 hover:bg-primary/10 border border-border/40 hover:border-primary/30 rounded-lg text-left text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer select-none">
                  Keahlian
                </button>
              </Link>
              <Link href="/manage-projects" className="w-full">
                <button className="w-full py-2.5 px-4 bg-secondary/30 hover:bg-primary/10 border border-border/40 hover:border-primary/30 rounded-lg text-left text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer select-none">
                  Proyek Portofolio
                </button>
              </Link>
              <Link href="/manage-experience" className="w-full">
                <button className="w-full py-2.5 px-4 bg-secondary/30 hover:bg-primary/10 border border-border/40 hover:border-primary/30 rounded-lg text-left text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer select-none">
                  Pengalaman & Edukasi
                </button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
