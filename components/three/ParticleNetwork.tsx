"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { usePerformanceTier } from "@/hooks/use-utils";
import { PARTICLE_COUNT } from "@/lib/constants";

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const performanceTier = usePerformanceTier();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0, radius: 150 };

    // Get particle count based on performance tier
    const particleCount: number = PARTICLE_COUNT[performanceTier] ?? 60;

    // Jika partikel = 0 (mobile), skip animasi sepenuhnya
    if (particleCount <= 0) return;

    // Frame throttling ke ~30fps untuk hemat CPU
    let lastFrameTime = 0;
    const targetFrameInterval = 1000 / 30; // 30fps

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseSize: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseSize = Math.random() * 2 + 1;
        this.size = this.baseSize;
        this.color = theme === "dark" ? "rgba(255, 23, 68, 0.45)" : "rgba(220, 20, 60, 0.35)";
      }

      update() {
        // Edge bouncing
        if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas!.height) this.vy = -this.vy;

        this.x += this.vx;
        this.y += this.vy;

        // Interaction with mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 1.5;
          this.y -= (dy / distance) * force * 1.5;
          this.size = this.baseSize * (1 + force * 1.5);
        } else {
          this.size = this.baseSize;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        // shadowBlur dihapus — sangat mahal di Canvas 2D, terutama mobile
        ctx!.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
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

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      drawConnections();
    };

    const drawConnections = () => {
      const maxDistance = 80; // Dikurangi dari 110 — mengurangi O(n²) computation
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            if (theme === "dark") {
              ctx.strokeStyle = `rgba(255, 23, 68, ${alpha})`;
            } else {
              ctx.strokeStyle = `rgba(220, 20, 60, ${alpha * 0.7})`;
            }
            
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    // touchmove dihapus — tidak berguna untuk particle interaction di mobile
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme, performanceTier, mounted]);

  if (!mounted) return null;

  // Di mobile (particleCount = 0), tampilkan gradient ringan sebagai pengganti
  if (PARTICLE_COUNT[performanceTier] === 0) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-primary/3 rounded-full blur-[60px]" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 dark:opacity-55"
    />
  );
}
