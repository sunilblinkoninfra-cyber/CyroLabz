"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProcessStep } from "@/types";

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    phase: "PHASE 01",
    title: "Discover",
    duration: "WEEKS 1–2",
    description:
      "Deep alignment on business objectives, user workflows, and technical constraints. We map system architectures, evaluate data sources, and determine feasibility before committing code.",
    milestones: [
      "Technical discovery & stack evaluation",
      "AI feasibility & data security review",
      "Architecture specification document",
    ],
  },
  {
    number: "02",
    phase: "PHASE 02",
    title: "Design",
    duration: "WEEKS 2–4",
    description:
      "Translating architectural vision into interactive systems. High-fidelity UI prototyping, custom WebGL/3D motion studies, design system tokens, and strict UX validation.",
    milestones: [
      "Design tokens & component library",
      "Interactive 3D prototypes & shader tests",
      "Information architecture & user journeys",
    ],
  },
  {
    number: "03",
    phase: "PHASE 03",
    title: "Build",
    duration: "WEEKS 4–10",
    description:
      "Agile, type-safe full-stack engineering. Clean Next.js components, robust API integrations, custom LLM pipeline development, and test-driven development with weekly deployable builds.",
    milestones: [
      "Strict TypeScript implementation",
      "Model inference orchestration & RAG",
      "Automated unit & integration test suites",
    ],
  },
  {
    number: "04",
    phase: "PHASE 04",
    title: "Audit & Launch",
    duration: "WEEKS 10–12",
    description:
      "Rigorous pre-flight auditing. Accessibility compliance, security vulnerability scans, load testing under peak traffic, and zero-downtime deployment to production infrastructure.",
    milestones: [
      "WCAG AA accessibility validation",
      "Lighthouse 90+ performance optimization",
      "Production deployment & rollback safety",
    ],
  },
  {
    number: "05",
    phase: "PHASE 05",
    title: "Evolve",
    duration: "ONGOING",
    description:
      "Post-launch telemetry, proactive performance tuning, LLM fine-tuning based on live usage patterns, and continuous capability enhancement to maintain market leadership.",
    milestones: [
      "Real-user monitoring (RUM) & telemetry",
      "Model drift monitoring & prompt tuning",
      "Iterative feature sprints & scaling",
    ],
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="process"
      aria-label="Development Process"
      className="relative py-28 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 lg:mb-20">
          <SectionHeading
            eyebrow="03 // METHODOLOGY"
            title="Disciplined Engineering From Discovery To Evolution."
            description="Our structured 5-stage lifecycle eliminates guesswork. Predictable velocity, total transparency, and verified milestone gates at every phase."
          />
        </div>

        {/* Desktop Interactive Horizontal Timeline */}
        <div className="hidden lg:grid grid-cols-5 gap-4 relative mb-12">
          {/* Horizontal Connecting Rail */}
          <div className="absolute top-6 left-6 right-6 h-[1px] bg-line -z-10" />

          {PROCESS_STEPS.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(idx)}
                className="text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent p-2 rounded-sm"
              >
                {/* Node marker */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-300 tech-border ${
                      isSelected
                        ? "bg-ink text-bg border-ink scale-110 shadow-subtle"
                        : "bg-surface-card text-muted group-hover:border-ink group-hover:text-ink"
                    }`}
                  >
                    {step.number}
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-1">
                  {step.phase}
                </span>

                <h3
                  className={`text-lg font-display font-medium transition-colors ${
                    isSelected ? "text-accent" : "text-ink group-hover:text-ink"
                  }`}
                >
                  {step.title}
                </h3>

                <span className="text-[11px] font-mono text-muted block mt-1">
                  {step.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Card */}
        <div className="bg-surface-card tech-border p-8 sm:p-12 chamfer-sm relative shadow-subtle hidden lg:block">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-7 space-y-4">
              <div className="inline-flex items-center gap-3">
                <span className="text-xs font-mono text-accent uppercase tracking-widest font-semibold">
                  STAGE {PROCESS_STEPS[activeStep].number} OF 05
                </span>
                <span className="text-line">|</span>
                <span className="text-xs font-mono text-muted">
                  {PROCESS_STEPS[activeStep].duration}
                </span>
              </div>

              <h4 className="text-3xl font-display font-medium text-ink">
                {PROCESS_STEPS[activeStep].title} Phase
              </h4>

              <p className="text-base font-sans text-muted leading-relaxed pt-2">
                {PROCESS_STEPS[activeStep].description}
              </p>
            </div>

            <div className="col-span-5 bg-surface-subtle p-6 tech-border chamfer-sm space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted block pb-2 border-b border-line">
                VERIFIED MILESTONE GATES
              </span>
              <ul className="space-y-2.5">
                {PROCESS_STEPS[activeStep].milestones.map((m) => (
                  <li
                    key={m}
                    className="flex items-center gap-2.5 text-xs font-mono text-ink"
                  >
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Vertical Timeline */}
        <div className="lg:hidden space-y-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-surface-card tech-border p-6 sm:p-8 chamfer-sm space-y-4 shadow-subtle"
            >
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-ink text-bg flex items-center justify-center font-mono text-xs">
                    {step.number}
                  </span>
                  <span className="text-lg font-display font-medium text-ink">
                    {step.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted">
                  {step.duration}
                </span>
              </div>

              <p className="text-sm font-sans text-muted leading-relaxed">
                {step.description}
              </p>

              <div className="pt-3 border-t border-line">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">
                  KEY DELIVERABLES:
                </span>
                <ul className="space-y-1.5">
                  {step.milestones.map((m) => (
                    <li
                      key={m}
                      className="text-xs font-mono text-ink flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
