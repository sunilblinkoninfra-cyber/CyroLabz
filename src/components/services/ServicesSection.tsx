"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ServiceCard, ServiceCardData } from "./ServiceCard";
import { storyBus } from "@/lib/storyStore";

interface ServiceGroupData {
  id: string;
  stageIdx: number;
  stageNum: string;
  stageName: string;
  stageAction: string;
  eyebrow: string;
  headline: string;
  description: string;
  services: ServiceCardData[];
}

const SERVICE_GROUPS: ServiceGroupData[] = [
  {
    id: "carousel-consulting",
    stageIdx: 0,
    stageNum: "01",
    stageName: "CONSULTING",
    stageAction: "Diagnose",
    eyebrow: "STAGE 01 // CONSULTING | DIAGNOSE",
    headline: "Understand the system before changing it.",
    description:
      "Map your systems, data flows, and bottlenecks to build an actionable, sequenced roadmap before engineering begins.",
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
    id: "carousel-connect",
    stageIdx: 1,
    stageNum: "02",
    stageName: "CONNECT",
    stageAction: "Build",
    eyebrow: "STAGE 02 // CONNECT | BUILD",
    headline: "Turn the roadmap into connected digital solutions.",
    description:
      "Digitise manual processes and engineer platforms, APIs, custom software, and interactive 3D experiences into one unified architecture.",
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
    id: "carousel-intelligence",
    stageIdx: 2,
    stageNum: "03",
    stageName: "INTELLIGENCE",
    stageAction: "Think",
    eyebrow: "STAGE 03 // INTELLIGENCE | THINK",
    headline: "Connect systems with intelligence.",
    description:
      "Deploy domain-grounded copilots, autonomous workflows, and production-grade AI with built-in security, evaluation, and governance.",
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
    id: "carousel-visibility",
    stageIdx: 3,
    stageNum: "04",
    stageName: "VISIBILITY",
    stageAction: "Discover",
    eyebrow: "STAGE 04 // VISIBILITY | DISCOVER",
    headline: "Make knowledge discoverable across search and AI platforms.",
    description:
      "Ensure your brand, technical authority, and answers are indexed, recommended, and cited across modern search engines and AI assistants.",
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

interface GlassCarouselCardProps {
  group: ServiceGroupData;
  isActiveStage: boolean;
}

const GlassCarouselCard: React.FC<GlassCarouselCardProps> = ({
  group,
  isActiveStage,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = group.services.length;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Swipe handling for touch devices
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Horizontal swipe threshold 40px, ensuring horizontal intent
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <div
      id={group.id}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`glass-carousel-container scroll-fade-up p-6 sm:p-8 lg:p-10 transition-all duration-300 ${
        isActiveStage ? "is-active-stage" : ""
      }`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${group.stageName} carousel: ${group.headline}`}
    >
      {/* 1. Header Bar: Eyebrow, Headline, Description, and Navigation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-line/60 mb-8">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              {group.eyebrow}
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight">
            {group.headline}
          </h3>
          <p className="text-muted text-sm sm:text-base leading-relaxed">
            {group.description}
          </p>
        </div>

        {/* Carousel Controls Cluster */}
        <div className="flex items-center gap-4 self-start lg:self-end">
          {/* Step Counter */}
          <span className="font-mono text-xs tracking-wider text-muted font-medium select-none">
            0{activeIndex + 1} / 0{total}
          </span>

          {/* Interactive Pagination Indicator Pills */}
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label={`${group.stageName} card navigation`}
          >
            {group.services.map((svc, idx) => (
              <button
                key={svc.slug}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Go to ${svc.title}`}
                onClick={() => setActiveIndex(idx)}
                className={`glass-pagination-pill focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  idx === activeIndex ? "is-active" : ""
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="glass-ctrl-btn"
              onClick={handlePrev}
              aria-label={`Previous service in ${group.stageName}`}
            >
              <svg
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12.5 15l-5-5 5-5" />
              </svg>
            </button>
            <button
              type="button"
              className="glass-ctrl-btn"
              onClick={handleNext}
              aria-label={`Next service in ${group.stageName}`}
            >
              <svg
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7.5 5l5 5-5 5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Responsive Viewport:
          - On mobile (< 768px): Smoothly sliding track displaying 1 card at a time with swipe & buttons
          - On desktop (>= 768px): Refined grid layout with active card focus highlight and seamless hover glow */}
      <div className="block md:hidden overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {group.services.map((service, idx) => (
            <div key={service.slug} className="w-full flex-shrink-0 px-1">
              <ServiceCard service={service} isActive={idx === activeIndex} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop & Tablet Layout (>= 768px): Balanced Grid with Proportional Alignment */}
      <div
        className={`hidden md:grid gap-5 ${
          total === 2
            ? "grid-cols-2"
            : "grid-cols-2 lg:grid-cols-3"
        }`}
        style={{ perspective: "1400px" }}
      >
        {group.services.map((service, idx) => (
          <div
            key={service.slug}
            onClick={() => setActiveIndex(idx)}
            className="h-full cursor-pointer"
          >
            <ServiceCard service={service} isActive={idx === activeIndex} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  // Subscribe to storyBus for active service stage (0..3)
  useEffect(() => {
    const unsub = storyBus.subscribe((s) => {
      if (s >= 3.5) {
        const stage = Math.min(3, Math.max(0, Math.floor(s - 3.5)));
        setActiveStage(stage);
      }
    });
    return () => unsub();
  }, []);

  // Fade up observers for panels
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const panels = root.querySelectorAll<HTMLElement>(
      ".scroll-fade-up:not([data-service-card])"
    );
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
        if (secRect.bottom < 0 || secRect.top > window.innerHeight) {
          storyBus.setHoverGlow(null);
          return;
        }

        const cards = section.querySelectorAll<HTMLElement>(
          "[data-service-card='true']"
        );
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
      {/* 1. Services Section Intro Panel */}
      <div className="services-panel scroll-fade-up max-w-[680px] rounded-2xl p-7 sm:p-9 mb-16 sm:mb-20">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-3">
          Services // Four Core Chapters
        </span>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold text-ink leading-tight">
          Everything the story needs, in one team.
        </h2>
        <p className="text-muted text-sm sm:text-base leading-relaxed mt-4">
          Ten services across strategy, engineering, intelligence, and discoverability.
          Navigate each stage below as our connected digital architecture unfolds.
        </p>
      </div>

      {/* 2. Four Visually Distinct Glassmorphic Carousels */}
      <div className="space-y-16 sm:space-y-20">
        {SERVICE_GROUPS.map((group) => (
          <GlassCarouselCard
            key={group.id}
            group={group}
            isActiveStage={activeStage === group.stageIdx}
          />
        ))}
      </div>

      {/* 3. Closing Panel with Contact CTA */}
      <div className="services-panel scroll-fade-up max-w-[640px] rounded-2xl p-7 sm:p-8 mt-20 sm:mt-24 mx-auto text-center">
        <p className="text-sm sm:text-base text-ink leading-relaxed">
          Search, answer, and generative AI platforms evolve continuously. For SEO,
          AEO, and GEO we commit to the rigorous engineering and transparent
          measurement, not to an arbitrary ranking.
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest px-6 py-3.5 rounded bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          >
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
};
