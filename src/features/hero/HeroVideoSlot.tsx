"use client";

import React, { useState } from "react";
import Image from "next/image";

export function HeroVideoSlot() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none -z-20">
      {/* Poster Image (always mounted for instant render & fallback) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/hero.png"
          alt="Cyrolabz Orbital Interface Art"
          fill
          priority
          className="object-cover object-left md:object-center opacity-85"
        />
      </div>

      {/* Looping video slot if file exists, falling back to poster on error */}
      {!videoFailed && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-left md:object-center mix-blend-multiply opacity-80"
        >
          <source src="/assets/hero-loop.mp4" type="video/mp4" />
        </video>
      )}

      {/* Contrast Scrim: Soft radial and linear gradient so text on right/center is crisp */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/70 to-white/95 md:from-transparent md:via-white/60 md:to-white/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
    </div>
  );
}
