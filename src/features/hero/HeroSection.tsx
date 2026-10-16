"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { HeroPoster } from "./HeroPoster";
import { cn } from "@/lib/utils";

// Lazy-load live R3F layered canvas with dynamic import (ssr: false)
const HeroCanvas = dynamic(
  () => import("@/three/hero/HeroCanvas").then((mod) => mod.HeroCanvas),
  { ssr: false }
);

const CAPABILITY_CHIPS = [
  "Website Development",
  "3D Interactive Design",
  "AI Enablement",
  "Custom Software",
  "Consulting",
  "Audits",
];

export function HeroSection() {
  const [sceneReady, setSceneReady] = useState(false);
  const [textRevealed, setTextRevealed] = useState(false);

  useEffect(() => {
    // Intro sequence: text reveals at t=1.2s
    const textTimer = setTimeout(() => {
      setTextRevealed(true);
    }, 1200);

    return () => clearTimeout(textTimer);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Cyrolabz Hero Introduction"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* 1. Static Poster (Instant LCP & fallback with CSS parallax) */}
      <HeroPoster isCrossfaded={sceneReady} />

      {/* 2. Live 8-Layer 3D R3F Canvas (Fades in once initialized) */}
      <HeroCanvas onLoaded={() => setSceneReady(true)} />

      {/* 3. Semantic Accessible Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-10rem)]">
          {/* Left Column: Negative space allocated specifically for the live core orb */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" />

          {/* Right Column: Hero Typography & Controls */}
          <div
            className={cn(
              "lg:col-span-7 flex flex-col justify-center space-y-7 lg:pl-6 transition-all duration-1000",
              textRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3">
              <span className="w-2 h-2 bg-accent inline-block transform rotate-45 shadow-sm" />
              <span className="text-xs uppercase font-mono tracking-eyebrow text-ink-700 font-semibold">
                AI · SOFTWARE · 3D · AUDITS
              </span>
              <span className="h-[1px] w-12 bg-ink-300" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-display font-medium text-ink-950 tracking-tight leading-[1.08]">
              Engineering Intelligence Into Everything You Build.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl font-sans text-ink-700 leading-relaxed max-w-2xl font-normal">
              Cyrolabz helps businesses turn ideas into intelligent, immersive
              digital products. From AI implementation and custom software to
              interactive 3D websites, we design, build, and audit systems that
              perform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href="#contact" size="lg" variant="primary">
                Start a Project →
              </Button>
              <Button href="#services" size="lg" variant="secondary">
                Explore Our Services
              </Button>
            </div>

            {/* Capability Chips */}
            <div className="pt-5 border-t border-ink-200/80">
              <span className="block text-[11px] font-mono uppercase tracking-widest text-ink-500 mb-3">
                CORE CAPABILITIES //
              </span>
              <div className="flex flex-wrap gap-2">
                {CAPABILITY_CHIPS.map((chip) => (
                  <Chip key={chip} label={chip} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue at Bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none text-ink-500 text-xs font-mono uppercase tracking-widest animate-pulse-subtle">
          <span>Scroll to explore</span>
          <span className="text-sm font-bold">↓</span>
        </div>
      </div>
    </section>
  );
}
