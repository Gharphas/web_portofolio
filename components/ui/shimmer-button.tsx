import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor,
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor || "var(--shimmer-clr)",
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background || "var(--shimmer-bg)",
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] px-6 py-3 whitespace-nowrap",
          "bg-black text-white border border-white/15 shadow-[0_4px_12px_rgba(255,255,255,0.15)]",
          "dark:bg-white dark:text-black dark:border-black/15 dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]",
          "transform-gpu transition-all duration-300 ease-in-out active:translate-y-px",
          "hover:shadow-[0_12px_28px_rgba(255,255,255,0.35)] dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] hover:scale-[1.02]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "@container-[size] absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",
            "rounded-[inherit] px-4 py-1.5 text-sm font-medium",
            "shadow-[inset_0_-8px_12px_rgba(255,255,255,0.2)]",
            "group-hover:shadow-[inset_0_-6px_12px_rgba(255,255,255,0.4)]",
            "group-active:shadow-[inset_0_-10px_12px_rgba(255,255,255,0.4)]",
            "dark:shadow-[inset_0_-8px_12px_rgba(0,0,0,0.18)]",
            "dark:group-hover:shadow-[inset_0_-6px_12px_rgba(0,0,0,0.35)]",
            "dark:group-active:shadow-[inset_0_-10px_12px_rgba(0,0,0,0.35)]",
            "transform-gpu transition-all duration-300 ease-in-out",
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
