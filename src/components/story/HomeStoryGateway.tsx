"use client";

import React from "react";
import Link from "next/link";
import { STORY_BEATS, CORE_SERVICE_NODES } from "@/data/storyline";

export const HomeStoryGateway: React.FC = () => {
  const proofTiles = [
    {
      num: "01",
      title: "End-to-End Continuity",
      desc: "The architects who map your legacy systems are the senior engineers who author the code, write the tests, and defend the audit.",
    },
    {
      num: "02",
      title: "Secure by Design",
      desc: "Cryptographic boundaries, immutable audit logging, and private-tenant AI deployments with zero client IP exposure.",
    },
    {
      num: "03",
      title: "Outcome-Led Telemetry",
      desc: "Success measured in production: sub-100ms latency, high-concurrency ceilings, and verifiable business impact.",
    },
  ];

  return (
    <section
      className="relative z-20 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Cyrolabz Transformation Gateway"
    >
      {/* Chapter Overview Container */}
      <div className="p-8 sm:p-12 md:p-14 rounded-2xl border border-line bg-surface/85 backdrop-blur-xl shadow-xl relative">
        {/* Precision Reticles */}
        <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent pointer-events-none" />
        <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent pointer-events-none" />
        <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent pointer-events-none" />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent pointer-events-none" />

        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-eyebrow text-accent font-semibold">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>01 → 02 → 03 → 04</span>
            <span className="text-muted">•</span>
            <span>The Transformation Spine</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Your transformation, mapped across four engineered chapters.
          </h2>

          <p className="font-sans text-sm sm:text-base md:text-lg text-muted leading-relaxed">
            Every step is a discrete discipline. You can enter at any node or navigate the full sequence from initial system discovery to enterprise AI intelligence and search dominance.
          </p>
        </div>

        {/* The 4 Chapter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STORY_BEATS.map((beat) => {
            const beatServices = CORE_SERVICE_NODES.filter((n) => n.beat === beat.id);

            return (
              <div
                key={beat.id}
                className="group p-6 rounded-xl border border-line bg-surface/70 hover:border-ink transition-all flex flex-col justify-between hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-muted">
                    <span className="text-accent font-bold text-sm">{beat.num}</span>
                    <span className="uppercase tracking-eyebrow font-semibold">
                      Chapter
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-ink group-hover:text-accent transition-colors">
                    {beat.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
                    {beat.line}
                  </p>

                  <div className="pt-2 border-t border-line/60">
                    <div className="text-[10px] font-mono uppercase text-muted mb-1.5">
                      Disciplines
                    </div>
                    <ul className="space-y-1">
                      {beatServices.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={s.href}
                            className="text-xs font-mono text-ink-soft hover:text-accent flex items-center gap-1.5 transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-accent" />
                            <span>{s.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-line/50">
                  <Link
                    href={beat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-accent font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>Enter {beat.name}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Three Proof Pillars */}
        <div className="border-t border-line pt-12 mb-14">
          <div className="text-xs font-mono uppercase tracking-eyebrow text-accent font-semibold mb-6">
            The Studio Standard
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proofTiles.map((tile) => (
              <div
                key={tile.num}
                className="p-6 rounded-xl border border-line/60 bg-bg/50 space-y-2.5"
              >
                <span className="font-mono text-xs text-accent font-bold">
                  {tile.num}
                </span>
                <h4 className="font-display text-base font-semibold text-ink">
                  {tile.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                  {tile.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-line/70">
          <div>
            <h4 className="font-display text-xl font-bold text-ink">
              Ready to begin your transformation?
            </h4>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Begin at Foundation (Chapter 01) or schedule an engineering consultation with our leads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              href="/services/consulting"
              className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-eyebrow px-6 py-3.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-all shadow-sm flex-1 sm:flex-initial"
            >
              <span>Begin at Chapter 01</span>
              <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-5 py-3.5 rounded-lg border border-line hover:border-ink text-ink font-medium transition-colors flex-1 sm:flex-initial"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

