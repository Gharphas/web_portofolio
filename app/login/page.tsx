"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Lock, Mail, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Login Form Schema validation
const loginSchema = z.object({
  email: z.string().email({ message: "Alamat email tidak valid" }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      // Simulate API verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock credentials check
      if (data.email === "admin@jemiarian.com" && data.password === "admin123") {
        // Successful login
        localStorage.setItem("jemiarian_admin_token", "mocked_jwt_token_xyz123");
        router.push("/dashboard");
      } else {
        setAuthError("Email atau kata sandi yang Anda masukkan salah.");
      }
    } catch (err) {
      setAuthError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-background">

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-crimson-glow/10 blur-[120px] rounded-full pointer-events-none z-[1]" />

      {/* Top back link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-heading font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>KEMBALI KE BERANDA</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <GlassCard className="p-8 border-border/40 shadow-[0_0_50px_rgba(255,23,68,0.05)]">
          {/* Form Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_10px_var(--crimson-glow)]">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground">
              ADMIN LOGIN
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase">
              Masukkan Kredensial untuk Mengakses Dashboard CMS
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Auth error alert */}
            {authError && (
              <div className="p-3 text-[11px] rounded-lg border border-destructive/20 bg-destructive/10 text-destructive font-sans">
                {authError}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@jemiarian.com"
                  className="pl-10 bg-secondary/20 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-xs py-5"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-medium text-destructive mt-0.5 font-sans">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi"
                  className="pl-10 bg-secondary/20 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-xs py-5"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] font-medium text-destructive mt-0.5 font-sans">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <GlowButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>VERIFIKASI...</span>
                  </>
                ) : (
                  <span>MASUK CMS</span>
                )}
              </GlowButton>
            </div>
          </form>

          {/* Hint info */}
          <div className="mt-6 pt-4 border-t border-border/10 text-center">
            <p className="text-[10px] text-muted-foreground/60 font-sans leading-relaxed">
              Email: <span className="text-foreground font-semibold">admin@jemiarian.com</span> • Sandi: <span className="text-foreground font-semibold">admin123</span>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
