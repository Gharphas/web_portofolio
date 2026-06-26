"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import GooeyNav from "@/components/ui/GooeyNav";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ShieldAlert, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const clickScrollingRef = useRef(false);
  const clickScrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Track scroll position to change background styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section on scroll — uses scroll position instead of
  // IntersectionObserver so that short sections (e.g. Skills) are never skipped.
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""));

    const handleScrollActive = () => {
      // Skip scroll-based updates while a click-triggered smooth scroll is in progress
      if (clickScrollingRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const navbarOffset = 100; // Height of the fixed navbar + some buffer

      // If near the bottom of the page, activate the last section
      if (scrollY + viewportHeight >= document.documentElement.scrollHeight - 50) {
        const lastId = sectionIds[sectionIds.length - 1];
        setActiveSection((prev) => (prev !== lastId ? lastId : prev));
        return;
      }

      // Find the section whose top is closest to (but above) the trigger line
      let currentSection = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= navbarOffset) {
            currentSection = id;
          }
        }
      }

      if (currentSection) {
        setActiveSection((prev) => (prev !== currentSection ? currentSection : prev));
      }
    };

    handleScrollActive(); // Set initial state
    window.addEventListener("scroll", handleScrollActive, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollActive);
  }, []);

  // When a nav link is clicked, immediately set the target section and
  // suppress scroll-based tracking until the smooth scroll finishes.
  const handleNavClick = useCallback((index: number) => {
    const targetId = NAV_LINKS[index]?.href.replace("#", "");
    if (!targetId) return;

    // Immediately activate the clicked section
    setActiveSection(targetId);

    // Suppress scroll tracking during smooth scroll animation
    clickScrollingRef.current = true;
    clearTimeout(clickScrollTimerRef.current);
    clickScrollTimerRef.current = setTimeout(() => {
      clickScrollingRef.current = false;
    }, 1000); // 1s is enough for smooth scroll to complete
  }, []);

  // Find the index of the currently active section
  const activeIndex = NAV_LINKS.findIndex((link) => link.href.replace("#", "") === activeSection);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "py-3 bg-background/70 backdrop-blur-md border-b border-border/40 shadow-sm"
            : "py-5 bg-transparent"
        )}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-heading text-xl font-bold tracking-wider text-gradient select-none">
              {SITE_CONFIG.name.toUpperCase()}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <GooeyNav items={NAV_LINKS} activeIndex={activeIndex} onChange={handleNavClick} />
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Hire Me CTA — Scroll to Contact */}
            <GlowButton
              href="#contact"
              variant="primary"
              size="sm"
              className="hidden md:inline-flex items-center gap-1.5 px-5"
            >
              <Sparkles className="h-3 w-3" />
              Hire Me
            </GlowButton>

            {/* Admin shortcut button */}
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "hidden lg:flex h-8 w-8 border border-border/30 hover:border-primary/30 text-muted-foreground hover:text-foreground rounded-full"
              )}
              title="Admin Panel"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-full border border-border/50 hover:border-primary/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-md md:hidden flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col gap-6 text-center">
              {NAV_LINKS.map((link, index) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => {
                        handleNavClick(index);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "font-heading text-2xl font-semibold tracking-wider transition-colors duration-300",
                        isActive
                          ? "text-primary text-glow"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label.toUpperCase()}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                className="mt-4 pt-6 border-t border-border/30"
              >
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-heading text-lg font-medium tracking-wide text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="h-4 w-4" />
                  ADMIN PANEL
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
