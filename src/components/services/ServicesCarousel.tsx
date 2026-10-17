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
  const common = "w-[19px] h-[19px] stroke-current text-ink";
  switch (icon) {
    case "consulting":
      // Route between two points
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="5" cy="18" r="2.5" />
          <circle cx="19" cy="6" r="2.5" />
          <path d="M7.5 16.5C11 14 13 13.5 14 10.5C14.8 8.1 16.5 6.5 16.5 6.5" strokeDasharray="2 2" />
          <path d="M7.5 16.5C10 14.5 12 14 14 11C15.2 9.2 16.5 6.5 16.5 6.5" />
        </svg>
      );
    case "audits":
      // Magnifier with a check
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="7" />
          <path d="M15.5 15.5L21 21" />
          <path d="M7.5 10.5L9.5 12.5L14 8" />
        </svg>
      );
    case "custom-software":
      // Code brackets
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M8 7L3 12L8 17" />
          <path d="M16 7L21 12L16 17" />
          <path d="M14 4L10 20" />
        </svg>
      );
    case "website":
      // Browser window
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M3 9H21" />
          <circle cx="6.5" cy="6.5" r="0.75" fill="currentColor" />
          <circle cx="9.5" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      );
    case "3d":
      // Cube
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z" />
          <path d="M12 12V21.5" />
          <path d="M12 12L20.5 7.5" />
          <path d="M12 12L3.5 7.5" />
        </svg>
      );
    case "ai-enablement":
      // Person with a spark
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="8.5" cy="7" r="3.5" />
          <path d="M3 20V18C3 15 5.5 12.5 8.5 12.5C10.2 12.5 11.7 13.2 12.7 14.3" />
          <path d="M18 9L18.8 11.2L21 12L18.8 12.8L18 15L17.2 12.8L15 12L17.2 11.2Z" />
          <path d="M18 17L18.4 18.1L19.5 18.5L18.4 18.9L18 20L17.6 18.9L16.5 18.5L17.6 18.1Z" />
        </svg>
      );
    case "ai-implementation":
      // Chip
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <rect x="9" y="9" width="6" height="6" rx="0.75" />
          <path d="M9 2V5 M15 2V5 M9 19V22 M15 19V22 M2 9H5 M2 15H5 M19 9H22 M19 15H22" />
        </svg>
      );
    case "seo":
      // Magnifier with bars
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <path d="M15 15L21 21" />
          <path d="M7.5 11.5V10 M10 11.5V8 M12.5 11.5V9" />
        </svg>
      );
    case "aeo":
      // Speech bubble with a question mark
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M21 11.5C21 15.6 17.2 19 12.5 19C11.1 19 9.8 18.7 8.6 18.1L3.5 19.5L4.9 15.8C3.7 14.6 3 13.1 3 11.5C3 7.4 6.8 4 11.5 4C16.2 4 21 7.4 21 11.5Z" />
          <path d="M11 9C11.3 8.4 12 8.2 12.6 8.5C13.2 8.8 13.5 9.4 13.2 10C12.8 10.7 12 11 12 11.8" />
          <circle cx="12" cy="14" r="0.5" fill="currentColor" />
        </svg>
      );
    case "geo":
      // Globe
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
  const [viewportW, setViewportW] = useState(1200);
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

  // Container opacity: smoothstep((s - 3.55) / 0.4); hidden when under 0.01; pointer-events only when above 0.9
  const containerOpacity = smoothstep((s - 3.55) / 0.4);
  const isContainerVisible = containerOpacity >= 0.01;
  const isInteractive = containerOpacity > 0.9;

  // Carousel position cp:
  // for s below 4: cp = 0
  // for s of 4 or more, with a = min(6, floor(s)): cp = (a - 4) + smoothstep((s - a - 0.3) / 0.5)
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

  // Dimensions & Step calculation
  // Slide width = min(1000px, W - 2 * max(16px, 4% of W))
  const marginSide = Math.max(16, 0.04 * viewportW);
  const slideWidth = Math.min(1000, viewportW - 2 * marginSide);
  const step = slideWidth + 36;

  // Slide area: 84px below top, 96px above bottom (70px and 90px on mobile)
  const isMobile = viewportW <= 820;
  const topPad = isMobile ? 70 : 84;
  const bottomPad = isMobile ? 90 : 96;
  const areaHeight = viewportH - topPad - bottomPad;
  const areaCenterY = topPad + areaHeight / 2;

  // Note under controls appears only on card 4 (opacity 0 to 1)
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
      {/* 4 Slides */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, i) => {
          const d = i - cp;
          const absD = Math.abs(d);
          const isCurrent = Math.abs(d) < 0.5;

          // Specified transform & styling:
          // transform: translate(calc(-50% + d * step px), -50%) scale(1 - 0.07 * min(|d|, 1))
          // opacity: 1 - 0.68 * min(|d|, 1); z-index: 10 - round(|d| * 3); visibility hidden when |d| is above 1.25
          const scale = 1 - 0.07 * Math.min(absD, 1);
          const slideOpacity = Math.max(0, 1 - 0.68 * Math.min(absD, 1));
          const zIndex = 10 - Math.round(absD * 3);
          const isSlideVisible = absD <= 1.25;

          const nCols = slide.services.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3";

          return (
            <article
              key={slide.num}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of 4: ${slide.group.charAt(0) + slide.group.slice(1).toLowerCase()}`}
              aria-hidden={!isCurrent}
              inert={!isCurrent ? true : undefined}
              className="absolute left-1/2"
              style={{
                top: `${areaCenterY}px`,
                width: `${slideWidth}px`,
                maxHeight: `${areaHeight}px`,
                transform: `translate(calc(-50% + ${d * step}px), -50%) scale(${scale})`,
                opacity: slideOpacity,
                zIndex,
                visibility: isSlideVisible ? "visible" : "hidden",
                pointerEvents: isCurrent && isInteractive ? "auto" : "none",
                borderRadius: isMobile ? "18px" : "22px",
                padding: isMobile ? "20px 18px 18px" : "28px 30px 26px",
                background: "linear-gradient(135deg, var(--glass-a), var(--glass-b))",
                WebkitBackdropFilter: "blur(9px) saturate(1.5)",
                backdropFilter: "blur(9px) saturate(1.5)",
                border: "1px solid var(--glass-line)",
                boxShadow: "inset 0 1px 0 var(--glass-edge), 0 30px 60px -28px var(--glass-shadow)",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Top Row: 0N / 04 on left, Group pill on right */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span
                  style={{
                    fontFamily: "var(--f-label), 'Michroma', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                  }}
                  className="text-muted uppercase select-none"
                >
                  <span className="text-ink font-semibold">{slide.num}</span> / 04
                </span>

                <span
                  style={{
                    fontFamily: "var(--f-label), 'Michroma', sans-serif",
                    fontSize: "10px",
                    color: "var(--accent)",
                    background: "var(--glass-b)",
                    border: "1px solid var(--glass-line)",
                    borderRadius: "999px",
                    padding: "3px 12px 2px",
                    letterSpacing: "0.12em",
                  }}
                  className="uppercase font-medium select-none"
                >
                  {slide.group}
                </span>
              </div>

              {/* Tagline: h3 Sora, clamp(1.6rem, 2.8vw, 2.3rem) */}
              <h3
                style={{
                  fontFamily: "var(--f-display), 'Sora', sans-serif",
                  fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  margin: "12px 0 20px",
                  color: "var(--ink)",
                }}
                className="font-medium"
              >
                {slide.tagline}
              </h3>

              {/* Inner Service Panels Grid (2 or 3 columns, 14px gap; 1 column under 820px) */}
              <div className={`grid ${nCols} gap-[14px]`}>
                {slide.services.map((svc) => (
                  <div
                    key={svc.title}
                    style={{
                      borderRadius: "16px",
                      padding: "18px 18px 16px",
                      border: "1px solid var(--glass-line)",
                      background: "var(--glass-in)",
                      WebkitBackdropFilter: "blur(16px)",
                      backdropFilter: "blur(16px)",
                    }}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      {/* Icon box next to title */}
                      <div className="flex items-start gap-3 mb-2.5">
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            minWidth: "38px",
                            borderRadius: "10px",
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
                              fontSize: "1.1875rem",
                              lineHeight: 1.25,
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
                                fontSize: "9px",
                                letterSpacing: "0.08em",
                                color: "var(--muted)",
                                marginTop: "3px",
                              }}
                              className="uppercase"
                            >
                              {svc.fullName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Promise: 14px, muted */}
                      <p
                        style={{
                          fontFamily: "var(--f-body), 'Manrope', sans-serif",
                          fontSize: "14px",
                          lineHeight: 1.45,
                          color: "var(--muted)",
                          marginBottom: "14px",
                        }}
                      >
                        {svc.promise}
                      </p>

                      {/* 3 Bullets with 5px accent squares */}
                      <ul className="space-y-2 mb-4">
                        {svc.bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            style={{
                              fontFamily: "var(--f-body), 'Manrope', sans-serif",
                              fontSize: "13px",
                              lineHeight: 1.4,
                              color: "var(--ink)",
                            }}
                            className="flex items-start gap-2.5"
                          >
                            <span
                              style={{
                                width: "5px",
                                height: "5px",
                                minWidth: "5px",
                                background: "var(--accent)",
                                marginTop: "6px",
                              }}
                              className="shrink-0 rounded-[1px]"
                              aria-hidden="true"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hairline divider, YOU GET label, and Pinned link */}
                    <div>
                      <div
                        style={{
                          height: "1px",
                          background: "var(--glass-line)",
                          margin: "12px 0 10px",
                        }}
                        aria-hidden="true"
                      />

                      <div className="mb-3">
                        <span
                          style={{
                            fontFamily: "var(--f-label), 'Michroma', sans-serif",
                            fontSize: "9px",
                            letterSpacing: "0.14em",
                            color: "var(--muted)",
                          }}
                          className="uppercase block mb-1"
                        >
                          YOU GET
                        </span>
                        <p
                          style={{
                            fontFamily: "var(--f-body), 'Manrope', sans-serif",
                            fontSize: "13px",
                            lineHeight: 1.4,
                            color: "var(--ink)",
                          }}
                          className="font-medium"
                        >
                          {svc.youGet}
                        </p>
                      </div>

                      {/* Explore link pinned to the bottom of the panel */}
                      <div className="pt-2">
                        <Link
                          href={svc.href}
                          style={{
                            fontFamily: "var(--f-label), 'Michroma', sans-serif",
                            fontSize: "10px",
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
            </article>
          );
        })}
      </div>

      {/* Controls centred at the bottom (30px from edge) */}
      <div
        className="absolute left-1/2 flex items-center gap-[18px]"
        style={{
          bottom: "30px",
          transform: "translateX(-50%)",
          zIndex: 30,
        }}
      >
        {/* Previous Button: round 42px glass */}
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
            boxShadow: "inset 0 1px 0 var(--glass-edge), 0 4px 14px rgba(0,0,0,0.06)",
            opacity: activeSlide === 0 ? 0.35 : 1,
            cursor: activeSlide === 0 ? "not-allowed" : "pointer",
            pointerEvents: activeSlide === 0 ? "none" : "auto",
          }}
          className="flex items-center justify-center text-ink hover:border-accent transition-colors shrink-0"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
            <path d="M10 3L5 8L10 13" />
          </svg>
        </button>

        {/* 4 Dots: 9px circle with 1px ink border; active is 26px filled pill */}
        <div className="flex items-center gap-2">
          {SLIDES.map((slide, dotIdx) => {
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

        {/* Next Button: round 42px glass */}
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
            boxShadow: "inset 0 1px 0 var(--glass-edge), 0 4px 14px rgba(0,0,0,0.06)",
            opacity: activeSlide === 3 ? 0.35 : 1,
            cursor: activeSlide === 3 ? "not-allowed" : "pointer",
            pointerEvents: activeSlide === 3 ? "none" : "auto",
          }}
          className="flex items-center justify-center text-ink hover:border-accent transition-colors shrink-0"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
            <path d="M6 3L11 8L6 13" />
          </svg>
        </button>

        {/* Small note under controls: appears only on card 4, Michroma 9px, uppercase, muted, hidden on mobile */}
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
