"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/scrollStore";

const PARTICLE_COUNT = 320;

export function ParticleStream() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread across x [-7 to 7], y [-4 to 4], z [-2 to 2]
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;

      // Drifting left -> right velocity
      vel[i] = 0.008 + Math.random() * 0.02;
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !sceneState.isTabVisible) return;
    if (sceneState.prefersReducedMotion) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const speedMultiplier = 1 + (1 - Math.min(1, sceneState.scrollProgress)) * 0.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Flow left -> right (+x)
      array[i * 3 + 0] += velocities[i] * speedMultiplier * (delta * 60);

      // Wrap around when past right boundary
      if (array[i * 3 + 0] > 7) {
        array[i * 3 + 0] = -7;
        array[i * 3 + 1] = (Math.random() - 0.5) * 8;
      }
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
        size={0.035}
        color="#222222"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
