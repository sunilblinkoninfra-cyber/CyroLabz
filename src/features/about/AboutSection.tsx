"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProofTile } from "@/types";

const PROOF_TILES: ProofTile[] = [
  {
    title: "End-to-end Execution",
    subtitle: "UNIFIED LIFECYCLE OWNERSHIP",
    description:
      "We shepherd digital products from initial discovery and architectural blueprinting through production deployment, performance hardening, and continuous evolution without handoff friction.",
    specs: [
      "Discovery & systems architecture",
      "Interactive 3D & front-end engineering",
      "Backend, AI pipelines & cloud deployment",
    ],
  },
  {
    title: "Secure by Design",
    subtitle: "ENTERPRISE RIGOR",
    description:
      "Security is not a checkbox added before launch. We implement zero-trust defaults, strict data boundaries, privacy-conscious model isolation, and automated vulnerability scanning at the commit level.",
    specs: [
      "Zero-trust credential & key management",
      "Model inference data isolation",
      "Continuous CI/CD security scanning",
    ],
  },
  {
    title: "Outcome-led Engineering",
    subtitle: "MEASURED IMPACT",
    description:
      "We judge our engagements by production software running in the hands of real users—delivering reduced latency, higher reliability, and measurable operational capability rather than endless theory.",
    specs: [
      "Deterministic release timelines",
      "Verifiable performance benchmarks",
      "Production-ready handover documentation",
    ],
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Cyrolabz"
      className="relative py-28 lg:py-36 bg-surface-subtle/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-16 lg:mb-20">
          <SectionHeading
            eyebrow="02 // STUDIO PHILOSOPHY"
            title="Strategy That Ships. Technology That Holds Up."
            description="Cyrolabz was founded on a simple premise: modern software shouldn't force a compromise between aesthetic elegance and technical durability. We build digital products that look extraordinary and perform under enterprise load."
          />
        </div>

        {/* 3 Proof Tiles (Strictly zero made-up statistics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROOF_TILES.map((tile, idx) => (
            <div
              key={tile.title}
              className="bg-surface-card tech-border p-8 lg:p-10 chamfer-sm relative flex flex-col justify-between hover:border-ink transition-all duration-300 shadow-subtle"
            >
              <div>
                {/* Index & reticle badge */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
                  <span className="text-xs font-mono text-muted">
                    CORE PILLAR // 0{idx + 1}
                  </span>
                  <div className="w-2.5 h-2.5 bg-ink chamfer-sm" />
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block mb-2">
                  {tile.subtitle}
                </span>

                <h3 className="text-2xl font-display font-medium text-ink mb-4 tracking-tight">
                  {tile.title}
                </h3>

                <p className="text-sm font-sans text-muted leading-relaxed mb-8">
                  {tile.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="pt-6 border-t border-line space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">
                  VERIFIED STANDARDS:
                </span>
                {tile.specs.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-center gap-2.5 text-xs font-mono text-ink"
                  >
                    <span className="w-1.5 h-1.5 bg-ink" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
