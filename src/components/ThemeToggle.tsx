"use client";

import React, { useState, useEffect } from "react";
import type { ThemePreference } from "@/lib/themeStore";
import { notifyThemeChange } from "@/lib/themeStore";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemePreference>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("cyrolabz-theme") as ThemePreference | null;
      if (stored === "light" || stored === "dark" || stored === "auto") {
        setTheme(stored);
      }
    } catch {
      // Ignore localStorage security/private browsing exceptions
    }
  }, []);

  const changeTheme = (newTheme: ThemePreference) => {
    setTheme(newTheme);

    try {
      localStorage.setItem("cyrolabz-theme", newTheme);
    } catch {
      // Ignore localStorage exceptions
    }

    if (newTheme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }

    notifyThemeChange();
  };

  if (!mounted) {
    // Reserve layout space during SSR to avoid shift
    return <div className={cn("w-28 h-8", className)} />;
  }

  const options: { value: ThemePreference; label: string; icon: string }[] = [
    { value: "auto", label: "Auto", icon: "◓" },
    { value: "light", label: "Light", icon: "○" },
    { value: "dark", label: "Dark", icon: "●" },
  ];

  return (
    <div
      role="group"
      aria-label="Theme mode selector"
      className={cn(
        "inline-flex items-center p-0.5 rounded-full tech-border bg-surface-subtle text-xs font-mono select-none",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => changeTheme(opt.value)}
            aria-pressed={isActive}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              isActive
                ? "bg-ink text-bg font-semibold shadow-subtle"
                : "text-muted hover:text-ink hover:bg-surface/50"
            )}
          >
            <span className="text-[10px]">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
