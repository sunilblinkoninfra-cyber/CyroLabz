"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { storyBus, useStoryStore } from "@/lib/storyStore";
import { ServicesCarousel } from "@/components/services/ServicesCarousel";

const READ = [
  "Legacy systems",
  "Connected platform",
  "Applied intelligence",
  "Cyrolabz",
];

const SIDES = [1, -1, 1, -1]; // +1 right, -1 left
const SEG = 3;

export default function HomePage() {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const viewRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [sVal, setSVal] = useState(0);

  const travelTo = useStoryStore((state) => state.travelTo);

  // Scroll to chapter index k (0..3) in the story
  const go = useCallback((k: number) => {
    const vh = window.innerHeight;
    const S = 4.6 * vh;
    const dStory = 0.94 * S;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: (0.04 + 0.9 * (k / SEG)) * dStory,
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  const handleReplay = useCallback(() => {
    go(0);
    travelTo(0);
  }, [go, travelTo]);

  // Pointer movement tracking over stage and 3D copy tilt
  useEffect(() => {
    const stageEl = stageRef.current;
    const viewEl = viewRef.current;
    const copyEl = copyRef.current;
    if (!stageEl || !viewEl || !copyEl) return;

    let ptTX = -9999;
    let ptTY = -9999;
    let ptx = -9999;
    let pty = -9999;
    let pw = 0;
    let pxn = 0;
    let pyn = 0;
    let inside = false;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = viewEl.getBoundingClientRect();
      ptTX = e.clientX - r.left;
      ptTY = e.clientY - r.top;
      if (!inside) {
        ptx = ptTX;
        pty = ptTY;
      }
      inside = true;
    };

    const onPointerLeave = () => {
      inside = false;
    };

    stageEl.addEventListener("pointermove", onPointerMove);
    stageEl.addEventListener("pointerleave", onPointerLeave);

    let animId = 0;
    let curChapter = -1;

    const loop = () => {
      animId = requestAnimationFrame(loop);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.innerWidth >= 821;
      const W = Math.max(1, viewEl.clientWidth);
      const H = Math.max(1, viewEl.clientHeight);

      // Scroll calculation according to specification:
      // Let S be the height of the story's scroll spacer (460vh in the prototype),
      // vh the viewport height, py the scroll position and t = (py - 0.94 * S) / vh.
      // Story progress is unchanged and gives s up to 3 at py = 0.94 * S.
      // After that:
      // s = 3 + t / 0.85 for t from 0 to 0.85 (logo turns into image 1)
      // s = 4 + min(3, t - 0.85) for t above 0.85 (one screen of scroll per card)
      const vh = window.innerHeight;
      const S = 4.6 * vh;
      const dStory = 0.94 * S;
      const py = window.pageYOffset || document.documentElement.scrollTop || 0;
      const t = (py - dStory) / vh;

      let target = 0;
      if (py <= 0) {
        target = 0;
      } else if (py <= dStory) {
        target = Math.max(0, Math.min(1, (py / dStory - 0.04) / 0.9)) * 3;
      } else if (t <= 0.85) {
        target = 3 + t / 0.85;
      } else {
        target = 4 + Math.min(3, t - 0.85);
      }

      storyBus.targetS = target;

      const s = storyBus.s;
      setSVal(s);

      const c = Math.min(3, Math.max(0, Math.round(Math.min(3, s))));
      if (c !== curChapter) {
        curChapter = c;
        setActiveChapter(c);
      }

      // When s is above 3.3, fade out the story copy, the scene caption and the corner brackets
      const storyFadeOpacity = Math.max(0, Math.min(1, 1 - (s - 3.3) / 0.25));
      copyEl.style.opacity = storyFadeOpacity.toString();
      copyEl.style.pointerEvents = storyFadeOpacity < 0.05 ? "none" : "auto";
      viewEl.style.opacity = storyFadeOpacity.toString();

      // Pointer tilt & 3D text shadow extrusion
      if (!reduce) {
        pw += ((inside ? 1 : 0) - pw) * 0.12;
        if (inside) {
          ptx += (ptTX - ptx) * 0.22;
          pty += (ptTY - pty) * 0.22;
        }
        pxn += ((inside ? ptTX / W - 0.5 : 0) - pxn) * 0.06;
        pyn += ((inside ? ptTY / H - 0.5 : 0) - pyn) * 0.06;

        if (wide) {
          copyEl.style.setProperty("--ry", (pxn * 7).toFixed(2) + "deg");
          copyEl.style.setProperty("--rx", (-pyn * 5).toFixed(2) + "deg");
          copyEl.style.setProperty("--sx", (0.5 + pxn * 2.2).toFixed(2));
          copyEl.style.setProperty("--sy", (0.9 + pyn * 2.2).toFixed(2));
        } else {
          copyEl.style.removeProperty("--rx");
          copyEl.style.removeProperty("--ry");
        }
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      stageEl.removeEventListener("pointermove", onPointerMove);
      stageEl.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  // Keyboard navigation for story chapters when s <= 3.9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (storyBus.s > 3.9) return;
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        go(Math.min(SEG, Math.round(storyBus.s) + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        go(Math.max(0, Math.round(storyBus.s) - 1));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [go]);

  const artSide = SIDES[activeChapter] === 1 ? "right" : "left";

  return (
    <div className="page relative">
      <div className="runway" id="runway" ref={runwayRef}>
        <section
          className="stage"
          id="stage"
          ref={stageRef}
          data-art={artSide}
          aria-label="Digital transformation story in four chapters"
        >
          {/* Corner brackets and readout caption */}
          <div className="view" id="view" ref={viewRef}>
            <p className="readout" id="readout">
              {READ[activeChapter]}
            </p>
          </div>

          {/* Story chapters copy (fades out when s > 3.3) */}
          <div className="copy" id="copy" ref={copyRef} aria-live="polite">
            {/* Chapter 01 */}
            <article
              className="chap"
              data-side="left"
              data-active={activeChapter === 0 ? "true" : "false"}
              aria-hidden={activeChapter === 0 ? "false" : "true"}
            >
              <div className="tilt">
                <p className="eyebrow z1">
                  FOUNDATION
                </p>
                <h2 className="z3">Your business, as it stands.</h2>
                <p className="lead z2">
                  Years of tools, spreadsheets and systems. Each one works. Few
                  of them talk to each other.
                </p>
                <p className="out z2">
                  We map what you have and find what&rsquo;s holding it back.
                </p>
                <ul className="tags z4">
                  <li>Consulting</li>
                  <li>Audits</li>
                </ul>
                <p className="cue z4">Scroll to continue &darr;</p>
              </div>
            </article>

            {/* Chapter 02 */}
            <article
              className="chap"
              data-side="right"
              data-active={activeChapter === 1 ? "true" : "false"}
              aria-hidden={activeChapter === 1 ? "false" : "true"}
            >
              <div className="tilt">
                <p className="eyebrow z1">
                  CONNECT
                </p>
                <h2 className="z3">Every system becomes a signal.</h2>
                <p className="lead z2">
                  We digitise your processes and wire platforms, APIs and custom
                  software into one connected whole.
                </p>
                <p className="out z2">One platform, one source of truth.</p>
                <ul className="tags z4">
                  <li>Custom Software</li>
                  <li>Website Development</li>
                  <li>3D Interactive Design</li>
                </ul>
              </div>
            </article>

            {/* Chapter 03 */}
            <article
              className="chap"
              data-side="left"
              data-active={activeChapter === 2 ? "true" : "false"}
              aria-hidden={activeChapter === 2 ? "false" : "true"}
            >
              <div className="tilt">
                <p className="eyebrow z1">
                  INTELLIGENCE
                </p>
                <h2 className="z3">Then the system starts to think.</h2>
                <p className="lead z2">
                  AI turns connected data into decisions, copilots and
                  automation, with governance and security built in.
                </p>
                <p className="out z2">
                  AI that works in production, not just in demos.
                </p>
                <ul className="tags z4">
                  <li>AI Enablement</li>
                  <li>AI Implementation</li>
                </ul>
              </div>
            </article>

            {/* Chapter 04 */}
            <article
              className="chap"
              data-side="right"
              data-active={activeChapter === 3 ? "true" : "false"}
              aria-hidden={activeChapter === 3 ? "false" : "true"}
            >
              <div className="tilt">
                <p className="eyebrow z1">
                  CYROLABZ
                </p>
                <h2 className="z3">Transformation, engineered.</h2>
                <p className="lead z2">
                  One team takes you from strategy to build to audit. Every
                  point in this mark began as a point in your business.
                </p>
                <p className="out z2">Let&rsquo;s engineer yours.</p>
                <ul className="tags z4">
                  <li>AI Consulting</li>
                  <li>Software Development</li>
                  <li>Audits</li>
                  <li>SEO · AEO · GEO</li>
                </ul>
                <button
                  className="replay z4"
                  id="replay"
                  type="button"
                  onClick={handleReplay}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M2.5 8a5.5 5.5 0 1 0 1.8-4.07" />
                    <path d="M2.5 2.5v3h3" />
                  </svg>
                  Back to the start
                </button>
              </div>
            </article>
          </div>

          {/* Glass Card Carousel for Services (fades in as logo morphs to image 1, s >= 3.55) */}
          <ServicesCarousel s={sVal} />
        </section>
      </div>
    </div>
  );
}
