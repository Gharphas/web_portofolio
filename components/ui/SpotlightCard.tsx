"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Spotlight color in rgba */
  spotlightColor?: string;
  /** Spotlight size (blur radius) */
  spotlightSize?: number;
  /** Border radius for the card */
  borderRadius?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(255, 23, 68, 0.08)",
  spotlightSize = 300,
  borderRadius = 16,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      style={{ borderRadius }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight radial gradient that follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
        style={{
          borderRadius,
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
