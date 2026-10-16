"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ServiceCard, ServiceCardData } from "./ServiceCard";
import { storyBus } from "@/lib/storyStore";

interface ServiceGroup {
  id: string;
  label: string;
  tagline: string;
  isPair?: boolean;
  services: ServiceCardData[];
}

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "group-1",
    label: "GROUP 1: FOUNDATION",
    tagline: "Know where you stand.",
    isPair: true,
    services: [
      {
        num: "01",
        slug: "consulting",
        title: "Consulting",
        promise: "Clarity on where you are and where to go next.",
        whatWeDo: [
          "Map your systems, data and processes",
          "Rank opportunities by impact and effort",
          "Build a sequenced, costed roadmap",
        ],
        youGet: "A roadmap your team can start on Monday.",
        icon: "consulting",
      },
      {
        num: "02",
        slug: "audits",
        title: "Audits",
        promise: "An honest read of your systems, security and AI readiness.",
        whatWeDo: [
          "Review architecture, code and data flows",
          "Check security and privacy against standards such as GDPR and ISO 27001",
          "Score AI readiness and risk",
        ],
        youGet: "A ranked findings report, with fixes.",
        icon: "audits",
      },
    ],
  },
  {
    id: "group-2",
    label: "GROUP 2: CONNECT",
    tagline: "Build it. Wire it together.",
    services: [
      {
        num: "03",
        slug: "custom-software",
        title: "Custom Software",
        promise: "Software built around how your business actually works.",
        whatWeDo: [
          "Web apps, internal tools and platforms",
          "APIs and integrations between your systems",
          "Tested, documented and cloud-ready",
        ],
        youGet: "Software you own, and the docs to run it.",
        icon: "custom-software",
      },
      {
        num: "04",
        slug: "website-development",
        title: "Website Development",
        promise: "Fast, accessible websites that carry your brand.",
        whatWeDo: [
          "Design systems and responsive builds",
          "Performance, accessibility and clean code",
          "Content workflows your team controls",
        ],
        youGet: "A site your team can update itself.",
        icon: "website",
      },
      {
        num: "05",
        slug: "3d-interactive-design",
        title: "3D Interactive Design",
        promise: "Interactive 3D that explains your product and holds attention.",
        whatWeDo: [
          "Scroll-driven stories and product explainers",
          "Configurators and interactive demos",
          "WebGL tuned for phones and modest hardware",
        ],
        youGet: "Experiences that run smoothly on real devices.",
        icon: "3d",
      },
    ],
  },
  {
    id: "group-3",
    label: "GROUP 3: INTELLIGENCE",
    tagline: "Make it think.",
    isPair: true,
    services: [
      {
        num: "06",
        slug: "ai-enablement",
        title: "AI Enablement",
        promise: "Your team ready to use AI safely and well.",
        whatWeDo: [
          "Use-case discovery and prioritisation",
          "Governance, policy and responsible-AI frameworks",
          "Training and playbooks for your teams",
        ],
        youGet: "A clear AI policy and a team that can apply it.",
        icon: "ai-enablement",
      },
      {
        num: "07",
        slug: "ai-implementation",
        title: "AI Implementation",
        promise: "AI built into your workflows, governed from day one.",
        whatWeDo: [
          "Copilots, assistants and automation",
          "Language models grounded in your own data",
          "Evaluation, monitoring and guardrails",
        ],
        youGet: "AI in production that you can measure and trust.",
        icon: "ai-implementation",
      },
    ],
  },
  {
    id: "group-4",
    label: "GROUP 4: VISIBILITY",
    tagline: "Be found. Be answered. Be cited.",
    services: [
      {
        num: "08",
        slug: "seo",
        title: "SEO",
        fullName: "SEARCH ENGINE OPTIMISATION",
        promise: "Be found where people search.",
        whatWeDo: [
          "Technical audit: crawling, speed and indexing",
          "Content and keyword strategy built on intent",
          "Structured data and authority building",
        ],
        youGet: "A search plan with measurable targets.",
        icon: "seo",
      },
      {
        num: "09",
        slug: "aeo",
        title: "AEO",
        fullName: "ANSWER ENGINE OPTIMISATION",
        promise: "Be the answer, not just a link.",
        whatWeDo: [
          "Content structured as clear questions and answers",
          "FAQ, how-to and entity schema markup",
          "Built for featured snippets, voice and AI answer panels",
        ],
        youGet: "Pages that answer engines can quote with confidence.",
        icon: "aeo",
      },
      {
        num: "10",
        slug: "geo",
        title: "GEO",
        fullName: "GENERATIVE ENGINE OPTIMISATION",
        promise: "Be cited when AI makes a recommendation.",
        whatWeDo: [
          "Consistent, verifiable facts about your brand across the web",
          "Original, evidence-backed content worth citing",
          "Track how ChatGPT, Gemini, Perplexity and Claude describe you",
        ],
        youGet: "A visibility baseline across AI assistants, and a plan to improve it.",
        icon: "geo",
      },
    ],
  },
];

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headPanelRef = useRef<HTMLDivElement | null>(null);
  const closePanelRef = useRef<HTMLDivElement | null>(null);

  // Fade up observers for the header panel, group headers, and closing panel
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const panels = root.querySelectorAll<HTMLElement>(".scroll-fade-up:not([data-service-card])");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      panels.forEach((p) => p.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 100px 0px" }
    );

    panels.forEach((p) => {
      observer.observe(p);
    });

    return () => observer.disconnect();
  }, []);

  // Touch device hover glow: select card closest to vertical center of screen
  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch) return;

    let ticking = false;

    const onScrollOrTouch = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const section = sectionRef.current;
        if (!section) return;

        const secRect = section.getBoundingClientRect();
        // Only active if services section is in view
        if (secRect.bottom < 0 || secRect.top > window.innerHeight) {
          storyBus.setHoverGlow(null);
          return;
        }

        const cards = section.querySelectorAll<HTMLElement>("[data-service-card='true']");
        const centerY = window.innerHeight / 2;
        let bestDist = Infinity;
        let bestCard: HTMLElement | null = null;

        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const cardCenterY = r.top + r.height / 2;
          const dist = Math.abs(cardCenterY - centerY);
          if (dist < bestDist) {
            bestDist = dist;
            bestCard = card;
          }
        });

        if (bestCard && bestDist < window.innerHeight * 0.45) {
          const r = (bestCard as HTMLElement).getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const largerSide = Math.max(r.width, r.height);
          const rEdges = 0.9 * largerSide + 110;
          const rNodes = 0.85 * rEdges;
          storyBus.setHoverGlow({ cx, cy, rEdges, rNodes });
        } else {
          storyBus.setHoverGlow(null);
        }
      });
    };

    window.addEventListener("scroll", onScrollOrTouch, { passive: true });
    window.addEventListener("touchmove", onScrollOrTouch, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrTouch);
      window.removeEventListener("touchmove", onScrollOrTouch);
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-20 pt-[14vh] pb-[20vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Services"
    >
      {/* 1. Heading Panel (max-width 640px) */}
      <div
        ref={headPanelRef}
        className="services-panel scroll-fade-up max-w-[640px] rounded-lg p-7 sm:p-8 mb-16 sm:mb-20"
      >
        <span className="font-mono text-xs uppercase tracking-eyebrow text-accent font-semibold block mb-3">
          Services
        </span>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold text-ink leading-tight">
          Everything the story needs, in one team.
        </h2>
        <p className="text-muted text-sm sm:text-base leading-relaxed mt-4">
          Ten services across strategy, build, intelligence and visibility. Choose
          one, or let us wire them together.
        </p>
      </div>

      {/* 2. Four Groups */}
      <div className="space-y-16 sm:space-y-20">
        {SERVICE_GROUPS.map((group) => (
          <div key={group.id} className="space-y-6">
            {/* Small Header Panel (accent label + short line) */}
            <div className="services-panel scroll-fade-up rounded-lg px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-line">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-accent font-semibold">
                {group.label}
              </span>
              <span className="font-display text-sm sm:text-base text-ink font-medium">
                {group.tagline}
              </span>
            </div>

            {/* Card Grid: auto-fit columns with min 310px, 18px gap, perspective 1400px */}
            <div
              className={`grid gap-[18px] ${
                group.isPair
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
              style={{
                perspective: "1400px",
              }}
            >
              {group.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Closing Panel (max-width 640px) */}
      <div
        ref={closePanelRef}
        className="services-panel scroll-fade-up max-w-[640px] rounded-lg p-7 sm:p-8 mt-20 sm:mt-24 mx-auto text-center"
      >
        <p className="text-sm sm:text-base text-ink leading-relaxed">
          Search and AI results change all the time. For SEO, AEO and GEO we
          commit to the work and the measurement, not to a ranking.
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-6 py-3.5 rounded bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          >
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
};
