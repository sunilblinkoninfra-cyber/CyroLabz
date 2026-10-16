"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  PARTICLE_COUNT,
  generateSkylinePoints,
  generateCircuitPoints,
  generateFacePoints,
  generateLogoPoints,
} from "./particleShapes";
import { themeTokens, subscribeTheme } from "@/lib/themeStore";

interface MorphingParticlesProps {
  activeChapter: number;
  onSettled?: (chapter: number) => void;
  onMorphStart?: (fromChapter: number, toChapter: number) => void;
}

export function MorphingParticles({
  activeChapter,
  onSettled,
  onMorphStart,
}: MorphingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Pre-generate coordinate buffers once
  const chapterBuffers = useMemo(() => {
    return [
      generateSkylinePoints(PARTICLE_COUNT),
      generateCircuitPoints(PARTICLE_COUNT),
      generateFacePoints(PARTICLE_COUNT),
      generateLogoPoints(PARTICLE_COUNT),
    ];
  }, []);

  // Current position array and transition buffers
  const { currentPositions, sourcePositions, targetPositions, velocities } = useMemo(() => {
    const current = new Float32Array(chapterBuffers[0]);
    const source = new Float32Array(chapterBuffers[0]);
    const target = new Float32Array(chapterBuffers[0]);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    return {
      currentPositions: current,
      sourcePositions: source,
      targetPositions: target,
      velocities: vel,
    };
  }, [chapterBuffers]);

  // Transition tracking
  const stateRef = useRef({
    prevChapter: activeChapter,
    currentChapter: activeChapter,
    morphProgress: 1.0, // 1.0 = fully settled
    settledReported: true,
    transitionSpeed: 0.95,
  });

  // Soft anti-aliased circular particle texture
  const circleTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.9)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Update target coordinates when activeChapter changes
  useEffect(() => {
    const s = stateRef.current;
    if (s.currentChapter !== activeChapter) {
      onMorphStart?.(s.currentChapter, activeChapter);

      // Snapshot current positions into source
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        sourcePositions[i] = currentPositions[i];
      }

      // Load new target buffer
      const newTarget = chapterBuffers[activeChapter] || chapterBuffers[0];
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        targetPositions[i] = newTarget[i];
      }

      s.prevChapter = s.currentChapter;
      s.currentChapter = activeChapter;
      s.morphProgress = 0.0;
      s.settledReported = false;
    }
  }, [activeChapter, chapterBuffers, currentPositions, sourcePositions, targetPositions, onMorphStart]);

  // Theme synchronization for particle ink color
  useEffect(() => {
    const unsubscribe = subscribeTheme((tokens) => {
      if (materialRef.current) {
        materialRef.current.color.set(tokens.ink);
      }
    });

    if (materialRef.current) {
      materialRef.current.color.set(themeTokens.ink);
    }

    return unsubscribe;
  }, []);

  // Continuous animation loop in useFrame
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    if (!posAttr) return;

    const s = stateRef.current;
    const time = state.clock.getElapsedTime();

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Instant transition
      if (s.morphProgress < 1.0) {
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          currentPositions[i] = targetPositions[i];
        }
        s.morphProgress = 1.0;
        posAttr.needsUpdate = true;
      }
      if (!s.settledReported) {
        s.settledReported = true;
        onSettled?.(s.currentChapter);
      }
      return;
    }

    // Standard morph transition
    if (s.morphProgress < 1.0) {
      // Smooth non-linear progress step
      s.morphProgress = Math.min(1.0, s.morphProgress + delta * s.transitionSpeed);

      // EaseInOutCubic curve
      const p = s.morphProgress;
      const easeT = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      // Dispersion expansion during midpoint of morph
      const dispersionFactor = Math.sin(p * Math.PI) * 0.45;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const sx = sourcePositions[idx + 0];
        const sy = sourcePositions[idx + 1];
        const sz = sourcePositions[idx + 2];

        const tx = targetPositions[idx + 0];
        const ty = targetPositions[idx + 1];
        const tz = targetPositions[idx + 2];

        // Per-particle organic turbulence during flight
        const pNoiseX = Math.sin(time * 3 + i * 0.1) * dispersionFactor;
        const pNoiseY = Math.cos(time * 3 + i * 0.15) * dispersionFactor;
        const pNoiseZ = Math.sin(time * 2.5 + i * 0.2) * (dispersionFactor * 0.6);

        currentPositions[idx + 0] = sx + (tx - sx) * easeT + pNoiseX;
        currentPositions[idx + 1] = sy + (ty - sy) * easeT + pNoiseY;
        currentPositions[idx + 2] = sz + (tz - sz) * easeT + pNoiseZ;
      }

      posAttr.needsUpdate = true;

      // Check if settled
      if (s.morphProgress >= 1.0 && !s.settledReported) {
        s.settledReported = true;
        onSettled?.(s.currentChapter);
      }
    } else {
      // Settled idle state: subtle organic micro-drift so the shape breathes
      const idleTime = time * 0.8;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const tx = targetPositions[idx + 0];
        const ty = targetPositions[idx + 1];
        const tz = targetPositions[idx + 2];

        const driftX = Math.sin(idleTime + i * 0.2) * 0.015;
        const driftY = Math.cos(idleTime + i * 0.25) * 0.015;
        const driftZ = Math.sin(idleTime * 0.7 + i * 0.15) * 0.01;

        currentPositions[idx + 0] = tx + driftX;
        currentPositions[idx + 1] = ty + driftY;
        currentPositions[idx + 2] = tz + driftZ;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.065}
        sizeAttenuation={true}
        map={circleTexture || undefined}
        transparent={true}
        opacity={0.88}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
}
