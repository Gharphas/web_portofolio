"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import { skillsData } from "@/lib/mock-data";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { usePerformanceTier, useIsInViewport } from "@/hooks/use-utils";

// Helper function to return high-fidelity SVG brand logos for each technology
function getTechIcon(name: string, color: string): React.ReactNode {
  const cleanName = name.toLowerCase().trim();

  // 1. React / React Native
  if (cleanName.includes("react")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-5 h-5 animate-spin-slow">
        <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="2" fill={color} />
      </svg>
    );
  }
  // 2. Next.js
  if (cleanName.includes("next")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16L9.5 8.5V16" stroke={color} strokeLinecap="round" />
        <path d="M14.5 8.5L16.5 10.5" stroke={color} strokeLinecap="round" />
      </svg>
    );
  }
  // 3. TypeScript
  if (cleanName.includes("typescript")) {
    return (
      <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5 rounded-[4px] shadow-[0_0_8px_rgba(49,120,198,0.25)]">
        <rect width="24" height="24" rx="4" />
        <text x="21" y="20" fill="#0A0A0F" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="end">TS</text>
      </svg>
    );
  }
  // 4. JavaScript
  if (cleanName.includes("javascript")) {
    return (
      <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5 rounded-[4px]">
        <rect width="24" height="24" rx="4" />
        <text x="21" y="20" fill="#0A0A0F" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="end">JS</text>
      </svg>
    );
  }
  // 5. Tailwind CSS
  if (cleanName.includes("tailwind")) {
    return (
      <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5">
        <path d="M12 6.002C9.288 6.002 7.712 7.352 7.288 10.05c1.08-.81 2.16-1.125 3.24-.945 1.493.248 2.56.968 3.738 1.761 1.916 1.294 4.143 2.138 6.684 2.138 2.712 0 4.288-1.35 4.712-4.048-1.08.81-2.16 1.125-3.24.945-1.493-.248-2.56-.968-3.738-1.761-1.916-1.294-4.143-2.138-6.684-2.138zm-4.712 6.046c-2.712 0-4.288 1.35-4.712 4.048 1.08-.81 2.16-1.125 3.24-.945 1.493.247 2.56.967 3.738 1.761 1.916 1.294 4.143 2.138 6.684 2.138 2.712 0 4.288-1.35 4.712-4.048-1.08.81-2.16 1.125-3.24.945-1.493-.248-2.56-.968-3.738-1.761-1.916-1.294-4.143-2.138-6.684-2.138z" />
      </svg>
    );
  }
  // 6. Node.js
  if (cleanName.includes("node")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  // 7. Express.js
  if (cleanName.includes("express")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M8 10h8M8 14h8" />
      </svg>
    );
  }
  // 8. Python
  if (cleanName.includes("python")) {
    return (
      <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5">
        <path d="M12 2c-5.5 0-5.5 2.5-5.5 2.5h2.5s0-1.5 3-1.5 3 1.5 3 1.5v2.5H9.5S7 7.5 7 10c0 2.5 2.5 2.5 2.5 2.5h5s2.5 0 2.5-2.5V7.5s0-2.5-2.5-2.5H12V2zm0 20c5.5 0 5.5-2.5 5.5-2.5h-2.5s0 1.5-3 1.5-3-1.5-3-1.5v-2.5h5.5S17 16.5 17 14c0-2.5-2.5-2.5-2.5-2.5h-5s-2.5 0-2.5 2.5v2.5s0 2.5 2.5 2.5H12V22z" />
      </svg>
    );
  }
  // 9. PostgreSQL / Databases
  if (cleanName.includes("postgres")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    );
  }
  // 10. MongoDB
  if (cleanName.includes("mongo")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }
  // 11. Supabase
  if (cleanName.includes("supabase")) {
    return (
      <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5">
        <path d="M19 10.5h-5.5L18 2h-9l-5 11.5h5.5L6 22l13-11.5z" />
      </svg>
    );
  }
  // 12. Flutter
  if (cleanName.includes("flutter")) {
    return (
      <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5">
        <path d="M14.3 2.3L5 11.6l2.3 2.3L16.6 4.6zm5.1 5.1L10.1 16.7l2.3 2.3L21.7 9.7zM6 21.7l3.4-3.4 2.3 2.3L8.3 24z" />
      </svg>
    );
  }
  // 13. Docker
  if (cleanName.includes("docker")) {
    return (
      <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5">
        <path d="M13.983 11.078h2.119c.102 0 .186-.083.186-.185V8.99c0-.102-.084-.186-.186-.186h-2.119c-.103 0-.186.084-.186.186v1.903c0 .102.083.185.186.185zM11.261 11.078h2.119c.102 0 .185-.083.185-.185V8.99c0-.102-.083-.186-.185-.186h-2.119c-.103 0-.186.084-.186.186v1.903c0 .102.083.185.186.185zM11.261 8.402h2.119c.102 0 .185-.083.185-.185V6.314c0-.101-.083-.185-.185-.185h-2.119c-.103 0-.186.084-.186.185v1.903c0 .102.083.185.186.185zM8.577 11.078h2.119c.102 0 .186-.083.186-.185V8.99c0-.102-.084-.186-.186-.186H8.577c-.102 0-.186.084-.186.186v1.903c0 .102.084.185.186.185zM8.577 8.402h2.119c.102 0 .186-.083.186-.185V6.314c0-.101-.084-.185-.186-.185H8.577c-.102 0-.186.084-.186.185v1.903c0 .102.084.185.186.185zM5.894 11.078h2.119c.103 0 .186-.083.186-.185V8.99c0-.102-.083-.186-.186-.186H5.894c-.102 0-.186.084-.186.186v1.903c0 .102.084.185.186.185zM2.2 12.5c0 3 2.5 5.5 5.5 5.5h8.5c3 0 5.5-2.5 5.5-5.5v-2h-3v2c0 1.5-1 2.5-2.5 2.5H7.7c-1.5 0-2.5-1-2.5-2.5v-2H2.2v2z" />
      </svg>
    );
  }
  // 14. Git / GitHub
  if (cleanName.includes("git")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 15V9a4 4 0 0 0-4-4H9" />
        <line x1="6" y1="9" x2="6" y2="15" />
      </svg>
    );
  }
  // 15. Figma
  if (cleanName.includes("figma")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" className="w-5 h-5">
        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" fill={color} />
        <path d="M12 2h3.5a3.5 3.5 0 0 1 0 7H12V2z" fill={color} />
        <path d="M12 9h3.5a3.5 3.5 0 0 1 0 7H12V9z" fill={color} />
        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v3.5A3.5 3.5 0 0 1 8.5 16H8.5A3.5 3.5 0 0 1 5 12.5z" fill={color} />
        <path d="M5 18.5A3.5 3.5 0 0 1 8.5 15H12v3.5A3.5 3.5 0 0 1 8.5 22H8.5A3.5 3.5 0 0 1 5 18.5z" fill={color} />
      </svg>
    );
  }
  // 16. AWS / Cloud (fallback)
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17.5 19A3.5 3.5 0 0 0 13 15.5a5 5 0 0 0-9.5-1.5A3.5 3.5 0 0 0 4.5 21H17a2 2 0 0 0 2-2z" />
    </svg>
  );
}

