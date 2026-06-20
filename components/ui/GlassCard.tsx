"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  glow?: boolean;
  hoverGlow?: boolean;
  className?: string;
  animateHover?: boolean;
}

export function GlassCard({
  children,
  glow = false,
  hoverGlow = true,
  className,
  animateHover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        animateHover
          ? {
              y: -5,
              scale: 1.01,
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
      className={cn(
        "glass-card relative overflow-hidden transition-all duration-300",
        glow && "glow-crimson-sm border-primary/30",
        hoverGlow && "hover:glow-crimson-sm hover:border-primary/40",
        className
      )}
      {...props}
    >
      {/* Decorative gradient corner element */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-tr-[inherit]" />

      {/* Decorative gradient line at the top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

      {/* Card Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
