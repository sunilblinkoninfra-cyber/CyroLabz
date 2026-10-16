import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES_DATA } from "@/data/servicesData";
import { Text3DBlock } from "@/components/ui/Text3DBlock";

export const metadata: Metadata = {
  title: "Services — Connected Engineering & Applied AI",
  description:
    "Ten disciplines across four transformation chapters: Strategy, Systems, Intelligence, and Visibility (including SEO, AEO and GEO).",
};

export default function ServicesPage() {
  const chapters = [
    {
      chapter: "01 Foundation",
      headline: "Your business, as it stands",
      description: "Assess tech debt, audit codebases, and map modernisation architectures.",
      services: [SERVICES_DATA["consulting"], SERVICES_DATA["audits"]],
    },
    {
      chapter: "02 Connect",
      headline: "Every system becomes a signal",
      description: "We digitise your processes and wire platforms, APIs and custom software into one connected whole.",
      services: [
        SERVICES_DATA["custom-software"],
        SERVICES_DATA["website-development"],
        SERVICES_DATA["3d-interactive-design"],
      ],
    },
    {
      chapter: "03 Intelligence",
      headline: "Then the system starts to think",
      description: "Deploy secure RAG pipelines, fine-tuned copilots, and autonomous agents.",
      services: [
        SERVICES_DATA["ai-enablement"],
        SERVICES_DATA["ai-implementation"],
      ],
    },
    {
      chapter: "04 Visibility",
      headline: "Be found. Be answered. Be cited.",
      description: "Search, answer and generative engine optimisation built on factual consistency, structured schema, and verifiable authority.",
      services: [
        SERVICES_DATA["seo"],
        SERVICES_DATA["aeo"],
        SERVICES_DATA["geo"],
      ],
    },
  ];

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header section: aligned right in Scene 02 to complement circuit artwork on left */}
      <div className="md:min-h-[45vh] flex items-center justify-end mb-20">
        <div className="max-w-2xl text-left">
          <Text3DBlock
            headlineAs="h1"
            kicker="02 / CONNECTED PLATFORM"
            headline="Engineering disciplines built for continuous transformation."
            body="We do not build isolated widgets or deliver slide decks that collect dust. Every service is a stage in one journey: moving from legacy systems to connected, intelligent software."
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
                    <span>Learn more</span>
                    <span className="text-ink font-medium">Read specs</span>
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
              desc: "Forensic code review, dependency mapping, and data readiness check.",
            },
            {
              num: "02",
              title: "Architect & Contract",
              desc: "Strict type schemas, OpenAPI contracts, and blueprint authoring.",
            },
            {
              num: "03",
              title: "Engineer & Iterate",
              desc: "Rapid delivery in small, tested increments with immutable CI/CD.",
            },
            {
              num: "04",
              title: "Audit & Scale",
              desc: "Load stress testing, security validation, and long-term telemetry.",
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

      {/* Closing Call to Action */}
      <div className="text-center max-w-xl mx-auto space-y-6">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Ready to engineer your transformation?
        </h3>
        <p className="text-sm text-muted">
          Talk directly with our lead architects. We provide an initial technical scope within 48 hours.
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
