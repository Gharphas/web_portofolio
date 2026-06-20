"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  className,
  align = "center",
}: SectionHeadingProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "mb-12 md:mb-16 flex flex-col gap-3",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        align === "right" && "items-end text-right",
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <motion.span
          variants={itemVariants}
          className="px-3 py-1 text-[10px] tracking-[0.2em] font-heading font-semibold uppercase rounded-full border border-primary/30 bg-primary/5 text-primary shadow-[0_0_10px_var(--crimson-glow)]"
        >
          {badge}
        </motion.span>
      )}

      {/* Main Title */}
      <motion.h2
        variants={itemVariants}
        className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground relative py-1"
      >
        {title.split(" ").map((word, i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <span
              key={i}
              className={cn(
                isLast ? "text-gradient text-glow inline-block" : "text-foreground inline-blockmr-2"
              )}
            >
              {word}
              {i < arr.length - 1 ? "\u00A0" : ""}
            </span>
          );
        })}
      </motion.h2>

      {/* Subtitle / Description */}
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="text-sm md:text-base text-muted-foreground max-w-xl font-sans mt-2"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative Line */}
      <motion.div
        variants={itemVariants}
        className={cn(
          "h-[2px] w-24 bg-gradient-to-r from-transparent via-crimson to-transparent mt-4",
          align === "left" && "bg-gradient-to-r from-crimson to-transparent origin-left",
          align === "right" && "bg-gradient-to-l from-crimson to-transparent origin-right"
        )}
      />
    </motion.div>
  );
}
