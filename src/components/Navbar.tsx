"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface-glass backdrop-blur-md tech-border border-t-0 border-x-0 shadow-subtle py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with strict light/dark CSS blend mode rules */}
          <a
            href="#"
            className="flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm group"
          >
            <div
              className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 overflow-hidden rounded-sm transition-transform duration-200 group-hover:scale-105"
              style={{ width: 36, height: 36, maxWidth: 36, maxHeight: 36 }}
            >
              <Image
                src="/assets/logo.png"
                alt="Cyrolabz Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain brand-logo-img"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-wider text-base sm:text-lg text-ink uppercase leading-none">
                CYROLABZ
              </span>
              <span className="text-[9px] font-mono tracking-widest text-muted uppercase mt-1 hidden sm:block">
                TECH STUDIO
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 bg-surface-glass backdrop-blur-sm px-6 py-1.5 rounded-full tech-border"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase font-mono tracking-tech text-muted hover:text-ink transition-colors duration-150 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-ink hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button, Theme Toggle & Mobile Trigger */}
          <div className="flex items-center gap-3">
            {/* 3-State Theme Toggle (Auto / Light / Dark) */}
            <ThemeToggle className="hidden sm:inline-flex" />

            <Button
              href="#contact"
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              Start a Project →
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 text-ink tech-border chamfer-sm bg-surface-glass hover:bg-surface-subtle transition-colors"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={cn(
                    "w-full h-0.5 bg-ink transition-all duration-200 origin-left",
                    mobileMenuOpen && "rotate-45 translate-x-0.5 -translate-y-0.5"
                  )}
                />
                <span
                  className={cn(
                    "w-full h-0.5 bg-ink transition-all duration-200",
                    mobileMenuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "w-full h-0.5 bg-ink transition-all duration-200 origin-left",
                    mobileMenuOpen && "-rotate-45 translate-x-0.5 translate-y-0.5"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-glass backdrop-blur-xl tech-border border-x-0 border-t mt-3 py-6 px-6 space-y-5 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <span className="text-xs font-mono uppercase tracking-widest text-muted">
              APPEARANCE //
            </span>
            <ThemeToggle />
          </div>

          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono uppercase tracking-tech text-muted hover:text-ink py-2 border-b border-line flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-muted">→</span>
              </a>
            ))}
          </nav>

          <div className="pt-2">
            <Button
              href="#contact"
              size="md"
              variant="primary"
              className="w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start a Project →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
