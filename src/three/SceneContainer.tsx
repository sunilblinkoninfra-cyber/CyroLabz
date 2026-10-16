"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { sceneState } from "@/lib/scrollStore";
import { HeroOrbScene } from "./HeroOrbScene";
import { cn } from "@/lib/utils";

export function SceneContainer() {
  const [mounted, setMounted] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasLoaded, setCanvasLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect WebGL
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }

    // Detect reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    sceneState.prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      sceneState.prefersReducedMotion = e.matches;
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Handle tab visibility to pause render loop
    const handleVisibility = () => {
      sceneState.isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Handle pointer parallax
    const handlePointerMove = (e: MouseEvent) => {
      // Normalized between -1 and 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneState.pointer.targetX = nx;
      sceneState.pointer.targetY = ny;
    };
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  // If no WebGL or user prefers reduced motion, fallback gracefully
  if (!webGLSupported || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden transition-opacity duration-1000",
        canvasLoaded ? "opacity-100" : "opacity-0"
      )}
    >
      <Canvas
        camera={{ fov: 42, position: [-1.0, 0, 4.4], near: 0.1, far: 20 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={() => {
          setCanvasLoaded(true);
          sceneState.isCanvasReady = true;
        }}
      >
        <Suspense fallback={null}>
          <HeroOrbScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
