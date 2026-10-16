"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { themeTokens, subscribeTheme } from "@/lib/themeStore";

interface FaceCutoutOverlayProps {
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
  uniform vec3 uBg;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Calculate ITU-R BT.601 perceptual luminance
    float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // The background in face.png is a light gradient (lum ~ 0.82 to 0.98).
    // Artwork elements (face mesh, reaching hand, nodes) have lum < 0.78 down to 0.0.
    // Cut out light background to alpha = 0.0, retain artwork features at alpha = 1.0
    float alpha = smoothstep(0.92, 0.65, lum) * uOpacity;
    
    // Remap tone between current theme bg and ink tokens:
    // When lum is 0.0 (deepest darks in artwork), tone = 1.0 -> uInk
    // When lum is 0.85, tone = 0.0 -> uBg
    float tone = clamp((0.90 - lum) / 0.88, 0.0, 1.0);
    vec3 mappedColor = mix(uBg, uInk, tone);
    
    gl_FragColor = vec4(mappedColor, alpha);
  }
`;

export function FaceCutoutOverlay({
  activeChapter,
  settled,
  fadingOut = false,
}: FaceCutoutOverlayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load face texture safely
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/assets/story/face.png",
      (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load /assets/story/face.png", err);
      }
    );
  }, []);

  const uniforms = useMemo(() => {
    return {
      uTexture: { value: null as THREE.Texture | null },
      uOpacity: { value: 0.0 },
      uInk: { value: new THREE.Color(themeTokens.ink) },
      uBg: { value: new THREE.Color(themeTokens.bg) },
    };
  }, []);

  // Sync texture when loaded
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
        materialRef.current.uniforms.uBg.value.set(tokens.bg);
      }
    });

    if (materialRef.current) {
      materialRef.current.uniforms.uInk.value.set(themeTokens.ink);
      materialRef.current.uniforms.uBg.value.set(themeTokens.bg);
    }

    return unsubscribe;
  }, []);

  // Frame animation for smooth cross-fading
  useFrame((_, delta) => {
    if (!materialRef.current) return;

    const shouldShow = activeChapter === 2 && settled && !fadingOut;
    const targetOpacity = shouldShow ? 0.95 : 0.0;
    const current = materialRef.current.uniforms.uOpacity.value;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      materialRef.current.uniforms.uOpacity.value = targetOpacity;
    } else {
      // Smooth exponential cross-fade
      const fadeSpeed = shouldShow ? 2.5 : 5.0; // Fast fade-out before morph
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        current,
        targetOpacity,
        Math.min(1.0, delta * fadeSpeed)
      );
    }

    if (meshRef.current) {
      meshRef.current.visible = materialRef.current.uniforms.uOpacity.value > 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.02]} visible={false}>
      {/* 16:9 plane matching 1024x576 source aspect ratio */}
      <planeGeometry args={[5.2, 2.925]} />
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