// Individual Word Node Component using Drei Html with premium glassmorphism & brand-specific color coding
function Word({
  children,
  color,
}: {
  children: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  // Prevent pure black color (like Next.js default brand color) from being invisible in dark mode
  const resolvedColor = color === "#000000" || color === "#000" ? "#E8E8E8" : color;

  return (
    <Html
      center
      distanceFactor={10.2} // INCREASED to make text badges larger and sharper to balance the wider orbits
      className="pointer-events-auto"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="font-heading text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider px-5 py-3 rounded-2xl border transition-all duration-500 select-none cursor-pointer flex items-center gap-3 whitespace-nowrap"
        style={{
          color: hovered ? "#FFFFFF" : "#F3F4F6",
          borderColor: hovered ? resolvedColor : `${resolvedColor}25`, // subtle brand color tint on border
          backgroundColor: hovered ? `${resolvedColor}18` : "rgba(8, 8, 12, 0.8)",
          transform: hovered ? "scale(1.12) translateY(-4px)" : "scale(1)",
          boxShadow: hovered 
            ? `0 0 35px ${resolvedColor}40, inset 0 0 12px ${resolvedColor}25` 
            : `0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 12px ${resolvedColor}08`, // subtle ambient brand glow
        }}
      >
        {/* Render the official brand-specific SVG tech logo */}
        <div className="flex items-center justify-center">
          {getTechIcon(children, resolvedColor)}
        </div>
        
        <span>{children}</span>
      </div>
    </Html>
  );
}

// Glowing Cyber Core component at the center of the sphere (with aligned Y offset)
function CentralCore({ color = "#FF1744" }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coreRef.current) {
      // Pulsing size animation
      const scale = 0.85 + Math.sin(time * 2.5) * 0.08;
      coreRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = time * 0.4;
      ringRef1.current.rotation.y = time * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = -time * 0.3;
      ringRef2.current.rotation.z = time * 0.25;
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* Central glowing core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} wireframe />
      </mesh>
      
      {/* Outer spinning orbital rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[1.0, 0.015, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.4, 0.01, 8, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>

      {/* Cybernetic holographic radar target grid base disk under the sphere (scaled to ellipse to match orbits and prevent bottom canvas clipping) */}
      <group position={[0, -1.2, 0]} scale={[1.0, 1.0, 0.62]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[0, 6.8, 64]} />
          <meshBasicMaterial color="#07070a" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[6.76, 6.8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[4.96, 5.0, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[2.96, 3.0, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Target crosshairs */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[13.6, 0.015]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, 0]}>
          <planeGeometry args={[13.6, 0.015]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
      </group>
    </group>
  );
}

interface PhysicsBadge {
  name: string;
  color: string;
  orbitIndex: number;
  theta: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rx: number;
  rz: number;
  yBase: number;
  direction: number;
  speed: number;
  xOffset: number;
  yOffset: number;
}

// Concentric Orbit Systems holding the categorized skill tags with dynamic 3D physics (bounce & overlap prevention)
function ConcentricOrbits() {
  const physicsBadges = useRef<PhysicsBadge[]>([]);
  const badgeRefs = useRef<(THREE.Group | null)[]>([]);

  // Split skills 6-6-6 into concentric orbits and initialize physics state (expanded sizes for spacious layout)
  useEffect(() => {
    const temp: PhysicsBadge[] = [];

    // 1. Inner Ring (Core/Featured Skills) - Radius X=3.6, Z=1.9, Y=0.8
    const innerSkills = skillsData.slice(0, 6);
    innerSkills.forEach((skill, i) => {
      const theta = (i / 6) * Math.PI * 2;
      const rx = 3.6;
      const rz = 1.9;
      const yBase = 0.8 + Math.sin(i * 1.5) * 0.1;
      temp.push({
        name: skill.name,
        color: skill.color || "#FF1744",
        orbitIndex: 0,
        theta,
        position: new THREE.Vector3(Math.cos(theta) * rx, yBase, Math.sin(theta) * rz),
        velocity: new THREE.Vector3(0, 0, 0),
        rx,
        rz,
        yBase,
        direction: 1,
        speed: 0.12,
        xOffset: 0,
        yOffset: 0,
      });
    });

    // 2. Middle Ring (Frameworks & Core Backend) - Radius X=5.6, Z=2.9, Y=0.0
    // Ditambahkan phase offset Math.PI / 6 (30 derajat) untuk mencegah sejajar visual dengan orbit dalam
    const middleSkills = skillsData.slice(6, 12);
    middleSkills.forEach((skill, i) => {
      const theta = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const rx = 5.6;
      const rz = 2.9;
      const yBase = 0.0 + Math.sin((i + 2) * 1.2) * 0.1;
      temp.push({
        name: skill.name,
        color: skill.color || "#FF1744",
        orbitIndex: 1,
        theta,
        position: new THREE.Vector3(Math.cos(theta) * rx, yBase, Math.sin(theta) * rz),
        velocity: new THREE.Vector3(0, 0, 0),
        rx,
        rz,
        yBase,
        direction: -1,
        speed: 0.08,
        xOffset: 0,
        yOffset: 0,
      });
    });

    // 3. Outer Ring (Mobile, DevOps & Tools) - Radius X=7.6, Z=4.0, Y=-0.8
    // Ditambahkan phase offset Math.PI / 3 (60 derajat) untuk mencegah sejajar visual dengan orbit lainnya
    const outerSkills = skillsData.slice(12, 18);
    outerSkills.forEach((skill, i) => {
      const theta = (i / 6) * Math.PI * 2 + Math.PI / 3;
      const rx = 7.6;
      const rz = 4.0;
      const yBase = -0.8 + Math.sin((i + 4) * 0.9) * 0.1;
      temp.push({
        name: skill.name,
        color: skill.color || "#FF1744",
        orbitIndex: 2,
        theta,
        position: new THREE.Vector3(Math.cos(theta) * rx, yBase, Math.sin(theta) * rz),
        velocity: new THREE.Vector3(0, 0, 0),
        rx,
        rz,
        yBase,
        direction: 1,
        speed: 0.05,
        xOffset: 0,
        yOffset: 0,
      });
    });

    physicsBadges.current = temp;
  }, []);

  // Update physics simulation (smooth orbital rotation and waving with soft-collision resolution)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const dt = Math.min(state.clock.getDelta(), 0.05); // cap dt to avoid explosions during frame drops
    if (physicsBadges.current.length === 0) return;

    const count = physicsBadges.current.length;

    // 1. Move badges along their orbits (update theta)
    physicsBadges.current.forEach((badge) => {
      badge.theta += badge.direction * badge.speed * dt;
    });

    // 2. Compute analytical base positions and screen projections
    const basePositions = physicsBadges.current.map((badge, idx) => {
      const baseX = Math.cos(badge.theta) * badge.rx;
      const baseZ = Math.sin(badge.theta) * badge.rz;
      const wave = Math.sin(time * 1.5 + badge.orbitIndex * 2.0 + idx * 0.7) * 0.15;
      const baseY = badge.yBase + wave;
      return { x: baseX, y: baseY, z: baseZ };
    });

    // Compute depths and perspective scales
    // Camera is at [0, 4.0, 11.0].
    // Forward vector is (0, -0.342, -0.940).
    // depth = -0.342 * (y - 4) - 0.940 * (z - 11)
    const scales = basePositions.map((pos) => {
      const depth = -0.342 * (pos.y - 4) - 0.940 * (pos.z - 11);
      // scale ranges from ~0.75 (back) to ~1.5 (front). Reference depth is 11.7
      return Math.max(0.5, Math.min(2.0, 11.7 / Math.max(1.0, depth)));
    });

    // Initialize vertical offsets for relaxation
    const targetOffsetY = new Array(count).fill(0);

    // Reference collision bounds (in projected screen space / units at depth=11.7)
    // Since coordinates are fully projected, these sizes represent the physical badge sizes on screen.
    const refW = 3.9;
    const refH = 1.25;

    // 3. Relaxation Loop to resolve screen-space overlaps vertically
    // 8 iterations for perfect convergence
    for (let iter = 0; iter < 4; iter++) {
      for (let i = 0; i < count; i++) {
        // Project coordinates to screen space by multiplying with perspective scale
        const posI_x = basePositions[i].x * scales[i];
        const posI_y = (basePositions[i].y * 0.940 - basePositions[i].z * 0.342 + targetOffsetY[i] * 0.940) * scales[i];

        for (let j = i + 1; j < count; j++) {
          const posJ_x = basePositions[j].x * scales[j];
          const posJ_y = (basePositions[j].y * 0.940 - basePositions[j].z * 0.342 + targetOffsetY[j] * 0.940) * scales[j];

          const dx = posI_x - posJ_x;
          const dy = posI_y - posJ_y;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          // If they overlap on both screen X and screen Y, we push them apart vertically in screen space
          if (absDx < refW && absDy < refH) {
            const overlapY = refH - absDy;
            const signY = dy >= 0 ? 1 : -1;

            const screenPushY = overlapY * 0.5;
            // Map the screen-space push back to world-space targetOffsetY (devided by cos(tilt) * scale)
            targetOffsetY[i] += screenPushY / (0.940 * scales[i]);
            targetOffsetY[j] -= screenPushY / (0.940 * scales[j]);
          }
        }
      }
    }

    // 4. Update badge offsets and interpolate position of each badge (lerp)
    physicsBadges.current.forEach((badge, idx) => {
      // Map screen-space Y offset back to 3D Y offset (offsetY_3d = offsetY_screen / cos(tilt))
      const targetYOffset = targetOffsetY[idx] / 0.940;

      // Keep horizontal offset at 0 since we resolve vertically, and lerp yOffset responsively
      badge.xOffset = THREE.MathUtils.lerp(badge.xOffset, 0, 0.1);
      badge.yOffset = THREE.MathUtils.lerp(badge.yOffset, targetYOffset, 0.25);

      // Compute final 3D target coordinates
      const targetX = basePositions[idx].x + badge.xOffset;
      const targetZ = basePositions[idx].z;
      const targetY = basePositions[idx].y + badge.yOffset;

      // Smoothly lerp badge coordinates to eliminate any jittering
      badge.position.x = THREE.MathUtils.lerp(badge.position.x, targetX, 0.1);
      badge.position.y = THREE.MathUtils.lerp(badge.position.y, targetY, 0.1);
      badge.position.z = THREE.MathUtils.lerp(badge.position.z, targetZ, 0.1);

      // Direct DOM/mesh update (bypasses React virtual DOM render cycle)
      const refGroup = badgeRefs.current[idx];
      if (refGroup) {
        refGroup.position.copy(badge.position);
      }
    });
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* ─── Inner Orbit Track (Very faint structural guideline) ─── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.8, 0]} scale={[3.6, 1.9, 1.0]} frustumCulled>
        <ringGeometry args={[0.993, 1.007, 32]} />
        <meshBasicMaterial color="#FF1744" transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>

      {/* ─── Middle Orbit Track (Very faint structural guideline) ─── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.0, 0]} scale={[5.6, 2.9, 1.0]}>
        <ringGeometry args={[0.995, 1.005, 32]} />
        <meshBasicMaterial color="#FF1744" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* ─── Outer Orbit Track (Very faint structural guideline) ─── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} scale={[7.6, 4.0, 1.0]}>
        <ringGeometry args={[0.996, 1.004, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>

      {/* ─── Floating Physics Badges (Single flat list managed by refs) ─── */}
      {skillsData.map((skill, idx) => (
        <group key={skill.id} ref={(el) => { badgeRefs.current[idx] = el; }}>
          <Word color={skill.color || "#FF1744"}>
            {skill.name}
          </Word>
        </group>
      ))}
    </group>
  );
}

