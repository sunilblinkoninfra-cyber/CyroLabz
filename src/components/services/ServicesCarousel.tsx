"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface ServiceItemData {
  title: string;
  fullName?: string;
  promise: string;
  bullets: string[];
  youGet: string;
  href: string;
  icon: string;
}

interface SlideData {
  num: string;
  group: string;
  tagline: string;
  services: ServiceItemData[];
}

const SLIDES: SlideData[] = [
  {
    num: "01",
    group: "FOUNDATION",
    tagline: "Know where you stand.",
    services: [
      {
        title: "Consulting",
        promise: "Clarity on where you are and where to go next.",
        bullets: [
          "Map your systems, data and processes",
          "Rank opportunities by impact and effort",
          "Build a sequenced, costed roadmap",
        ],
        youGet: "A roadmap your team can start on Monday.",
        href: "/services/consulting",
        icon: "consulting",
      },
      {
        title: "Audits",
        promise: "An honest read of your systems, security and AI readiness.",
        bullets: [
          "Review architecture, code and data flows",
          "Check security and privacy against standards such as GDPR and ISO 27001",
          "Score AI readiness and risk",
        ],
        youGet: "A ranked findings report, with fixes.",
        href: "/services/audits",
        icon: "audits",
      },
    ],
  },
  {
    num: "02",
    group: "CONNECT",
    tagline: "Build it. Wire it together.",
    services: [
      {
        title: "Custom Software",
        promise: "Software built around how your business actually works.",
        bullets: [
          "Web apps, internal tools and platforms",
          "APIs and integrations between your systems",
          "Tested, documented and cloud-ready",
        ],
        youGet: "Software you own, and the docs to run it.",
        href: "/services/custom-software",
        icon: "custom-software",
      },
      {
        title: "Website Development",
        promise: "Fast, accessible websites that carry your brand.",
        bullets: [
          "Design systems and responsive builds",
          "Performance, accessibility and clean code",
          "Content workflows your team controls",
        ],
        youGet: "A site your team can update itself.",
        href: "/services/website-development",
        icon: "website",
      },
      {
        title: "3D Interactive Design",
        promise: "Interactive 3D that explains your product and holds attention.",
        bullets: [
          "Scroll-driven stories and product explainers",
          "Configurators and interactive demos",
          "WebGL tuned for phones and modest hardware",
        ],
        youGet: "Experiences that run smoothly on real devices.",
        href: "/services/3d-interactive-design",
        icon: "3d",
      },
    ],
  },
  {
    num: "03",
    group: "INTELLIGENCE",
    tagline: "Make it think.",
    services: [
      {
        title: "AI Enablement",
        promise: "Your team ready to use AI safely and well.",
        bullets: [
          "Use-case discovery and prioritisation",
          "Governance, policy and responsible-AI frameworks",
          "Training and playbooks for your teams",
        ],
        youGet: "A clear AI policy and a team that can apply it.",
        href: "/services/ai-enablement",
        icon: "ai-enablement",
      },
      {
        title: "AI Implementation",
        promise: "AI built into your workflows, governed from day one.",
        bullets: [
          "Copilots, assistants and automation",
          "Language models grounded in your own data",
          "Evaluation, monitoring and guardrails",
        ],
        youGet: "AI in production that you can measure and trust.",
        href: "/services/ai-implementation",
        icon: "ai-implementation",
      },
    ],
  },
  {
    num: "04",
    group: "VISIBILITY",
    tagline: "Be found. Be answered. Be cited.",
    services: [
      {
        title: "SEO",
        fullName: "Search Engine Optimisation",
        promise: "Be found where people search.",
        bullets: [
          "Technical audit: crawling, speed and indexing",
          "Content and keyword strategy built on intent",
          "Structured data and authority building",
        ],
        youGet: "A search plan with measurable targets.",
        href: "/services/seo",
        icon: "seo",
      },
      {
        title: "AEO",
        fullName: "Answer Engine Optimisation",
        promise: "Be the answer, not just a link.",
        bullets: [
          "Content structured as clear questions and answers",
          "FAQ, how-to and entity schema markup",
          "Built for featured snippets, voice and AI answer panels",
        ],
        youGet: "Pages that answer engines can quote with confidence.",
        href: "/services/aeo",
        icon: "aeo",
      },
      {
        title: "GEO",
        fullName: "Generative Engine Optimisation",
        promise: "Be cited when AI makes a recommendation.",
        bullets: [
          "Consistent, verifiable facts about your brand across the web",
          "Original, evidence-backed content worth citing",
          "Track how ChatGPT, Gemini, Perplexity and Claude describe you",
        ],
        youGet: "A visibility baseline across AI assistants, and a plan to improve it.",
        href: "/services/geo",
        icon: "geo",
      },
    ],
  },
];

