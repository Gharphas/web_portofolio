"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { DecryptedText } from "@/components/ui/DecryptedText";

interface TimelineCardProps {
  children: ReactNode;
  index?: number;
  className?: string;
  /** Color accent for the gradient border */
  accentColor?: string;
  /** Whether this is the currently active/featured card */
  isCurrent?: boolean;
}

export function TimelineCard({
  children,
  index = 0,
  className,
  accentColor = "rgba(255,23,68,0.15)",
  isCurrent = false,
}: TimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 400, damping: 40 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 400, damping: 40 });

  // Spotlight
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  // Glare
  const glareX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
    setSpotlightPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  const staggerDelay = index * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, scale: 0.97 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: staggerDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        ref={cardRef}
        className={cn("relative", className)}
        style={{ perspective: 900 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full"
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            scale: isHovered ? 1.02 : 1,
            transformStyle: "preserve-3d",
            transition: isHovered ? undefined : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Gradient border wrapper */}
          <div className={cn(
            "relative rounded-xl p-[1px] transition-all duration-500",
            isCurrent
              ? "bg-gradient-to-br from-primary/60 via-accent/30 to-primary/40"
              : "bg-gradient-to-br from-border/50 via-border/20 to-border/50",
            isHovered && !isCurrent && "from-primary/40 via-accent/20 to-primary/40",
            isCurrent && "shadow-[0_0_25px_rgba(255,23,68,0.12)]"
          )}>
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
              initial={false}
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)]"
                animate={isHovered ? { x: ["-100%", "200%"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.5, ease: "linear" }}
              />
            </motion.div>

            {/* Card body */}
            <div className="relative bg-card rounded-xl overflow-hidden">
              {/* Spotlight overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-20 rounded-xl"
                style={{
                  background: `radial-gradient(250px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${accentColor}, transparent 40%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Card content */}
              <div className="relative z-10 p-6">
                {children}
              </div>
            </div>
          </div>

          {/* Glare shine overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-30 rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.08 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
              style={{
                x: glareX,
                y: glareY,
                background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 50%)",
                transform: "translate(-50%, -50%)",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Re-export DecryptedText for convenience */
export { DecryptedText };
