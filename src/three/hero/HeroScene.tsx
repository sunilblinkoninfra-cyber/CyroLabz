"use client";

import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { BackgroundLayer } from "./BackgroundLayer";
import { FarDustLayer } from "./FarDustLayer";
import { DataStreaksLayer } from "./DataStreaksLayer";
import { ConstellationLinesLayer } from "./ConstellationLinesLayer";
import { RingSystemLayer } from "./RingSystemLayer";
import { DiscLayer } from "./DiscLayer";
import { CoreOrbLayer } from "./CoreOrbLayer";
import { OrbitersLayer } from "./OrbitersLayer";

interface HeroSceneProps {
  onSceneReady?: () => void;
}

export function HeroScene({ onSceneReady }: HeroSceneProps) {
  const { camera } = useThree();
  const sceneGroupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Performance frame-time monitor
  const frameTimes = useRef<number[]>([]);
  const lastTime = useRef<number>(performance.now());

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      heroMotionState.isTouchDevice = mobile || "ontouchstart" in window;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // GSAP 2s Intro Timeline: tweening state values that useFrame reads
    const introObj = { progress: 0 };
    const introTween = gsap.to(introObj, {
      progress: 1,
      duration: 2.0,
      ease: "power2.out",
      onUpdate: () => {
        heroMotionState.introProgress = introObj.progress;
      },
      onComplete: () => {
        heroMotionState.isCanvasReady = true;
        onSceneReady?.();
      },
    });

    return () => {
      introTween.kill();
      window.removeEventListener("resize", checkMobile);
    };
  }, [onSceneReady]);

  // Position the focal core slightly left of center on desktop (x = -1.25), centered on mobile (x = 0)
  const focalX = isMobile ? 0 : -1.25;

  useFrame((_, delta) => {
    if (!heroMotionState.isTabVisible || !heroMotionState.isHeroInView) return;

    // --- Frame-time monitor (downgrade quality if FPS < 40) ---
    const now = performance.now();
    const frameDuration = now - lastTime.current;
    lastTime.current = now;

    if (frameDuration > 0 && frameDuration < 100) {
      frameTimes.current.push(frameDuration);
      if (frameTimes.current.length > 50) {
        frameTimes.current.shift();
        const avgDuration =
          frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
        const estimatedFps = 1000 / avgDuration;
        if (estimatedFps < 40 && !heroMotionState.isQualityDowngraded) {
          heroMotionState.isQualityDowngraded = true;
        }
      }
    }

    // --- Parallax Dampening ---
    const { pointer, isTouchDevice, prefersReducedMotion, scrollExitProgress } =
      heroMotionState;

    if (isTouchDevice && !prefersReducedMotion) {
      // Gentle automatic Lissajous figure-8 drift for touch devices
      const t = performance.now() * 0.0008;
      pointer.targetX = Math.sin(t) * 0.25;
      pointer.targetY = Math.cos(t * 2) * 0.15;
    }

    // Lerp pointer smoothly
    pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, 0.06);
    pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, 0.06);

    // --- Scroll Trigger Camera Zoom Out ---
    // Camera pulls back slightly as hero leaves the viewport
    const baseCamZ = isMobile ? 5.8 : 4.4;
    const targetCamZ = baseCamZ + scrollExitProgress * 1.5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);

    // Subtle pitch on scroll
    camera.rotation.x = THREE.MathUtils.lerp(
      camera.rotation.x,
      -scrollExitProgress * 0.1,
      0.08
    );
  });

  return (
    <>
      {/* 1 Directional Light + 1 Ambient Light (Strictly within budget) */}
      <ambientLight color="#FFFFFF" intensity={1.1} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
        color="#FFFFFF"
      />

      {/* Layer 1: Background Gradient Plane (Behind the anchor) */}
      <BackgroundLayer />

      {/* Main Focal Hub Group anchored to the left of center */}
      <group ref={sceneGroupRef} position={[focalX, 0, 0]}>
        {/* Layer 2: Far Dust Points */}
        <FarDustLayer isMobile={isMobile} />

        {/* Layer 3: Horizontal Data Streaks */}
        <DataStreaksLayer />

        {/* Layer 4: Constellation Lines */}
        <ConstellationLinesLayer />

        {/* Layer 5: Concentric Ring System & Vernier Ticks */}
        <RingSystemLayer />

        {/* Layer 6: Stepped Disc & Soft Drop Shadow */}
        <DiscLayer />

        {/* Layer 7: Core Glossy Black Orb & Glint */}
        <CoreOrbLayer />

        {/* Layer 8: Instanced Black Orbiters */}
        <OrbitersLayer />
      </group>
    </>
  );
}
