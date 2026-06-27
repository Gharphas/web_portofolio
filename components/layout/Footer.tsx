"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { SiX, SiInstagram, SiYoutube } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border pt-12 pb-6 overflow-hidden transition-colors duration-300 perf-section">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-950/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-6">
          
          {/* Left Column (Logo & Description & Socials) - spans 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="font-heading text-lg font-bold tracking-wider text-foreground">
              {SITE_CONFIG.name.toUpperCase()}
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-sans">
              JemiArian is the modern and intuitive way to model & protect your digital products.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted hover:border-foreground/30 flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
              >
                <SiX className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted hover:border-foreground/30 flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
              >
                <SiInstagram className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted hover:border-foreground/30 flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
              >
                <SiYoutube className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted hover:border-foreground/30 flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
              >
                <FaLinkedin className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Columns (Links Columns) - spans 7 cols */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 w-full">
            
            {/* Column 1: Product */}
            <div className="flex flex-col gap-4 w-full border-t border-border pt-5">
              <h4 className="font-heading text-sm font-semibold tracking-wider text-foreground">
                Product
              </h4>
              <div className="flex flex-col gap-3">
                <Link href="#projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                  Product Updates
                </Link>
              </div>
            </div>

            {/* Column 2: Resources */}
            <div className="flex flex-col gap-4 w-full border-t border-border pt-5">
              <h4 className="font-heading text-sm font-semibold tracking-wider text-foreground">
                Resources
              </h4>
              <div className="flex flex-col gap-3">
                <Link href="#about" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                  Customer stories
                </Link>
                <Link href="#gallery" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                  Product docs
                </Link>
              </div>
            </div>

            {/* Column 3: Company */}
            <div className="flex flex-col gap-4 w-full border-t border-border pt-5">
              <h4 className="font-heading text-sm font-semibold tracking-wider text-foreground">
                Company
              </h4>
              <div className="flex flex-col gap-3">
                <Link href="#about" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                  About
                </Link>
                <div className="flex items-center gap-2">
                  <Link href="#about" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                    Careers
                  </Link>
                  <span className="text-[8px] bg-muted text-muted-foreground font-sans tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full border border-border whitespace-nowrap">
                    WE'RE HIRING
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ───── Middle Large Outline Logo/Text (HOWITZER style) ───── */}
        <div className="relative w-full py-6 md:py-8 border-y border-border select-none overflow-hidden flex justify-center my-1">
          <span 
            className="font-sans font-light tracking-[0.3em] text-center leading-none text-[11.5vw] md:text-[10vw] uppercase pointer-events-none select-none transition-all duration-300 bg-gradient-to-b from-foreground/20 via-foreground/5 to-transparent bg-clip-text text-transparent"
            style={{
              WebkitTextStroke: "1px var(--foreground, rgba(255, 255, 255, 0.25))",
              opacity: 0.25,
            }}
          >
            {SITE_CONFIG.name}
          </span>
        </div>

        {/* ───── Footer Bottom Row ───── */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/60">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:text-muted-foreground transition-colors font-sans">
              Security
            </Link>
            <Link href="#" className="hover:text-muted-foreground transition-colors font-sans">
              Terms of service
            </Link>
            <Link href="#" className="hover:text-muted-foreground transition-colors font-sans">
              Privacy policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
