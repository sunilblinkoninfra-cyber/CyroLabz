"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Interactive3DDemo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Get current theme colors
    function getColors() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark" ||
        (!document.documentElement.getAttribute("data-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      return {
        accent: isDark ? 0x6c97ff : 0x2f6bff,
        line: isDark ? 0x2a2e35 : 0xd3d7dc,
        ink: isDark ? 0xeef0f3 : 0x0b0c0e,
      };
    }

    let colors = getColors();

    // 1. Core Icosahedron with Wireframe & Points
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: colors.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Inner Torus Rings
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: colors.ink,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.8, 0.025, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: colors.accent,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 3. Orbiting Nodes (Satellites)
    const nodeCount = 18;
    const nodes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: colors.accent });

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      scene.add(node);
      nodes.push(node);
    }

    // Pointer Interaction & Rotation Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Theme Mutation Observer to re-color 3D materials
    const observer = new MutationObserver(() => {
      colors = getColors();
      coreMat.color.setHex(colors.accent);
      ringMat1.color.setHex(colors.ink);
      ringMat2.color.setHex(colors.accent);
      nodeMat.color.setHex(colors.accent);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let reqId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * speedMultiplier;

      // Smooth damp rotation toward target
      coreMesh.rotation.y += (targetRotY - coreMesh.rotation.y) * 0.08 + 0.004;
      coreMesh.rotation.x += (targetRotX - coreMesh.rotation.x) * 0.08 + 0.002;

      ring1.rotation.z += 0.006;
      ring2.rotation.x += 0.008;

      // Position orbiting nodes in 3D paths
      for (let i = 0; i < nodeCount; i++) {
        const angle = time * 0.6 + (i * Math.PI * 2) / nodeCount;
        const radius = 2.4 + Math.sin(time + i) * 0.3;
        nodes[i].position.x = Math.cos(angle) * radius;
        nodes[i].position.y = Math.sin(angle * 1.5) * 0.8;
        nodes[i].position.z = Math.sin(angle) * radius;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, [speedMultiplier]);

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] rounded-lg border border-line bg-surface/60 backdrop-blur-md overflow-hidden group">
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Interactive Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-muted bg-bg/80 backdrop-blur-sm px-3 py-1.5 rounded border border-line">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>Three.js Interactive Demo</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() =>
            setSpeedMultiplier((prev) => (prev === 1 ? 2.5 : prev === 2.5 ? 0.4 : 1))
          }
          className="px-2.5 py-1.5 rounded border border-line bg-surface-subtle hover:border-ink font-mono text-[10px] uppercase tracking-eyebrow text-ink transition-colors"
          title="Toggle orbit velocity"
        >
          Speed: {speedMultiplier}x
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-muted hidden sm:block">
        DRAG TO ROTATE · REALTIME SHADER WIREFRAME
      </div>
    </div>
  );
};
