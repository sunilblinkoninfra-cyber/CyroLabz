"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

const STREAK_COUNT = 75;

interface StreakData {
  x: number;
  y: number;
  z: number;
  length: number;
  thickness: number;
  speed: number;
}

export function DataStreaksLayer() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  const streaks = useMemo<StreakData[]>(() => {
    const list: StreakData[] = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      const yDist = (Math.random() - 0.5) * 2.8;
      const y = yDist * (0.3 + Math.random() * 0.7);
      const x = (Math.random() - 0.5) * 14;
      const z = -1.2 + Math.random() * 1.5;
      const length = 0.15 + Math.random() * 1.1;
      const thickness = 0.005 + Math.random() * 0.006;
      const speed = 0.012 + Math.random() * 0.035;

      list.push({ x, y, z, length, thickness, speed });
    }
    return list;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    streaks.forEach((s, i) => {
      tempPos.set(s.x, s.y, s.z);
      tempScale.set(s.length, s.thickness, s.thickness);
      tempMatrix.compose(tempPos, tempQuat, tempScale);
      meshRef.current?.setMatrixAt(i, tempMatrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [streaks, tempMatrix, tempPos, tempQuat, tempScale]);

  useFrame((_, delta) => {
    if (!meshRef.current || !heroMotionState.isTabVisible) return;
    const clampedDelta = Math.min(delta, 0.1);
    const { introProgress, pointer, prefersReducedMotion } = heroMotionState;

    // Parallax depth factor: 0.4
    meshRef.current.position.x = pointer.x * 0.4;
    meshRef.current.position.y = pointer.y * 0.35;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, introProgress * 0.55, 0.05);

    // Theme reactivity: tint with ink color
    mat.color.lerp(new THREE.Color(themeTokens.ink), 0.08);

    if (prefersReducedMotion) return;

    streaks.forEach((s, i) => {
      s.x += s.speed * (clampedDelta * 60);

      if (s.x > 7.5) {
        s.x = -7.5;
        s.y = (Math.random() - 0.5) * 2.4;
      }

      tempPos.set(s.x, s.y, s.z);
      tempScale.set(s.length, s.thickness, s.thickness);
      tempMatrix.compose(tempPos, tempQuat, tempScale);
      meshRef.current?.setMatrixAt(i, tempMatrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, STREAK_COUNT]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={themeTokens.ink}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
