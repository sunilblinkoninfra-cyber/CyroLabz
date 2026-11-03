"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  STORY_BEATS,
  CORE_SERVICE_NODES,
  getBeat,
  getNextNode,
  getPreviousNode,
  getStoryNode,
  getNodeStepProgress,
} from "@/data/storyline";

interface StoryConnectProps {
  nodeId: string;
  className?: string;
}

export function StoryConnect({ nodeId, className = "" }: StoryConnectProps) {
  const [mapOpen, setMapOpen] = useState(false);
  const node = getStoryNode(nodeId);
  if (!node) return null;

  const beat = getBeat(node.beat);
  const next = getNextNode(node.id);
  const previous = getPreviousNode(node.id);
  const progress = getNodeStepProgress(node.id);

  const isFinalNode = node.id === "contact";

  return (
    <section
      className={`story-connect-chassis mt-20 relative p-6 sm:p-10 md:p-12 rounded-2xl border border-line bg-surface/85 backdrop-blur-xl shadow-lg ${className}`}
      aria-label="Cyrolabz Transformation Storyline Navigator"
    >
      {/* Precision Reticle Corner Brackets */}
      <span className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-accent pointer-events-none" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-accent pointer-events-none" />
      <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-accent pointer-events-none" />
      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-accent pointer-events-none" />

      {/* Header bar: Storyline position kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-eyebrow text-accent font-semibold">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Story Spine Navigation</span>
            <span className="text-muted">•</span>
            <span className="text-muted">Chapter {beat.num}</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
            Current Node: <span className="text-accent">{node.title}</span>
            <span className="text-xs font-mono font-normal text-muted ml-2">
              ({progress.step})
            </span>
          </h3>
        </div>

        {/* Story Map Toggle Button */}
        <button
          type="button"
          onClick={() => setMapOpen(!mapOpen)}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-eyebrow px-3.5 py-2 rounded border border-line bg-surface/60 hover:border-ink hover:text-ink text-muted transition-colors self-start sm:self-auto"
          aria-expanded={mapOpen}
        >
          <span>{mapOpen ? "− Close Map" : "+ View Full Storyline Map"}</span>
        </button>
      </div>

      {/* The 4-Beat Highway Rail */}
      <div className="py-6">
        <div className="text-[11px] font-mono uppercase tracking-eyebrow text-muted mb-3">
          Transformation Highway (4 Beats)
        </div>
        <nav aria-label="Transformation Chapters">
          <ol className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STORY_BEATS.map((b) => {
              const isActive = b.id === node.beat;
              return (
                <li key={b.id} className="relative">
                  <Link
                    href={b.href}
                    className={`block p-3.5 rounded-lg border transition-all ${
                      isActive
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-line/70 bg-surface/50 hover:border-line hover:bg-surface/80"
                    }`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isActive ? "text-accent" : "text-muted"
                        }`}
                      >
                        {b.num}
                      </span>
                      {isActive && (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent text-on-accent font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="font-display text-sm font-semibold text-ink">
                      {b.name}
                    </div>
                    <div className="text-[11px] text-muted line-clamp-1 mt-0.5 font-sans">
                      {b.line}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Expandable 10-Discipline Transformation Grid */}
      {mapOpen && (
        <div className="my-6 p-5 sm:p-6 rounded-xl border border-line bg-surface/90 backdrop-blur-lg animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
            <h4 className="font-display text-base font-semibold text-ink">
              10 Engineering Disciplines in Transformation Sequence
            </h4>
            <span className="font-mono text-xs text-muted">
              Click any node to navigate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {CORE_SERVICE_NODES.map((item) => {
              const isCurrent = item.id === node.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                    isCurrent
                      ? "border-accent bg-accent text-on-accent shadow-sm"
                      : "border-line/60 bg-bg/60 hover:border-ink hover:bg-surface text-ink"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span
                        className={
                          isCurrent ? "text-on-accent" : "text-accent font-semibold"
                        }
                      >
                        {item.stepNum}
                      </span>
                      <span className={isCurrent ? "opacity-90" : "text-muted"}>
                        Ch {getBeat(item.beat).num}
                      </span>
                    </div>
                    <div
                      className={`font-display text-sm font-semibold leading-tight ${
                        isCurrent ? "text-on-accent" : "text-ink"
                      }`}
                    >
                      {item.title}
                    </div>
                  </div>
                  <div
                    className={`text-[10px] mt-2 line-clamp-1 ${
                      isCurrent ? "text-on-accent/90" : "text-muted"
                    }`}
                  >
                    {item.line}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Next Node Feature Card */}
      <div className="mt-6 pt-6 border-t border-line">
        {next && !isFinalNode ? (
          <div className="p-6 sm:p-8 rounded-xl border border-line bg-surface/70 hover:border-line/90 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-eyebrow text-accent font-semibold">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Next Transformation Node</span>
                <span className="text-muted">•</span>
                <span className="text-muted">
                  Chapter {getBeat(next.beat).num} / {getBeat(next.beat).name}
                </span>
                {next.stepNum && (
                  <>
                    <span className="text-muted">•</span>
                    <span className="text-ink">Step {next.stepNum} of 10</span>
                  </>
                )}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                {next.title}
              </h3>

              <p className="text-sm sm:text-base text-muted font-sans leading-relaxed">
                {next.line}
              </p>

              {next.deliverable && (
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-muted">
                  <span className="text-accent">Deliverable:</span>
                  <span className="text-ink font-medium">{next.deliverable}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 flex-shrink-0">
              <Link
                href={next.href}
                className="inline-flex items-center justify-center gap-2.5 font-mono text-xs uppercase tracking-eyebrow px-6 py-3.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-all shadow-sm group min-h-[44px]"
              >
                <span>Continue to {next.title}</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              {previous && (
                <Link
                  href={previous.href}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-ink transition-colors py-1"
                >
                  <span>←</span>
                  <span>Previous: {previous.title}</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Final Destination State (on /contact or story conclusion) */
          <div className="p-6 sm:p-8 rounded-xl border border-accent/40 bg-surface/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="font-mono text-xs uppercase tracking-eyebrow text-accent font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Storyline Complete</span>
                <span className="text-muted">•</span>
                <span className="text-muted">Full Journey Traversed</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                Every point in your business is ready to transform.
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                You have traversed the four beats: from Foundation to Connected Systems to Applied Intelligence and High Visibility. Let&rsquo;s engineer your real-world architecture.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-eyebrow px-6 py-3.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-all min-h-[44px]"
              >
                <span>Start a Project</span>
                <span>→</span>
              </Link>
              <Link
                href="/services/consulting"
                className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-eyebrow px-5 py-2.5 rounded-lg border border-line hover:border-ink text-ink font-medium transition-colors"
              >
                <span>Restart at Foundation (01)</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Two-Way Navigation Sub-Bar */}
      {previous && !isFinalNode && (
        <div className="mt-4 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-muted">
          <Link
            href={previous.href}
            className="hover:text-ink flex items-center gap-1 transition-colors"
          >
            <span>←</span>
            <span>Back to {previous.title}</span>
          </Link>
          <span className="text-[11px] text-muted">
            Cyrolabz Transformation Sequence
          </span>
        </div>
      )}
    </section>
  );
}
