import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASE_STUDIES, CaseStudy } from "@/data/workData";
import { Text3DBlock } from "@/components/ui/Text3DBlock";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES[slug];
  if (!study) return { title: "Case Study Not Found" };

  return {
    title: `${study.title} — Case Study | Cyrolabz`,
    description: study.subtitle,
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study: CaseStudy | undefined = CASE_STUDIES[slug];

  if (!study) {
    notFound();
  }

  const beats = [
    {
      num: "01",
      name: "Foundation",
      label: "The Starting State",
      content: study.beats.foundation,
    },
    {
      num: "02",
      name: "Connect",
      label: "What We Wired Together",
      content: study.beats.connect,
    },
    {
      num: "03",
      name: "Intelligence",
      label: "What It Now Decides",
      content: study.beats.intelligence,
    },
  ];

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back button */}
      <div className="mb-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-eyebrow text-muted hover:text-ink transition-colors"
        >
          <span>←</span>
          <span>Back to all case studies</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-20 max-w-4xl">
        <Text3DBlock
          headlineAs="h1"
          kicker={`CASE STUDY / ${study.clientIndustry.toUpperCase()}`}
          headline={study.title}
          body={study.subtitle}
          tags={
            <div className="flex flex-wrap gap-4 text-xs font-mono text-muted">
              <div className="p-2.5 rounded border border-line bg-surface/80">
                <span className="text-muted block text-[10px]">CATEGORY</span>
                <span className="text-ink font-semibold">{study.serviceCategory}</span>
              </div>
              <div className="p-2.5 rounded border border-line bg-surface/80">
                <span className="text-muted block text-[10px]">TIMELINE</span>
                <span className="text-ink font-semibold">{study.timeline}</span>
              </div>
              <div className="p-2.5 rounded border border-line bg-surface/80">
                <span className="text-muted block text-[10px]">VERIFIED IMPACT</span>
                <span className="text-accent font-semibold">{study.beats.result[0]}</span>
              </div>
            </div>
          }
        />
      </div>

      {/* The Four Beats */}
      <div className="space-y-12 mb-24">
        {/* Beat 1, 2, 3 */}
        {beats.map((beat) => (
          <div
            key={beat.num}
            className="p-8 sm:p-12 rounded-lg border border-line bg-surface/75 space-y-4"
          >
            <div className="flex items-center gap-3 font-mono text-xs text-muted">
              <span className="text-accent font-semibold">{beat.num}</span>
              <span>/</span>
              <span className="uppercase tracking-eyebrow text-ink font-semibold">
                {beat.name}
              </span>
              <span>—</span>
              <span>{beat.label}</span>
            </div>

            <p className="text-base sm:text-lg text-ink leading-relaxed font-sans max-w-4xl">
              {beat.content}
            </p>
          </div>
        ))}

        {/* Beat 4: Result (Numbers) */}
        <div className="p-8 sm:p-12 rounded-lg border border-accent/40 bg-surface/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-accent font-semibold">04</span>
            <span>/</span>
            <span className="uppercase tracking-eyebrow text-accent font-semibold">
              Result
            </span>
            <span>—</span>
            <span className="text-ink">Production Numbers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {study.beats.result.map((metric, idx) => (
              <div
                key={idx}
                className="p-5 rounded border border-line/60 bg-bg/50 flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span className="font-mono text-sm sm:text-base text-ink font-medium leading-snug">
                  {metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center max-w-xl mx-auto space-y-6 pt-10 border-t border-line/70">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Need similar engineering results?
        </h3>
        <p className="text-sm text-muted">
          Our team can conduct a technical discovery call to assess your architecture and establish baseline milestones.
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
