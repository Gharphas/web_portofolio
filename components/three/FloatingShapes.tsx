"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";

export function FloatingShapes() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const icosahedronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate shapes slowly
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.1;
      sphereRef.current.rotation.x = time * 0.05;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = -time * 0.15;
      torusRef.current.rotation.y = time * 0.2;
    }
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.y = -time * 0.1;
      icosahedronRef.current.rotation.z = time * 0.15;
    }
  });

  return (
    <group>
      {/* Ambient Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FF1744" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#C0C0C0" />
      <pointLight position={[0, 0, 5]} intensity={1} color="#FF2D55" />

      {/* Main Distorted Sphere */}
      <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5}>
        <Sphere ref={sphereRef} args={[1.6, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#FF1744"
            clearcoat={1.0}
            clearcoatRoughness={0.15}
            roughness={0.1}
            metalness={0.9}
            distort={0.4}
            speed={2}
          />
        </Sphere>
      </Float>

      {/* Floating Torus Ring */}
      <Float speed={2.5} rotationIntensity={1.8} floatIntensity={2}>
        <mesh ref={torusRef} position={[2.8, 1.5, -1]}>
          <torusGeometry args={[0.7, 0.2, 16, 100]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </Float>

      {/* Floating Icosahedron */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.8}>
        <mesh ref={icosahedronRef} position={[-2.8, -1.5, -0.5]}>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial
            color="#FF2D55"
            wireframe
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}
