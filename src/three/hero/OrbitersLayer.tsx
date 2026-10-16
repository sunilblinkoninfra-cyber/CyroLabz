"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

const ORBITER_COUNT = 25;

interface OrbiterParam {
  radiusA: number;
  radiusB: number;
  speed: number;
  initialAngle: number;
  inclination: number;
  scale: number;
  zDepth: number;
  spawnOffsetDist: number;
}

export function OrbitersLayer() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const shadowMeshRef = useRef<THREE.InstancedMesh>(null);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempShadowMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const currentAngles = useRef<Float32Array>(new Float32Array(ORBITER_COUNT));

  const orbiters = useMemo<OrbiterParam[]>(() => {
    const list: OrbiterParam[] = [];
    for (let i = 0; i < ORBITER_COUNT; i++) {
      const radiusA = 1.1 + (i / ORBITER_COUNT) * 2.3 + Math.random() * 0.25;
      const radiusB = radiusA * (0.65 + Math.random() * 0.3);
      const speed = (0.15 + (i % 3) * 0.12 + Math.random() * 0.08) * (i % 2 === 0 ? 1 : -0.9);
      const initialAngle = (i / ORBITER_COUNT) * Math.PI * 2 + Math.random();
      const inclination = (Math.random() - 0.5) * 0.35;
      const scale = 0.035 + Math.random() * 0.085 + (i % 5 === 0 ? 0.05 : 0);
      const zDepth = -0.3 + (i / ORBITER_COUNT) * 0.8;
      const spawnOffsetDist = 3.0 + Math.random() * 2.0;

      list.push({
        radiusA,
        radiusB,
        speed,
        initialAngle,
        inclination,
        scale,
        zDepth,
        spawnOffsetDist,
      });
      currentAngles.current[i] = initialAngle;
    }
    return list;
  }, []);

  useEffect(() => {
    if (!meshRef.current || !shadowMeshRef.current) return;
    orbiters.forEach((orb, i) => {
      const angle = currentAngles.current[i];
      const x = Math.cos(angle) * orb.radiusA;
      const y = Math.sin(angle) * orb.radiusB;
      const z = orb.zDepth;

      tempPos.set(x, y, z);
      tempScale.set(orb.scale, orb.scale, orb.scale);
      tempMatrix.compose(tempPos, tempQuat, tempScale);
      meshRef.current?.setMatrixAt(i, tempMatrix);

      tempPos.set(x - 0.03, y - 0.03, -0.05);
      tempScale.set(orb.scale * 1.25, orb.scale * 1.25, 0.001);
      tempShadowMatrix.compose(tempPos, tempQuat, tempScale);
      shadowMeshRef.current?.setMatrixAt(i, tempShadowMatrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    shadowMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [orbiters, tempMatrix, tempShadowMatrix, tempPos, tempQuat, tempScale]);

  useFrame((_, delta) => {
    if (!meshRef.current || !shadowMeshRef.current || !heroMotionState.isTabVisible) return;
    const clampedDelta = Math.min(delta, 0.1);
    const { introProgress, pointer, prefersReducedMotion } = heroMotionState;

    // Parallax depth factor: 1.35
    const px = pointer.x * 1.35;
    const py = pointer.y * 1.2;
    meshRef.current.position.set(px, py, 0);
    shadowMeshRef.current.position.set(px, py, 0);

    const flyInScale = THREE.MathUtils.lerp(1.8, 1.0, Math.min(1, introProgress * 1.3));

    // Dynamic theming: orbiters follow ink color
    const orbMat = meshRef.current.material as THREE.MeshStandardMaterial;
    orbMat.color.lerp(new THREE.Color(themeTokens.isDark ? themeTokens.ink : "#0A0A0A"), 0.08);

    const shadowMat = shadowMeshRef.current.material as THREE.MeshBasicMaterial;
    shadowMat.opacity = themeTokens.isDark ? 0.35 : 0.16;

    orbiters.forEach((orb, i) => {
      if (!prefersReducedMotion) {
        currentAngles.current[i] += orb.speed * (clampedDelta * 60) * 0.015;
      }

      const angle = currentAngles.current[i];
      const x = Math.cos(angle) * (orb.radiusA * flyInScale);
      const y = Math.sin(angle) * (orb.radiusB * flyInScale) + Math.sin(angle * 2) * orb.inclination;
      const z = orb.zDepth;

      tempPos.set(x, y, z);
      tempScale.set(orb.scale, orb.scale, orb.scale);
      tempMatrix.compose(tempPos, tempQuat, tempScale);
      meshRef.current?.setMatrixAt(i, tempMatrix);

      tempPos.set(x - 0.04, y - 0.04, -0.08);
      tempScale.set(orb.scale * 1.3, orb.scale * 1.3, 0.001);
      tempShadowMatrix.compose(tempPos, tempQuat, tempScale);
      shadowMeshRef.current?.setMatrixAt(i, tempShadowMatrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    shadowMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Soft Contact Shadows */}
      <instancedMesh
        ref={shadowMeshRef}
        args={[undefined, undefined, ORBITER_COUNT]}
        frustumCulled={false}
      >
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Orbiting Spheres */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, ORBITER_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial
          color="#0A0A0A"
          roughness={0.25}
          metalness={0.75}
        />
      </instancedMesh>
    </>
  );
}
