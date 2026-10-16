"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CASE_STUDIES } from "@/data/workData";
import { Text3DBlock } from "@/components/ui/Text3DBlock";

export default function WorkPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const categories = [
    "All",
    "Consulting & Audits",
    "Custom Software & Web",
    "AI Enablement & Implementation",
  ];

  const caseStudiesList = Object.values(CASE_STUDIES);

  const filteredStudies = caseStudiesList.filter((item) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Consulting & Audits") {
      return (
        item.serviceCategory.includes("Consulting") ||
        item.serviceCategory.includes("Audits")
      );
    }
    if (selectedFilter === "Custom Software & Web") {
      return (
        item.serviceCategory.includes("Custom Software") ||
        item.serviceCategory.includes("Website Development") ||
        item.serviceCategory.includes("3D Interactive")
      );
    }
    if (selectedFilter === "AI Enablement & Implementation") {
      return item.serviceCategory.includes("AI");
    }
    return true;
  });

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header: aligned right in Scene 02 */}
      <div className="md:min-h-[45vh] flex items-center justify-end mb-16">
        <div className="max-w-2xl text-left">
          <Text3DBlock
            headlineAs="h1"
            kicker="02 → 03 / CONNECTED RESULTS"
            headline="Proof, measured in production."
            body="Real client engineering transformations across legacy modernisations, high-concurrency custom platforms, 3D interactive graphics, and secure AI agent deployments."
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-16 flex flex-wrap gap-2.5 border-b border-line pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`font-mono text-xs uppercase tracking-eyebrow px-4 py-2 rounded border transition-colors ${
              selectedFilter === cat
                ? "bg-accent text-on-accent border-accent font-semibold"
                : "border-line bg-surface/60 text-muted hover:text-ink hover:border-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Case studies list */}
      <div className="space-y-12">
        {filteredStudies.map((study, idx) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="group block p-8 sm:p-10 rounded-lg border border-line bg-surface/75 hover:border-ink transition-all hover:shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted">
                  <span className="text-accent font-semibold">0{idx + 1}</span>
                  <span>/</span>
                  <span className="text-ink">{study.serviceCategory}</span>
                  <span>/</span>
                  <span>{study.clientIndustry}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink group-hover:text-accent transition-colors">
                  {study.title}
                </h2>

                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  {study.subtitle}
                </p>

                {/* The 4-beat summary strip */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-muted">
                  <div className="p-2.5 rounded bg-bg/60 border border-line/50">
                    <div className="text-[10px] uppercase text-accent font-semibold mb-1">
                      01 Foundation
                    </div>
                    <div className="line-clamp-2 text-ink">
                      {study.beats.foundation}
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-bg/60 border border-line/50">
                    <div className="text-[10px] uppercase text-accent font-semibold mb-1">
                      02 Connect
                    </div>
                    <div className="line-clamp-2 text-ink">
                      {study.beats.connect}
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-bg/60 border border-line/50">
                    <div className="text-[10px] uppercase text-accent font-semibold mb-1">
                      03 Intelligence
                    </div>
                    <div className="line-clamp-2 text-ink">
                      {study.beats.intelligence}
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-bg/60 border border-line/50">
                    <div className="text-[10px] uppercase text-accent font-semibold mb-1">
                      04 Result
                    </div>
                    <div className="text-accent font-semibold truncate">
                      {study.beats.result[0]}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-line/60">
                <span className="font-mono text-xs text-muted">
                  Timeline: {study.timeline}
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-eyebrow px-4 py-2.5 rounded border border-line group-hover:border-ink group-hover:bg-accent group-hover:text-on-accent transition-all text-ink font-semibold">
                  <span>View beats</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
