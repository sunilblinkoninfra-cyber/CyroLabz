"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoryStore, getTargetChapterForPath } from "@/lib/storyStore";

export const Footer: React.FC = () => {
  const travelTo = useStoryStore((state) => state.travelTo);

  const handleNavClick = (href: string) => {
    const ch = getTargetChapterForPath(href);
    travelTo(ch);
  };

  return (
    <footer className="relative z-20 glass-footer pt-16 pb-28 text-muted font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link
              href="/"
              onClick={() => handleNavClick("/")}
              className="inline-flex items-center gap-2.5 group"
              aria-label="Cyrolabz Home"
            >
              <div className="relative w-7 h-7 flex-shrink-0">
                <Image
                  src="/assets/logo.png"
                  alt="Cyrolabz Logo"
                  fill
                  className="object-contain brand-logo-img"
                />
              </div>
              <span className="font-display font-bold tracking-tight text-lg text-ink group-hover:text-accent transition-colors">
                Cyrolabz
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs text-muted">
              Transformation, engineered. High-performance software engineering,
              applied AI systems, and technical auditing for modern enterprises.
            </p>
            <div className="font-mono text-[11px] text-accent">
              01 → 02 → 03 → 04
            </div>
          </div>

          {/* Services Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/consulting"
                  onClick={() => handleNavClick("/services/consulting")}
                  className="hover:text-ink transition-colors"
                >
                  Consulting
                </Link>
              </li>
              <li>
                <Link
                  href="/services/audits"
                  onClick={() => handleNavClick("/services/audits")}
                  className="hover:text-ink transition-colors"
                >
                  Audits
                </Link>
              </li>
              <li>
                <Link
                  href="/services/custom-software"
                  onClick={() => handleNavClick("/services/custom-software")}
                  className="hover:text-ink transition-colors"
                >
                  Custom Software
                </Link>
              </li>
              <li>
                <Link
                  href="/services/website-development"
                  onClick={() => handleNavClick("/services/website-development")}
                  className="hover:text-ink transition-colors"
                >
                  Website Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services/3d-interactive-design"
                  onClick={() => handleNavClick("/services/3d-interactive-design")}
                  className="hover:text-ink transition-colors"
                >
                  3D Interactive Design
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ai-enablement"
                  onClick={() => handleNavClick("/services/ai-enablement")}
                  className="hover:text-ink transition-colors"
                >
                  AI Enablement
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ai-implementation"
                  onClick={() => handleNavClick("/services/ai-implementation")}
                  className="hover:text-ink transition-colors"
                >
                  AI Implementation
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold">
              Studio
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/work"
                  onClick={() => handleNavClick("/work")}
                  className="hover:text-ink transition-colors"
                >
                  Work & Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => handleNavClick("/about")}
                  className="hover:text-ink transition-colors"
                >
                  About Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  onClick={() => handleNavClick("/insights")}
                  className="hover:text-ink transition-colors"
                >
                  Insights & Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => handleNavClick("/contact")}
                  className="hover:text-ink transition-colors"
                >
                  Start a Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Engineering Posture */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold">
              Standards
            </h4>
            <div className="p-4 rounded border border-line bg-surface-subtle text-xs space-y-2">
              <div className="flex items-center gap-2 text-ink font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Secure by Design</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted">
                Enterprise IP protection, zero vendor lock-in, reproducible pipelines, and thorough automated regression testing.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted">
            <div className="relative w-4 h-4">
              <Image
                src="/assets/logo-mark.png"
                alt="Cyrolabz Mark"
                fill
                className="object-contain brand-logo-img"
              />
            </div>
            <span>© {new Date().getFullYear()} Cyrolabz. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-muted">
            <Link
              href="/privacy"
              onClick={() => handleNavClick("/privacy")}
              className="hover:text-ink transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              onClick={() => handleNavClick("/terms")}
              className="hover:text-ink transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
