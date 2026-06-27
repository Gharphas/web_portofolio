"use client";

import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform, type SpringOptions } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max rotation in degrees on X/Y axis */
  maxTilt?: number;
  /** Spring config for smooth return */
  spring?: SpringOptions;
  /** Scale on hover */
  hoverScale?: number;
  /** Glare overlay opacity */
  glareOpacity?: number;
  /** Enable/disable the glare shine effect */
  showGlare?: boolean;
  /** Border radius for the card */
  borderRadius?: number;
}

export function TiltedCard({
  children,
  className,
  style,
  maxTilt = 8,
  spring = { stiffness: 300, damping: 30 },
  hoverScale = 1.02,
  glareOpacity = 0.15,
  showGlare = true,
  borderRadius = 16,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, spring);
  const springRotateY = useSpring(rotateY, spring);

  // Glare position transforms
  const glareX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseX.set(x);
      mouseY.set(y);

      const tiltX = (0.5 - y) * maxTilt * 2;
      const tiltY = (x - 0.5) * maxTilt * 2;

      rotateX.set(tiltX);
      rotateY.set(tiltY);
    },
    [maxTilt, rotateX, rotateY, mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [rotateX, rotateY, mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative", className)}
      style={{
        perspective: 800,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: isHovered ? hoverScale : 1,
          borderRadius,
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {/* Glare effect */}
        {showGlare && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30 rounded-[inherit] overflow-hidden"
            style={{ borderRadius }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? glareOpacity : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
              style={{
                x: glareX,
                y: glareY,
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 60%)",
                transform: "translate(-50%, -50%)",
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
