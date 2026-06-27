"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface GlowButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  glow?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  electricColor?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

const sizeClasses = {
  sm: "px-5 py-2.5 text-[10px]",
  md: "px-7 py-3.5 text-xs",
  lg: "px-9 py-4.5 text-sm",
};

const variantShimmerColor: Record<string, string> = {
  primary: "#FF1744",
  secondary: "#a8aaac",
  outline: "#FF1744",
};

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
  electricColor,
  type,
  disabled,
  onClick,
  ...props
}: GlowButtonProps) {
  const shimmerColor = electricColor || variantShimmerColor[variant] || undefined;

  const innerContent = (
    <span className="relative z-10 flex items-center justify-center gap-2 font-heading font-semibold tracking-wider uppercase">
      {children}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-full whitespace-nowrap",
          "bg-black text-white border border-white/15 shadow-[0_4px_12px_rgba(255,255,255,0.15)]",
          "dark:bg-white dark:text-black dark:border-black/15 dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]",
          "transform-gpu transition-all duration-300 ease-in-out active:translate-y-px",
          "hover:shadow-[0_12px_28px_rgba(255,255,255,0.35)] dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] hover:scale-[1.02]",
          sizeClasses[size],
          className
        )}
        style={{
          "--spread": "90deg",
          "--shimmer-color": shimmerColor || "var(--shimmer-clr)",
          "--radius": "100px",
          "--speed": "3s",
          "--cut": "0.05em",
          "--bg": "var(--shimmer-bg)",
        } as React.CSSProperties}
      >
        {/* spark container */}
        <div className="-z-30 blur-[2px] @container-[size] absolute inset-0 overflow-visible">
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {innerContent}
        <div className={cn(
          "absolute inset-0 size-full rounded-[inherit] px-4 py-1.5 text-sm font-medium",
          "shadow-[inset_0_-8px_12px_rgba(255,255,255,0.2)]",
          "group-hover:shadow-[inset_0_-6px_12px_rgba(255,255,255,0.4)]",
          "group-active:shadow-[inset_0_-10px_12px_rgba(255,255,255,0.4)]",
          "dark:shadow-[inset_0_-8px_12px_rgba(0,0,0,0.18)]",
          "dark:group-hover:shadow-[inset_0_-6px_12px_rgba(0,0,0,0.35)]",
          "dark:group-active:shadow-[inset_0_-10px_12px_rgba(0,0,0,0.35)]",
          "transform-gpu transition-all duration-300 ease-in-out",
        )} />
        <div className="absolute inset-(--cut) -z-20 rounded-full [background:var(--bg)]" />
      </Link>
    );
  }

  return (
    <ShimmerButton
      shimmerColor={shimmerColor}
      className={cn(sizeClasses[size], className)}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {innerContent}
    </ShimmerButton>
  );
}
