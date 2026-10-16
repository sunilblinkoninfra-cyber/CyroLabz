"use client";

export type ThemePreference = "auto" | "light" | "dark";

export interface ThemeTokens {
  bg: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  onAccent: string;
  isDark: boolean;
}

export const themeTokens: ThemeTokens = {
  bg: "#F4F5F7",
  ink: "#0B0C0E",
  muted: "#5E636E",
  line: "#E2E4E8",
  accent: "#2F6BFF",
  onAccent: "#FFFFFF",
  isDark: false,
};

type ThemeListener = (tokens: ThemeTokens) => void;
const listeners = new Set<ThemeListener>();

export function subscribeTheme(listener: ThemeListener): () => void {
  listeners.add(listener);
  // Immediate call with current values
  listener(themeTokens);
  return () => {
    listeners.delete(listener);
  };
}

export function readThemeTokens(): ThemeTokens {
  if (typeof window === "undefined") return themeTokens;

  const rootStyle = getComputedStyle(document.documentElement);
  const bg = rootStyle.getPropertyValue("--bg").trim() || "#F4F5F7";
  const ink = rootStyle.getPropertyValue("--ink").trim() || "#0B0C0E";
  const muted = rootStyle.getPropertyValue("--muted").trim() || "#5E636E";
  const line = rootStyle.getPropertyValue("--line").trim() || "#E2E4E8";
  const accent = rootStyle.getPropertyValue("--accent").trim() || "#2F6BFF";
  const onAccent = rootStyle.getPropertyValue("--on-accent").trim() || "#FFFFFF";

  const dataTheme = document.documentElement.getAttribute("data-theme");
  const isDark =
    dataTheme === "dark" ||
    (!dataTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  themeTokens.bg = bg;
  themeTokens.ink = ink;
  themeTokens.muted = muted;
  themeTokens.line = line;
  themeTokens.accent = accent;
  themeTokens.onAccent = onAccent;
  themeTokens.isDark = isDark;

  return themeTokens;
}

export function notifyThemeChange(): void {
  const tokens = readThemeTokens();
  listeners.forEach((fn) => fn(tokens));
}

// Initialize observer on client
if (typeof window !== "undefined") {
  readThemeTokens();

  // 1. MutationObserver on data-theme attribute
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        notifyThemeChange();
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // 2. matchMedia listener for system dark mode changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    // Only matters if user is on 'auto' (no data-theme)
    if (!document.documentElement.getAttribute("data-theme")) {
      notifyThemeChange();
    }
  });
}
