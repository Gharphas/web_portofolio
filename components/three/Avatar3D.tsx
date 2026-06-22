"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface CropConfig {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Symmetrical 1:1.6 aspect ratio crops to prevent ANY distortion
const CROPS: Record<string, CropConfig> = {
  front: { x: 234, y: 160, w: 350, h: 560 },
  frontLeft: { x: 64, y: 80, w: 231, h: 370 },
  frontRight: { x: 522, y: 80, w: 231, h: 370 },
  rear: { x: 82, y: 505, w: 196, h: 315 },
  profile: { x: 577, y: 505, w: 196, h: 315 },
};

export function Avatar3D({ color = "#FF1744" }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pedestalRef1 = useRef<THREE.Mesh>(null);
  const pedestalRef2 = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const texturesRef = useRef<Record<string, THREE.CanvasTexture>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/avatar_sheet.png";
    img.onload = () => {
      // Configuration for high-fidelity hologram transparency
      const featherX = 3.5;
      const featherY = 2.5;
      const bgThreshold = 180;
      const bgTolerance = 30;

      const newTextures: Record<string, THREE.CanvasTexture> = {};

      Object.entries(CROPS).forEach(([key, config]) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = config.w;
        canvas.height = config.h;

        // Draw cropped section
        ctx.drawImage(
          img,
          config.x,
          config.y,
          config.w,
          config.h,
          0,
          0,
          config.w,
          config.h
        );

        // Apply advanced feathering + luminance keying
        try {
          const imgData = ctx.getImageData(0, 0, config.w, config.h);
          const data = imgData.data;
          const w = config.w;
          const h = config.h;

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = (y * w + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              let alpha = data[idx + 3];

              // 1. Lightness check for studio background removal
              const lum = r * 0.299 + g * 0.587 + b * 0.114;
              if (lum > bgThreshold) {
                const diff = lum - bgThreshold;
                if (diff >= bgTolerance) {
                  alpha = 0;
                } else {
                  alpha = Math.round((1 - diff / bgTolerance) * 255);
                }
              }

              // 2. Soft Edge Feathering (radial-linear falloff)
              const distX = Math.abs(x - w / 2) / (w / 2); // 0 (center) to 1 (left/right edge)
              const distY = (h - y) / h;                  // 0 (bottom) to 1 (top edge)

              const fadeX = Math.max(0, 1 - Math.pow(distX, featherX));
              const fadeY = Math.max(0, 1 - Math.pow(distY, featherY));

              const finalAlpha = Math.min(alpha, Math.round(fadeX * fadeY * 255));
              data[idx + 3] = finalAlpha;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (e) {
          console.error("Canvas read error:", e);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        newTextures[key] = texture;
      });

      // Mirror the profile view for the other side
      if (newTextures.profile) {
        const profileCanvas = newTextures.profile.image as HTMLCanvasElement;
        const mirroredCanvas = document.createElement("canvas");
        mirroredCanvas.width = profileCanvas.width;
        mirroredCanvas.height = profileCanvas.height;
        const mirroredCtx = mirroredCanvas.getContext("2d");
        if (mirroredCtx) {
          mirroredCtx.translate(profileCanvas.width, 0);
          mirroredCtx.scale(-1, 1);
          mirroredCtx.drawImage(profileCanvas, 0, 0);
          
          const mirroredTexture = new THREE.CanvasTexture(mirroredCanvas);
          mirroredTexture.colorSpace = THREE.SRGBColorSpace;
          newTextures.profileMirrored = mirroredTexture;
        }
      }

      texturesRef.current = newTextures;
      setLoaded(true);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate pedestal elements for high-end kinetic 3D look
    if (pedestalRef1.current) {
      pedestalRef1.current.rotation.y = time * 0.15;
    }
    if (pedestalRef2.current) {
      pedestalRef2.current.rotation.y = -time * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.25;
    }

    if (!loaded || !meshRef.current || !materialRef.current) return;

    const camera = state.camera;
    const mesh = meshRef.current;
    
    // Y-Axis Billboarding: Rotate only on Y axis to face the camera
    const dx = camera.position.x - mesh.position.x;
    const dz = camera.position.z - mesh.position.z;
    mesh.rotation.y = Math.atan2(dx, dz);

    // Calculate camera angle for texture swapping (theta)
    const theta = Math.atan2(camera.position.x, camera.position.z);

    let selectedTexture = texturesRef.current.front;
    const PI = Math.PI;
    const sector = PI / 8; // 22.5 degrees

    if (theta >= -sector && theta < sector) {
      selectedTexture = texturesRef.current.front;
    } else if (theta >= sector && theta < 3 * sector) {
      selectedTexture = texturesRef.current.frontLeft;
    } else if (theta >= 3 * sector && theta < 5 * sector) {
      selectedTexture = texturesRef.current.profile;
    } else if (theta >= -3 * sector && theta < -sector) {
      selectedTexture = texturesRef.current.frontRight;
    } else if (theta >= -5 * sector && theta < -3 * sector) {
      selectedTexture = texturesRef.current.profileMirrored || texturesRef.current.profile;
    } else {
      selectedTexture = texturesRef.current.rear;
    }

    if (selectedTexture && materialRef.current.map !== selectedTexture) {
      materialRef.current.map = selectedTexture;
      materialRef.current.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Pedestal Top (Sleek dark glassy/metallic cylinder) */}
      <mesh ref={pedestalRef1} position={[0, -1.6, 0]}>
        <cylinderGeometry args={[1.2, 1.25, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#121316"
          roughness={0.35}
          metalness={0.25}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive={new THREE.Color(color)}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Pedestal Base (Textured carbon base) */}
      <mesh ref={pedestalRef2} position={[0, -1.82, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.1, 32]} />
        <meshStandardMaterial
          color="#090a0c"
          roughness={0.5}
          metalness={0.15}
          emissive={new THREE.Color(color).clone().multiplyScalar(0.1)}
        />
      </mesh>

      {/* Kinetic Halo Ring */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh 
          ref={ringRef} 
          position={[0, -1.6, 0]} 
          rotation={[Math.PI / 2.2, 0, 0]}
        >
          <torusGeometry args={[1.65, 0.035, 12, 64]} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.15}
            emissive={new THREE.Color(color)}
            emissiveIntensity={2.0}
          />
        </mesh>
      </Float>

      {/* Character Plane - perfectly sized to 1.5w x 2.4h (1:1.6 Aspect Ratio) to eliminate distortion */}
      {loaded && (
        <mesh ref={meshRef} position={[0, -0.4, 0]}>
          <planeGeometry args={[1.5, 2.4]} />
          <meshBasicMaterial
            ref={materialRef}
            transparent
            side={THREE.DoubleSide}
            depthWrite={true}
          />
        </mesh>
      )}
    </group>
  );
}
