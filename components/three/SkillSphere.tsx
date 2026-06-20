"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { skillsData } from "@/lib/mock-data";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

// Individual Word Node Component
function Word({
  children,
  position,
  color,
}: {
  children: string;
  position: THREE.Vector3;
  color: string;
}) {
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  // Make the text always face the camera
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.28}
      color={hovered ? "#FF1744" : color}
      font="/fonts/Orbitron-Bold.ttf" // Optional fallback, R3F uses default sans-serif font if missing
      anchorX="center"
      anchorY="middle"
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      scale={hovered ? 1.25 : 1}
    >
      {children}
    </Text>
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
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.06;
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
