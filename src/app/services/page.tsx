import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES_DATA } from "@/data/servicesData";
import { Text3DBlock } from "@/components/ui/Text3DBlock";
import { StoryConnect } from "@/components/story/StoryConnect";
import { StoryNodeBadge } from "@/components/story/StoryNodeBadge";

export const metadata: Metadata = {
  title: "Services: Consulting, Audits, Software, AI & Search",
  description:
    "Ten services across four chapters, from mapping your systems to AI in production and search visibility. Use one, or take the full path.",
  openGraph: {
    title: "Services: Consulting, Audits, Software, AI & Search",
    description:
      "Ten services across four chapters, from mapping your systems to AI in production and search visibility. Use one, or take the full path.",
  },
  twitter: {
    title: "Services: Consulting, Audits, Software, AI & Search",
    description:
      "Ten services across four chapters, from mapping your systems to AI in production and search visibility. Use one, or take the full path.",
  },
};

export default function ServicesPage() {
  const chapters = [
    {
      chapter: "01 Foundation",
      headline: "Your business, as it stands",
      description: "Find out where you stand: a clear map of your systems, risks and opportunities.",
      services: [SERVICES_DATA["consulting"], SERVICES_DATA["audits"]],
    },
    {
      chapter: "02 Connect",
      headline: "Every system becomes a signal",
      description: "Join your tools, data and platforms into one working whole.",
      services: [
        SERVICES_DATA["custom-software"],
        SERVICES_DATA["website-development"],
        SERVICES_DATA["3d-interactive-design"],
      ],
    },
    {
      chapter: "03 Intelligence",
      headline: "Then the system starts to think",
      description: "Put AI to work on connected data, with governance built in.",
      services: [
        SERVICES_DATA["ai-enablement"],
        SERVICES_DATA["ai-implementation"],
      ],
    },
    {
      chapter: "04 Visibility",
      headline: "Be found. Be answered. Be cited.",
      description: "Be found, answered and cited by search engines and AI assistants.",
      services: [
        SERVICES_DATA["seo"],
        SERVICES_DATA["aeo"],
        SERVICES_DATA["geo"],
      ],
    },
  ];

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Story Node Breadcrumb */}
      <div className="mb-6 md:text-right">
        <StoryNodeBadge nodeId="services" />
      </div>

      {/* Header section: aligned right in Scene 02 to complement circuit artwork on left */}
      <div className="md:min-h-[45vh] flex items-center justify-end mb-20">
        <div className="max-w-2xl text-left">
          <Text3DBlock
            headlineAs="h1"
            kicker="ALL SERVICES"
            headline="From tangled systems to AI that holds up in production."
            body="Take one service or the whole path. Each stands alone; together they remove the hand-offs where projects fail."
          />
        </div>
      </div>

      {/* Services grouped by chapter */}
      <div className="space-y-24 mb-28">
        {chapters.map((group) => (
          <div key={group.chapter} className="space-y-6">
            <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-eyebrow text-accent font-semibold">
                  {group.chapter}
                </span>
                <span className="text-muted text-sm">—</span>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink">
                  {group.headline}
                </h2>
              </div>
              <p className="text-xs text-muted font-sans sm:max-w-md">
                {group.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.services.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="group p-6 rounded-lg border border-line bg-surface/75 hover:border-ink transition-all flex flex-col justify-between hover:shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-muted">
                      <span className="text-accent">{item.chapterNum}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-ink group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted leading-relaxed">
                      {item.promise}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-muted">
                    <span>See the service</span>
                    <span className="text-ink font-medium">What&apos;s included</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* "How we work" strip */}
      <div className="p-8 sm:p-12 rounded-lg border border-line bg-surface/80 backdrop-blur-md mb-24">
        <div className="max-w-2xl mb-10">
          <div className="font-mono text-xs uppercase tracking-eyebrow text-accent mb-2">
            The Cyrolabz Operating Model
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            How we take you from strategy to deployment.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              title: "Discover & Audit",
              desc: "We review your systems, code and data to see what you really have.",
            },
            {
              num: "02",
              title: "Architect & Agree",
              desc: "We define the target design and the contracts between systems, and agree the success measures.",
            },
            {
              num: "03",
              title: "Build & Iterate",
              desc: "We deliver in small, tested increments you can see and review.",
            },
            {
              num: "04",
              title: "Test & Scale",
              desc: "We stress-test, validate security, and set up the monitoring to keep it healthy.",
            },
          ].map((step) => (
            <div key={step.num} className="space-y-3 p-4 rounded border border-line/50 bg-bg/50">
              <span className="font-mono text-xs text-accent font-semibold">
                {step.num}
              </span>
              <h4 className="font-display text-base font-semibold text-ink">
                {step.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Storyline Progression to Foundation (Node 01) */}
      <StoryConnect nodeId="services" className="mb-24" />

      {/* Closing Call to Action */}
      <div className="text-center max-w-xl mx-auto space-y-6">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Ready to get started?
        </h3>
        <p className="text-sm text-muted">
          Talk directly with a senior lead. We provide an initial scope within 48 hours.
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
