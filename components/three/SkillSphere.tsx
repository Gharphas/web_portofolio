"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { skillsData } from "@/lib/mock-data";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

// Individual Word Node Component using Drei Html for maximum React 19 stability & Web3 styling
function Word({
  children,
  position,
  color,
}: {
  children: string;
  position: THREE.Vector3;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Html
      position={position}
      center
      distanceFactor={4.5} // Scales text size based on 3D distance from camera for depth effect
      className="pointer-events-auto"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="font-heading text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-sm whitespace-nowrap transition-all duration-300 select-none cursor-pointer"
        style={{
          color: hovered ? "#FF1744" : color,
          borderColor: hovered ? "rgba(255, 23, 68, 0.5)" : "rgba(255, 255, 255, 0.12)",
          backgroundColor: hovered ? "rgba(255, 23, 68, 0.15)" : "rgba(10, 10, 15, 0.65)",
          transform: hovered ? "scale(1.2) translateY(-2px)" : "scale(1)",
          boxShadow: hovered 
            ? "0 0 15px rgba(255, 23, 68, 0.4), inset 0 0 5px rgba(255, 23, 68, 0.2)" 
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </div>
    </Html>
  );
}

// Group of Words forming a Sphere
function Cloud({ count = 20, radius = 2.4 }) {
  const groupRef = useRef<THREE.Group>(null);
  const [words, setWords] = useState<[THREE.Vector3, string, string][]>([]);

  useEffect(() => {
    // Select skill names to display
    const skillsToDisplay = skillsData.slice(0, count);
    const tempWords: [THREE.Vector3, string, string][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

    for (let i = 0; i < skillsToDisplay.length; i++) {
      // Fibonacci sphere distribution
      const y = 1 - (i / (skillsToDisplay.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const position = new THREE.Vector3(x * radius, y * radius, z * radius);
      
      // Determine font color based on skill category
      let color = "#C0C0C0";
      if (skillsToDisplay[i].category === "Frontend") color = "#FF2D55";
      else if (skillsToDisplay[i].category === "Backend") color = "#E8E8E8";
      
      tempWords.push([position, skillsToDisplay[i].name, color]);
    }
    setWords(tempWords);
  }, [count, radius]);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the word cloud slowly
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {words.map(([pos, word, col], idx) => (
        <Word key={idx} position={pos} color={col}>
          {word}
        </Word>
      ))}
    </group>
  );
}

export function SkillSphere() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] sm:h-[400px] md:h-[450px] relative select-none">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Cloud count={18} radius={2.2} />
        </Canvas>
      </Suspense>
    </div>
  );
}
