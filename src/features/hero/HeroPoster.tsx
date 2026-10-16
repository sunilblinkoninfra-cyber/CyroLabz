"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroPosterProps {
  isCrossfaded?: boolean;
}

export function HeroPoster({ isCrossfaded }: HeroPosterProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full select-none pointer-events-none transition-opacity duration-1000 -z-10",
        isCrossfaded ? "opacity-0" : "opacity-100"
      )}
    >
      {/* High-resolution Static Poster from reference image */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
        }}
      >
        <Image
          src="/assets/hero.png"
          alt="Cyrolabz Orbital Interface Architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left md:object-[35%_center] brand-logo-img opacity-90"
        />
      </div>

      {/* Soft Gradient Scrim using CSS variables ensuring WCAG AA contrast for text */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg/60 to-bg/95 md:from-transparent md:via-bg/75 md:to-bg/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
    </div>
  );
}
