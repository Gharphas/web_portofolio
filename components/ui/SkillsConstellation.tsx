"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { skillsData } from "@/lib/mock-data";
import { Cpu } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiSupabase,
  SiFlutter,
  SiDocker,
  SiGit,
  SiFigma
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import ElectricBorder from "./ElectricBorder";

/* ─────────────────────────────────────────────
   Skill name to Icon mapping
   ───────────────────────────────────────────── */
const skillIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  "React.js": SiReact,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "JavaScript": SiJavascript,
  "HTML/CSS": SiHtml5,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  "Python": SiPython,
  "PostgreSQL": SiPostgresql,
  "MongoDB": SiMongodb,
  "Supabase": SiSupabase,
  "React Native": SiReact,
  "Flutter": SiFlutter,
  "Docker": SiDocker,
  "Git & GitHub": SiGit,
  "Figma": SiFigma,
  "AWS": FaAws,
};

/* ─────────────────────────────────────────────
   Category configuration
   ───────────────────────────────────────────── */
const categoryConfig: Record<string, { label: string; color: string; glowColor: string }> = {
  Frontend: { label: "Frontend", color: "#ef4444", glowColor: "rgba(239,68,68,0.4)" },
  Backend: { label: "Backend", color: "#f97316", glowColor: "rgba(249,115,22,0.4)" },
  Mobile: { label: "Mobile", color: "#a855f7", glowColor: "rgba(168,85,247,0.4)" },
  DevOps: { label: "DevOps", color: "#22d3ee", glowColor: "rgba(34,211,238,0.4)" },
  Tools: { label: "Tools", color: "#f59e0b", glowColor: "rgba(245,158,11,0.4)" },
};

/* ─────────────────────────────────────────────
   Central Hub Icon
   ───────────────────────────────────────────── */
function CentralHubIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 md:w-8 md:h-8">
      <path d="M8 20L16 24L24 20L16 16L8 20Z" stroke="url(#hubGrad)" strokeWidth="1.2" fill="rgba(239,68,68,0.06)" />
      <path d="M8 16L16 20L24 16L16 12L8 16Z" stroke="url(#hubGrad)" strokeWidth="1.2" fill="rgba(239,68,68,0.10)" />
      <path d="M8 12L16 16L24 12L16 8L8 12Z" stroke="url(#hubGrad)" strokeWidth="1.2" fill="rgba(239,68,68,0.16)" />
      <defs>
        <linearGradient id="hubGrad" x1="8" y1="8" x2="24" y2="24">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Skill Node Component
   ───────────────────────────────────────────── */
