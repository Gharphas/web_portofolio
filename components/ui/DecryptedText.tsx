"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface DecryptedTextProps {
  text: string;
  className?: string;
  /** Characters used for the scramble effect */
  charset?: string;
  /** Animation speed in ms per character */
  speed?: number;
  /** Trigger: 'hover' or 'view' (on scroll into view) */
  trigger?: "hover" | "view" | "always";
  /** Whether to animate once or repeatedly */
  repeat?: boolean;
  /** Delay before animation starts (ms) */
  delay?: number;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}";

export function DecryptedText({
  text,
  className,
  charset = DEFAULT_CHARSET,
  speed = 40,
  trigger = "hover",
  repeat = false,
  delay = 0,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [, setIsActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  const scramble = useCallback(() => {
    let iteration = 0;
    const totalIterations = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
          continue;
        }
        if (i < iteration) {
          result += text[i];
        } else {
          result += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      setDisplayText(result);
      iteration += 1 / 2;

      if (iteration >= totalIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  }, [text, charset, speed]);

  // Hover trigger
  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      setIsActive(true);
      scramble();
    }
  }, [trigger, scramble]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover" && repeat) {
      setIsActive(false);
    }
  }, [trigger, repeat]);

  // View trigger
  useEffect(() => {
    if (trigger !== "view") return;
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimatedRef.current || repeat) {
            hasAnimatedRef.current = true;
            setTimeout(() => scramble(), delay);
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, scramble, repeat, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      ref={elementRef}
      className={cn("inline-block font-mono", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}
