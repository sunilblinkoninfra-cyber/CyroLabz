"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/scrollStore";
import { InstancedSatellites } from "./InstancedSatellites";
import { ParticleStream } from "./ParticleStream";

// 5 Process camera waypoints
const PROCESS_WAYPOINTS = [
  new THREE.Vector3(-0.8, 0.2, 4.0),
  new THREE.Vector3(-0.4, -0.2, 3.8),
  new THREE.Vector3(0.0, 0.3, 3.6),
  new THREE.Vector3(0.4, -0.1, 3.8),
  new THREE.Vector3(0.8, 0.2, 4.0),
];

export function HeroOrbScene() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Reusable vectors for lerping
  const targetCamPos = useMemo(() => new THREE.Vector3(-1.0, 0, 4.4), []);
  const targetCamLook = useMemo(() => new THREE.Vector3(-0.5, 0, 0), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  // Ring configurations
  const ringConfigs = useMemo(
    () => [
      { inner: 0.95, outer: 1.05, speed: 0.22, color: "#D1D5DB" },
      { inner: 1.25, outer: 1.30, speed: -0.16, color: "#9CA3AF" },
      { inner: 1.55, outer: 1.62, speed: 0.12, color: "#6B7280" },
      { inner: 1.95, outer: 2.00, speed: -0.09, color: "#D1D5DB" },
      { inner: 2.35, outer: 2.42, speed: 0.07, color: "#9CA3AF" },
      { inner: 2.75, outer: 2.80, speed: -0.05, color: "#E5E7EB" },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!sceneState.isTabVisible) return;
    const clampedDelta = Math.min(delta, 0.1);

    const {
      scrollProgress,
      activeSection,
      sectionProgress,
      hoveredServiceIndex,
      pointer,
      prefersReducedMotion,
    } = sceneState;

    // Smooth pointer parallax
    pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, 0.05);
    pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, 0.05);

    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y = pointer.x * 0.15;
      groupRef.current.rotation.x = -pointer.y * 0.12;
    }

    // Orb slow spin
    if (orbRef.current && !prefersReducedMotion) {
      orbRef.current.rotation.y += 0.3 * clampedDelta;
    }

    // Rings rotation & hover effects
    if (ringsRef.current) {
      const ringChildren = ringsRef.current.children;
      let speedScale = 1.0;

      if (activeSection === "about") {
        // "rings slow and settle"
        speedScale = 0.15;
      } else if (activeSection === "process") {
        speedScale = 0.4;
      }

      ringConfigs.forEach((config, idx) => {
        const ringMesh = ringChildren[idx] as THREE.Mesh | undefined;
        if (ringMesh) {
          if (!prefersReducedMotion) {
            ringMesh.rotation.z += config.speed * speedScale * clampedDelta;
          }

          const mat = ringMesh.material as THREE.MeshStandardMaterial;
          const isHovered = hoveredServiceIndex === idx;

          // Highlight matching ring on service card hover
          if (isHovered) {
            mat.color.set("#2F6BFF");
            mat.emissive.set("#2F6BFF");
            mat.emissiveIntensity = 0.8;
          } else {
            mat.color.set(config.color);
            mat.emissive.set("#000000");
            mat.emissiveIntensity = 0;
          }
        }
      });
    }

    // Camera movement based on scroll progress and active section
    if (activeSection === "hero") {
      // Anchored to the left so hero typography on the right has space
      targetCamPos.set(-1.0, 0, 4.4);
      targetCamLook.set(-0.5, 0, 0);
    } else if (activeSection === "services") {
      targetCamPos.set(-0.7, 0.2, 4.2);
      targetCamLook.set(-0.3, 0, 0);
    } else if (activeSection === "about") {
      // Settle towards center
      targetCamPos.set(0.0, 0.0, 3.8);
      targetCamLook.set(0.0, 0, 0);
    } else if (activeSection === "process") {
      // 5 waypoints interpolation
      const waypointIdx = Math.min(
        4,
        Math.max(0, Math.floor(sectionProgress * 5))
      );
      const targetWaypoint = PROCESS_WAYPOINTS[waypointIdx];
      targetCamPos.copy(targetWaypoint);
      targetCamLook.set(0, 0, 0);
    } else if (activeSection === "contact") {
      // Zoom closer as spheres converge
      targetCamPos.set(0, 0, 3.2);
      targetCamLook.set(0, 0, 0);
    }

    // Smooth camera lerp
    camera.position.lerp(targetCamPos, 0.05);
    currentLook.lerp(targetCamLook, 0.05);
    camera.lookAt(currentLook);
  });

  return (
    <>
      {/* Maximum 1 directional + 1 ambient light (Strictly enforced) */}
      <ambientLight color="#FFFFFF" intensity={0.9} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.4}
        color="#FFFFFF"
      />

      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Core Black Orb */}
        <mesh ref={orbRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.78, 48, 48]} />
          <meshStandardMaterial
            color="#0A0A0A"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* Inner stepped bezel base disc (echoing the white/grey hub in the hero image) */}
        <mesh position={[0, 0, -0.05]}>
          <cylinderGeometry args={[1.15, 1.25, 0.12, 64]} />
          <meshStandardMaterial
            color="#E5E7EB"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Concentric Rotating Ring Discs */}
        <group ref={ringsRef}>
          {ringConfigs.map((cfg, i) => (
            <mesh key={i} position={[0, 0, 0.01 * (i + 1)]}>
              <ringGeometry args={[cfg.inner, cfg.outer, 64]} />
              <meshStandardMaterial
                color={cfg.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>

        {/* Instanced Orbiting Black Spheres */}
        <InstancedSatellites />

        {/* Particle Stream Flowing Left -> Right */}
        <ParticleStream />
      </group>
    </>
  );
}
