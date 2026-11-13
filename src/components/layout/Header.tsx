"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useStoryStore, getTargetChapterForPath } from "@/lib/storyStore";
import { LiquidNavbar, LiquidNavItem } from "@/components/ui/liquid-glass-navbar";
import { LiquidToggle, NimbusToggleIcons } from "@/components/ui/liquid-glass-toggle";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
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

  const toggleTheme = (forceTheme?: "light" | "dark") => {
    const nextTheme = forceTheme ?? (effectiveTheme === "dark" ? "light" : "dark");
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
    { label: "About", href: "/about" },
    { label: "Services", href: "/services", hasDropdown: true },
    { label: "Insights", href: "/insights" },
    { label: "Case studies", href: "/work" },
    { label: "Contact", href: "/contact" },
  ];

  const liquidNavItems: LiquidNavItem[] = [
    {
      label: "About",
      href: "/about",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8.5" r="3.8" />
          <path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5" />
        </svg>
      ),
      fx: "wave",
    },
    {
      label: "Services",
      href: "/services",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3-8 4.5 8 4.5 8-4.5L12 3Z" />
          <path d="m4 12 8 4.5 8-4.5" />
          <path d="m4 16.5 8 4.5 8-4.5" />
        </svg>
      ),
      fx: "drop",
    },
    {
      label: "Insights",
      href: "/insights",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3 1.9 4.8L19 9.5l-4 3.6 1.2 5.4-4.2-2.8-4.2 2.8 1.2-5.4-4-3.6 5.1-1.7L12 3Z" />
        </svg>
      ),
      fx: "glow",
    },
    {
      label: "Case studies",
      href: "/work",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
          <path d="M8 13h8" />
          <path d="M8 16h5" />
        </svg>
      ),
      fx: "pop",
    },
    {
      label: "Contact",
      href: "/contact",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.2 3.6 5.4l2.7 6.8-2.7 6.4L21 12.2Zm-14.7 0H13" />
        </svg>
      ),
      fx: "plane",
    },
  ];

  const getActiveIndex = () => {
    if (pathname === "/about" || pathname.startsWith("/about/")) return 0;
    if (pathname === "/services" || pathname.startsWith("/services/")) return 1;
    if (pathname === "/insights" || pathname.startsWith("/insights/")) return 2;
    if (pathname === "/work" || pathname.startsWith("/work/")) return 3;
    if (pathname === "/contact" || pathname.startsWith("/contact/")) return 4;
    return -1;
  };

  const activeIndex = getActiveIndex();

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    const targetChapter = getTargetChapterForPath(href);
    travelTo(targetChapter);
  };

  const handleLiquidNavChange = (index: number, item: LiquidNavItem) => {
    if (item.href) {
      handleNavClick(item.href);
      router.push(item.href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 glass-header pointer-events-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo: C:\Users\CyroLabz\logo.png */}
        <Link
          href="/"
          onClick={() => handleNavClick("/")}
          className="header-pill-btn px-3 sm:px-3.5 py-1.5 gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent group pointer-events-auto"
          aria-label="Cyrolabz Home"
        >
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Cyrolabz Logo"
              fill
              priority
              className="object-contain brand-logo-img"
            />
          </div>
          <span className="font-display font-bold tracking-tight text-base sm:text-lg text-ink group-hover:text-accent transition-colors">
            Cyrolabz
          </span>
        </Link>

        {/* Desktop Navigation — Liquid Glass Navbar */}
        <div
          className="relative hidden md:flex items-center justify-center pointer-events-auto"
          onMouseLeave={() => setServicesOpen(false)}
        >
          <LiquidNavbar
            items={liquidNavItems}
            active={activeIndex >= 0 ? activeIndex : undefined}
            tone={effectiveTheme}
            onChange={handleLiquidNavChange}
            onItemMouseEnter={(i) => {
              if (i === 1) setServicesOpen(true);
              else setServicesOpen(false);
            }}
            sound={false}
          />

          {/* Services Dropdown Menu */}
          {servicesOpen && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[460px] rounded-xl services-panel p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
              role="menu"
              aria-label="Services list"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {servicesList.map((svc) => (
                  <Link
                    key={svc.href}
                    href={svc.href}
                    onClick={() => handleNavClick(svc.href)}
                    className="p-2 rounded-lg hover:bg-[var(--glass-b)] hover:border hover:border-[var(--glass-line)] border border-transparent group transition-all block text-left"
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

              <div
                className="mt-3 pt-3 flex items-center justify-between text-xs"
                style={{ borderTop: "1px solid var(--glass-line)" }}
              >
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
                  Contact studio →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right side controls: Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
          {/* Liquid Glass Theme Toggle */}
          <LiquidToggle
            size={34}
            tone={effectiveTheme}
            checked={effectiveTheme === "dark"}
            onCheckedChange={(isDark) => toggleTheme(isDark ? "dark" : "light")}
            icons={{ off: NimbusToggleIcons.sun, on: NimbusToggleIcons.moon }}
            sound={false}
            label={
              effectiveTheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden header-pill-btn w-9 h-9 sm:w-10 sm:h-10 p-2"
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
        <div className="md:hidden mx-4 mt-2 p-5 rounded-2xl services-panel space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
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

            {/* Theme switcher inside mobile drawer */}
            <div className="pt-2 flex items-center justify-between">
              <span className="font-sans text-sm text-ink">Dark mode</span>
              <LiquidToggle
                size={30}
                tone={effectiveTheme}
                checked={effectiveTheme === "dark"}
                onCheckedChange={(isDark) => toggleTheme(isDark ? "dark" : "light")}
                icons={{ off: NimbusToggleIcons.sun, on: NimbusToggleIcons.moon }}
                sound={false}
                label="Dark mode toggle"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
