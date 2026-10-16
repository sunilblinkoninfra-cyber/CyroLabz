"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

interface FarDustProps {
  isMobile?: boolean;
}

export function FarDustLayer({ isMobile }: FarDustProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = useMemo(() => {
    if (isMobile) return 550;
    return heroMotionState.isQualityDowngraded ? 700 : 1450;
  }, [isMobile]);

  const { positions, randomVelocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = -2.5 + Math.random() * 2.0;

      // Gentle organic drift
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.0025;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return { positions: pos, randomVelocities: vel };
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !heroMotionState.isTabVisible) return;
    const clampedDelta = Math.min(delta, 0.1);
    const { introProgress, pointer, prefersReducedMotion } = heroMotionState;

    // Parallax depth factor: 0.2
    pointsRef.current.position.x = pointer.x * 0.2;
    pointsRef.current.position.y = pointer.y * 0.18;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    // Fade up during intro
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, introProgress * 0.45, 0.05);

    // Dynamic theming: adapt particle color to --ink
    mat.color.lerp(new THREE.Color(themeTokens.ink), 0.08);

    if (prefersReducedMotion) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      arr[i * 3 + 0] += randomVelocities[i * 3 + 0] * (clampedDelta * 60);
      arr[i * 3 + 1] += randomVelocities[i * 3 + 1] * (clampedDelta * 60);

      // Wrap around bounds
      if (arr[i * 3 + 0] > 8) arr[i * 3 + 0] = -8;
      if (arr[i * 3 + 0] < -8) arr[i * 3 + 0] = 8;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
      if (arr[i * 3 + 1] < -5) arr[i * 3 + 1] = 5;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.025 : 0.03}
        color={themeTokens.ink}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
