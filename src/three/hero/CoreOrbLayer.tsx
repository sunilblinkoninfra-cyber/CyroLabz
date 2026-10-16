"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

export function CoreOrbLayer() {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const bezelRef = useRef<THREE.Mesh>(null);
  const reticleRef = useRef<THREE.Mesh>(null);
  const glintLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !heroMotionState.isTabVisible) return;
    const { introProgress, pointer, prefersReducedMotion } = heroMotionState;

    // Parallax depth factor: 1.0
    groupRef.current.position.x = pointer.x * 1.0;
    groupRef.current.position.y = pointer.y * 0.9;

    // Subtle tilt toward cursor
    if (!prefersReducedMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.45,
        0.08
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.45,
        0.08
      );
    }

    const time = clock.getElapsedTime();

    // Slow breathing pulse
    if (orbRef.current && !prefersReducedMotion) {
      const pulse = (1.0 + Math.sin(time * 1.4) * 0.022) * Math.min(1, introProgress);
      orbRef.current.scale.set(pulse, pulse, pulse);
      orbRef.current.rotation.y += 0.005;
    }

    // Light glint sweeping across the surface
    if (glintLightRef.current && !prefersReducedMotion) {
      const glintAngle = time * 0.8;
      glintLightRef.current.position.x = Math.cos(glintAngle) * 0.9;
      glintLightRef.current.position.y = Math.sin(glintAngle) * 0.6;
      glintLightRef.current.position.z = 1.1 + Math.sin(glintAngle * 2) * 0.3;
    }

    // Dynamic theming
    if (bezelRef.current) {
      const bezelMat = bezelRef.current.material as THREE.MeshStandardMaterial;
      bezelMat.color.lerp(new THREE.Color(themeTokens.isDark ? "#121418" : "#18181B"), 0.08);
    }
    if (reticleRef.current) {
      const retMat = reticleRef.current.material as THREE.MeshBasicMaterial;
      retMat.color.lerp(new THREE.Color(themeTokens.line), 0.08);
    }
    if (orbRef.current) {
      const orbMat = orbRef.current.material as THREE.MeshStandardMaterial;
      orbMat.roughness = themeTokens.isDark ? 0.08 : 0.12;
      orbMat.metalness = themeTokens.isDark ? 0.95 : 0.88;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dark Ring Bezel Socket */}
      <mesh ref={bezelRef} position={[0, 0, 0.02]}>
        <ringGeometry args={[0.54, 0.68, 64]} />
        <meshStandardMaterial
          color="#18181B"
          roughness={0.3}
          metalness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Concentric Detail Reticle */}
      <mesh ref={reticleRef} position={[0, 0, 0.025]}>
        <ringGeometry args={[0.58, 0.60, 64]} />
        <meshBasicMaterial
          color={themeTokens.line}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Core Glossy Black Sphere */}
      <mesh ref={orbRef} position={[0, 0, 0.22]}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial
          color="#0A0A0A"
          roughness={0.12}
          metalness={0.88}
        />
      </mesh>

      {/* Sweeping Glint Light for Gloss Reflection */}
      <pointLight
        ref={glintLightRef}
        color="#FFFFFF"
        intensity={themeTokens.isDark ? 1.4 : 0.8}
        distance={2.5}
      />
    </group>
  );
}
