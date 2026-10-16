"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface StoryChapter {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  pillars: {
    label: string;
    value: string;
    detail: string;
  }[];
  ctaText: string;
  ctaHref: string;
}

interface StoryCopyCardProps {
  chapter: StoryChapter;
  chapterIndex: number;
  totalChapters: number;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}

export function StoryCopyCard({
  chapter,
  chapterIndex,
  totalChapters,
  onNext,
  onPrev,
  className,
}: StoryCopyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return;
      // Skip on pure touch pointers to prevent jarring mobile jumps
      if (e.pointerType === "touch") return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      // Target ~7 degrees max tilt
      const maxAngle = 7;
      setTilt({
        rotX: -y * maxAngle * 2,
        rotY: x * maxAngle * 2,
      });
    },
    [reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotX: 0, rotY: 0 });
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div
      className={cn("w-full relative", className)}
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={cn(
          "w-full rounded-2xl tech-border bg-surface/85 backdrop-blur-md p-6 sm:p-8 lg:p-10",
          "shadow-subtle transition-transform duration-200 ease-out",
          "relative overflow-hidden"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: reducedMotion
            ? "none"
            : `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
        }}
      >
        {/* Subtle decorative 1px grid corner reticle */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 border-r border-t border-ink" />
        <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-20 border-l border-b border-ink" />

        {/* Layer 1: Chapter Meta & Step Counter [translateZ: 22px] */}
        <div
          className="flex items-center justify-between pb-6 mb-6 border-b border-line"
          style={{ transform: reducedMotion ? "none" : "translateZ(22px)" }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider bg-surface-subtle tech-border text-ink">
              {chapter.step}
            </span>
            <span className="text-xs font-mono tracking-widest text-muted uppercase">
              {chapter.eyebrow}
            </span>
          </div>

          <div className="text-xs font-mono tracking-wider text-muted">
            <span className="text-ink font-semibold">{chapterIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{totalChapters}</span>
          </div>
        </div>

        {/* Layer 2: Chapter Title & Subtitle [translateZ: 36px] */}
        <div
          className="mb-4"
          style={{ transform: reducedMotion ? "none" : "translateZ(36px)" }}
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-ink leading-tight">
            {chapter.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm font-mono tracking-wider text-accent uppercase font-medium">
            {chapter.subtitle}
          </p>
        </div>

        {/* Layer 3: Body Description [translateZ: 20px] */}
        <div
          className="mb-8"
          style={{ transform: reducedMotion ? "none" : "translateZ(20px)" }}
        >
          <p className="text-sm sm:text-base text-muted leading-relaxed font-sans">
            {chapter.description}
          </p>
        </div>

        {/* Layer 4: Three Technical Pillars / Metrics [translateZ: 28px] */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
          style={{ transform: reducedMotion ? "none" : "translateZ(28px)" }}
        >
          {chapter.pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-subtle/80 tech-border hover:border-line-strong transition-colors"
            >
              <div className="text-[10px] font-mono tracking-wider text-muted uppercase">
                {p.label}
              </div>
              <div className="text-sm font-display font-semibold text-ink mt-0.5">
                {p.value}
              </div>
              <div className="text-[11px] text-muted/90 mt-1 font-sans leading-tight">
                {p.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Layer 5: Actions and Stepper Controls [translateZ: 32px] */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line/60"
          style={{ transform: reducedMotion ? "none" : "translateZ(32px)" }}
        >
          <Button
            href={chapter.ctaHref}
            variant="primary"
            size="md"
            className="group"
          >
            <span>{chapter.ctaText}</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous chapter"
              disabled={chapterIndex === 0}
              className={cn(
                "w-9 h-9 rounded-full tech-border flex items-center justify-center font-mono text-sm transition-colors",
                chapterIndex === 0
                  ? "opacity-30 cursor-not-allowed text-muted"
                  : "hover:bg-surface-subtle hover:text-ink text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              )}
            >
              ←
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next chapter"
              disabled={chapterIndex === totalChapters - 1}
              className={cn(
                "w-9 h-9 rounded-full tech-border flex items-center justify-center font-mono text-sm transition-colors",
                chapterIndex === totalChapters - 1
                  ? "opacity-30 cursor-not-allowed text-muted"
                  : "hover:bg-surface-subtle hover:text-ink text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              )}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
