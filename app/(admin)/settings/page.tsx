"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONFIG } from "@/lib/constants";
import { Settings, CheckCircle2, AlertCircle, Loader2, Globe, FileText, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { authClient } from "@/lib/auth-client";
import { authApi } from "@/lib/api";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState(SITE_CONFIG.name);
  const [siteTitle, setSiteTitle] = useState(SITE_CONFIG.title);
  const [siteDesc, setSiteDesc] = useState(SITE_CONFIG.description);
  const [siteUrl, setSiteUrl] = useState(SITE_CONFIG.url);

  // Profile Data & CV State
  const [aboutData, setAboutData] = useState<any>(null);
  const [resumeUrl, setResumeUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Change Password State ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // --- Change Email State ---
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch about profile data
        const aboutResponse = await fetch(`${apiUrl}/about`);
        if (aboutResponse.ok) {
          const resData = await aboutResponse.json();
          if (resData.success && resData.data) {
            setAboutData(resData.data);
            setResumeUrl(resData.data.resume_url || "");
          }
        }

        // 2. Fetch site settings
        const settingsResponse = await fetch(`${apiUrl}/settings`);
        if (settingsResponse.ok) {
          const resData = await settingsResponse.json();
          if (resData.success && Array.isArray(resData.data)) {
            resData.data.forEach((setting: any) => {
              if (setting.key === "site_name") setSiteName(setting.value || "");
              if (setting.key === "site_title") setSiteTitle(setting.value || "");
              if (setting.key === "site_url") setSiteUrl(setting.value || "");
              if (setting.key === "meta_description") setSiteDesc(setting.value || "");
            });
          }
        }

        // 3. Fetch current user email from auth
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user?.email) {
          setCurrentEmail(sessionData.user.email);
        }

      } catch (err: any) {
        console.error("Gagal memuat data pengaturan:", err);
        setError("Gagal memuat data pengaturan dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // --- Handle Save Site Settings ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("jemiarian_admin_token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      // 1. Save CV to about table
      if (aboutData) {
        const response = await fetch(`${apiUrl}/about`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            title: aboutData.title || "",
            tagline: aboutData.tagline || aboutData.subtitle || "",
            location: aboutData.location || "",
            bio_short: aboutData.bio_short || "",
            bio_full: aboutData.bio_full || "",
            photo_url: aboutData.photo_url || "",
            resume_url: resumeUrl,
          }),
        });

        const resData = await response.json();
        if (!response.ok || !resData.success) {
          throw new Error(resData.error?.message || "Gagal menyimpan berkas CV.");
        }
      }

      // 2. Save site settings (SEO & General) via bulk update
      const settingsResponse = await fetch(`${apiUrl}/settings/bulk`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          settings: [
            { key: "site_name", value: siteName, category: "general" },
            { key: "site_title", value: siteTitle, category: "seo" },
            { key: "site_url", value: siteUrl, category: "general" },
            { key: "meta_description", value: siteDesc, category: "seo" },
          ],
        }),
      });
      const settingsResData = await settingsResponse.json();
      if (!settingsResponse.ok || !settingsResData.success) {
        throw new Error(settingsResData.error?.message || "Gagal menyimpan pengaturan SEO & General.");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error("Gagal menyimpan pengaturan:", err);
      setError(err.message || "Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handle Change Password via Better Auth ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validasi
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua field password wajib diisi.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (result.error) {
        // Map Better Auth errors to Indonesian messages
        const errorMessage = result.error.message || "Gagal mengganti password.";
        if (errorMessage.toLowerCase().includes("invalid password") || errorMessage.toLowerCase().includes("incorrect")) {
          setPasswordError("Password saat ini salah.");
        } else if (errorMessage.toLowerCase().includes("too short")) {
          setPasswordError("Password baru terlalu pendek.");
        } else if (errorMessage.toLowerCase().includes("too long")) {
          setPasswordError("Password baru terlalu panjang.");
        } else {
          setPasswordError(errorMessage);
        }
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      console.error("Gagal mengganti password:", err);
      setPasswordError(err.message || "Gagal mengganti password. Coba lagi nanti.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // --- Handle Change Email via Custom Endpoint ---
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(false);

    // Validasi
    if (!newEmail || !emailPassword) {
      setEmailError("Email baru dan password wajib diisi.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Format email tidak valid.");
      return;
    }
    if (newEmail === currentEmail) {
      setEmailError("Email baru tidak boleh sama dengan email saat ini.");
      return;
    }

    setIsChangingEmail(true);

    try {
      const res = await authApi.changeEmail(newEmail, emailPassword);

      if (!res.success) {
        setEmailError(res.error?.message || "Gagal mengganti email.");
        return;
      }

      setEmailSuccess(true);
      setCurrentEmail(newEmail);
      setNewEmail("");
      setEmailPassword("");
      setTimeout(() => setEmailSuccess(false), 4000);
    } catch (err: any) {
      console.error("Gagal mengganti email:", err);
      setEmailError(err.message || "Gagal mengganti email. Coba lagi nanti.");
    } finally {
      setIsChangingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          PENGATURAN SITUS
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Kelola nama situs, tag meta SEO, berkas CV/Resume, serta keamanan akun Anda.
        </p>
      </div>

      <div className="max-w-3xl">
        {/* ═══════════════════════════════════════════ */}
        {/* Form: Site Settings & CV Upload            */}
        {/* ═══════════════════════════════════════════ */}
        <form onSubmit={handleSave} className="space-y-6">
          {success && (
            <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold font-sans">
              <CheckCircle2 className="h-4 w-4" />
              <span>Pengaturan situs berhasil disimpan!</span>
            </div>
          )}

          {error && (
            <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* CV / Resume Upload Card */}
          <GlassCard className="p-6 md:p-8 border-border/40 space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>BERKAS CV / RESUME</span>
            </h3>

            <div className="space-y-2 text-xs font-sans">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Unduhan Berkas CV (Format PDF)</label>
              <ImageUploader
                bucket="documents"
                accept="application/pdf"
                value={resumeUrl}
                onChange={setResumeUrl}
              />
              <p className="text-[9px] text-muted-foreground">
                Unggah berkas CV PDF Anda di sini agar pengunjung situs dapat mengunduhnya secara instan melalui tombol &quot;Unduh CV&quot;.
              </p>
            </div>
          </GlassCard>

          {/* SEO Settings Card */}
          <GlassCard className="p-6 md:p-8 border-border/40 space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>SETTING SEO & GENERAL</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Nama Situs</label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Judul Utama SEO</label>
                <Input
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="bg-secondary/20 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Site URL</label>
              <Input
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="bg-secondary/20 text-xs"
              />
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="text-[10px] uppercase font-semibold text-muted-foreground">Meta Deskripsi</label>
              <Textarea
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="bg-secondary/20 text-xs resize-none"
                rows={3}
              />
            </div>
          </GlassCard>

          <div>
            <GlowButton type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving ? "MENYIMPAN..." : "SIMPAN PENGATURAN"}
            </GlowButton>
          </div>
        </form>

        {/* ═══════════════════════════════════════════ */}
        {/* Section: Account Security                  */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mt-10 mb-2">
          <h2 className="font-heading text-lg font-bold text-foreground">
            KEAMANAN AKUN
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            Perbarui kata sandi dan alamat email akun administrator Anda.
          </p>
        </div>

        <div className="space-y-6">
          {/* Change Password Card */}
          <GlassCard className="p-6 md:p-8 border-border/40 space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>GANTI KATA SANDI</span>
            </h3>

            {passwordSuccess && (
              <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold font-sans">
                <CheckCircle2 className="h-4 w-4" />
                <span>Kata sandi berhasil diperbarui!</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
                <AlertCircle className="h-4 w-4" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1 text-xs font-sans">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Password Saat Ini</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-secondary/20 text-xs pr-10"
                    placeholder="Masukkan password saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs font-sans">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Password Baru</label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-secondary/20 text-xs pr-10"
                      placeholder="Minimal 8 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-sans">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-secondary/20 text-xs pr-10"
                      placeholder="Ulangi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <GlowButton type="submit" variant="primary" size="sm" disabled={isChangingPassword}>
                  {isChangingPassword ? "MENGUBAH..." : "GANTI KATA SANDI"}
                </GlowButton>
              </div>
            </form>
          </GlassCard>

          {/* Change Email Card */}
          <GlassCard className="p-6 md:p-8 border-border/40 space-y-4">
            <h3 className="font-heading text-sm font-bold text-primary flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>GANTI EMAIL</span>
            </h3>

            {emailSuccess && (
              <div className="p-3 text-[11px] rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 font-semibold font-sans">
                <CheckCircle2 className="h-4 w-4" />
                <span>Email berhasil diperbarui!</span>
              </div>
            )}

            {emailError && (
              <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 font-semibold font-sans">
                <AlertCircle className="h-4 w-4" />
                <span>{emailError}</span>
              </div>
            )}

            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div className="space-y-1 text-xs font-sans">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Email Saat Ini</label>
                <Input
                  value={currentEmail}
                  disabled
                  className="bg-secondary/30 text-xs text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-1 text-xs font-sans">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Email Baru</label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-secondary/20 text-xs"
                  placeholder="Masukkan email baru"
                />
              </div>

              <div className="space-y-1 text-xs font-sans">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Password (Verifikasi Identitas)</label>
                <div className="relative">
                  <Input
                    type={showEmailPassword ? "text" : "password"}
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    className="bg-secondary/20 text-xs pr-10"
                    placeholder="Masukkan password untuk verifikasi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showEmailPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-[9px] text-muted-foreground">
                  Masukkan password Anda saat ini untuk memverifikasi bahwa ini benar-benar Anda.
                </p>
              </div>

              <div>
                <GlowButton type="submit" variant="primary" size="sm" disabled={isChangingEmail}>
                  {isChangingEmail ? "MENGUBAH..." : "GANTI EMAIL"}
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
