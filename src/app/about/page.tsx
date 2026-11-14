import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Text3DBlock } from "@/components/ui/Text3DBlock";
import { StoryConnect } from "@/components/story/StoryConnect";
import { StoryNodeBadge } from "@/components/story/StoryNodeBadge";

export const metadata: Metadata = {
  title: "About Cyrolabz: One Team from Strategy to Audit",
  description:
    "Why we combine strategy, build and audit in one studio, and how we work with your team.",
  openGraph: {
    title: "About Cyrolabz: One Team from Strategy to Audit",
    description:
      "Why we combine strategy, build and audit in one studio, and how we work with your team.",
  },
  twitter: {
    title: "About Cyrolabz: One Team from Strategy to Audit",
    description:
      "Why we combine strategy, build and audit in one studio, and how we work with your team.",
  },
};

export default function AboutPage() {
  const principles = [
    {
      num: "01",
      title: "One team, start to finish",
      body: "The people who map your systems also build and test them. Delivery stays with the team that designed it.",
    },
    {
      num: "02",
      title: "Secure by Design",
      body: "Security and data protection are designed into every pipeline, index and API from the start, not added at the end.",
    },
    {
      num: "03",
      title: "Results you can check",
      body: "We report on speed, uptime, error rates and business outcomes after launch. We ship working software, not slide decks.",
    },
    {
      num: "04",
      title: "You own what we build",
      body: "You own the code, repositories, infrastructure definitions and trained models. Everything is documented so your team can run it.",
    },
  ];

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Story Node Breadcrumb */}
      <div className="mb-6 md:text-right">
        <StoryNodeBadge nodeId="about" />
      </div>

      {/* Header with settled mark scene (Scene 04: art on left, copy on right) */}
      <div className="md:min-h-[45vh] flex items-center justify-end mb-20">
        <div className="max-w-2xl text-left">
          <Text3DBlock
            headlineAs="h1"
            kicker="CYROLABZ STUDIO"
            headline="One team, from the map to the build to the audit."
            body="Years of tools, spreadsheets and systems do not fix themselves. We bring strategy, software, 3D and AI together in one team."
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
            Many projects fail at the seams: strategy that never reaches code, code built without understanding the system, and AI added on top of data that isn&apos;t ready.
          </p>
          <p>
            Cyrolabz exists to close those seams. Every engagement follows the same arc: understand what you have, connect it, add intelligence, and prove the result in production.
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
              Targeted sprints
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              2 to 6 week fixed-scope engagements: audits, architecture plans, or quick proof-of-concept AI prototypes.
            </p>
          </div>
          <div className="p-6 rounded border border-line/60 bg-bg/50 space-y-3">
            <h4 className="font-display text-lg font-semibold text-ink">
              Full-cycle delivery
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Complete builds, from discovery to launch: custom software, websites or 3D interactive design.
            </p>
          </div>
          <div className="p-6 rounded border border-line/60 bg-bg/50 space-y-3">
            <h4 className="font-display text-lg font-semibold text-ink">
              Ongoing advisory
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Ongoing senior advice, regular AI model benchmarking, and infrastructure oversight for your team.
            </p>
          </div>
        </div>
      </div>

      {/* Storyline Progression to Insights */}
      <StoryConnect nodeId="about" className="mb-20" />

      {/* CTA */}
      <div className="text-center max-w-xl mx-auto space-y-6 pt-10 border-t border-line/70">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Let’s talk about your challenge.
        </h3>
        <p className="text-sm text-muted">
          Speak with a senior lead, in plain language.
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
