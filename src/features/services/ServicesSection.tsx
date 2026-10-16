"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { updateHoveredService } from "@/lib/scrollStore";
import type { ServiceItem } from "@/types";

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "web-dev",
    ringIndex: 0,
    category: "FRONT-END ARCHITECTURE",
    title: "Website Development",
    description:
      "High-performance, accessible, and SEO-rigorous web applications crafted with Next.js and TypeScript for enduring digital presence.",
    deliverables: ["Next.js & React 19", "Micro-frontend systems", "Lighthouse 95+ performance"],
  },
  {
    id: "3d-design",
    ringIndex: 1,
    category: "SPATIAL COMPUTING",
    title: "3D Interactive Design",
    description:
      "Captivating real-time 3D web experiences powered by WebGL and React Three Fiber with zero layout shift and smooth scroll orchestration.",
    deliverables: ["R3F & Three.js", "Custom GLSL shaders", "Optimized draw calls"],
  },
  {
    id: "ai-enablement",
    ringIndex: 2,
    category: "INTELLIGENT SYSTEMS",
    title: "AI Enablement & Implementation",
    description:
      "Production-grade generative AI, bespoke LLM pipelines, autonomous agents, and RAG architectures integrated securely into your product stack.",
    deliverables: ["Agentic workflows", "Structured output", "Local & hosted models"],
  },
  {
    id: "custom-software",
    ringIndex: 3,
    category: "FULL-STACK ENGINEERING",
    title: "Custom Software Development",
    description:
      "Bespoke enterprise applications, scalable distributed backends, and robust cloud microservices engineered for high throughput.",
    deliverables: ["Event-driven architectures", "Type-safe APIs", "Zero-downtime CI/CD"],
  },
  {
    id: "consulting",
    ringIndex: 4,
    category: "STRATEGIC ADVISORY",
    title: "Technical Consulting",
    description:
      "Senior fractional CTO advisory, technology stack selection, and AI roadmap planning to derisk complex engineering initiatives.",
    deliverables: ["Architecture roadmaps", "Feasibility analysis", "Team enablement"],
  },
  {
    id: "audits",
    ringIndex: 5,
    category: "QUALITY & SECURITY",
    title: "Architecture & Code Audits",
    description:
      "Comprehensive performance, security, accessibility, and code quality evaluations that expose bottlenecks and harden systems for scale.",
    deliverables: ["WCAG 2.2 AA compliance", "Security posture reviews", "Latency profiling"],
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-label="Studio Services"
      className="relative py-28 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 lg:mb-20">
          <SectionHeading
            eyebrow="01 // CAPABILITIES"
            title="Engineered Services For High-Impact Products."
            description="We bridge the gap between creative ambition and computational rigor. Every deliverable is designed for resilience, speed, and real enterprise utility."
          />

          <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-muted uppercase tracking-widest pb-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>HOVER CARD TO SYNCHRONIZE 3D ORBIT</span>
          </div>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES_DATA.map((service, idx) => (
            <article
              key={service.id}
              onMouseEnter={() => updateHoveredService(service.ringIndex)}
              onMouseLeave={() => updateHoveredService(-1)}
              className="group relative bg-surface-card/90 backdrop-blur-sm tech-border p-8 transition-all duration-300 hover:border-ink hover:shadow-subtle flex flex-col justify-between chamfer-sm"
            >
              {/* Corner Ring Motif SVG (echoes the concentric hero artwork) */}
              <div className="absolute top-6 right-6 w-12 h-12 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  viewBox="0 0 48 48"
                  className="w-full h-full text-ink group-hover:text-accent group-hover:rotate-90 transition-all duration-500"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="4"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div>
                {/* Header with index and category */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted">
                    [ 0{idx + 1} ]
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-surface-subtle text-ink chamfer-sm">
                    {service.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-display font-medium text-ink mb-3 group-hover:text-accent transition-colors duration-200">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm font-sans text-muted leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Deliverable pills */}
                <ul className="space-y-1.5 pt-4 border-t border-line">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="text-xs font-mono text-muted flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-muted group-hover:bg-accent rounded-full transition-colors" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link */}
              <div className="mt-8 pt-4 border-t border-line flex items-center justify-between">
                <a
                  href="#contact"
                  className="text-xs font-mono uppercase tracking-tech text-ink group-hover:text-accent font-semibold flex items-center gap-2 transition-colors"
                >
                  <span>Inquire for {service.title}</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
