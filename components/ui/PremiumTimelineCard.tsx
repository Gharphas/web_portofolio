"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const CardHoverContext = createContext<{ isHovered: boolean; rotation: { x: number; y: number } }>({
  isHovered: false,
  rotation: { x: 0, y: 0 }
});

export const useCardHover = () => useContext(CardHoverContext);

interface PremiumTimelineCardProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumTimelineCard({ children, className }: PremiumTimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark" || resolvedTheme === undefined;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();

      // Calculate mouse position relative to card center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate rotation (limited range for subtle effect)
      const rotateX = -(y / rect.height) * 4; // Max 4 degrees rotation
      const rotateY = (x / rect.width) * 4; // Max 4 degrees rotation

      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <CardHoverContext.Provider value={{ isHovered, rotation }}>
      <motion.div
        ref={cardRef}
        className={cn(
          "relative rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-300",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          backgroundColor: isDark ? "#05070c" : "#ffffff",
          border: isDark ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: isDark
            ? (isHovered && !isMobile
                ? "0 -10px 80px 10px rgba(239, 68, 68, 0.15), 0 0 15px 0 rgba(0, 0, 0, 0.6)"
                : "0 -5px 40px 5px rgba(239, 68, 68, 0.05), 0 0 10px 0 rgba(0, 0, 0, 0.4)")
            : (isHovered && !isMobile
                ? "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)"
                : "0 10px 20px -10px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)"),
        }}
        initial={{ y: 0 }}
        animate={{
          y: isHovered && !isMobile ? -6 : 0,
          rotateX: isMobile ? 0 : rotation.x,
          rotateY: isMobile ? 0 : rotation.y,
          perspective: 1200,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 22
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Subtle glass reflection overlay */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(1px)",
          }}
          animate={{
            opacity: isHovered && !isMobile ? 0.7 : 0.5,
            rotateX: isMobile ? 0 : -rotation.x * 0.2,
            rotateY: isMobile ? 0 : -rotation.y * 0.2,
            z: 1,
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        />

        {/* Dark background with black gradient */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(180deg, #000000 0%, #030712 100%)"
              : "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          }}
          animate={{
            z: -1
          }}
        />

        {/* Noise texture overlay */}
        <motion.div
          className="absolute inset-0 mix-blend-overlay z-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          animate={{
            opacity: isDark ? 0.22 : 0.06,
            z: -0.5
          }}
        />

        {/* Subtle finger smudge texture for realism */}
        <motion.div
          className="absolute inset-0 mix-blend-soft-light z-11 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='smudge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23smudge)'/%3E%3C/svg%3E")`,
            backdropFilter: "blur(0.5px)",
          }}
          animate={{
            opacity: isDark ? 0.05 : 0.01,
            z: -0.25
          }}
        />

        {/* Red/silver glow effect matching the requested theme */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2/3 z-20 pointer-events-none"
          style={{
            background: isDark
              ? `
                radial-gradient(ellipse at bottom right, rgba(160, 174, 192, 0.35) -10%, rgba(160, 174, 192, 0) 70%),
                radial-gradient(ellipse at bottom left, rgba(239, 68, 68, 0.35) -10%, rgba(239, 68, 68, 0) 70%)
              `
              : `
                radial-gradient(ellipse at bottom right, rgba(160, 174, 192, 0.08) -10%, rgba(160, 174, 192, 0) 70%),
                radial-gradient(ellipse at bottom left, rgba(239, 68, 68, 0.08) -10%, rgba(239, 68, 68, 0) 70%)
              `,
            filter: "blur(40px)",
          }}
          animate={{
            opacity: isHovered ? (isDark ? 0.85 : 0.4) : (isDark ? 0.6 : 0.25),
            y: isHovered && !isMobile ? rotation.x * 0.4 : 0,
            z: 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        />

        {/* Central red glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2/3 z-21 pointer-events-none"
          style={{
            background: isDark
              ? `radial-gradient(circle at bottom center, rgba(220, 38, 38, 0.35) -20%, rgba(220, 38, 38, 0) 60%)`
              : `radial-gradient(circle at bottom center, rgba(239, 68, 68, 0.08) -20%, rgba(239, 68, 68, 0) 60%)`,
            filter: "blur(45px)",
          }}
          animate={{
            opacity: isHovered ? (isDark ? 0.8 : 0.4) : (isDark ? 0.55 : 0.2),
            y: isHovered && !isMobile ? `calc(10% + ${rotation.x * 0.3}px)` : "10%",
            z: 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        />

        {/* Enhanced bottom border glow for premium look */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] z-25 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(226, 232, 240, 0.1) 100%)"
              : "linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.4) 50%, rgba(239, 68, 68, 0.05) 100%)",
          }}
          animate={{
            boxShadow: isDark
              ? (isHovered
                  ? "0 0 15px 3px rgba(239, 68, 68, 0.7), 0 0 25px 5px rgba(203, 213, 225, 0.5), 0 0 30px 6px rgba(255, 255, 255, 0.4)"
                  : "0 0 10px 2px rgba(239, 68, 68, 0.4), 0 0 15px 3px rgba(203, 213, 225, 0.3), 0 0 20px 4px rgba(255, 255, 255, 0.2)")
              : (isHovered
                  ? "0 0 10px 1px rgba(239, 68, 68, 0.3), 0 0 15px 2px rgba(239, 68, 68, 0.15)"
                  : "0 0 5px 0.5px rgba(239, 68, 68, 0.15)"),
            opacity: isHovered ? 1 : 0.8,
            z: 0.5
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        />

        {/* Border glow side lines */}
        <motion.div
          className="absolute bottom-0 left-0 h-1/4 w-[1px] z-25 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to top, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 80%)"
              : "linear-gradient(to top, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0) 80%)",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.7,
            z: 0.5
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-1/4 w-[1px] z-25 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to top, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 80%)"
              : "linear-gradient(to top, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0) 80%)",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.7,
            z: 0.5
          }}
        />

        {/* Inner Content Wrapper with 3D translation */}
        <motion.div
          className="relative flex flex-col h-full z-40 w-full"
          animate={{
            z: isHovered && !isMobile ? 12 : 2,
            rotateX: isHovered && !isMobile ? -rotation.x * 0.25 : 0,
            rotateY: isHovered && !isMobile ? -rotation.y * 0.25 : 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </CardHoverContext.Provider>
  );
}

interface PremiumCardIconProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumCardIcon({ children, className }: PremiumCardIconProps) {
  const { isHovered, rotation } = useCardHover();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark" || resolvedTheme === undefined;

  return (
    <motion.div
      className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden transition-colors duration-300",
        className
      )}
      style={{
        background: isDark
          ? "linear-gradient(225deg, #2a1215 0%, #17191d 100%)"
          : "linear-gradient(225deg, #fef2f2 0%, #f3f4f6 100%)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(0, 0, 0, 0.08)",
      }}
      animate={{
        boxShadow: isDark
          ? (isHovered && !isMobile
              ? "0 8px 16px -2px rgba(0, 0, 0, 0.4), 0 4px 8px -1px rgba(0, 0, 0, 0.3), inset 2px 2px 5px rgba(255, 255, 255, 0.15), inset -2px -2px 5px rgba(0, 0, 0, 0.7)"
              : "0 6px 12px -2px rgba(0, 0, 0, 0.3), 0 3px 6px -1px rgba(0, 0, 0, 0.2), inset 1px 1px 3px rgba(255, 255, 255, 0.1), inset -2px -2px 4px rgba(0, 0, 0, 0.5)")
          : (isHovered && !isMobile
              ? "0 8px 16px -2px rgba(0, 0, 0, 0.08), 0 4px 8px -1px rgba(0, 0, 0, 0.04), inset 2px 2px 5px rgba(255, 255, 255, 0.6), inset -2px -2px 5px rgba(0, 0, 0, 0.1)"
              : "0 4px 8px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03), inset 1px 1px 3px rgba(255, 255, 255, 0.5), inset -2px -2px 4px rgba(0, 0, 0, 0.08)"),
        z: isHovered && !isMobile ? 15 : 5,
        y: isHovered && !isMobile ? -3 : 0,
        rotateX: isHovered && !isMobile ? -rotation.x * 0.4 : 0,
        rotateY: isHovered && !isMobile ? -rotation.y * 0.4 : 0
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      {/* Top-left highlight for realistic lighting */}
      <div
        className="absolute top-0 left-0 w-2/3 h-2/3 opacity-30 pointer-events-none blur-[6px]"
        style={{
          background: isDark
            ? "radial-gradient(circle at top left, rgba(255, 255, 255, 0.4), transparent 80%)"
            : "radial-gradient(circle at top left, rgba(255, 255, 255, 0.8), transparent 80%)",
        }}
      />

      {/* Bottom shadow for depth */}
      <div
        className="absolute bottom-0 left-0 w-full h-1/2 opacity-40 pointer-events-none backdrop-blur-[1px]"
        style={{
          background: isDark
            ? "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)"
            : "linear-gradient(to top, rgba(0, 0, 0, 0.08), transparent)",
        }}
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