function smoothstep(x: number) {
  return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
}

function renderServiceIcon(icon: string) {
  const common = "w-[18px] h-[18px] stroke-current text-ink";
  switch (icon) {
    case "consulting":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="5" cy="18" r="2.5" />
          <circle cx="19" cy="6" r="2.5" />
          <path d="M7.5 16.5C11 14 13 13.5 14 10.5C14.8 8.1 16.5 6.5 16.5 6.5" strokeDasharray="2 2" />
          <path d="M7.5 16.5C10 14.5 12 14 14 11C15.2 9.2 16.5 6.5 16.5 6.5" />
        </svg>
      );
    case "audits":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="7" />
          <path d="M15.5 15.5L21 21" />
          <path d="M7.5 10.5L9.5 12.5L14 8" />
        </svg>
      );
    case "custom-software":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M8 7L3 12L8 17" />
          <path d="M16 7L21 12L16 17" />
          <path d="M14 4L10 20" />
        </svg>
      );
    case "website":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M3 9H21" />
          <circle cx="6.5" cy="6.5" r="0.75" fill="currentColor" />
          <circle cx="9.5" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      );
    case "3d":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z" />
          <path d="M12 12V21.5" />
          <path d="M12 12L20.5 7.5" />
          <path d="M12 12L3.5 7.5" />
        </svg>
      );
    case "ai-enablement":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="8.5" cy="7" r="3.5" />
          <path d="M3 20V18C3 15 5.5 12.5 8.5 12.5C10.2 12.5 11.7 13.2 12.7 14.3" />
          <path d="M18 9L18.8 11.2L21 12L18.8 12.8L18 15L17.2 12.8L15 12L17.2 11.2Z" />
          <path d="M18 17L18.4 18.1L19.5 18.5L18.4 18.9L18 20L17.6 18.9L16.5 18.5L17.6 18.1Z" />
        </svg>
      );
    case "ai-implementation":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <rect x="9" y="9" width="6" height="6" rx="0.75" />
          <path d="M9 2V5 M15 2V5 M9 19V22 M15 19V22 M2 9H5 M2 15H5 M19 9H22 M19 15H22" />
        </svg>
      );
    case "seo":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <path d="M15 15L21 21" />
          <path d="M7.5 11.5V10 M10 11.5V8 M12.5 11.5V9" />
        </svg>
      );
    case "aeo":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M21 11.5C21 15.6 17.2 19 12.5 19C11.1 19 9.8 18.7 8.6 18.1L3.5 19.5L4.9 15.8C3.7 14.6 3 13.1 3 11.5C3 7.4 6.8 4 11.5 4C16.2 4 21 7.4 21 11.5Z" />
          <path d="M11 9C11.3 8.4 12 8.2 12.6 8.5C13.2 8.8 13.5 9.4 13.2 10C12.8 10.7 12 11 12 11.8" />
          <circle cx="12" cy="14" r="0.5" fill="currentColor" />
        </svg>
      );
    case "geo":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9H20.4" />
          <path d="M3.6 15H20.4" />
          <path d="M11.5 3C9.8 6 9.2 9 9.2 12C9.2 15 9.8 18 11.5 21" />
          <path d="M12.5 3C14.2 6 14.8 9 14.8 12C14.8 15 14.2 18 12.5 21" />
        </svg>
      );
    default:
      return null;
  }
}

