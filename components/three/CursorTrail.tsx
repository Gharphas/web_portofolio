"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { usePerformanceTier } from "@/hooks/use-utils";

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const performanceTier = usePerformanceTier();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Disable cursor trail di mobile dan tablet — tidak ada cursor
    if (performanceTier !== "desktop") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let points: { x: number; y: number; age: number }[] = [];
    const maxAge = 25; // Dikurangi dari 40 — trail lebih pendek, lebih ringan
    let mouse = { x: -1000, y: -1000 };

    // Frame throttling ke ~30fps
    let lastFrameTime = 0;
    const targetFrameInterval = 1000 / 30;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      points.push({ x: mouse.x, y: mouse.y, age: 0 });
    };

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Throttle ke 30fps
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < targetFrameInterval) return;
      lastFrameTime = currentTime - (elapsed % targetFrameInterval);

      // Pause saat tab tidak aktif
      if (document.hidden) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update points age
      points.forEach((p) => p.age++);
      points = points.filter((p) => p.age < maxAge);

      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        // Fading Crimson glow — tanpa shadowBlur (mahal di Canvas 2D)
        const glowColor = theme === "dark" ? "rgba(255, 23, 68, 0.4)" : "rgba(220, 20, 60, 0.25)";
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // shadowBlur dihapus — sangat mahal
        ctx.stroke();

        // Inner core of the trail
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(220, 20, 60, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme, performanceTier, mounted]);

  if (!mounted) return null;

  // Tidak render canvas di mobile/tablet — hemat memori sepenuhnya
  if (performanceTier !== "desktop") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-50 pointer-events-none"
    />
  );
}
