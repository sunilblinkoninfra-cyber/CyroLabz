"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { updateScrollProgress } from "@/lib/scrollStore";
import type { ActiveSection } from "@/types";

export function ScrollController() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sections: { id: ActiveSection; selector: string }[] = [
      { id: "hero", selector: "#hero" },
      { id: "services", selector: "#services" },
      { id: "about", selector: "#about" },
      { id: "process", selector: "#process" },
      { id: "contact", selector: "#contact" },
    ];

    const triggers: ScrollTrigger[] = [];

    // Global page progress trigger
    const globalTrigger = ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Find which section is most in view
        const currentProgress = self.progress;
        let activeSec: ActiveSection = "hero";
        let secProgress = 0;

        if (currentProgress < 0.22) {
          activeSec = "hero";
          secProgress = currentProgress / 0.22;
        } else if (currentProgress < 0.45) {
          activeSec = "services";
          secProgress = (currentProgress - 0.22) / 0.23;
        } else if (currentProgress < 0.65) {
          activeSec = "about";
          secProgress = (currentProgress - 0.45) / 0.20;
        } else if (currentProgress < 0.85) {
          activeSec = "process";
          secProgress = (currentProgress - 0.65) / 0.20;
        } else {
          activeSec = "contact";
          secProgress = (currentProgress - 0.85) / 0.15;
        }

        updateScrollProgress(currentProgress, activeSec, Math.min(1, Math.max(0, secProgress)));
      },
    });

    triggers.push(globalTrigger);

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