function SkillNode({
  skill,
  index,
  isVisible,
  isHovered,
  onHover,
  onLeave,
  nodeSize,
}: {
  skill: (typeof skillsData)[0];
  index: number;
  isVisible: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  nodeSize: number;
}) {
  const cat = categoryConfig[skill.category] || categoryConfig.Frontend;
  const accentColor = cat.color;
  const IconComponent = skillIcons[skill.name] || Cpu;

  return (
    <div
      className="group flex flex-col items-center gap-1.5 md:gap-2 cursor-pointer"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? isHovered
            ? "scale(1.08) translateY(-4px)"
            : "scale(1)"
          : "scale(0.5) translateY(20px)",
        transition: `all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        transitionDelay: isVisible ? `${index * 35 + 100}ms` : "0ms",
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Node circle wrapper with ElectricBorder */}
      <ElectricBorder
        color={skill.color === "#000000" ? "#ffffff" : skill.color}
        borderRadius={nodeSize / 2}
        speed={0.8}
        chaos={0.06}
        width={nodeSize}
        height={nodeSize}
        style={{
          width: nodeSize,
          height: nodeSize,
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isHovered
              ? `linear-gradient(145deg, rgba(35,10,15,0.97), rgba(15,5,8,0.99))`
              : `linear-gradient(145deg, rgba(18,6,10,0.94), rgba(10,3,5,0.97))`,
          }}
        >
          {/* Technology Brand Logo Icon */}
          <IconComponent
            className="w-6 h-6 md:w-8 md:h-8 transition-all duration-300 flex items-center justify-center"
            style={{
              color: skill.color === "#000000" ? (isHovered ? "#ffffff" : "#e0e0e0") : skill.color,
              filter: isHovered
                ? `drop-shadow(0 0 8px ${skill.color === "#000000" ? "#ffffff" : skill.color}90)`
                : `drop-shadow(0 0 3px ${skill.color === "#000000" ? "#e0e0e0" : skill.color}50)`,
            }}
          />
        </div>
      </ElectricBorder>

      {/* Skill name label */}
      <span
        className="text-[9px] md:text-[10px] font-heading font-semibold uppercase tracking-[0.12em] transition-all duration-300 whitespace-nowrap text-center pointer-events-none"
        style={{
          color: isHovered ? "#ffffff" : `${accentColor}cc`,
          textShadow: isHovered ? `0 0 16px ${cat.glowColor}` : "none",
        }}
      >
        {skill.name}
      </span>
    </div>
  );
}


/* ─────────────────────────────────────────────
   SkillsConstellation – main component
   ───────────────────────────────────────────── */
export function SkillsConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Intersection observer for entry animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { width, height } = dimensions;
  const cx = width / 2;
  const cy = height / 2;
  const isMobile = width < 640;

  // Sort skills into category groups for orbital rings
  const { innerRing, outerRing } = useMemo(() => {
    const featured = skillsData.filter(s => s.isFeatured);
    const others = skillsData.filter(s => !s.isFeatured);
    return { innerRing: featured, outerRing: others };
  }, []);

  // Padding so nodes + labels never touch the edge
  const pad = isMobile ? 65 : 60;

  // Compute node positions: inner ring (featured) + outer ring (others)
  const constellationData = useMemo(() => {
    if (width === 0 || height === 0) {
      return { nodePositions: [], innerRx: 0, innerRy: 0, outerRx: 0, outerRy: 0 };
    }

    const usableW = width - pad * 2;
    const usableH = height - pad * 2;

    // Calculate radii based on device size (desktop vs mobile)
    // Sideways and vertically expanded for a balanced and spacious layout
    const innerRx = isMobile ? usableW * 0.32 : Math.min(usableW * 0.30, 420);
    const innerRy = isMobile ? usableH * 0.28 : Math.min(usableH * 0.30, 310);

    const outerRx = isMobile ? usableW * 0.46 : Math.min(usableW * 0.44, 720);
    const outerRy = isMobile ? usableH * 0.42 : Math.min(usableH * 0.44, 450);

    const positions: Array<(typeof skillsData)[0] & { x: number; y: number; ring: "inner" | "outer" }> = [];

    // Inner ring - featured skills (closer to center)
    innerRing.forEach((skill, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / innerRing.length;
      const rawX = cx + Math.cos(angle) * innerRx;
      const rawY = cy + Math.sin(angle) * innerRy;
      positions.push({
        ...skill,
        x: Math.max(pad, Math.min(width - pad, rawX)),
        y: Math.max(pad, Math.min(height - pad, rawY)),
        ring: "inner",
      });
    });

    // Find the offset for the outer ring that maximizes the minimum angle difference
    // to prevent alignment and radial overlaps
    let bestOffset = 0;
    let maxMinDiff = 0;
    const steps = 60;
    for (let s = 0; s < steps; s++) {
      const offset = (s * 2 * Math.PI) / steps;
      let minDiff = 2 * Math.PI;
      for (let i = 0; i < innerRing.length; i++) {
        const innerAngle = -Math.PI / 2 + (2 * Math.PI * i) / innerRing.length;
        for (let j = 0; j < outerRing.length; j++) {
          const outerAngle = -Math.PI / 2 + offset + (2 * Math.PI * j) / outerRing.length;
          let diff = Math.abs((innerAngle - outerAngle) % (2 * Math.PI));
          if (diff > Math.PI) diff = 2 * Math.PI - diff;
          if (diff < minDiff) minDiff = diff;
        }
      }
      if (minDiff > maxMinDiff) {
        maxMinDiff = minDiff;
        bestOffset = offset;
      }
    }

    // Outer ring - other skills
    outerRing.forEach((skill, i) => {
      const angle = -Math.PI / 2 + bestOffset + (2 * Math.PI * i) / outerRing.length;
      const rawX = cx + Math.cos(angle) * outerRx;
      const rawY = cy + Math.sin(angle) * outerRy;
      positions.push({
        ...skill,
        x: Math.max(pad, Math.min(width - pad, rawX)),
        y: Math.max(pad, Math.min(height - pad, rawY)),
        ring: "outer",
      });
    });

    // Run iterative relaxation to push nodes apart if they overlap / are too close
    // Because labels are horizontal, we need larger horizontal spacing (minDx) than vertical (minDy)
    const minDx = isMobile ? 95 : 140;
    const minDy = isMobile ? 65 : 95;
    const relaxationIterations = 25;

    for (let iter = 0; iter < relaxationIterations; iter++) {
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const nodeA = positions[i];
          const nodeB = positions[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          if (absDx < minDx && absDy < minDy) {
            const overlapX = minDx - absDx;
            const overlapY = minDy - absDy;

            // Push apart along the axis of smaller overlap
            if (overlapX < overlapY) {
              const pushX = overlapX * (dx > 0 ? 0.5 : -0.5) * 0.5;
              nodeA.x -= pushX;
              nodeB.x += pushX;
            } else {
              const pushY = overlapY * (dy > 0 ? 0.5 : -0.5) * 0.5;
              nodeA.y -= pushY;
              nodeB.y += pushY;
            }
          }
        }
      }

      // Clamp coordinates to stay inside boundaries and respect center hub distance
      positions.forEach(node => {
        node.x = Math.max(pad, Math.min(width - pad, node.x));
        node.y = Math.max(pad + 10, Math.min(height - pad - 10, node.y));

        const hdx = node.x - cx;
        const hdy = node.y - cy;
        const hdist = Math.sqrt(hdx * hdx + hdy * hdy);
        const minHubDist = isMobile ? 85 : 130;
        if (hdist < minHubDist) {
          const angle = hdist > 0 ? Math.atan2(hdy, hdx) : Math.random() * Math.PI * 2;
          node.x = cx + Math.cos(angle) * minHubDist;
          node.y = cy + Math.sin(angle) * minHubDist;
        }
      });
    }

    // ─── Line-avoidance pass ───
    // For each connection line (center → node i), ensure no other node j
    // sits on top of it. If the perpendicular distance from node j's center
    // to the line (cx,cy)→(node i) is smaller than the node radius + margin,
    // push node j away perpendicularly.
    const avoidRadius = isMobile ? 30 : 42; // half nodeSize + margin
    const avoidPasses = 4;

    for (let pass = 0; pass < avoidPasses; pass++) {
      for (let i = 0; i < positions.length; i++) {
        // Line from center to node i
        const lx = positions[i].x - cx;
        const ly = positions[i].y - cy;
        const lineLen = Math.sqrt(lx * lx + ly * ly);
        if (lineLen < 1) continue;

        // Unit direction along the line
        const ux = lx / lineLen;
        const uy = ly / lineLen;

        for (let j = 0; j < positions.length; j++) {
          if (i === j) continue;

          // Vector from center to node j
          const jx = positions[j].x - cx;
          const jy = positions[j].y - cy;

          // Projection of j onto the line i (scalar)
          const proj = jx * ux + jy * uy;

          // Only care if j is between center and node i (not beyond)
          if (proj < avoidRadius || proj > lineLen - avoidRadius) continue;

          // Perpendicular distance from j to the line
          const perpX = jx - proj * ux;
          const perpY = jy - proj * uy;
          const perpDist = Math.sqrt(perpX * perpX + perpY * perpY);

          if (perpDist < avoidRadius) {
            // Push j away perpendicularly
            const pushDir = perpDist > 0.01 ? 1 : (Math.random() > 0.5 ? 1 : -1);
            const pushMag = (avoidRadius - perpDist) * 0.6;
            const nx = perpDist > 0.01 ? perpX / perpDist : -uy;
            const ny = perpDist > 0.01 ? perpY / perpDist : ux;

            positions[j].x += nx * pushMag * pushDir;
            positions[j].y += ny * pushMag * pushDir;

            // Keep inside boundaries
            positions[j].x = Math.max(pad, Math.min(width - pad, positions[j].x));
            positions[j].y = Math.max(pad + 10, Math.min(height - pad - 10, positions[j].y));
          }
        }
      }
    }

    return { nodePositions: positions, innerRx, innerRy, outerRx, outerRy };
  }, [width, height, cx, cy, isMobile, innerRing, outerRing, pad]);

  const { nodePositions, innerRx, innerRy, outerRx, outerRy } = constellationData;

  const nodeSize = isMobile ? 46 : 64;

  /* ─── Canvas animation for flowing lines ─── */
  const drawFlowingLines = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      ctx.clearRect(0, 0, width, height);
      if (!isVisible || width === 0) return;

      const hubRadius = isMobile ? 28 : 36;

      // Helper to draw jagged electric bolts
      const drawLightningArc = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: string,
        lineWidth: number = 1.2
      ) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) return;

        ctx.beginPath();
        ctx.moveTo(x1, y1);

        const nx = -dy / dist;
        const ny = dx / dist;

        // Number of segments based on length
        const segments = Math.max(3, Math.floor(dist / 6));
        
        for (let i = 1; i < segments; i++) {
          const frac = i / segments;
          const bx = x1 + dx * frac;
          const by = y1 + dy * frac;
          // Random offset (electric jitter)
          const offset = (Math.random() - 0.5) * 5;
          ctx.lineTo(bx + nx * offset, by + ny * offset);
        }
        
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.stroke();
      };

      // Draw orbital ring guides (subtle)
      const drawOrbitRing = (rx: number, ry: number, alpha: number) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // Draw inner and outer orbit rings using the shared radii
      drawOrbitRing(innerRx, innerRy, 0.08);
      drawOrbitRing(outerRx, outerRy, 0.05);

      // Draw connection lines from center to each node
      nodePositions.forEach((node, i) => {
        const dx = node.x - cx;
        const dy = node.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = hoveredId === node.id;
        const cat = categoryConfig[node.category] || categoryConfig.Frontend;

        // Midpoint (straight line)
        const cpX = cx + dx * 0.5;
        const cpY = cy + dy * 0.5;

        // Base line gradient — brighter and more visible
        const grad = ctx.createLinearGradient(cx, cy, node.x, node.y);

        if (isHovered) {
          const col = cat.color;
          grad.addColorStop(0, `${col}ff`);
          grad.addColorStop(0.35, `${col}cc`);
          grad.addColorStop(1, `${col}88`);
        } else {
          const isInner = node.ring === "inner";
          const baseAlpha = isInner ? 0.35 : 0.22;
          grad.addColorStop(0, `rgba(239, 68, 68, ${baseAlpha * 0.5})`);
          grad.addColorStop(0.4, `rgba(239, 68, 68, ${baseAlpha})`);
          grad.addColorStop(1, `rgba(239, 68, 68, ${baseAlpha + 0.1})`);
        }

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cpX, cpY, node.x, node.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isHovered ? 2 : 1.1;
        ctx.stroke();

        // Glow layer on hover
        if (isHovered) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.quadraticCurveTo(cpX, cpY, node.x, node.y);
          const glowGrad = ctx.createLinearGradient(cx, cy, node.x, node.y);
          glowGrad.addColorStop(0, `${cat.color}44`);
          glowGrad.addColorStop(1, `${cat.color}00`);
          ctx.strokeStyle = glowGrad;
          ctx.lineWidth = 6;
          ctx.stroke();
        }

        // ─── Flowing energy particles (REVERSED: node → center) ───
        const speed = isHovered ? 0.5 : 0.18 + (i % 4) * 0.03;
        const particleCount = isHovered ? 4 : 2;

        for (let p = 0; p < particleCount; p++) {
          // t goes 0→1 but we reverse start/end: 0 = node, 1 = center
          const phase = ((time * speed + (p / particleCount) + (i * 0.13)) % 1);
          const t = phase;

          // Quadratic Bézier from NODE to CENTER (reversed)
          const px = (1 - t) * (1 - t) * node.x + 2 * (1 - t) * t * cpX + t * t * cx;
          const py = (1 - t) * (1 - t) * node.y + 2 * (1 - t) * t * cpY + t * t * cy;

          // Trail behind the particle (in the direction it came from, i.e. toward node)
          const trailLen = dist * 0.08;
          const ts = Math.max(0, t - trailLen / dist);
          const trailX = (1 - ts) * (1 - ts) * node.x + 2 * (1 - ts) * ts * cpX + ts * ts * cx;
          const trailY = (1 - ts) * (1 - ts) * node.y + 2 * (1 - ts) * ts * cpY + ts * ts * cy;

          const pGrad = ctx.createLinearGradient(trailX, trailY, px, py);
          const alpha = isHovered ? 0.9 : 0.55;
          const particleColor = isHovered ? cat.color : "#ef4444";
          pGrad.addColorStop(0, `${particleColor}00`);
          pGrad.addColorStop(0.5, `${particleColor}${Math.round(alpha * 120).toString(16).padStart(2, '0')}`);
          pGrad.addColorStop(1, `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);

          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(px, py);
          ctx.strokeStyle = pGrad;
          ctx.lineWidth = isHovered ? 2.5 : 1.5;
          ctx.lineCap = "round";
          ctx.stroke();

          // Bright dot at head of particle
          ctx.beginPath();
          ctx.arc(px, py, isHovered ? 2.5 : 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 220, 220, ${alpha})`;
          ctx.fill();

          // ─── ELECTRIC DISCHARGE INTO THE CENTRAL HUB ───
          // If the particle is getting close to the central hub, make it trigger lightning arcs
          const pDist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
          if (pDist < hubRadius + 16) {
            const angle = Math.atan2(py - cy, px - cx);
            const hx = cx + Math.cos(angle) * hubRadius;
            const hy = cy + Math.sin(angle) * hubRadius;
            
            // Choose lightning color (white-blue or category color)
            const sparkColor = isHovered 
              ? `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})` 
              : `${cat.color}${Math.round(0.3 + Math.random() * 0.7 * 255).toString(16).padStart(2, '0')}`;
              
            drawLightningArc(px, py, hx, hy, sparkColor, isHovered ? 1.5 : 1.0);

            // Tiny impact flash on the hub border
            if (Math.random() > 0.6) {
              ctx.beginPath();
              ctx.arc(hx, hy, Math.random() * 2 + 1, 0, Math.PI * 2);
              ctx.fillStyle = isHovered ? "#ffffff" : cat.color;
              ctx.fill();
            }
          }
        }
      });

      // Central glow
      const glowRadius = isMobile ? 80 : 140;
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
      centerGlow.addColorStop(0, "rgba(220, 20, 40, 0.20)");
      centerGlow.addColorStop(0.3, "rgba(180, 20, 30, 0.08)");
      centerGlow.addColorStop(0.6, "rgba(120, 10, 15, 0.02)");
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);
    },
    [width, height, cx, cy, nodePositions, innerRx, innerRy, outerRx, outerRy, hoveredId, isVisible, isMobile, pad]
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      drawFlowingLines(ctx, elapsed);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [width, height, drawFlowingLines]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none bg-background transition-colors duration-300"
      style={{
        height: isMobile ? "750px" : "950px",
        maxHeight: "95vh",
      }}
    >
      {width > 0 && height > 0 && (
        <>
          {/* ───── Canvas Layer ───── */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          />

          {/* ───── Central Hub Node ───── */}
          <div
            className={`absolute z-20 flex items-center justify-center transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{
              left: cx - (isMobile ? 28 : 36),
              top: cy - (isMobile ? 28 : 36),
              width: isMobile ? 56 : 72,
              height: isMobile ? 56 : 72,
            }}
          >
            <div
              className="relative w-full h-full rounded-full flex items-center justify-center bg-background/95 border-2 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2),_inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden"
            >
              {/* Visual Radial Glow behind the icon */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12)_0%,transparent_70%)] pointer-events-none" />
              <div className="animate-pulse flex items-center justify-center z-[2]">
                <CentralHubIcon />
              </div>
            </div>
          </div>

          {/* ───── Skill Nodes (positioned absolutely) ───── */}
          {nodePositions.map((node, i) => {
            const half = nodeSize / 2;
            return (
              <div
                key={node.id}
                className="absolute z-10"
                style={{
                  left: node.x - half,
                  top: node.y - half - 10,
                }}
              >
                <SkillNode
                  skill={node}
                  index={i}
                  isVisible={isVisible}
                  isHovered={hoveredId === node.id}
                  onHover={() => setHoveredId(node.id)}
                  onLeave={() => setHoveredId(null)}
                  nodeSize={nodeSize}
                />
              </div>
            );
          })}

        </>
      )}
    </div>
  );
}
