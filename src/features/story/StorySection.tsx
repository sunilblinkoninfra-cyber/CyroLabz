"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StoryCopyCard, type StoryChapter } from "./StoryCopyCard";

// Dynamic import with SSR: false for Three.js canvas
const StoryMorphCanvas = dynamic(
  () =>
    import("@/three/story/StoryMorphCanvas").then((mod) => mod.StoryMorphCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[380px] lg:min-h-[560px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-line border-t-accent animate-spin" />
      </div>
    ),
  }
);

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "foundation",
    step: "01",
    eyebrow: "Architectural Core",
    title: "Resilient Digital Foundations",
    subtitle: "High-Throughput Monolith & Cloud Modernization",
    description:
      "Every transformative technology begins with architectural integrity. We dismantle legacy friction, re-engineering core systems with sub-millisecond edge routing, type-safe data pipelines, and scalable cloud topologies engineered for zero downtime.",
    pillars: [
      {
        label: "Latency",
        value: "<12ms",
        detail: "Edge routed global compute",
      },
      {
        label: "Topology",
        value: "99.99%",
        detail: "Fault-tolerant microservices",
      },
      {
        label: "Integrity",
        value: "100%",
        detail: "Strict type-safe schemas",
      },
    ],
    ctaText: "Explore Architecture",
    ctaHref: "#services",
  },
  {
    id: "connect",
    step: "02",
    eyebrow: "Distributed Systems",
    title: "Harmonized Network Ecosystems",
    subtitle: "Real-Time Nervous Systems & Event Streams",
    description:
      "Transforming fragmented silos into an interconnected nervous system. We architect real-time event streaming brokers, high-throughput gRPC and WebSocket mesh networks, and resilient data synchronization layers that keep distributed platforms in lockstep.",
    pillars: [
      {
        label: "Sync Speed",
        value: "Sub-Second",
        detail: "Distributed event replication",
      },
      {
        label: "Protocols",
        value: "gRPC / WSS",
        detail: "Multiplexed bidirectional streams",
      },
      {
        label: "Resilience",
        value: "Self-Healing",
        detail: "Automated circuit breakers",
      },
    ],
    ctaText: "Discover Integrations",
    ctaHref: "#services",
  },
  {
    id: "intelligence",
    step: "03",
    eyebrow: "Cognitive AI",
    title: "Autonomous Intelligence & Vision",
    subtitle: "Frontier Multimodal Models & Agent Orchestration",
    description:
      "Infusing raw computational infrastructure with cognitive depth. We build context-aware Retrieval-Augmented Generation (RAG) engines, deterministic agent swarms, and bespoke neural inference pipelines tailored to high-stakes enterprise decisions.",
    pillars: [
      {
        label: "Inference",
        value: "<80ms",
        detail: "Quantized on-prem & edge inference",
      },
      {
        label: "Accuracy",
        value: "Audited",
        detail: "Deterministic factual guardrails",
      },
      {
        label: "Autonomy",
        value: "Multi-Agent",
        detail: "Supervised self-optimizing loops",
      },
    ],
    ctaText: "Deploy Enterprise AI",
    ctaHref: "#contact",
  },
  {
    id: "cyrolabz",
    step: "04",
    eyebrow: "Engineered Reality",
    title: "The Cyrolabz Transformation",
    subtitle: "End-to-End Strategic Engineering & Advisory",
    description:
      "Where architectural discipline meets artificial intelligence. From strategic audits and technical consulting to production software and immersive 3D web systems, Cyrolabz partners with visionaries to engineer enduring technical superiority.",
    pillars: [
      {
        label: "Delivery",
        value: "Full Cycle",
        detail: "Design, code, audit & deploy",
      },
      {
        label: "Quality",
        value: "Production",
        detail: "Zero outsourcing, rigorous tests",
      },
      {
        label: "Impact",
        value: "Compound",
        detail: "Long-term proprietary IP assets",
      },
    ],
    ctaText: "Initiate Engagement",
    ctaHref: "#contact",
  },
];

