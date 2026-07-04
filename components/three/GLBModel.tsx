"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface GLBModelProps {
  url: string;
  wireframe: boolean;
  color?: string;
  autoRotate?: boolean;
  disablePointer?: boolean;
}

// Utility function to key out near-black background pixels from GLB textures
function makeTextureTransparent(originalTexture: THREE.Texture): THREE.Texture {
  const image = originalTexture.image as HTMLImageElement;
  if (!image) return originalTexture;

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return originalTexture;

  // Draw original texture
  ctx.drawImage(image, 0, 0);

  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Threshold for black background removal (very dark gray or black)
    const threshold = 15;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If pixel is close to black, make it fully transparent
      if (r < threshold && g < threshold && b < threshold) {
        data[i + 3] = 0; // Alpha = 0
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.error("Failed to key texture transparency:", e);
    return originalTexture;
  }

  const newTexture = new THREE.CanvasTexture(canvas);
  newTexture.colorSpace = originalTexture.colorSpace;
  newTexture.wrapS = originalTexture.wrapS;
  newTexture.wrapT = originalTexture.wrapT;
  newTexture.minFilter = originalTexture.minFilter;
  newTexture.magFilter = originalTexture.magFilter;
  newTexture.flipY = originalTexture.flipY;
  newTexture.needsUpdate = true;

  return newTexture;
}

export function GLBModel({ url, wireframe, color = "#FF1744", autoRotate = true, disablePointer = false }: GLBModelProps) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  
  // Cache untuk menyimpan tekstur transparan yang sudah diproses agar tidak memicu memory leak
  const processedTexturesCache = useRef<Map<THREE.Texture, THREE.Texture>>(new Map());

  // Bersihkan semua tekstur yang dibuat saat unmount
  useEffect(() => {
    return () => {
      processedTexturesCache.current.forEach((texture) => {
        texture.dispose();
      });
      processedTexturesCache.current.clear();
    };
  }, []);

  const getProcessedTexture = (originalTexture: THREE.Texture): THREE.Texture => {
    if (processedTexturesCache.current.has(originalTexture)) {
      return processedTexturesCache.current.get(originalTexture)!;
    }

    const processed = makeTextureTransparent(originalTexture);
    processedTexturesCache.current.set(originalTexture, processed);
    return processed;
  };

  // Clone the scene to avoid caching side effects during state changes
  const clonedScene = useMemo(() => {
    if (!gltf.scene) return null;
    
    const clone = gltf.scene.clone();
    
    // Calculate bounding box of meshes only to ignore empty nodes/helpers in GLB
    const box = new THREE.Box3();
    let hasMesh = false;
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        box.expandByObject(child);
        hasMesh = true;
      }
    });

    if (!hasMesh) {
      box.setFromObject(clone); // Fallback
    }

    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Center the model's pivot point
    clone.position.sub(center);
    
    // Scale model to fit a standard bounding volume in our viewport
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 4.0; // Enlarged model size
    const scale = targetSize / (maxDim || 1);
    clone.scale.set(scale, scale, scale);
    
    return clone;
  }, [gltf.scene]);

  // Apply wireframe and emissive materials dynamically
  useEffect(() => {
    if (!clonedScene) return;

    const createdMaterials: THREE.Material[] = [];

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        let newMat: THREE.Material;
        if (wireframe) {
          newMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
            wireframe: true,
            transparent: true,
            opacity: 0.75,
            depthWrite: true,
          });
        } else {
          // If not wireframe, we can customize standard materials for a premium look
          const originalMat = mesh.material;
          const mat = Array.isArray(originalMat) ? originalMat[0] : originalMat;
          
          const originalColor = mat && ('color' in mat)
            ? (mat as THREE.MeshStandardMaterial).color
            : new THREE.Color("#ffffff");

          const standardMat = new THREE.MeshStandardMaterial({
            color: originalColor,
            roughness: 0.3,
            metalness: 0.6,
            bumpScale: 0.05,
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.05,
          });

          // If the original mesh has textures, keep them and apply transparency keying
          if (mat && 'map' in mat && (mat as THREE.MeshStandardMaterial).map) {
            const originalMap = (mat as THREE.MeshStandardMaterial).map;
            if (originalMap) {
              standardMat.map = getProcessedTexture(originalMap);
            }
          }
          if (mat && 'normalMap' in mat) {
            standardMat.normalMap = (mat as THREE.MeshStandardMaterial).normalMap;
          }
          
          newMat = standardMat;
        }

        mesh.material = newMat;
        createdMaterials.push(newMat);
      }
    });

    // Lepaskan material kustom dari memori GPU ketika efek ini dijalankan ulang atau komponen di-unmount
    return () => {
      createdMaterials.forEach((mat) => mat.dispose());
    };
  }, [clonedScene, wireframe, color]);

  // Apply smooth pointer tracking and idle animation
  useFrame((state) => {
    if (groupRef.current) {
      // Animasi idle (breathing effect) — selalu aktif
      const idleY = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      const idleX = Math.cos(state.clock.getElapsedTime() * 0.5) * 0.03;

      if (disablePointer) {
        // Mobile: hanya idle animation, tidak mengikuti pointer/sentuhan
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          idleY,
          0.05
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          idleX,
          0.05
        );
      } else {
        // Desktop: rotasi mengikuti posisi kursor mouse
        const { x, y } = state.pointer; // range [-1, 1]
        const targetRotationY = x * (Math.PI / 4); // maks ±45 derajat
        const targetRotationX = -y * (Math.PI / 6); // maks ±30 derajat

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotationY + idleY,
          0.08
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotationX + idleX,
          0.08
        );
      }
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} position={[0.6, -1.2, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// NOTE: Preload dihapus untuk performa — model dimuat on-demand saat HeroScene masuk viewport
