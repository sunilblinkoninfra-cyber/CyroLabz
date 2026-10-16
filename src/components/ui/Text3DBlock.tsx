"use client";

import React, { useRef, useState, useEffect } from "react";

interface Text3DBlockProps {
  kicker?: React.ReactNode;
  headline: React.ReactNode;
  body?: React.ReactNode;
  outcome?: React.ReactNode;
  tags?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  headlineAs?: "h1" | "h2" | "h3";
  side?: "left" | "right";
  variant?: "default" | "chassis";
}

export const Text3DBlock: React.FC<Text3DBlockProps> = ({
  kicker,
  headline,
  body,
  outcome,
  tags,
  actions,
  className = "",
  headlineAs = "h2",
  side = "left",
  variant = "default",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  useEffect(() => {
    // Check touch and reduced motion
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isReduced) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let animId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);

      targetRotX = Math.max(-6, Math.min(6, -dy * 6));
      targetRotY = Math.max(-5, Math.min(5, dx * 5));
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const updateTilt = () => {
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;
      setRotX(currentRotX);
      setRotY(currentRotY);
      animId = requestAnimationFrame(updateTilt);
    };
    animId = requestAnimationFrame(updateTilt);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const HeadlineTag = headlineAs;

  const content = (
    <>
      {kicker && (
        <div
          className="layer-kicker mb-3 block"
          style={{ transform: "translateZ(12px)" }}
        >
          {kicker}
        </div>
      )}

      <HeadlineTag
        className={`layer-headline font-display ${
          variant === "chassis"
            ? "text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold"
            : "text-2xl sm:text-3xl md:text-5xl font-semibold"
        } tracking-tight text-ink leading-[1.18] mb-3 extrusion-shadow`}
        style={{ transform: "translateZ(20px)" }}
      >
        {headline}
      </HeadlineTag>

      {/* Narrative Lead Body placed immediately below headline for natural reading flow */}
      {body && (
        <div
          className="layer-body font-sans text-xs sm:text-sm md:text-[15px] text-muted leading-relaxed max-w-xl mb-3.5"
          style={{ transform: "translateZ(26px)" }}
        >
          {body}
        </div>
      )}

      {/* Outcome line: semibold, ink colour, sits between body and tags, same translateZ depth as body (26px), hidden under 820px */}
      {outcome && (
        <div
          className="layer-outcome hidden min-[820px]:block font-sans text-xs sm:text-sm md:text-[15px] font-semibold text-ink leading-relaxed max-w-xl mb-3.5"
          style={{ transform: "translateZ(26px)" }}
        >
          {outcome}
        </div>
      )}

      {/* Specular divider in chassis mode before cards */}
      {variant === "chassis" && tags && (
        <div className="glass-divider my-3.5" style={{ transform: "translateZ(18px)" }} />
      )}

      {/* Modular Cards / Tags */}
      {tags && (
        <div
          className="layer-tags my-3"
          style={{ transform: "translateZ(34px)" }}
        >
          {tags}
        </div>
      )}

      {/* Bottom Actions / Telemetry */}
      {actions && (
        <div
          className="layer-actions mt-4 pt-1"
          style={{ transform: "translateZ(38px)" }}
        >
          {actions}
        </div>
      )}
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`perspective-container ${className}`}
      style={{ perspective: "1300px" }}
    >
      <div
        className="copy-tilt-card transform-gpu"
        style={{
          transformOrigin: side === "right" ? "100% 50%" : "0% 50%",
          transform: `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
        }}
      >
        {variant === "chassis" ? (
          <div className="glass-chassis rounded-2xl p-5 sm:p-6 md:p-7 relative">
            {/* Precision Drafting Reticle Corner Brackets */}
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent" />
            {content}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};
