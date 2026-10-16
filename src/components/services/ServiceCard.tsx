"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { storyBus } from "@/lib/storyStore";

export interface ServiceCardData {
  num: string;
  slug: string;
  title: string;
  fullName?: string;
  promise: string;
  whatWeDo: string[];
  youGet: string;
  icon: "consulting" | "audits" | "custom-software" | "website" | "3d" | "ai-enablement" | "ai-implementation" | "seo" | "aeo" | "geo";
}

interface ServiceCardProps {
  service: ServiceCardData;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver for one-time fade up (0.7s, 26px travel)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 120px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3D Tilt calculation (up to 7 deg on Y, 5 deg on X)
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    if (window.innerWidth < 820) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xNorm = (x / rect.width - 0.5) * 2; // -1 to +1
    const yNorm = (y / rect.height - 0.5) * 2; // -1 to +1

    // Tilt toward pointer: moving right tilts positive Y; moving down tilts negative X
    const rotY = (xNorm * 7).toFixed(2);
    const rotX = (-yNorm * 5).toFixed(2);

    setTiltStyle({
      transform: `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
    });
  };

  const handlePointerLeave = () => {
    setTiltStyle({
      transform: "perspective(1400px) rotateX(0deg) rotateY(0deg)",
    });
    storyBus.setHoverGlow(null);
  };

  // Hover glow triggering
  const triggerGlow = () => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const largerSide = Math.max(rect.width, rect.height);
    const rEdges = 0.9 * largerSide + 110;
    const rNodes = 0.85 * rEdges;
    storyBus.setHoverGlow({ cx, cy, rEdges, rNodes });
  };

  const handlePointerEnter = () => {
    triggerGlow();
  };

  const handleFocus = () => {
    triggerGlow();
  };

  const handleBlur = () => {
    storyBus.setHoverGlow(null);
  };

  // Dedicated SVG Icons (24px viewBox, stroke only, 1.5px stroke, currentColor)
  const renderIcon = () => {
    switch (service.icon) {
      case "consulting":
        return (
          // Route between two points
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="5" cy="19" r="2.5" />
            <circle cx="19" cy="5" r="2.5" />
            <path d="M7.5 19h4.5a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3h1" />
          </svg>
        );
      case "audits":
        return (
          // Magnifier with a check
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" />
            <path d="m8 10.5 2 2 3.5-3.5" />
          </svg>
        );
      case "custom-software":
        return (
          // Code brackets
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case "website":
        return (
          // Browser window
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <circle cx="6" cy="6.5" r="0.8" fill="currentColor" />
            <circle cx="9" cy="6.5" r="0.8" fill="currentColor" />
          </svg>
        );
      case "3d":
        return (
          // Cube
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" />
            <path d="M12 12v9" />
            <path d="m12 12 8-4.5" />
            <path d="M12 12 4 7.5" />
          </svg>
        );
      case "ai-enablement":
        return (
          // Person with a spark
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 4v6m-3-3h6" />
          </svg>
        );
      case "ai-implementation":
        return (
          // Chip
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="2" x2="9" y2="6" />
            <line x1="15" y1="2" x2="15" y2="6" />
            <line x1="9" y1="18" x2="9" y2="22" />
            <line x1="15" y1="18" x2="15" y2="22" />
            <line x1="2" y1="9" x2="6" y2="9" />
            <line x1="2" y1="15" x2="6" y2="15" />
            <line x1="18" y1="9" x2="22" y2="9" />
            <line x1="18" y1="15" x2="22" y2="15" />
          </svg>
        );
      case "seo":
        return (
          // Magnifier with bars
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" />
            <line x1="7.5" y1="13" x2="7.5" y2="11" />
            <line x1="10.5" y1="13" x2="10.5" y2="9" />
            <line x1="13.5" y1="13" x2="13.5" y2="7" />
          </svg>
        );
      case "aeo":
        return (
          // Speech bubble with a question mark
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8.5z" />
            <path d="M11 9a1.5 1.5 0 1 1 2.2 1.3c-.5.4-.7.7-.7 1.3v.4" />
            <circle cx="12.2" cy="14.8" r="0.6" fill="currentColor" />
          </svg>
        );
      case "geo":
        return (
          // Globe
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const href = `/services/${service.slug}`;

  return (
    <article
      ref={cardRef}
      data-service-card="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={tiltStyle}
      className={`svc-card rounded-lg p-6 sm:p-7 flex flex-col justify-between scroll-fade-up ${
        isVisible ? "is-visible" : ""
      }`}
    >
      {/* Top Row: Number on left, 40px icon box on right */}
      <div
        className="flex items-center justify-between transition-transform duration-150"
        style={{ transform: "translateZ(16px)" }}
      >
        <span className="font-mono text-sm tracking-wider text-muted font-medium">
          {service.num}
        </span>
        <div
          className="w-10 h-10 rounded border border-line bg-bg flex items-center justify-center text-ink"
          aria-hidden="true"
        >
          {renderIcon()}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div
        className="mt-5 space-y-1 transition-transform duration-150"
        style={{ transform: "translateZ(24px)" }}
      >
        <h3 className="font-display text-[1.5rem] font-semibold text-ink leading-tight">
          {service.title}
        </h3>
        {service.fullName && (
          <p className="font-mono text-[0.6875rem] uppercase tracking-wider text-muted">
            {service.fullName}
          </p>
        )}
      </div>

      {/* Promise */}
      <p className="text-sm text-muted leading-relaxed mt-2.5">
        {service.promise}
      </p>

      {/* WHAT WE DO */}
      <div className="mt-6">
        <h4 className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted font-semibold">
          WHAT WE DO
        </h4>
        <ul className="mt-3 space-y-2">
          {service.whatWeDo.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span
                className="inline-block w-1.5 h-1.5 bg-accent flex-shrink-0 mt-2 rounded-[1px]"
                aria-hidden="true"
              />
              <span className="text-sm text-ink leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-line/60" />

      {/* YOU GET */}
      <div>
        <h4 className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted font-semibold">
          YOU GET
        </h4>
        <p className="text-sm text-ink leading-relaxed mt-1 font-medium">
          {service.youGet}
        </p>
      </div>

      {/* Explore link pinned to bottom with margin-top: auto */}
      <div
        className="mt-auto pt-6 transition-transform duration-150"
        style={{ transform: "translateZ(20px)" }}
      >
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-colors group"
        >
          <span>Explore {service.title}</span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
};
