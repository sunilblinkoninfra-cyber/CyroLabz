"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { themeTokens, subscribeTheme } from "@/lib/themeStore";

interface LogoMarkOverlayProps {
  activeChapter: number;
  settled: boolean;
  fadingOut?: boolean;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform vec3 uInk;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    
    // logo-mark.png has the faceted black C mark on pure white background
    float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Cut out white background (lum > 0.9) to transparent, keep black mark as solid alpha
    float alpha = smoothstep(0.92, 0.70, lum) * uOpacity;
    
    // Color tinted with exact current theme ink color
    gl_FragColor = vec4(uInk, alpha);
  }
`;

export function LogoMarkOverlay({
  activeChapter,
  settled,
  fadingOut = false,
}: LogoMarkOverlayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load logo mark texture safely
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/assets/story/logo-mark.png",
      (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load /assets/story/logo-mark.png", err);
      }
    );
  }, []);

  const uniforms = useMemo(() => {
    return {
      uTexture: { value: null as THREE.Texture | null },
      uOpacity: { value: 0.0 },
      uInk: { value: new THREE.Color(themeTokens.ink) },
    };
  }, []);

  useEffect(() => {
    if (texture && materialRef.current) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  // Sync theme tokens
  useEffect(() => {
    const unsubscribe = subscribeTheme((tokens) => {
      if (materialRef.current) {
        materialRef.current.uniforms.uInk.value.set(tokens.ink);
      }
    });

    if (materialRef.current) {
      materialRef.current.uniforms.uInk.value.set(themeTokens.ink);
    }

    return unsubscribe;
  }, []);

  // Frame animation for sharpening in
  useFrame((_, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const shouldShow = activeChapter === 3 && settled && !fadingOut;
    const targetOpacity = shouldShow ? 1.0 : 0.0;
    const current = materialRef.current.uniforms.uOpacity.value;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      materialRef.current.uniforms.uOpacity.value = targetOpacity;
      meshRef.current.scale.setScalar(targetOpacity > 0 ? 1.0 : 0.94);
    } else {
      // Sharpen in smoothly
      const speed = shouldShow ? 3.0 : 6.0;
      const nextOpacity = THREE.MathUtils.lerp(
        current,
        targetOpacity,
        Math.min(1.0, delta * speed)
      );
      materialRef.current.uniforms.uOpacity.value = nextOpacity;

      // Scale sharpen pop from 0.94 -> 1.0
      const currentScale = THREE.MathUtils.lerp(
        0.94,
        1.0,
        Math.pow(nextOpacity, 0.5)
      );
      meshRef.current.scale.setScalar(currentScale);
    }

    meshRef.current.visible = materialRef.current.uniforms.uOpacity.value > 0.001;
  });

  return (
    <mesh ref={meshRef} position={[-0.05, 0, 0.03]} visible={false}>
      {/* 1:1 square plane matching 1024x1024 logo mark */}
      <planeGeometry args={[3.2, 3.2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
