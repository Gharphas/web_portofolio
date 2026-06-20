"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Create an animated version of Next.js Link
const MotionLink = motion.create ? motion.create(Link) : motion(Link);

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  glow?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
}

export function GlowButton({
  children,
  variant = "primary",
  glow = true,
  className,
  size = "md",
  href,
  download,
  target,
  rel,
  ...props
}: GlowButtonProps) {
  const commonClasses = cn(
    "relative rounded-full font-heading font-semibold tracking-wider text-xs uppercase cursor-pointer select-none overflow-hidden transition-all duration-300 inline-flex items-center justify-center",
    // Sizes
    size === "sm" && "px-5 py-2.5 text-[10px]",
    size === "md" && "px-7 py-3.5 text-xs",
    size === "lg" && "px-9 py-4.5 text-sm",
    // Primary (Gradient Crimson)
    variant === "primary" &&
      "bg-gradient-to-r from-crimson to-accent text-white border border-transparent shadow-[0_0_15px_rgba(220,20,60,0.2)] hover:shadow-[0_0_25px_var(--crimson-glow)]",
    // Secondary (Silver Glass)
    variant === "secondary" &&
      "bg-secondary/40 backdrop-blur-sm border border-border/80 text-foreground hover:bg-secondary/70 hover:border-primary/40",
    // Outline (Glow outline)
    variant === "outline" &&
      "bg-transparent border border-primary text-primary hover:bg-primary/10 shadow-[inset_0_0_6px_var(--crimson-glow)] hover:shadow-[inset_0_0_12px_var(--crimson-glow),0_0_15px_var(--crimson-glow)]",
    className
  );

  const sharedContent = (
    <>
      {/* Light sweep element */}
      {variant === "primary" && (
        <span className="absolute inset-0 block h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[grid-line_1.5s_ease-out_infinite] pointer-events-none" />
      )}

      {/* Decorative gradient border for secondary/outline */}
      {variant !== "primary" && (
        <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-primary via-transparent to-accent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <MotionLink
        href={href}
        download={download as any}
        target={target}
        rel={rel}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={commonClasses}
        {...(props as any)}
      >
        {sharedContent}
      </MotionLink>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={commonClasses}
      {...props}
    >
      {sharedContent}
    </motion.button>
  );
}
