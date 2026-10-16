"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/scrollStore";

const SATELLITE_COUNT = 24;

interface SatelliteData {
  radius: number;
  baseRadius: number;
  speed: number;
  angle: number;
  inclination: number;
  scale: number;
}

export function InstancedSatellites() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  // Precompute orbital parameters
  const satellites = useMemo<SatelliteData[]>(() => {
    const list: SatelliteData[] = [];
    for (let i = 0; i < SATELLITE_COUNT; i++) {
      const baseRadius = 1.6 + (i / SATELLITE_COUNT) * 2.8 + (Math.random() * 0.4);
      const speed = (0.2 + (Math.random() * 0.35)) * (i % 2 === 0 ? 1 : -1);
      const angle = (i / SATELLITE_COUNT) * Math.PI * 2 + Math.random();
      const inclination = (Math.random() - 0.5) * 0.4;
      const scale = 0.04 + Math.random() * 0.08;

      list.push({
        radius: baseRadius,
        baseRadius,
        speed,
        angle,
        inclination,
        scale,
      });
    }
    return list;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    // Initialize matrices
    satellites.forEach((sat, i) => {
      tempPos.set(
        Math.cos(sat.angle) * sat.radius,
        Math.sin(sat.angle) * sat.radius * sat.inclination,
        Math.sin(sat.angle) * sat.radius
      );
      tempScale.set(sat.scale, sat.scale, sat.scale);
      tempMatrix.compose(tempPos, tempQuat, tempScale);
      meshRef.current?.setMatrixAt(i, tempMatrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [satellites, tempMatrix, tempPos, tempQuat, tempScale]);

  useFrame((_, delta) => {
    if (!meshRef.current || !sceneState.isTabVisible) return;
    if (sceneState.prefersReducedMotion) return;

    const clampedDelta = Math.min(delta, 0.1);
    const { activeSection, scrollProgress } = sceneState;

    // In 'about', rings slow and settle
    let speedFactor = 1.0;
    if (activeSection === "about") {
      speedFactor = 0.2;
    } else if (activeSection === "process") {
      speedFactor = 0.5;
    }

    // In 'contact', spheres converge on the core
    const isContact = activeSection === "contact" || scrollProgress > 0.85;
    const convergeFactor = isContact ? Math.min(1, (scrollProgress - 0.75) * 4) : 0;

    satellites.forEach((sat, i) => {
      sat.angle += sat.speed * speedFactor * clampedDelta;

      // Target radius: shrink towards core if contact section
      const targetRadius = sat.baseRadius * (1 - convergeFactor * 0.65);
      sat.radius = THREE.MathUtils.lerp(sat.radius, targetRadius, 0.06);

      const x = Math.cos(sat.angle) * sat.radius;
      const y = Math.sin(sat.angle) * sat.radius * sat.inclination + Math.sin(sat.angle * 2) * 0.1;
      const z = Math.sin(sat.angle) * sat.radius * 0.4;

      tempPos.set(x, y, z);
      tempScale.set(sat.scale, sat.scale, sat.scale);
      tempMatrix.compose(tempPos, tempQuat, tempScale);
      meshRef.current?.setMatrixAt(i, tempMatrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, SATELLITE_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#0A0A0A"
        roughness={0.3}
        metalness={0.7}
      />
    </instancedMesh>
  );
}
