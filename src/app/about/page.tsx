import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Text3DBlock } from "@/components/ui/Text3DBlock";

export const metadata: Metadata = {
  title: "About — Engineering Principles & Founding Story",
  description:
    "Cyrolabz is a technology studio that carries companies from technical strategy to custom software build to forensic audit.",
};

export default function AboutPage() {
  const principles = [
    {
      num: "01",
      title: "End-to-End Continuity",
      body: "We do not hand off architectural blueprints to offshore subcontractors. The architects who map your systems are the engineers who write the code, author the tests, and defend the audit.",
    },
    {
      num: "02",
      title: "Secure by Design",
      body: "Security and data sovereignty are never an afterthought. Every data pipeline, vector index, and API contract is engineered with strict cryptographic boundaries, zero PII exposure, and immutable audit logs.",
    },
    {
      num: "03",
      title: "Outcome-Led Engineering",
      body: "We measure success in production telemetry: latency reduction, concurrency ceilings, error rate declines, and verified business conversions. We ship working software, not speculative decks.",
    },
    {
      num: "04",
      title: "Zero Vendor Lock-in",
      body: "You own all code, repositories, infrastructure definitions, and trained weights. Everything we build is modular, strictly typed, and cleanly documented so your internal teams can maintain it independently.",
    },
  ];

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with settled mark scene (Scene 04: art on left, copy on right) */}
      <div className="md:min-h-[45vh] flex items-center justify-end mb-20">
        <div className="max-w-2xl text-left">
          <Text3DBlock
            headlineAs="h1"
            kicker="04 / CYROLABZ STUDIO"
            headline="One multidisciplinary team. Built for continuous transformation."
            body="Years of tools, spreadsheets and systems do not fix themselves. We bridge the gap between high-level architectural strategy, custom full-stack development, real-time 3D graphics, and applied intelligence."
          />
        </div>
      </div>

      {/* Founding Story */}
      <div className="mb-24 p-8 sm:p-12 rounded-lg border border-line bg-surface/75 space-y-6 max-w-4xl">
        <div className="font-mono text-xs uppercase tracking-eyebrow text-accent">
          Founding Story
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Why Cyrolabz exists
        </h2>
        <div className="space-y-4 text-muted text-base leading-relaxed">
          <p>
            Most technology engagements fail at the seams. Management consultants propose theoretical transformations without writing a line of code. Software shops build feature tickets without understanding underlying system bottlenecks. AI agencies bolt speculative models onto unindexed, broken data pipelines.
          </p>
          <p>
            Cyrolabz was founded to collapse those siloes into one unified discipline. We treat every client engagement as a coherent four-beat progression: understanding the existing Foundation, Connecting disparate platforms into a unified nervous system, deploying Intelligence to automate decisions, and proving the Result in production.
          </p>
          <p>
            Every point in our mark began as a point in our clients’ businesses. We engineer systems designed to last, adapt, and scale.
          </p>
        </div>
      </div>

      {/* Engineering Principles */}
      <div className="mb-28">
        <div className="border-b border-line pb-4 mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Our Core Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((pr) => (
            <div
              key={pr.num}
              className="p-8 rounded-lg border border-line bg-surface/70 space-y-3"
            >
              <span className="font-mono text-xs text-accent font-semibold">
                {pr.num}
              </span>
              <h3 className="font-display text-xl font-semibold text-ink">
                {pr.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {pr.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How We Work / Engagement Models */}
      <div className="mb-24 p-8 sm:p-12 rounded-lg border border-line bg-surface/80 backdrop-blur-md">
        <div className="max-w-2xl mb-8">
          <div className="font-mono text-xs uppercase tracking-eyebrow text-accent mb-2">
            Engagement Formats
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            How we partner with client teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded border border-line/60 bg-bg/50 space-y-3">
            <h4 className="font-display text-lg font-semibold text-ink">
              1. Targeted Sprints
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              2 to 6 week fixed-scope engagements: Forensic Audits, Architecture Blueprints, or rapid Proof-of-Concept AI agent prototypes.
            </p>
          </div>
          <div className="p-6 rounded border border-line/60 bg-bg/50 space-y-3">
            <h4 className="font-display text-lg font-semibold text-ink">
              2. Full-Cycle Delivery
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Complete end-to-end builds: Custom Software, Website Development, or 3D Interactive Design from technical discovery through production deployment.
            </p>
          </div>
          <div className="p-6 rounded border border-line/60 bg-bg/50 space-y-3">
            <h4 className="font-display text-lg font-semibold text-ink">
              3. Strategic Retainers
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Dedicated engineering advisory, continuous AI model benchmarking, and infrastructure oversight for high-velocity technology teams.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center max-w-xl mx-auto space-y-6 pt-10 border-t border-line/70">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Let’s discuss your technical challenges.
        </h3>
        <p className="text-sm text-muted">
          Connect with an engineering director. We speak in concrete architectures, not sales jargon.
        </p>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-6 py-3.5 rounded bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-colors"
          >
            Start a project
          </Link>
        </div>
      </div>
    </div>
  );
}
