"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import GooeyNav from "@/components/ui/GooeyNav";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ShieldAlert, Sparkles, Home, User, Wrench, FolderOpen, Briefcase, Mail } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/providers/LenisProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const clickScrollingRef = useRef(false);
  const clickScrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lenis = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const resolvedLinks = useMemo(() => {
    return NAV_LINKS.map((link) => ({
      ...link,
      href: `/${link.href}`,
    }));
  }, []);

  // Consolidated single scroll listener for both styling and active section tracking
  useEffect(() => {
    if (!isHome) return;
    const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""));

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // 1) Update scrolled state for navbar styling
      setScrolled(scrollY > 20);

      // 2) Track active section — skip during click-triggered smooth scroll
      if (clickScrollingRef.current) return;

      const viewportHeight = window.innerHeight;
      const navbarOffset = 100;

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

    handleScroll(); // Set initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Handle styling scroll even on non-home pages
  useEffect(() => {
    if (isHome) return;
    const handlePageScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handlePageScroll();
    window.addEventListener("scroll", handlePageScroll, { passive: true });
    return () => window.removeEventListener("scroll", handlePageScroll);
  }, [isHome]);

  // Handle auto scroll to section on page load or when navigating from other pages to home
  useEffect(() => {
    if (!isHome || !lenis) return;

    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetId = hash.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        // Immediately set the active section state
        setActiveSection(targetId);

        // Suppress scroll tracking during this scroll
        clickScrollingRef.current = true;
        clearTimeout(clickScrollTimerRef.current);
        clickScrollTimerRef.current = setTimeout(() => {
          clickScrollingRef.current = false;
        }, 1500);

        // Use a short timeout to let the DOM settle (especially Next.js rendering)
        const timer = setTimeout(() => {
          lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
        }, 200);

        return () => clearTimeout(timer);
      }
    };

    // Run on mount or when pathname/lenis changes
    handleInitialHash();

    // Listen to hashchange events in case hash changes
    window.addEventListener("hashchange", handleInitialHash);
    return () => {
      window.removeEventListener("hashchange", handleInitialHash);
    };
  }, [isHome, lenis, pathname]);

  // When a nav link is clicked, smoothly scroll using Lenis and suppress scroll tracking
  const handleNavClick = useCallback((index: number) => {
    if (!isHome) return;
    const targetId = NAV_LINKS[index]?.href.replace("#", "");
    if (!targetId) return;

    // Immediately activate the clicked section
    setActiveSection(targetId);

    // Suppress scroll tracking during smooth scroll animation
    clickScrollingRef.current = true;
    clearTimeout(clickScrollTimerRef.current);
    clickScrollTimerRef.current = setTimeout(() => {
      clickScrollingRef.current = false;
    }, 1200);

    // Use Lenis for smooth scrolling to the target section
    const targetEl = document.getElementById(targetId);
    if (targetEl && lenis) {
      lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
    } else if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isHome, lenis]);

  // Find the index of the currently active section or match active subpage
  const activeIndex = useMemo(() => {
    if (isHome) {
      return NAV_LINKS.findIndex((link) => link.href.replace("#", "") === activeSection);
    }
    // On subpages, match the pathname with the NAV_LINK href/label
    return NAV_LINKS.findIndex((link) => {
      const section = link.href.replace("#", "");
      return pathname.startsWith(`/${section}`);
    });
  }, [isHome, activeSection, pathname]);

  const mobileNavIcons = useMemo(() => [
    { label: "Home", href: "#hero", icon: Home },
    { label: "About", href: "#about", icon: User },
    { label: "Skills", href: "#skills", icon: Wrench },
    { label: "Projects", href: "#projects", icon: FolderOpen },
    { label: "Experience", href: "#experience", icon: Briefcase },
    { label: "Contact", href: "#contact", icon: Mail },
  ], []);

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
            <GooeyNav items={resolvedLinks} activeIndex={activeIndex} onChange={handleNavClick} />
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Hire Me CTA — Scroll to Contact */}
            <GlowButton
              href={isHome ? "#contact" : "/#contact"}
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
              {resolvedLinks.map((link, index) => {
                const isActive = activeIndex === index;
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
                        if (isHome) {
                          handleNavClick(index);
                        }
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