export function SkillSphere() {
  const { ref, isInViewport: inViewport } = useIsInViewport(0.05);
  const [hasBeenInViewport, setHasBeenInViewport] = useState(false);
  const performanceTier = usePerformanceTier();
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const isInViewport = inViewport;

  useEffect(() => {
    if (inViewport) {
      setHasBeenInViewport(true);
    }
  }, [inViewport]);

  useEffect(() => {
    setMounted(true);

    // Cek ketersediaan WebGL di sisi klien
    try {
      const isSupported = !!window.WebGLRenderingContext;
      setWebglSupported(isSupported);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // Hanya gunakan fallback jika WebGL benar-benar tidak didukung atau terjadi context lost permanen
  const showFallback = webglSupported === false;

  if (showFallback) {
    return (
      <div className="w-full min-h-[360px] flex flex-col items-center justify-center relative select-none px-4 py-8">
        {/* Latar belakang aura pendaran cahaya neon */}
        <div className="absolute w-48 h-48 bg-primary/5 rounded-full blur-[60px] animate-pulse-glow pointer-events-none" />
        
        {/* Core tech bertumpuk dengan animasi melayang dan rotasi */}
        <div className="relative w-28 h-28 flex items-center justify-center animate-float mb-12">
          <div className="absolute w-24 h-24 rounded-full border border-primary/20 border-dashed animate-spin-slow" />
          <div className="absolute w-20 h-20 rounded-full border border-accent/30 animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }} />
          
          {/* Inti (nucleus) tengah */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_var(--crimson-glow)]">
            <span className="font-heading text-[9px] font-bold text-white tracking-widest">TECH</span>
          </div>
          
          {/* Titik orbit kecil cyber yang pulsing */}
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--crimson-glow)] animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--crimson-glow)] animate-pulse" />
        </div>

        {/* List of skills in a beautiful, responsive grid/flex container to match the WebGL look */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl relative z-10">
          {skillsData.map((skill) => {
            const color = skill.color || "#FF1744";
            const resolvedColor = color === "#000000" || color === "#000" ? "#E8E8E8" : color;
            return (
              <div
                key={skill.id}
                className="font-heading text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all duration-300 select-none cursor-pointer flex items-center gap-2.5 whitespace-nowrap bg-[rgba(8,8,12,0.8)]"
                style={{
                  color: "#F3F4F6",
                  borderColor: `${resolvedColor}25`,
                  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 8px ${resolvedColor}05`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.borderColor = resolvedColor;
                  e.currentTarget.style.backgroundColor = `${resolvedColor}15`;
                  e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 0 25px ${resolvedColor}30, inset 0 0 10px ${resolvedColor}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#F3F4F6";
                  e.currentTarget.style.borderColor = `${resolvedColor}25`;
                  e.currentTarget.style.backgroundColor = "rgba(8, 8, 12, 0.8)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 8px ${resolvedColor}05`;
                }}
              >
                <div className="flex items-center justify-center">
                  {getTechIcon(skill.name, resolvedColor)}
                </div>
                <span>{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="w-full h-[360px] sm:h-[480px] md:h-[580px] relative select-none">
      {hasBeenInViewport ? (
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          }
        >
          {/* Keep Canvas mounted but hide it visually when out of viewport */}
          <div className={isInViewport ? "w-full h-full block" : "w-full h-full hidden"}>
            <Canvas
              camera={{ position: [0, 4.0, 11.0], fov: 48 }}
              dpr={[1, performanceTier === 'desktop' ? 2 : 1.5]}
              gl={{ antialias: performanceTier === 'desktop', alpha: true }}
              style={{ overflow: "visible" }}
              className="w-full h-full"
              onCreated={({ gl }) => {
                glRef.current = gl;
                const handleContextLost = (event: Event) => {
                  event.preventDefault();
                  console.warn("WebGL context lost in SkillSphere. Falling back.");
                  setWebglSupported(false);
                };
                gl.domElement.addEventListener("webglcontextlost", handleContextLost);
              }}
            >
              <ambientLight intensity={0.65} />
              <pointLight position={[10, 15, 10]} intensity={1.2} />
              <directionalLight position={[0, 8, 5]} intensity={0.8} color="#FF1744" />
              
              {/* Smooth Floating animation applying to the whole 3D holographic structure */}
              <Float speed={1.2} rotationIntensity={0.04} floatIntensity={0.25}>
                <group position={[0, -0.35, 0]}>
                  <CentralCore color="#FF1744" />
                  <ConcentricOrbits />
                </group>
              </Float>
            </Canvas>
          </div>
          {!isInViewport && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </Suspense>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}
