"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function BrandedLoader() {
  const [progress, setProgress] = useState(15);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(65), 180);
    const timer2 = setTimeout(() => setProgress(100), 550);
    const timer3 = setTimeout(() => setVisible(false), 950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Engine initialization"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg transition-opacity duration-500 pointer-events-none"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="relative w-14 h-14 flex-shrink-0 animate-pulse overflow-hidden rounded-sm"
          style={{ width: 56, height: 56, maxWidth: 56, maxHeight: 56 }}
        >
          <Image
            src="/assets/logo.png"
            alt="Cyrolabz"
            width={56}
            height={56}
            className="w-full h-full object-contain brand-logo-img"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-display font-semibold tracking-wider text-sm text-ink uppercase">
            CYROLABZ
          </span>
          <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
            INITIALIZING CORE SYSTEMS // {progress}%
          </span>
        </div>

        {/* 1px Technical Progress Bar */}
        <div className="w-48 h-[2px] bg-line overflow-hidden relative">
          <div
            className="h-full bg-ink transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
