"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

export function DiscLayer() {
  const groupRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);
  const faceRef = useRef<THREE.Mesh>(null);
  const reticleRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!groupRef.current || !heroMotionState.isTabVisible) return;
    const { introProgress, pointer } = heroMotionState;

    // Parallax depth factor: 0.8
    groupRef.current.position.x = pointer.x * 0.8;
    groupRef.current.position.y = pointer.y * 0.72;

    const scale = THREE.MathUtils.lerp(0.5, 1.0, introProgress);
    groupRef.current.scale.set(scale, scale, scale);

    // Dynamic theming
    if (rimRef.current) {
      const rimMat = rimRef.current.material as THREE.MeshStandardMaterial;
      rimMat.color.lerp(new THREE.Color(themeTokens.isDark ? "#1E222A" : "#E4E4E7"), 0.08);
    }
    if (faceRef.current) {
      const faceMat = faceRef.current.material as THREE.MeshStandardMaterial;
      faceMat.color.lerp(new THREE.Color(themeTokens.isDark ? "#161920" : "#F4F4F5"), 0.08);
    }
    if (reticleRef.current) {
      const retMat = reticleRef.current.material as THREE.MeshBasicMaterial;
      retMat.color.lerp(new THREE.Color(themeTokens.line), 0.08);
    }
    if (shadowRef.current) {
      const shadowMat = shadowRef.current.material as THREE.MeshBasicMaterial;
      shadowMat.opacity = themeTokens.isDark ? 0.45 : 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft Contact Shadow Plane behind the disc */}
      <mesh ref={shadowRef} position={[0, 0, -0.12]}>
        <ringGeometry args={[0.7, 1.35, 64]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Stepped Rim of the Disc */}
      <mesh ref={rimRef} position={[0, 0, -0.06]}>
        <cylinderGeometry args={[1.08, 1.14, 0.08, 64]} />
        <meshStandardMaterial
          color="#E4E4E7"
          roughness={0.4}
          metalness={0.08}
        />
      </mesh>

      {/* Main Pale Circular Disc */}
      <mesh ref={faceRef} position={[0, 0, -0.02]}>
        <cylinderGeometry args={[0.96, 0.96, 0.06, 64]} />
        <meshStandardMaterial
          color="#F4F4F5"
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* Inner Fine Reticle Ring on the Disc Face */}
      <mesh ref={reticleRef} position={[0, 0, 0.015]}>
        <ringGeometry args={[0.82, 0.84, 64]} />
        <meshBasicMaterial
          color={themeTokens.line}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}
