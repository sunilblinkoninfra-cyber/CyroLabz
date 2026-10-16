"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

const TICK_COUNT = 72;

export function RingSystemLayer() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.LineLoop>(null);
  const ring2Ref = useRef<THREE.LineSegments>(null);
  const ring3Ref = useRef<THREE.LineLoop>(null);
  const ring4Ref = useRef<THREE.LineSegments>(null);
  const ring5Ref = useRef<THREE.LineLoop>(null);
  const ticksRef = useRef<THREE.InstancedMesh>(null);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!ticksRef.current) return;
    const tickRadius = 2.05;

    for (let i = 0; i < TICK_COUNT; i++) {
      const angle = (i / TICK_COUNT) * Math.PI * 2;
      const x = Math.cos(angle) * tickRadius;
      const y = Math.sin(angle) * tickRadius;
      tempPos.set(x, y, 0);

      tempQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);

      const isMajor = i % 6 === 0;
      const length = isMajor ? 0.08 : 0.035;
      tempScale.set(length, 0.006, 0.006);

      tempMatrix.compose(tempPos, tempQuat, tempScale);
      ticksRef.current.setMatrixAt(i, tempMatrix);
    }
    ticksRef.current.instanceMatrix.needsUpdate = true;
  }, [tempMatrix, tempPos, tempQuat, tempScale]);

  const { dashedCircle1, dashedCircle2 } = useMemo(() => {
    const createDashed = (radius: number, segments: number, dashRatio = 0.5) => {
      const pts: number[] = [];
      for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * Math.PI * 2;
        const a2 = ((i + dashRatio) / segments) * Math.PI * 2;
        pts.push(Math.cos(a1) * radius, Math.sin(a1) * radius, 0);
        pts.push(Math.cos(a2) * radius, Math.sin(a2) * radius, 0);
      }
      return new Float32Array(pts);
    };

    return {
      dashedCircle1: createDashed(1.65, 48, 0.6),
      dashedCircle2: createDashed(2.45, 64, 0.4),
    };
  }, []);

  const circleGeos = useMemo(() => {
    const createCircle = (radius: number, points = 96) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < points; i++) {
        const a = (i / points) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
      }
      return pts;
    };
    return {
      c1: new THREE.BufferGeometry().setFromPoints(createCircle(1.3)),
      c3: new THREE.BufferGeometry().setFromPoints(createCircle(1.88)),
      c5: new THREE.BufferGeometry().setFromPoints(createCircle(2.85)),
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !heroMotionState.isTabVisible) return;
    const clampedDelta = Math.min(delta, 0.1);
    const { introProgress, pointer, scrollExitProgress, prefersReducedMotion } =
      heroMotionState;

    // Parallax depth factor: 0.6
    groupRef.current.position.x = pointer.x * 0.6;
    groupRef.current.position.y = pointer.y * 0.52;

    const currentScale = THREE.MathUtils.lerp(0.3, 1.0, introProgress);
    groupRef.current.scale.set(currentScale, currentScale, currentScale);

    // Theme reactivity
    const lineCol = new THREE.Color(themeTokens.line);
    const mutedCol = new THREE.Color(themeTokens.muted);
    const inkCol = new THREE.Color(themeTokens.ink);

    if (ring1Ref.current) (ring1Ref.current.material as THREE.LineBasicMaterial).color.lerp(mutedCol, 0.08);
    if (ring2Ref.current) (ring2Ref.current.material as THREE.LineBasicMaterial).color.lerp(lineCol, 0.08);
    if (ring3Ref.current) (ring3Ref.current.material as THREE.LineBasicMaterial).color.lerp(inkCol, 0.08);
    if (ticksRef.current) (ticksRef.current.material as THREE.MeshBasicMaterial).color.lerp(mutedCol, 0.08);
    if (ring4Ref.current) (ring4Ref.current.material as THREE.LineBasicMaterial).color.lerp(lineCol, 0.08);
    if (ring5Ref.current) (ring5Ref.current.material as THREE.LineBasicMaterial).color.lerp(inkCol, 0.08);

    if (prefersReducedMotion) return;

    const scrollFactor = 1 - scrollExitProgress * 0.7;

    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.08 * scrollFactor * clampedDelta;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.12 * scrollFactor * clampedDelta;
    if (ring3Ref.current) ring3Ref.current.rotation.z += 0.05 * scrollFactor * clampedDelta;
    if (ticksRef.current) ticksRef.current.rotation.z -= 0.04 * scrollFactor * clampedDelta;
    if (ring4Ref.current) ring4Ref.current.rotation.z += 0.09 * scrollFactor * clampedDelta;
    if (ring5Ref.current) ring5Ref.current.rotation.z -= 0.03 * scrollFactor * clampedDelta;
  });

  return (
    <group ref={groupRef}>
      <lineLoop ref={ring1Ref} geometry={circleGeos.c1}>
        <lineBasicMaterial color={themeTokens.muted} transparent opacity={0.65} />
      </lineLoop>

      <lineSegments ref={ring2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dashedCircle1, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={themeTokens.line} transparent opacity={0.5} />
      </lineSegments>

      <lineLoop ref={ring3Ref} geometry={circleGeos.c3}>
        <lineBasicMaterial color={themeTokens.ink} transparent opacity={0.8} />
      </lineLoop>

      <instancedMesh ref={ticksRef} args={[undefined, undefined, TICK_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={themeTokens.muted} transparent opacity={0.6} />
      </instancedMesh>

      <lineSegments ref={ring4Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dashedCircle2, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={themeTokens.line} transparent opacity={0.4} />
      </lineSegments>

      <lineLoop ref={ring5Ref} geometry={circleGeos.c5}>
        <lineBasicMaterial color={themeTokens.ink} transparent opacity={0.85} />
      </lineLoop>
    </group>
  );
}
