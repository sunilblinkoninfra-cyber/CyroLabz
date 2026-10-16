"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroMotionState } from "@/lib/scrollStore";
import { themeTokens } from "@/lib/themeStore";

const NODE_COUNT = 28;
const MAX_CONNECT_DIST = 1.85;

export function ConstellationLinesLayer() {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const [redrawKey, setRedrawKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRedrawKey((k) => k + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const linePositions = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = 1.3 + Math.random() * 2.2;
      const x = Math.cos(angle) * radius + (Math.random() > 0.4 ? 1.0 : 0);
      const y = Math.sin(angle) * (radius * 0.7);
      const z = -0.5 + Math.random() * 0.8;
      nodes.push(new THREE.Vector3(x, y, z));
    }

    const segments: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < MAX_CONNECT_DIST) {
          segments.push(nodes[i].x, nodes[i].y, nodes[i].z);
          segments.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    return new Float32Array(segments);
  }, [redrawKey]);

  useFrame(({ clock }) => {
    if (!lineSegmentsRef.current || !heroMotionState.isTabVisible) return;
    const { introProgress, pointer } = heroMotionState;

    // Parallax depth factor: 0.5
    lineSegmentsRef.current.position.x = pointer.x * 0.5;
    lineSegmentsRef.current.position.y = pointer.y * 0.45;

    const mat = lineSegmentsRef.current.material as THREE.LineBasicMaterial;
    const time = clock.getElapsedTime();
    const pulse = 0.22 + Math.sin(time * 1.8) * 0.1;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, introProgress * pulse, 0.08);

    // Theme responsiveness: tint with line / ink color
    mat.color.lerp(new THREE.Color(themeTokens.isDark ? themeTokens.line : themeTokens.muted), 0.08);
  });

  return (
    <lineSegments ref={lineSegmentsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={themeTokens.line}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </lineSegments>
  );
}
