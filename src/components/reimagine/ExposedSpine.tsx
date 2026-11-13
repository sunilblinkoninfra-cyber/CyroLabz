"use client";

import React from "react";
import type { SignatureId, TransformationSignature } from "@/data/reimagineData";

interface ExposedSpineProps {
  signatures: TransformationSignature[];
  activeId: SignatureId;
  onSelect: (id: SignatureId) => void;
}

export const ExposedSpine: React.FC<ExposedSpineProps> = ({
  signatures,
  activeId,
  onSelect,
}) => {
  const activeIndex = signatures.findIndex((s) => s.id === activeId);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = signatures[(idx + 1) % signatures.length];
      onSelect(next.id);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = signatures[(idx - 1 + signatures.length) % signatures.length];
      onSelect(prev.id);
    }
  };

  return (
    <>
      {/* Mobile & Tablet Horizontal Exposed-Stitch Rail */}
      <nav
        aria-label="Transformation signatures"
        className="lg:hidden border-b border-[var(--rg-rule)] bg-[var(--rg-paper-inset)] px-4 py-3"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-[var(--rg-muted)]">
            Exposed spine · {activeIndex + 1} of {signatures.length} open
          </span>
          <span className="reimagine-mono text-xs text-[var(--rg-muted)]">
            {signatures[activeIndex]?.index} / 04
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5" role="tablist">
          {signatures.map((sig, idx) => {
            const isActive = sig.id === activeId;
            const isBound = idx <= activeIndex;
            return (
              <button
                key={sig.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(sig.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`relative px-2 py-2.5 text-left border transition-colors ${
                  isActive
                    ? "border-[var(--rg-thread)] bg-[var(--rg-paper)] text-[var(--rg-ink)]"
                    : "border-[var(--rg-rule)] bg-transparent text-[var(--rg-muted)] hover:text-[var(--rg-ink)]"
                }`}
              >
                <span className="block reimagine-mono text-xs leading-none mb-1" style={{
                  color: isActive ? "var(--rg-thread)" : isBound ? "var(--rg-ink-soft)" : "var(--rg-muted)",
                }}>
                  {sig.index}
                </span>
                <span className="block text-xs font-semibold truncate">
                  {sig.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Central Vertical Coptic Chain-Stitch Gutter */}
      <nav
        aria-label="Transformation spine"
        className="hidden lg:flex flex-col items-center justify-between py-8 px-3 border-x border-[var(--rg-rule)] bg-[var(--rg-paper-inset)] select-none relative"
      >
        {/* Continuous vertical linen thread axis */}
        <svg
          aria-hidden="true"
          viewBox="0 0 36 520"
          className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-9 h-[calc(100%-2rem)] pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Base linen cord */}
          <line
            x1="18"
            y1="8"
            x2="18"
            y2="512"
            stroke="var(--rg-linen)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Active stitched thread progress from signature 01 down to active signature */}
          <line
            x1="18"
            y1="38"
            x2="18"
            y2={38 + activeIndex * 146}
            stroke="var(--rg-thread)"
            strokeWidth="2"
          />
          {/* Chain-stitch loops between stations */}
          {signatures.slice(0, -1).map((sig, idx) => {
            const yTop = 58 + idx * 146;
            const yMid = yTop + 53;
            const yBot = yTop + 106;
            const isStitched = idx < activeIndex;
            const strokeColor = isStitched ? "var(--rg-thread)" : "var(--rg-linen)";
            return (
              <g key={sig.id}>
                <path
                  d={`M 18 ${yTop} C 8 ${yTop + 20}, 8 ${yMid - 10}, 18 ${yMid} C 28 ${yMid + 10}, 28 ${yBot - 20}, 18 ${yBot}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
                <circle cx="18" cy={yMid} r="2.2" fill={strokeColor} />
              </g>
            );
          })}
        </svg>

        {signatures.map((sig, idx) => {
          const isActive = sig.id === activeId;
          const isVisited = idx <= activeIndex;

          return (
            <button
              key={sig.id}
              type="button"
              aria-pressed={isActive}
              aria-label={`Open signature ${sig.index}: ${sig.name}`}
              onClick={() => onSelect(sig.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative z-10 w-24 py-2.5 px-2 border text-center transition-colors ${
                isActive
                  ? "border-[var(--rg-thread)] bg-[var(--rg-paper)] text-[var(--rg-ink)] shadow-sm"
                  : isVisited
                    ? "border-[var(--rg-rule-strong)] bg-[var(--rg-paper)] text-[var(--rg-ink-soft)] hover:border-[var(--rg-thread)]"
                    : "border-[var(--rg-rule)] bg-[var(--rg-paper-inset)] text-[var(--rg-muted)] hover:border-[var(--rg-rule-strong)] hover:text-[var(--rg-ink)]"
              }`}
            >
              {/* Exposed kettle-stitch knot markers on left & right of station */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-0.5"
                style={{
                  backgroundColor: isActive ? "var(--rg-thread)" : "var(--rg-linen)",
                }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-0.5"
                style={{
                  backgroundColor: isActive ? "var(--rg-thread)" : "var(--rg-linen)",
                }}
              />

              <span
                className="block reimagine-mono text-xs font-medium leading-none mb-1"
                style={{
                  color: isActive ? "var(--rg-thread)" : "var(--rg-muted)",
                }}
              >
                {sig.index}
              </span>
              <span className="block text-xs font-semibold tracking-tight">
                {sig.name}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
