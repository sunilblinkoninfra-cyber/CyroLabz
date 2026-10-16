"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  uniform vec3 uColorTop;
  uniform vec3 uColorBottom;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    float grad = (1.0 - vUv.y * 0.7) + (vUv.x * 0.3);
    vec3 baseCol = mix(uColorBottom, uColorTop, clamp(grad, 0.0, 1.0));

    // Subtle technical film grain
    float grain = (hash(vUv * 800.0) - 0.5) * 0.025;
    vec3 finalCol = baseCol + grain;

    gl_FragColor = vec4(finalCol, uOpacity);
  }
`;

export function BackgroundLayer() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0.0 },
      uColorTop: { value: new THREE.Color("#FFFFFF") },
      uColorBottom: { value: new THREE.Color("#F4F5F7") },
    }),
    []
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const { introProgress, pointer } = heroMotionState;

    // Intro fade in
    uniforms.uOpacity.value = THREE.MathUtils.lerp(
      uniforms.uOpacity.value,
      introProgress,
      0.08
    );

    // Dynamic theming: adapt top and bottom colors to current theme
    if (themeTokens.isDark) {
      uniforms.uColorTop.value.lerp(new THREE.Color("#101217"), 0.08);
      uniforms.uColorBottom.value.lerp(new THREE.Color("#0A0B0D"), 0.08);
    } else {
      uniforms.uColorTop.value.lerp(new THREE.Color("#FFFFFF"), 0.08);
      uniforms.uColorBottom.value.lerp(new THREE.Color("#EBECEF"), 0.08);
    }

    // Subtle parallax depth factor: 0.1
    meshRef.current.position.x = pointer.x * 0.08;
    meshRef.current.position.y = pointer.y * 0.06;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -4.5]}>
      <planeGeometry args={[26, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
