"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { heroMotionState } from "@/lib/scrollStore";
import { HeroScene } from "./HeroScene";
import { cn } from "@/lib/utils";

interface HeroCanvasProps {
  onLoaded?: () => void;
}

export function HeroCanvas({ onLoaded }: HeroCanvasProps) {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check WebGL support
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }

    // 2. Check prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    heroMotionState.prefersReducedMotion = mq.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      heroMotionState.prefersReducedMotion = e.matches;
    };
    mq.addEventListener("change", onMotionChange);

    // 3. Screen size & touch check
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      heroMotionState.isTouchDevice = mobile || "ontouchstart" in window;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // 4. Tab visibility monitor
    const onVisibility = () => {
      heroMotionState.isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 5. GSAP quickTo for damped pointer target
    const quickX = gsap.quickTo(heroMotionState.pointer, "targetX", {
      duration: 0.8,
      ease: "power2.out",
    });
    const quickY = gsap.quickTo(heroMotionState.pointer, "targetY", {
      duration: 0.8,
      ease: "power2.out",
    });

    const onMouseMove = (e: MouseEvent) => {
      // Normalized coordinates: -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      quickX(nx);
      quickY(ny);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 6. IntersectionObserver to pause rendering when hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroMotionState.isHeroInView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      mq.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  // Gracefully skip 3D canvas if WebGL unavailable or reduced-motion requested
  if (!webGLSupported || prefersReducedMotion) {
    return null;
  }

  const handleSceneReady = () => {
    setSceneReady(true);
    onLoaded?.();
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000",
        sceneReady ? "opacity-100" : "opacity-0"
      )}
    >
      <Canvas
        camera={{
          fov: 35, // Low FOV for subtle cinematic depth as requested
          position: [0, 0, isMobile ? 5.8 : 4.4],
          near: 0.1,
          far: 25,
        }}
        dpr={isMobile ? 1 : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop="always"
      >
        <HeroScene onSceneReady={handleSceneReady} />
      </Canvas>
    </div>
  );
}