export function StorySection() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  // Safe chapter navigation with graceful cross-fade out for overlays
  const goToChapter = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeChapter) return;

      // If leaving Chapter 2 (Intelligence) or Chapter 3 (Cyrolabz), trigger quick fade out first
      if (activeChapter === 2 || activeChapter === 3) {
        setFadingOut(true);
        setTimeout(() => {
          setActiveChapter(targetIndex);
          setFadingOut(false);
        }, 220);
      } else {
        setActiveChapter(targetIndex);
      }
    },
    [activeChapter]
  );

  const nextChapter = useCallback(() => {
    goToChapter((activeChapter + 1) % STORY_CHAPTERS.length);
  }, [activeChapter, goToChapter]);

  const prevChapter = useCallback(() => {
    goToChapter(
      (activeChapter - 1 + STORY_CHAPTERS.length) % STORY_CHAPTERS.length
    );
  }, [activeChapter, goToChapter]);

  // Keyboard navigation when section is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextChapter();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevChapter();
    }
  };

  // Autoplay progression (paused on reduced motion, user hover or focus)
  useEffect(() => {
    if (reducedMotion || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextChapter();
    }, 7500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextChapter, isPaused, reducedMotion]);

  // Desktop side alternation:
  // Chapter 0: scene right (copy left, scene right) -> isSceneLeft = false
  // Chapter 1: scene left (scene left, copy right) -> isSceneLeft = true
  // Chapter 2: scene right (copy left, scene right) -> isSceneLeft = false
  // Chapter 3: scene left (scene left, copy right) -> isSceneLeft = true
  const isSceneLeftOnDesktop = activeChapter === 1 || activeChapter === 3;

  return (
    <section
      id="story"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Digital Transformation Story"
      className="relative py-24 sm:py-32 border-b border-line bg-bg focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      {/* Decorative Technical Reticle Accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <SectionHeading
            eyebrow="02 / DIGITAL TRANSFORMATION"
            title="From Raw Foundation to Engineered Autonomy"
            description="Experience the evolution of digital capability: architectural resilience, distributed networking, cognitive AI integration, and the unified Cyrolabz discipline."
          />

          {/* Chapter Selector Stepper */}
          <div
            role="tablist"
            aria-label="Story Chapters"
            className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-surface-subtle tech-border self-start md:self-auto overflow-x-auto max-w-full"
          >
            {STORY_CHAPTERS.map((ch, idx) => {
              const isActive = activeChapter === idx;
              return (
                <button
                  key={ch.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`chapter-panel-${ch.id}`}
                  onClick={() => goToChapter(idx)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap",
                    isActive
                      ? "bg-ink text-bg font-semibold shadow-subtle"
                      : "text-muted hover:text-ink hover:bg-surface/60"
                  )}
                >
                  <span className="text-[10px] opacity-70">{ch.step}</span>
                  <span>{ch.eyebrow.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Stage */}
        <div
          id={`chapter-panel-${STORY_CHAPTERS[activeChapter].id}`}
          role="tabpanel"
          className="relative min-h-[580px] lg:min-h-[640px] flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          {/* 
            Desktop Layout Alternation:
            - Chapter 0 & 2: Copy is left (lg:order-1), Scene is right (lg:order-2)
            - Chapter 1 & 3: Scene is left (lg:order-1), Copy is right (lg:order-2)
            Mobile:
            - Scene is ALWAYS stacked above copy (order-1 on scene, order-2 on copy)
          */}

          {/* 3D Scene Viewport */}
          <div
            className={cn(
              "w-full lg:w-1/2 flex items-center justify-center relative",
              "order-1", // Mobile: always stacked on top
              isSceneLeftOnDesktop ? "lg:order-1" : "lg:order-2" // Desktop alternation
            )}
          >
            <div className="w-full max-w-[580px] aspect-square rounded-2xl tech-border bg-surface-subtle/40 p-2 sm:p-4 relative overflow-hidden backdrop-blur-sm">
              {/* Corner reticles */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-muted/60 select-none">
                SYS.MORPH // CH_0{activeChapter + 1}
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-muted/60 select-none">
                PTS.2600 // R3F.LIVE
              </div>

              {/* R3F Dynamic Particle Canvas */}
              <StoryMorphCanvas
                activeChapter={activeChapter}
                fadingOut={fadingOut}
              />

              {/* Bottom chapter status bar */}
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[10px] font-mono text-muted/70 pt-2 border-t border-line/40 select-none">
                <span className="uppercase">
                  {STORY_CHAPTERS[activeChapter].title}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  REAL-TIME SYNCHRONIZED
                </span>
              </div>
            </div>
          </div>

          {/* 3D Copy Card */}
          <div
            className={cn(
              "w-full lg:w-1/2 flex items-center justify-center",
              "order-2", // Mobile: stacked below scene
              isSceneLeftOnDesktop ? "lg:order-2" : "lg:order-1" // Desktop alternation
            )}
          >
            <StoryCopyCard
              chapter={STORY_CHAPTERS[activeChapter]}
              chapterIndex={activeChapter}
              totalChapters={STORY_CHAPTERS.length}
              onNext={nextChapter}
              onPrev={prevChapter}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
