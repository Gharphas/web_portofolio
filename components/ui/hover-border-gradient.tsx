"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface HoverBorderGradientProps {
  children?: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: "button" | "a" | "div";
  duration?: number;
  clockwise?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as = "button",
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (current: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const idx = directions.indexOf(current);
    if (clockwise) {
      return directions[(idx + 1) % directions.length];
    }
    return directions[(idx - 1 + directions.length) % directions.length];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.16% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  const outerClasses = cn(
    "relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 dark:hover:bg-white/10 items-center flex-col flex-nowrap gap-10 h-fit justify-center overflow-visible p-[1px] w-fit decoration-clone",
    containerClassName
  );

  const innerContent = (
    <>
      <div
        className={cn(
          "w-auto text-white z-10 bg-black dark:bg-white dark:text-black px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-black dark:bg-white absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </>
  );

  if (as === "a") {
    return (
      <a
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={outerClasses}
        {...props}
      >
        {innerContent}
      </a>
    );
  }

  if (as === "div") {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={outerClasses}
        {...props}
      >
        {innerContent}
      </div>
    );
  }

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={outerClasses}
      {...props}
    >
      {innerContent}
    </button>
  );
}
