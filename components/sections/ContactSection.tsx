"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { publicApi } from "@/lib/api";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, Github, Linkedin, Twitter, AlertCircle } from "lucide-react";

// Form Validation Schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  subject: z.string().min(3, { message: "Subjek harus minimal 3 karakter" }),
  message: z.string().min(10, { message: "Pesan harus minimal 10 karakter" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await publicApi.sendContactMessage(data);
      
      if (result.success) {
        setSubmitSuccess(true);
        reset();
        // Reset success state after a few seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(result.error?.message || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (err: any) {
      setSubmitError("Terjadi kesalahan jaringan. Periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-crimson-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Hubungi Saya"
          subtitle="Punya pertanyaan atau ingin berkolaborasi dalam proyek baru? Silakan kirim pesan melalui formulir di bawah ini."
          badge="Contact"
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
          {/* Info Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <GlassCard className="p-6 md:p-8 space-y-6 border-border/40">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Detail Kontak
              </h3>

              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Silakan hubungi saya melalui email, nomor telepon, atau kunjungi alamat saya. Saya akan berusaha membalas pesan Anda dalam 24 jam.
              </p>

              {/* Direct links */}
              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center gap-3.5 text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground/60 uppercase font-semibold">Email</p>
                    <a href="mailto:jemiarian@jemiarian.com" className="hover:text-primary transition-colors font-semibold text-foreground">
                      jemiarian@jemiarian.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground/60 uppercase font-semibold">Telepon</p>
                    <a href="tel:+6281234567890" className="hover:text-primary transition-colors font-semibold text-foreground">
                      +62 812 3456 7890
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground/60 uppercase font-semibold">Lokasi</p>
                    <p className="font-semibold text-foreground">Palembang, Indonesia</p>
                  </div>
                </div>
              </div>

              {/* Social Channels shortcut */}
              <div className="pt-4 border-t border-border/15">
                <p className="text-[10px] text-muted-foreground/60 uppercase font-semibold mb-3">Sosial Media</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6 md:p-8 border-border/40">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-4"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Pesan Terkirim!
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                      Terima kasih telah menghubungi saya. Pesan Anda telah diterima dan akan segera saya balas melalui email yang diberikan.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* API Error Alert */}
                  {submitError && (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-[11px] font-sans">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                      Nama Lengkap
                    </label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama Anda"
                      className="bg-secondary/20 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-xs"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-[10px] font-medium text-destructive mt-0.5 font-sans">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                      Alamat Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contoh@domain.com"
                      className="bg-secondary/20 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-xs"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-[10px] font-medium text-destructive mt-0.5 font-sans">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-1">
                    <label htmlFor="subject" className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                      Subjek Pesan
                    </label>
                    <Input
                      id="subject"
                      placeholder="Apa keperluan Anda?"
                      className="bg-secondary/20 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-xs"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-[10px] font-medium text-destructive mt-0.5 font-sans">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1">
                    <label htmlFor="message" className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                      Isi Pesan
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan lengkap Anda di sini..."
                      rows={5}
                      className="bg-secondary/20 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-xs resize-none"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-[10px] font-medium text-destructive mt-0.5 font-sans">
                        {errors.message.message}
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
                          <span>MENGIRIM...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>KIRIM PESAN</span>
                        </>
                      )}
                    </GlowButton>
                  </div>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
