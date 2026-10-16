import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import { Text3DBlock } from "@/components/ui/Text3DBlock";
import { Interactive3DDemo } from "@/components/interactive/Interactive3DDemo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} — ${service.chapter} | Cyrolabz`,
    description: service.promise,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service: ServiceItem | undefined = SERVICES_DATA[slug];

  if (!service) {
    notFound();
  }

  const is3DDesign = slug === "3d-interactive-design";

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Header with Chapter label & headline (aligned right for Chapter 02) */}
      <div className={`mb-16 max-w-2xl ${service.chapterNum === "02" ? "md:ml-auto" : ""}`}>
        <Text3DBlock
          headlineAs="h1"
          kicker={`${service.chapterNum} / ${service.chapter.toUpperCase()}`}
          headline={service.title}
          body={service.promise}
          tags={
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-line bg-surface/80 font-mono text-xs text-muted">
              <span>Audience:</span>
              <span className="text-ink font-medium">{service.whoItIsFor}</span>
            </div>
          }
        />
      </div>

      {/* Interactive 3D Demo strictly on 3d-interactive-design */}
      {is3DDesign && (
        <div className="mb-20">
          <div className="mb-4">
            <h3 className="font-mono text-xs uppercase tracking-eyebrow text-muted">
              Live WebGL / Three.js Interactive Inspection
            </h3>
          </div>
          <Interactive3DDemo />
        </div>
      )}

      {/* 2. What We Do (4 bullets) */}
      <div className="mb-20">
        <div className="border-b border-line pb-4 mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            What we do
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.whatWeDo.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-line bg-surface/70 flex items-start gap-4"
            >
              <span className="font-mono text-xs text-accent font-semibold pt-0.5">
                0{idx + 1}
              </span>
              <p className="text-sm sm:text-base text-ink leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How We Work (4 steps) */}
      <div className="mb-20 p-8 sm:p-12 rounded-lg border border-line bg-surface/80 backdrop-blur-md">
        <div className="border-b border-line/60 pb-4 mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            How we work
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.howWeWork.map((step) => (
            <div key={step.step} className="space-y-3 p-4 rounded border border-line/50 bg-bg/50">
              <span className="font-mono text-xs text-accent font-semibold">
                {step.step}
              </span>
              <h4 className="font-display text-base font-semibold text-ink">
                {step.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. What You Get (Deliverables) */}
      <div className="mb-20">
        <div className="border-b border-line pb-4 mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            What you get
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.whatYouGet.map((deliv, idx) => (
            <div
              key={idx}
              className="p-5 rounded border border-line/70 bg-surface/60 flex items-center gap-3 text-sm text-ink"
            >
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <span>{deliv}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Proof: Linked Case Study */}
      <div className="mb-20 p-8 rounded-lg border border-line bg-surface/75">
        <div className="text-xs font-mono uppercase tracking-eyebrow text-muted mb-2">
          Verified Outcome Proof
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
              {service.caseStudy.title}
            </h3>
            <p className="font-mono text-xs text-accent">
              {service.caseStudy.metric}
            </p>
          </div>
          <Link
            href={`/work/${service.caseStudy.slug}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-eyebrow px-5 py-3 rounded border border-line hover:border-ink transition-colors font-medium text-ink"
          >
            <span>Read full case study</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 6. Related Services */}
      <div className="mb-24">
        <div className="border-b border-line pb-4 mb-6">
          <h3 className="font-mono text-xs uppercase tracking-eyebrow text-muted">
            Neighbouring Services in Chapter {service.chapterNum}
          </h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {service.relatedServices.map((rel) => (
            <Link
              key={rel.slug}
              href={`/services/${rel.slug}`}
              className="inline-flex items-center gap-3 px-4 py-3 rounded border border-line bg-surface hover:border-ink text-sm font-mono transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-ink font-semibold">{rel.title}</span>
              <span className="text-muted">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 7. Call to Action */}
      <div className="text-center max-w-xl mx-auto space-y-6 pt-10 border-t border-line/70">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Start your {service.title} project.
        </h3>
        <p className="text-sm text-muted">
          Schedule an engineering consultation or submit your specifications for a comprehensive proposal.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-6 py-3.5 rounded bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-colors"
          >
            Start a project
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-6 py-3.5 rounded border border-line hover:border-ink font-medium text-ink transition-colors"
          >
            Book a Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
