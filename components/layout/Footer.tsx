"use client";

import Link from "next/link";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-background border-t border-border/30 overflow-hidden py-12 md:py-16">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-crimson-glow/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Info Section */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-wider text-gradient">
                {SITE_CONFIG.name.toUpperCase()}
              </span>
              <span className="h-1 w-1 rounded-full bg-crimson animate-ping" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Membangun pengalaman web yang interaktif, bernilai estetika tinggi, dan responsif.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all text-muted-foreground hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:rian@rianpedia.com"
                className="h-8 w-8 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold tracking-wider text-foreground">
              NAVIGASI
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info Short */}
          <div className="flex flex-col gap-3 md:items-end">
            <h4 className="font-heading text-sm font-semibold tracking-wider text-foreground md:text-right">
              KONTAK & LOKASI
            </h4>
            <div className="text-xs text-muted-foreground md:text-right space-y-1">
              <p>Jakarta, Indonesia</p>
              <p className="hover:text-primary transition-colors">
                <Link href="mailto:rian@rianpedia.com">rian@rianpedia.com</Link>
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground/60">
                Punya proyek menarik? Mari berkolaborasi!
              </p>
            </div>
            
            {/* Scroll to Top */}
            <Button
              variant="outline"
              size="icon"
              onClick={scrollToTop}
              className="mt-3 h-8 w-8 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-primary transition-colors">
              Admin Area
            </Link>
            <span>•</span>
            <span>Made with Next.js & React Three Fiber</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
