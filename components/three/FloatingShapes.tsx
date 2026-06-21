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
      sphereRef.current.rotation.y = time * 0.12;
      sphereRef.current.rotation.x = time * 0.06;
    }
    if (torusRef.current) {
      // Rotation for Saturn-like orbit ring
      torusRef.current.rotation.z = time * 0.15;
    }
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.y = -time * 0.2;
      icosahedronRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group>
      {/* 1. Ambient Light for soft overall illumination */}
      <ambientLight intensity={0.5} />

      {/* 2. Key directional lights to sculpt the shapes and create shadow depth */}
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#FF1744" />
      <directionalLight position={[-5, -8, -5]} intensity={1.2} color="#ffffff" />

      {/* 3. Point Lights positioned close to create highly reflective specular highlights */}
      {/* White specular highlight on the upper right edge */}
      <pointLight position={[2.5, 3, 3.5]} intensity={5} color="#ffffff" distance={10} decay={1.5} />
      {/* Red neon specular highlight on the lower left edge */}
      <pointLight position={[-2.5, -3, 3]} intensity={4} color="#FF1744" distance={10} decay={1.5} />

      {/* 4. Main Futuristic Distorted Blob Sphere */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
        <Sphere ref={sphereRef} args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#FF1744"
            emissive="#1a0002" // Subtle deep crimson emission for glowing effect
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            roughness={0.22} // Perfect balance for glossy specular highlights without HDR env
            metalness={0.55} // Mix metallic feel with the rich base crimson color
            distort={0.35}
            speed={2.5}
          />
        </Sphere>
      </Float>

      {/* 5. Saturn-like Silver Orbit Ring (Centered & Tilted) */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh 
          ref={torusRef} 
          position={[0, 0, 0]} 
          rotation={[Math.PI / 2.5, Math.PI / 6, 0]} // Tilted Saturn angle
        >
          <torusGeometry args={[1.8, 0.08, 16, 100]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.7}
            roughness={0.15}
            emissive="#0d0d14"
          />
        </mesh>
      </Float>

      {/* 6. Floating Icosahedron Wireframe */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.2}>
        <mesh ref={icosahedronRef} position={[1.4, -1.2, 0.8]}>
          <icosahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial
            color="#FF2D55"
            wireframe
            metalness={0.6}
            roughness={0.2}
            emissive="#300208"
          />
        </mesh>
      </Float>
    </group>
  );
}