interface ServicesCarouselProps {
  s: number;
}

export const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ s }) => {
  const [viewportW, setViewportW] = useState(1280);
  const [viewportH, setViewportH] = useState(800);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      setViewportW(window.innerWidth);
      setViewportH(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Container opacity: smoothstep((s - 3.55) / 0.4)
  const containerOpacity = smoothstep((s - 3.55) / 0.4);
  const isContainerVisible = containerOpacity >= 0.01;
  const isInteractive = containerOpacity > 0.9;

  // Carousel position cp
  let cp = 0;
  if (s >= 4) {
    const a = Math.min(6, Math.floor(s));
    cp = a - 4 + smoothstep((s - a - 0.3) / 0.5);
  }

  // Active slide index (0 to 3)
  const activeSlide = Math.min(3, Math.max(0, Math.round(cp)));

  // Navigation: goTo(i) scrolls to py = 0.94 * S + vh * (0.85 + i)
  const goTo = useCallback((i: number) => {
    const S = 4.6 * window.innerHeight;
    const vh = window.innerHeight;
    const py = 0.94 * S + vh * (0.85 + i);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: py,
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  // Keyboard navigation when s is above 3.9
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (s <= 3.9) return;
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(Math.min(3, activeSlide + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(Math.max(0, activeSlide - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [s, activeSlide, goTo]);

  // Horizontal pointer drag / swipe (> 70px)
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const diff = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (diff < -70) {
      goTo(Math.min(3, activeSlide + 1));
    } else if (diff > 70) {
      goTo(Math.max(0, activeSlide - 1));
    }
  };

  // Layout geometry
  const isMobile = viewportW <= 820;
  const marginSide = Math.max(16, 0.035 * viewportW);
  const deckWidth = Math.min(1240, viewportW - 2 * marginSide);
  const topPad = isMobile ? 70 : 84;
  const bottomPad = isMobile ? 88 : 96;
  const areaHeight = Math.max(420, viewportH - topPad - bottomPad);
  const areaCenterY = topPad + areaHeight / 2;

  // Cap desktop diagonal height at 585px so slant bleed (72px) always exceeds tan(11deg) * H/2 (~57px)
  const desktopDeckHeight = Math.min(585, areaHeight);
  const collapsedVisible = viewportW >= 1100 ? 124 : 96;
  const bleedX = 72;

  // Note under controls appears only on slide 4
  const noteOpacity = Math.max(0, Math.min(1, (cp - 2.3) / 0.7));

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Services"
      className="absolute inset-0 z-20 overflow-hidden"
      style={{
        opacity: containerOpacity,
        visibility: isContainerVisible ? "visible" : "hidden",
        pointerEvents: isInteractive ? "auto" : "none",
        touchAction: "pan-y",
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {!isMobile ? (
        /* DESKTOP: Diagonal Slanted Glass Accordion Deck */
        <div
          className="absolute left-1/2"
          style={{
            top: `${areaCenterY}px`,
            width: `${deckWidth}px`,
            height: `${desktopDeckHeight}px`,
            transform: "translate(-50%, -50%)",
            borderRadius: "22px",
            overflow: "hidden",
            border: "1px solid var(--glass-line)",
            boxShadow:
              "inset 0 1px 0 var(--glass-edge), 0 30px 60px -28px var(--glass-shadow)",
          }}
        >
          <div
            className="flex h-full"
            style={{
              marginLeft: `-${bleedX}px`,
              marginRight: `-${bleedX}px`,
              width: `calc(100% + ${bleedX * 2}px)`,
            }}
          >
            {SLIDES.map((slide, i) => {
              const isCurrent = i === activeSlide;
              const isFirst = i === 0;
              const isLast = i === SLIDES.length - 1;
              const isThreeCol = slide.services.length === 3;

              // Collapsed width compensates for left/right bleed so visible slice stays uniform
              const collapsedBasis =
                isFirst || isLast ? collapsedVisible + bleedX : collapsedVisible;

              return (
                <article
                  key={slide.num}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of 4: ${slide.group.charAt(0) + slide.group.slice(1).toLowerCase()}`}
                  data-active={isCurrent ? "true" : "false"}
                  className="diagonal-slice h-full"
                  style={{
                    flex: isCurrent ? "1 1 0%" : `0 0 ${collapsedBasis}px`,
                    zIndex: 10 - i,
                  }}
                >
                  <div className="diagonal-slice-unskew relative">
                    {!isCurrent ? (
                      /* COLLAPSED DIAGONAL SLICE */
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Open ${slide.num} ${slide.group} services`}
                        className="group w-full h-full flex flex-col justify-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent cursor-pointer transition-transform duration-300"
                        style={{
                          paddingLeft: isFirst ? `${bleedX + 18}px` : "18px",
                          paddingRight: isLast ? `${bleedX + 14}px` : "14px",
                        }}
                      >
                        <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                          <span
                            style={{
                              fontFamily: "var(--f-display), 'Sora', sans-serif",
                              fontSize:
                                viewportW >= 1100
                                  ? "clamp(2.35rem, 3.2vw, 3.1rem)"
                                  : "2rem",
                              lineHeight: 0.94,
                              letterSpacing: "-0.04em",
                            }}
                            className="block font-light text-ink/80 group-hover:text-accent transition-colors select-none"
                          >
                            {slide.num}
                          </span>

                          <span
                            style={{
                              fontFamily: "var(--f-display), 'Sora', sans-serif",
                              fontSize: viewportW >= 1100 ? "11.5px" : "9.5px",
                              letterSpacing: "0.09em",
                            }}
                            className="block mt-2 uppercase font-semibold text-ink group-hover:text-accent transition-colors whitespace-nowrap select-none"
                          >
                            {slide.group}
                          </span>

                          <span
                            style={{
                              fontFamily: "var(--f-label), 'Michroma', sans-serif",
                              fontSize: "8.5px",
                              letterSpacing: "0.08em",
                            }}
                            className="mt-4 inline-flex items-center gap-1 uppercase text-muted group-hover:text-ink transition-colors select-none"
                          >
                            <span>{slide.services.length} Services</span>
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            >
                              ↗
                            </span>
                          </span>
                        </div>
                      </button>
                    ) : (
                      /* EXPANDED ACTIVE SLICE */
                      <div
                        className="no-scrollbar h-full w-full overflow-y-auto flex flex-col justify-between"
                        style={{
                          paddingTop: "24px",
                          paddingBottom: "22px",
                          paddingLeft: isFirst ? `${bleedX + 26}px` : "66px",
                          paddingRight: isLast ? `${bleedX + 26}px` : "66px",
                        }}
                      >
                        {/* Header Row */}
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-baseline gap-3.5 min-w-0">
                              <span
                                style={{
                                  fontFamily: "var(--f-display), 'Sora', sans-serif",
                                  fontSize: "clamp(2rem, 2.8vw, 2.65rem)",
                                  lineHeight: 0.95,
                                  letterSpacing: "-0.04em",
                                  color: "var(--accent)",
                                }}
                                className="font-light select-none shrink-0"
                              >
                                {slide.num}
                              </span>

                              <div className="min-w-0">
                                <span
                                  style={{
                                    fontFamily: "var(--f-label), 'Michroma', sans-serif",
                                    fontSize: "10px",
                                    letterSpacing: "0.14em",
                                    color: "var(--accent)",
                                  }}
                                  className="uppercase font-medium block mb-1 select-none"
                                >
                                  {slide.group}
                                </span>
                                <h3
                                  style={{
                                    fontFamily: "var(--f-display), 'Sora', sans-serif",
                                    fontSize: "clamp(1.35rem, 2.1vw, 1.85rem)",
                                    lineHeight: 1.12,
                                    letterSpacing: "-0.025em",
                                    color: "var(--ink)",
                                  }}
                                  className="font-medium"
                                >
                                  {slide.tagline}
                                </h3>
                              </div>
                            </div>

                            <span
                              style={{
                                fontFamily: "var(--f-label), 'Michroma', sans-serif",
                                fontSize: "10px",
                                letterSpacing: "0.14em",
                                background: "var(--glass-b)",
                                border: "1px solid var(--glass-line)",
                                borderRadius: "999px",
                                padding: "4px 12px 3px",
                              }}
                              className="text-muted uppercase select-none shrink-0"
                            >
                              <span className="text-ink font-semibold">{slide.num}</span> / 04
                            </span>
                          </div>

                          {/* Inner Glass Service Cards */}
                          <div
                            className={`grid gap-[13px] ${
                              isThreeCol
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1 md:grid-cols-2"
                            }`}
                          >
                            {slide.services.map((svc) => (
                              <div
                                key={svc.title}
                                style={{
                                  borderRadius: "16px",
                                  padding: isThreeCol
                                    ? "15px 15px 14px"
                                    : "18px 18px 16px",
                                  border: "1px solid var(--glass-line)",
                                  background: "var(--glass-in)",
                                  WebkitBackdropFilter: "blur(16px)",
                                  backdropFilter: "blur(16px)",
                                }}
                                className="flex flex-col justify-between transition-colors hover:border-accent/50"
                              >
                                <div>
                                  {/* Icon + Title */}
                                  <div className="flex items-start gap-2.5 mb-2">
                                    <div
                                      style={{
                                        width: "34px",
                                        height: "34px",
                                        minWidth: "34px",
                                        borderRadius: "9px",
                                        border: "1px solid var(--glass-line)",
                                        background: "var(--glass-a)",
                                      }}
                                      className="flex items-center justify-center shrink-0"
                                    >
                                      {renderServiceIcon(svc.icon)}
                                    </div>

                                    <div className="min-w-0">
                                      <h4
                                        style={{
                                          fontFamily: "var(--f-display), 'Sora', sans-serif",
                                          fontSize: isThreeCol ? "1.05rem" : "1.15rem",
                                          lineHeight: 1.22,
                                          color: "var(--ink)",
                                        }}
                                        className="font-semibold tracking-tight"
                                      >
                                        {svc.title}
                                      </h4>

                                      {svc.fullName && (
                                        <p
                                          style={{
                                            fontFamily: "var(--f-label), 'Michroma', sans-serif",
                                            fontSize: "8.5px",
                                            letterSpacing: "0.07em",
                                            color: "var(--muted)",
                                            marginTop: "2px",
                                          }}
                                          className="uppercase"
                                        >
                                          {svc.fullName}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Promise */}
                                  <p
                                    style={{
                                      fontFamily: "var(--f-body), 'Manrope', sans-serif",
                                      fontSize: isThreeCol ? "12.5px" : "13.5px",
                                      lineHeight: 1.42,
                                      color: "var(--muted)",
                                      marginBottom: "11px",
                                    }}
                                  >
                                    {svc.promise}
                                  </p>

                                  {/* 3 Bullets */}
                                  <ul className="space-y-1.5 mb-3">
                                    {svc.bullets.map((b, bIdx) => (
                                      <li
                                        key={bIdx}
                                        style={{
                                          fontFamily: "var(--f-body), 'Manrope', sans-serif",
                                          fontSize: isThreeCol ? "12px" : "12.5px",
                                          lineHeight: 1.38,
                                          color: "var(--ink)",
                                        }}
                                        className="flex items-start gap-2"
                                      >
                                        <span
                                          style={{
                                            width: "5px",
                                            height: "5px",
                                            minWidth: "5px",
                                            background: "var(--accent)",
                                            marginTop: "5.5px",
                                          }}
                                          className="shrink-0 rounded-[1px]"
                                          aria-hidden="true"
                                        />
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Divider, YOU GET, Explore Link */}
                                <div>
                                  <div
                                    style={{
                                      height: "1px",
                                      background: "var(--glass-line)",
                                      margin: "10px 0 8px",
                                    }}
                                    aria-hidden="true"
                                  />

                                  <div className="mb-2.5">
                                    <span
                                      style={{
                                        fontFamily: "var(--f-label), 'Michroma', sans-serif",
                                        fontSize: "8.5px",
                                        letterSpacing: "0.14em",
                                        color: "var(--muted)",
                                      }}
                                      className="uppercase block mb-0.5"
                                    >
                                      YOU GET
                                    </span>
                                    <p
                                      style={{
                                        fontFamily: "var(--f-body), 'Manrope', sans-serif",
                                        fontSize: isThreeCol ? "12px" : "12.5px",
                                        lineHeight: 1.35,
                                        color: "var(--ink)",
                                      }}
                                      className="font-medium"
                                    >
                                      {svc.youGet}
                                    </p>
                                  </div>

                                  <div className="pt-1">
                                    <Link
                                      href={svc.href}
                                      style={{
                                        fontFamily: "var(--f-label), 'Michroma', sans-serif",
                                        fontSize: "9.5px",
                                        letterSpacing: "0.1em",
                                        color: "var(--ink)",
                                      }}
                                      className="group inline-flex items-center gap-1.5 uppercase font-medium hover:text-accent transition-colors"
                                    >
                                      <span>Explore {svc.title}</span>
                                      <span
                                        aria-hidden="true"
                                        className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                                      >
                                        &rarr;
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        /* MOBILE: Diagonal-Accented Vertical Glass Accordion */
        <div
          className="absolute left-1/2 no-scrollbar overflow-y-auto space-y-2.5"
          style={{
            top: `${areaCenterY}px`,
            width: `${deckWidth}px`,
            maxHeight: `${areaHeight}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {SLIDES.map((slide, i) => {
            const isCurrent = i === activeSlide;

            return (
              <article
                key={slide.num}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of 4: ${slide.group}`}
                style={{
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, var(--glass-a), var(--glass-b))",
                  WebkitBackdropFilter: "blur(10px) saturate(1.5)",
                  backdropFilter: "blur(10px) saturate(1.5)",
                  border: isCurrent
                    ? "1px solid var(--accent)"
                    : "1px solid var(--glass-line)",
                  boxShadow:
                    "inset 0 1px 0 var(--glass-edge), 0 14px 32px -14px var(--glass-shadow)",
                }}
                className="overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-expanded={isCurrent}
                  className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      style={{
                        fontFamily: "var(--f-display), 'Sora', sans-serif",
                        color: isCurrent ? "var(--accent)" : "var(--ink)",
                        transform: "skewX(-12deg)",
                      }}
                      className="text-2xl font-light tracking-tight shrink-0"
                    >
                      {slide.num}
                    </span>

                    <span
                      style={{
                        width: "1px",
                        height: "22px",
                        background: isCurrent ? "var(--accent)" : "var(--glass-line)",
                        transform: "skewX(-12deg)",
                      }}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <span
                        style={{
                          fontFamily: "var(--f-display), 'Sora', sans-serif",
                          fontSize: "11px",
                          letterSpacing: "0.09em",
                          color: isCurrent ? "var(--accent)" : "var(--ink)",
                        }}
                        className="uppercase font-semibold block truncate"
                      >
                        {slide.group}
                      </span>
                      <span className="text-xs text-muted block truncate">
                        {slide.tagline}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] text-muted shrink-0">
                    {isCurrent ? "OPEN" : `${slide.services.length} SVC ↗`}
                  </span>
                </button>

                {isCurrent && (
                  <div className="px-4 pb-4 pt-1 space-y-3">
                    {slide.services.map((svc) => (
                      <div
                        key={svc.title}
                        style={{
                          borderRadius: "14px",
                          padding: "14px",
                          border: "1px solid var(--glass-line)",
                          background: "var(--glass-in)",
                          WebkitBackdropFilter: "blur(16px)",
                          backdropFilter: "blur(16px)",
                        }}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "1px solid var(--glass-line)",
                              background: "var(--glass-a)",
                            }}
                            className="flex items-center justify-center shrink-0"
                          >
                            {renderServiceIcon(svc.icon)}
                          </div>
                          <div>
                            <h4 className="font-display text-base font-semibold text-ink">
                              {svc.title}
                            </h4>
                            {svc.fullName && (
                              <p className="font-label text-[8.5px] uppercase text-muted">
                                {svc.fullName}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-muted mb-2.5 leading-relaxed">
                          {svc.promise}
                        </p>

                        <ul className="space-y-1.5 mb-3">
                          {svc.bullets.map((b, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-2 text-xs text-ink"
                            >
                              <span
                                style={{
                                  width: "5px",
                                  height: "5px",
                                  background: "var(--accent)",
                                  marginTop: "5px",
                                }}
                                className="shrink-0 rounded-[1px]"
                                aria-hidden="true"
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t border-line/50 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-ink line-clamp-1">
                            {svc.youGet}
                          </span>
                          <Link
                            href={svc.href}
                            className="font-label text-[9.5px] uppercase text-accent font-semibold shrink-0"
                          >
                            Explore &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Controls centred at the bottom */}
      <div
        className="absolute left-1/2 flex items-center gap-[18px]"
        style={{
          bottom: "28px",
          transform: "translateX(-50%)",
          zIndex: 30,
        }}
      >
        {/* Previous Button */}
        <button
          type="button"
          aria-label="Previous services"
          disabled={activeSlide === 0}
          onClick={() => goTo(Math.max(0, activeSlide - 1))}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, var(--glass-a), var(--glass-b))",
            WebkitBackdropFilter: "blur(14px)",
            backdropFilter: "blur(14px)",
            border: "1px solid var(--glass-line)",
            boxShadow:
              "inset 0 1px 0 var(--glass-edge), 0 4px 14px rgba(0,0,0,0.06)",
            opacity: activeSlide === 0 ? 0.35 : 1,
            cursor: activeSlide === 0 ? "not-allowed" : "pointer",
            pointerEvents: activeSlide === 0 ? "none" : "auto",
          }}
          className="flex items-center justify-center text-ink hover:border-accent transition-colors shrink-0"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M10 3L5 8L10 13" />
          </svg>
        </button>

        {/* 4 Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, dotIdx) => {
            const isActive = dotIdx === activeSlide;
            let dotLabel = "Foundation services";
            if (dotIdx === 1) dotLabel = "Connect services";
            if (dotIdx === 2) dotLabel = "Intelligence services";
            if (dotIdx === 3) dotLabel = "Visibility services: SEO, AEO and GEO";

            return (
              <button
                key={dotIdx}
                type="button"
                aria-label={dotLabel}
                onClick={() => goTo(dotIdx)}
                style={{
                  height: "9px",
                  width: isActive ? "26px" : "9px",
                  borderRadius: "9999px",
                  border: "1px solid var(--ink)",
                  background: isActive ? "var(--ink)" : "transparent",
                  transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                }}
                className="p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          aria-label="Next services"
          disabled={activeSlide === 3}
          onClick={() => goTo(Math.min(3, activeSlide + 1))}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, var(--glass-a), var(--glass-b))",
            WebkitBackdropFilter: "blur(14px)",
            backdropFilter: "blur(14px)",
            border: "1px solid var(--glass-line)",
            boxShadow:
              "inset 0 1px 0 var(--glass-edge), 0 4px 14px rgba(0,0,0,0.06)",
            opacity: activeSlide === 3 ? 0.35 : 1,
            cursor: activeSlide === 3 ? "not-allowed" : "pointer",
            pointerEvents: activeSlide === 3 ? "none" : "auto",
          }}
          className="flex items-center justify-center text-ink hover:border-accent transition-colors shrink-0"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M6 3L11 8L6 13" />
          </svg>
        </button>

        {/* Small note under controls: appears only on slide 4 */}
        <p
          style={{
            fontFamily: "var(--f-label), 'Michroma', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            opacity: noteOpacity,
            transition: "opacity 0.2s ease",
            whiteSpace: "nowrap",
          }}
          className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 uppercase select-none hidden md:block"
        >
          SEO, AEO and GEO: we commit to the work and the measurement, not to a ranking.
        </p>
      </div>
    </div>
  );
};
