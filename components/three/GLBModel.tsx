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

export function GLBModel({ url, wireframe, color = "#FF1744", autoRotate = true }: GLBModelProps) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

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

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        if (wireframe) {
          mesh.material = new THREE.MeshBasicMaterial({
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
              standardMat.map = makeTextureTransparent(originalMap);
            }
          }
          if (mat && 'normalMap' in mat) {
            standardMat.normalMap = (mat as THREE.MeshStandardMaterial).normalMap;
          }
          
          mesh.material = standardMat;
        }
      }
    });
  }, [clonedScene, wireframe, color]);

  // Apply smooth auto-rotation
  useFrame((state) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} position={[0.6, -1.2, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the active model for smoother user experience
useGLTF.preload("/3d-2.glb");
