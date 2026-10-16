import React from "react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-bg border-t border-line mt-24">
      {/* Reticle Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-line to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3.5">
              <div
                className="relative w-9 h-9 flex-shrink-0 overflow-hidden rounded-sm"
                style={{ width: 36, height: 36, maxWidth: 36, maxHeight: 36 }}
              >
                <Image
                  src="/assets/logo.png"
                  alt="Cyrolabz Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain brand-logo-img"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-wider text-ink uppercase">
                CYROLABZ
              </span>
            </div>

            <p className="text-sm font-mono uppercase tracking-tech text-muted max-w-sm">
              AI Consulting | Software Development | Audits
            </p>

            <p className="text-xs text-muted leading-relaxed max-w-md font-sans">
              Engineering intelligence into everything you build. Digital craftsmanship, high-assurance software engineering, and immersive interactive design for forward-thinking enterprises.
            </p>

            {/* Live Status indicator */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-surface-subtle tech-border chamfer-sm text-[11px] font-mono text-ink">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CORE SYSTEMS ONLINE</span>
              <span className="text-muted">|</span>
              <span className="text-muted">2026 EDITION</span>
            </div>
          </div>

          {/* Capabilities */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-eyebrow text-ink font-semibold">
              Capabilities
            </h3>
            <ul className="space-y-2.5 text-xs font-mono tracking-wide text-muted">
              <li>
                <a href="#services" className="hover:text-ink transition-colors">
                  Website Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-ink transition-colors">
                  3D Interactive Design
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-ink transition-colors">
                  AI Enablement & Implementation
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-ink transition-colors">
                  Custom Software Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-ink transition-colors">
                  Technical Consulting
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-ink transition-colors">
                  Architecture & Code Audits
                </a>
              </li>
            </ul>
          </div>

          {/* Studio & Nav */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-eyebrow text-ink font-semibold">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs font-mono tracking-wide text-muted">
              <li>
                <a href="#story" className="hover:text-ink transition-colors">
                  Story
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-ink transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-ink transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-ink transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-ink transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-eyebrow text-ink font-semibold">
              Inquiries
            </h3>
            <p className="text-xs font-mono text-ink">
              hello@cyrolabz.com
            </p>
            <p className="text-xs font-mono text-muted">
              Mon – Fri: 09:00 – 18:00 UTC
            </p>
            <a
              href="#contact"
              className="inline-block text-xs font-mono text-accent hover:underline uppercase tracking-wide mt-2"
            >
              Start Conversation →
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <p>© {currentYear} CYROLABZ STUDIO. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span className="text-muted">LATENCY: 24MS</span>
            <span className="text-line">·</span>
            <span>PRECISION ENGINEERING</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
