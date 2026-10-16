"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { MorphingParticles } from "./MorphingParticles";
import { FaceCutoutOverlay } from "./FaceCutoutOverlay";
import { LogoMarkOverlay } from "./LogoMarkOverlay";

interface StoryMorphCanvasProps {
  activeChapter: number;
  onSettled?: (chapter: number) => void;
  onMorphStart?: (fromChapter: number, toChapter: number) => void;
  fadingOut?: boolean;
}

function SceneCoordinator({
  activeChapter,
  onSettled,
  onMorphStart,
  fadingOut = false,
}: StoryMorphCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [settled, setSettled] = useState(true);

  // Subtle pointer parallax
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      groupRef.current.rotation.set(0, 0, 0);
      return;
    }

    const targetRotY = state.pointer.x * 0.14;
    const targetRotX = -state.pointer.y * 0.1;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      Math.min(1.0, delta * 3.5)
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      Math.min(1.0, delta * 3.5)
    );
  });

  const handleSettled = (ch: number) => {
    setSettled(true);
    onSettled?.(ch);
  };

  const handleMorphStart = (from: number, to: number) => {
    setSettled(false);
    onMorphStart?.(from, to);
  };

  return (
    <group ref={groupRef}>
      <MorphingParticles
        activeChapter={activeChapter}
        onSettled={handleSettled}
        onMorphStart={handleMorphStart}
      />
      <FaceCutoutOverlay
        activeChapter={activeChapter}
        settled={settled}
        fadingOut={fadingOut}
      />
      <LogoMarkOverlay
        activeChapter={activeChapter}
        settled={settled}
        fadingOut={fadingOut}
      />
    </group>
  );
}

export function StoryMorphCanvas({
  activeChapter,
  onSettled,
  onMorphStart,
  fadingOut = false,
}: StoryMorphCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[420px] lg:min-h-[560px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-line border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] select-none">
      <Canvas
        camera={{ position: [0, 0, 6.8], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SceneCoordinator
            activeChapter={activeChapter}
            onSettled={onSettled}
            onMorphStart={onMorphStart}
            fadingOut={fadingOut}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
