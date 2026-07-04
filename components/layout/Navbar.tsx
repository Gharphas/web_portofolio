"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import GooeyNav from "@/components/ui/GooeyNav";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Phone, Home, User, Wrench, FolderOpen, Briefcase, Mail, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/providers/LenisProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const clickScrollingRef = useRef(false);
  const clickScrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevScrollYRef = useRef(0);
  const lenis = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const resolvedLinks = useMemo(() => {
    return NAV_LINKS
      .filter((link) => !link.href.toLowerCase().includes("contact"))
      .map((link) => ({
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
      const prevScrollY = prevScrollYRef.current;
      const scrollingUp = scrollY < prevScrollY;
      prevScrollYRef.current = scrollY;

      // 1) Update scrolled state:
      //    - always true when scrollY > 10
      //    - also true when scrolling UP from anywhere (so pill style stays)
      if (scrollY <= 10) {
        setScrolled(false);
      } else if (scrollingUp || scrollY > 10) {
        setScrolled(true);
      }

      // 2) Track active section — skip during click-triggered smooth scroll
      if (clickScrollingRef.current) return;

      const navbarOffset = 100;

      // Build list of sections with their document offsets
      const sections = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, offsetTop: el.offsetTop } : null;
        })
        .filter(Boolean) as { id: string; offsetTop: number }[];

      if (sections.length === 0) return;

      // If haven't scrolled past the first section yet → hero zone, no active
      if (scrollY + navbarOffset < sections[0].offsetTop) {
        setActiveSection((prev) => (prev !== "" ? "" : prev));
        return;
      }

      // Find active: the last section whose offsetTop is <= scrollY + navbarOffset
      let currentSection = "";
      for (let i = 0; i < sections.length; i++) {
        if (scrollY + navbarOffset >= sections[i].offsetTop) {
          currentSection = sections[i].id;
        }
      }

      setActiveSection((prev) => (prev !== currentSection ? currentSection : prev));
    };

    handleScroll(); // Set initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Handle styling scroll even on non-home pages
  useEffect(() => {
    if (isHome) return;
    const handlePageScroll = () => {
      const scrollY = window.scrollY;
      const prevScrollY = prevScrollYRef.current;
      const scrollingUp = scrollY < prevScrollY;
      prevScrollYRef.current = scrollY;

      if (scrollY <= 10) {
        setScrolled(false);
      } else if (scrollingUp || scrollY > 10) {
        setScrolled(true);
      }
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:duration-300 md:ease-out",
        {
          "bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow-lg":
            scrolled && !mobileMenuOpen,
          "bg-background/90": mobileMenuOpen,
          "bg-transparent": !scrolled && !mobileMenuOpen,
        }
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:duration-300 md:ease-out",
          {
            "md:px-2": scrolled,
          }
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
        >
          <span className="font-heading text-xl font-bold tracking-wider dark:text-[#C0C0C0] text-black select-none">
            {SITE_CONFIG.name.toUpperCase()}
          </span>
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
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                const targetEl = document.getElementById("contact");
                if (targetEl && lenis) {
                  lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
                } else if (targetEl) {
                  targetEl.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
          >
            <Phone className="h-3 w-3" />
            Contact
          </GlowButton>

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
      </nav>

      {/* Mobile Navigation Overlay — zoom-in/out animation */}
      <div
        className={cn(
          "bg-background/95 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t border-border backdrop-blur-md md:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div
          data-slot={mobileMenuOpen ? "open" : "closed"}
          className={cn(
            "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 duration-200 ease-out",
            "flex h-full w-full flex-col justify-between gap-y-2 p-6"
          )}
        >
          <nav className="flex flex-col gap-3">
            {resolvedLinks.filter((link) => !link.href.includes("contact")).map((link, index) => {
              const isActive = activeIndex === index;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      handleNavClick(index);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start font-heading text-lg font-semibold tracking-wider transition-colors duration-300",
                    isActive
                      ? "text-primary text-glow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label.toUpperCase()}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3">
            <GlowButton
              href={isHome ? "#contact" : "/#contact"}
              variant="primary"
              className="w-full justify-center"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  const targetEl = document.getElementById("contact");
                  if (targetEl && lenis) {
                    lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
                  } else if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth" });
                  }
                }
                setMobileMenuOpen(false);
              }}
            >
              <Phone className="h-3 w-3" />
              Contact
            </GlowButton>
          </div>
        </div>
      </div>
    </header>
  );
}
