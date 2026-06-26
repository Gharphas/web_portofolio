"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import BorderGlow from "@/components/ui/BorderGlow";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  glow?: boolean;
  hoverGlow?: boolean;
  className?: string;
  animateHover?: boolean;
}

function splitClassName(className?: string) {
  if (!className) return { layoutClasses: "", contentClasses: "" };

  const words = className.split(/\s+/);
  const layoutPatterns = [
    /^(col|row)-span/,
    /^h-/,
    /^w-/,
    /^(max|min)-[wh]-/,
    /^flex/,
    /^grow/,
    /^shrink/,
    /^basis/,
    /^grid/,
    /^gap/,
    /^(absolute|relative|fixed|sticky)$/,
    /^(top|bottom|left|right|inset|z)-/,
    /^m[xytrbl]?-/,
  ];

  const layout: string[] = [];
  const content: string[] = [];

  words.forEach(word => {
    // Strip responsive prefix (e.g. md:) to test the base class
    const parts = word.split(":");
    const baseClass = parts[parts.length - 1];

    if (layoutPatterns.some(pattern => pattern.test(baseClass))) {
      layout.push(word);
    } else {
      content.push(word);
    }
  });

  return {
    layoutClasses: layout.join(" "),
    contentClasses: content.join(" "),
  };
}

export function GlassCard({
  children,
  glow = false,
  hoverGlow = true,
  className,
  animateHover = true,
  ...props
}: GlassCardProps) {
  const { layoutClasses, contentClasses } = splitClassName(className);

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
      className={cn("w-full flex flex-col", layoutClasses)}
      {...props}
    >
      <BorderGlow
        edgeSensitivity={30}
        glowColor="0 80 60"
        backgroundColor="var(--card)"
        borderRadius={12}
        glowRadius={30}
        glowIntensity={0.8}
        coneSpread={25}
        animated={false}
        colors={["#FF1744", "#a8aaac", "#680000"]}
        className="w-full h-full"
      >
        <div
          className={cn(
            "glass-card-solid relative overflow-hidden transition-all duration-300 w-full h-full flex flex-col",
            glow && "glow-crimson-sm",
            contentClasses
          )}
        >
          {/* Decorative gradient line at the top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

          {/* Card Content Wrapper */}
          <div className="relative z-10 w-full h-full flex flex-col">
            {children}
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  );
}
