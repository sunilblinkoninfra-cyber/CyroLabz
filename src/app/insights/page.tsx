"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INSIGHTS_DATA } from "@/data/insightsData";
import { Text3DBlock } from "@/components/ui/Text3DBlock";

export default function InsightsPage() {
  const [selectedChapter, setSelectedChapter] = useState("All");

  const articles = Object.values(INSIGHTS_DATA);

  const filteredArticles = articles.filter((art) => {
    if (selectedChapter === "All") return true;
    return art.chapter === selectedChapter;
  });

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header: aligned right in Scene 04 */}
      <div className="md:min-h-[45vh] flex items-center justify-end mb-16">
        <div className="max-w-2xl text-left">
          <Text3DBlock
            headlineAs="h1"
            kicker="04 / INSIGHTS & ENGINEERING"
            headline="Technical analysis, architecture patterns, and production telemetry."
            body="Field notes from our engineering team on software modernisation, applied AI pipelines, 3D graphics, and forensic technical auditing."
          />
        </div>
      </div>

      {/* Chapter Filters */}
      <div className="mb-14 flex flex-wrap gap-2.5 border-b border-line pb-6">
        {["All", "Foundation", "Connect", "Intelligence"].map((chap) => (
          <button
            key={chap}
            onClick={() => setSelectedChapter(chap)}
            className={`font-mono text-xs uppercase tracking-eyebrow px-4 py-2 rounded border transition-colors ${
              selectedChapter === chap
                ? "bg-accent text-on-accent border-accent font-semibold"
                : "border-line bg-surface/60 text-muted hover:text-ink hover:border-ink"
            }`}
          >
            {chap === "All" ? "All Chapters" : `Chapter ${chap}`}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((art) => (
          <Link
            key={art.slug}
            href={`/insights/${art.slug}`}
            className="group p-8 rounded-lg border border-line bg-surface/75 hover:border-ink transition-all flex flex-col justify-between hover:shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span className="text-accent uppercase tracking-eyebrow">
                  {art.chapterNum} / {art.chapter}
                </span>
                <span>{art.readTime}</span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink group-hover:text-accent transition-colors">
                {art.title}
              </h2>

              <p className="text-sm text-muted leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-muted">
              <span>{art.date}</span>
              <span className="text-ink font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read article</span>
                <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
