"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStoryStore, getTargetChapterForPath } from "@/lib/storyStore";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const travelTo = useStoryStore((state) => state.travelTo);
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const computeEffectiveTheme = (): "light" | "dark" => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("cyrolabz-theme");
      } catch (e) {}

      if (stored === "dark" || stored === "light") {
        document.documentElement.setAttribute("data-theme", stored);
        return stored;
      }

      const explicit = document.documentElement.getAttribute("data-theme");
      if (explicit === "dark" || explicit === "light") {
        return explicit;
      }

      return mediaQuery.matches ? "dark" : "light";
    };

    setEffectiveTheme(computeEffectiveTheme());

    const handleSystemChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("cyrolabz-theme");
      } catch (err) {}

      // If no choice has been saved, follow system changes live
      if (!stored) {
        document.documentElement.removeAttribute("data-theme");
        setEffectiveTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    const observer = new MutationObserver(() => {
      const explicit = document.documentElement.getAttribute("data-theme");
      if (explicit === "dark" || explicit === "light") {
        setEffectiveTheme(explicit);
      } else {
        setEffectiveTheme(mediaQuery.matches ? "dark" : "light");
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = effectiveTheme === "dark" ? "light" : "dark";
    setEffectiveTheme(nextTheme);
    try {
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("cyrolabz-theme", nextTheme);
    } catch (e) {
      // Storage unavailable fallback
    }
  };

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const servicesList = [
    { num: "01", label: "Consulting", href: "/services/consulting", group: "Foundation" },
    { num: "02", label: "Audits", href: "/services/audits", group: "Foundation" },
    { num: "03", label: "Custom Software", href: "/services/custom-software", group: "Connect" },
    { num: "04", label: "Website Development", href: "/services/website-development", group: "Connect" },
    { num: "05", label: "3D Interactive Design", href: "/services/3d-interactive-design", group: "Connect" },
    { num: "06", label: "AI Enablement", href: "/services/ai-enablement", group: "Intelligence" },
    { num: "07", label: "AI Implementation", href: "/services/ai-implementation", group: "Intelligence" },
    { num: "08", label: "SEO (Search Engine Optimisation)", href: "/services/seo", group: "Visibility" },
    { num: "09", label: "AEO (Answer Engine Optimisation)", href: "/services/aeo", group: "Visibility" },
    { num: "10", label: "GEO (Generative Engine Optimisation)", href: "/services/geo", group: "Visibility" },
  ];

  const navLinks = [
    { label: "Services", href: "/services", hasDropdown: true },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    const targetChapter = getTargetChapterForPath(href);
    travelTo(targetChapter);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 glass-header transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo: C:\Users\CyroLabz\logo.png */}
        <Link
          href="/"
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm group"
          aria-label="Cyrolabz Home"
        >
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Cyrolabz Logo"
              fill
              priority
              className="object-contain brand-logo-img"
            />
          </div>
          <span className="font-display font-bold tracking-tight text-lg sm:text-xl text-ink group-hover:text-accent transition-colors">
            Cyrolabz
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            if (item.hasDropdown) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    onFocus={() => setServicesOpen(true)}
                    className={`font-sans text-sm tracking-wide transition-colors relative py-1 inline-flex items-center gap-1 ${
                      isActive
                        ? "text-ink font-semibold"
                        : "text-muted hover:text-ink font-medium"
                    }`}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        servicesOpen ? "rotate-180 text-accent" : "text-muted"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {servicesOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-[460px] rounded-lg services-panel p-4 shadow-xl border border-line z-50 animate-in fade-in zoom-in-95 duration-150"
                      role="menu"
                      aria-label="Services list"
                    >
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {servicesList.map((svc) => (
                          <Link
                            key={svc.href}
                            href={svc.href}
                            onClick={() => handleNavClick(svc.href)}
                            className="p-2 rounded hover:bg-surface/80 group transition-colors block text-left"
                            role="menuitem"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-accent font-semibold">
                                {svc.num}
                              </span>
                              <span className="font-sans text-xs font-semibold text-ink group-hover:text-accent transition-colors truncate">
                                {svc.label}
                              </span>
                            </div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-muted block pl-5">
                              {svc.group}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                        <Link
                          href="/services"
                          onClick={() => handleNavClick("/services")}
                          className="font-mono text-[11px] text-accent hover:underline font-semibold"
                        >
                          All 10 services overview →
                        </Link>
                        <Link
                          href="/contact"
                          onClick={() => handleNavClick("/contact")}
                          className="text-muted hover:text-ink text-[11px]"
                        >
                          Start a project
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`font-sans text-sm tracking-wide transition-colors relative py-1 ${
                  isActive
                    ? "text-ink font-semibold"
                    : "text-muted hover:text-ink font-medium"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls: Theme Toggle + CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Single Round 38px Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-[38px] h-[38px] rounded-full border border-line hover:border-ink flex items-center justify-center text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={
              effectiveTheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            {effectiveTheme === "dark" ? (
              // Sun icon when dark (click switches to light)
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              // Moon icon when light (click switches to dark)
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Primary Action Button */}
          <Link
            href="/contact"
            onClick={() => handleNavClick("/contact")}
            className="hidden sm:inline-flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-4 py-2.5 rounded bg-accent text-on-accent hover:bg-accent-hover transition-colors font-semibold"
          >
            Start a project
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink border border-line rounded"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-header border-t-0 px-4 py-6 space-y-4 shadow-lg max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-3" aria-label="Mobile navigation">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.href} className="border-b border-line/40 pb-2">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full font-sans text-base py-2 text-ink flex items-center justify-between text-left"
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-xs text-muted">
                        {mobileServicesOpen ? "−" : "+"}
                      </span>
                    </button>
                    {mobileServicesOpen && (
                      <div className="pl-3 py-2 space-y-2 border-l border-accent/40 my-1">
                        {servicesList.map((svc) => (
                          <Link
                            key={svc.href}
                            href={svc.href}
                            onClick={() => handleNavClick(svc.href)}
                            className="font-sans text-xs py-1 text-muted hover:text-ink flex items-center justify-between"
                          >
                            <span>{svc.num} {svc.label}</span>
                            <span className="font-mono text-[10px] text-accent">→</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="font-sans text-base py-2 text-ink border-b border-line/40 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-muted">→</span>
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => handleNavClick("/contact")}
              className="mt-4 w-full flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-4 py-3 rounded bg-accent text-on-accent font-semibold"
            >
              Start a project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
