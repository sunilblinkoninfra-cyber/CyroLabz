"use client";

import React, { useEffect, useRef } from "react";
import { STORY_META, STORY_DATA } from "@/features/story/storyData";
import { SERVICES_ART_META, SERVICES_ART_DATA } from "@/features/services/servicesArtData";
import { storyBus } from "@/lib/storyStore";

export const StoryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const canvas: HTMLCanvasElement = cv;
    const context: CanvasRenderingContext2D = ctx;

    const rootEl = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = reduceMQ.matches;
    const wideMQ = window.matchMedia("(min-width: 820px)");
    let wide = wideMQ.matches;

    const M = STORY_META.M; // 11,000 points
    const isSmall =
      window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4;
    // 9,000 desktop, 5,000 phones or <=4 cores
    const N = isSmall ? 5000 : 9000;

    const SIDES = [1, -1, 1, -1];
    const STORY_ASPECTS = STORY_META.aspect;

    // Decode base64 uint16 little-endian u (x65535), uint16 v (x65535), uint8 tone (x255)
    function decodePointCloud(b64: string) {
      const bin = atob(b64);
      const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      return {
        u: new Uint16Array(u8.buffer, 0, M),
        v: new Uint16Array(u8.buffer, 2 * M, M),
        t: new Uint8Array(u8.buffer, 4 * M, M),
      };
    }

    // Combine Scenes 0..3 (Story) and 4..7 (Services background images 1..4)
    const allDatasets = [...STORY_DATA, ...SERVICES_ART_DATA];
    const scenes = allDatasets.map(decodePointCloud);

    const tones: Float32Array[] = scenes.map((sc) => {
      const arr = new Float32Array(N);
      for (let i = 0; i < N; i++) arr[i] = sc.t[i] / 255;
      return arr;
    });

    // Target positions array (0..7)
    const tx: Float32Array[] = [];
    const ty: Float32Array[] = [];
    for (let k = 0; k < 8; k++) {
      tx.push(new Float32Array(N));
      ty.push(new Float32Array(N));
    }

    // Deterministic random generator for delays, wander vectors, and sideways bows
    let seed = 20261014;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    const delay = new Float32Array(N);
    const r = new Float32Array(N); // per-particle random number in [-1, 1] for sideways bow
    const ax = new Float32Array(N);
    const ay = new Float32Array(N);
    const dep = new Float32Array(N);
    const ph = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      delay[i] = rnd() * 0.35;
      r[i] = rnd() * 2 - 1;
      ax[i] = rnd() * 2 - 1;
      ay[i] = rnd() * 2 - 1;
      dep[i] = 0.5 + rnd();
      ph[i] = rnd() * 6.2832;
    }

    const accStep = 23;
    const nAccMax = Math.ceil(N / accStep) + 1;
    const accX = new Float32Array(nAccMax);
    const accY = new Float32Array(nAccMax);
    const accA = new Float32Array(nAccMax);

    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
    let cyStory = wide ? H * 0.50 : H * 0.16;
    const cxs = [0, 0, 0, 0];
    const fit: { fw: number; fh: number; cx: number; cy: number }[] = [];

    // Colors
    let ink = "#0B0C0E";
    let accent = "#2F6BFF";
    let bgc = "#F4F5F7";

    function hexToRgb(c: string): [number, number, number] {
      c = (c || "").trim();
      if (c.startsWith("#")) {
        if (c.length === 4)
          c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
        return [
          parseInt(c.substring(1, 3), 16),
          parseInt(c.substring(3, 5), 16),
          parseInt(c.substring(5, 7), 16),
        ];
      }
      return [11, 12, 14];
    }

    // Cut-out images for Story scenes 0..3
    const skyImg = new Image();
    const circImg = new Image();
    const faceImg = new Image();
    const markImg = new Image();

    let skyReady = false;
    let circReady = false;
    let faceReady = false;
    let markReady = false;

    const skCv = document.createElement("canvas");
    const ciCv = document.createElement("canvas");
    const fcCv = document.createElement("canvas");
    const mkCv = document.createElement("canvas");

    // Cut-out images for Services scenes 4..7 (Images 1..4)
    const svcImgs = [new Image(), new Image(), new Image(), new Image()];
    const svcCvs = [
      document.createElement("canvas"),
      document.createElement("canvas"),
      document.createElement("canvas"),
      document.createElement("canvas"),
    ];
    const svcReady = [false, false, false, false];

    function tintCutouts() {
      if (skyReady) {
        skCv.width = skyImg.naturalWidth;
        skCv.height = skyImg.naturalHeight;
        const c = skCv.getContext("2d");
        if (c) {
          c.clearRect(0, 0, skCv.width, skCv.height);
          c.drawImage(skyImg, 0, 0);
          c.globalCompositeOperation = "source-in";
          c.fillStyle = ink;
          c.fillRect(0, 0, skCv.width, skCv.height);
        }
      }

      if (circReady) {
        ciCv.width = circImg.naturalWidth;
        ciCv.height = circImg.naturalHeight;
        const c = ciCv.getContext("2d");
        if (c) {
          c.clearRect(0, 0, ciCv.width, ciCv.height);
          c.drawImage(circImg, 0, 0);
          c.globalCompositeOperation = "source-in";
          c.fillStyle = ink;
          c.fillRect(0, 0, ciCv.width, ciCv.height);
        }
      }

      if (faceReady) {
        fcCv.width = faceImg.naturalWidth;
        fcCv.height = faceImg.naturalHeight;
        const c = fcCv.getContext("2d");
        if (c) {
          c.clearRect(0, 0, fcCv.width, fcCv.height);
          c.drawImage(faceImg, 0, 0);
          const id = c.getImageData(0, 0, fcCv.width, fcCv.height);
          const d = id.data;
          const I = hexToRgb(ink);
          const B = hexToRgb(bgc);
          for (let p = 0; p < d.length; p += 4) {
            const lum = d[p] / 255.0;
            d[p] = Math.round(I[0] + (B[0] - I[0]) * lum);
            d[p + 1] = Math.round(I[1] + (B[1] - I[1]) * lum);
            d[p + 2] = Math.round(I[2] + (B[2] - I[2]) * lum);
          }
          c.putImageData(id, 0, 0);
        }
      }

      if (markReady) {
        mkCv.width = markImg.naturalWidth;
        mkCv.height = markImg.naturalHeight;
        const c = mkCv.getContext("2d");
        if (c) {
          c.clearRect(0, 0, mkCv.width, mkCv.height);
          c.drawImage(markImg, 0, 0);
          c.globalCompositeOperation = "source-in";
          c.fillStyle = ink;
          c.fillRect(0, 0, mkCv.width, mkCv.height);
        }
      }

      // Tint services cut-outs (draw it, then fill with source-in ink)
      for (let sIdx = 0; sIdx < 4; sIdx++) {
        if (svcReady[sIdx]) {
          const cv = svcCvs[sIdx];
          const im = svcImgs[sIdx];
          cv.width = im.naturalWidth;
          cv.height = im.naturalHeight;
          const c = cv.getContext("2d");
          if (c) {
            c.clearRect(0, 0, cv.width, cv.height);
            c.drawImage(im, 0, 0);
            c.globalCompositeOperation = "source-in";
            c.fillStyle = ink;
            c.fillRect(0, 0, cv.width, cv.height);
          }
        }
      }
    }

    skyImg.onload = () => {
      skyReady = true;
      tintCutouts();
    };
    circImg.onload = () => {
      circReady = true;
      tintCutouts();
    };
    faceImg.onload = () => {
      faceReady = true;
      tintCutouts();
    };
    markImg.onload = () => {
      markReady = true;
      tintCutouts();
    };

    skyImg.src = "/assets/cutouts/skyline.webp";
    circImg.src = "/assets/cutouts/circuit.webp";
    faceImg.src = "/assets/cutouts/face.webp";
    markImg.src = "/assets/cutouts/mark.webp";

    svcImgs.forEach((im, idx) => {
      im.onload = () => {
        svcReady[idx] = true;
        tintCutouts();
      };
      im.src = `/assets/cutouts/services-${idx + 1}.webp`;
    });

    function readTokens() {
      const cs = getComputedStyle(rootEl);
      ink = cs.getPropertyValue("--ink").trim() || ink;
      accent = cs.getPropertyValue("--accent").trim() || accent;
      bgc = cs.getPropertyValue("--bg").trim() || bgc;
      tintCutouts();
    }
    readTokens();

    const darkMQ = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      readTokens();
    };
    darkMQ.addEventListener("change", onSystemThemeChange);

    const themeObserver = new MutationObserver(() => {
      readTokens();
    });
    themeObserver.observe(rootEl, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    // Layout calculation for both Story and Services scenes
    function layout() {
      W = window.innerWidth;
      H = window.innerHeight;
      wide = wideMQ.matches;
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      cyStory = wide ? H * 0.50 : H * 0.16;

      // 1. Story scenes 0..3: draw in their own box inside the stage
      for (let k = 0; k < 4; k++) {
        const ar = STORY_ASPECTS[k];
        const fw = wide
          ? Math.min(W * 0.38, H * 0.65 * ar)
          : Math.min(W * 0.70, H * 0.20 * ar);
        const fh = fw / ar;
        const cx = wide ? W * (0.5 + 0.28 * SIDES[k]) : W / 2;
        cxs[k] = cx;
        fit[k] = { fw, fh, cx, cy: cyStory };

        const sc = scenes[k];
        const X = tx[k];
        const Y = ty[k];
        for (let i = 0; i < N; i++) {
          X[i] = cx + (sc.u[i] / 65535 - 0.5) * fw;
          Y[i] = cyStory + (sc.v[i] / 65535 - 0.5) * fh;
        }
      }

      // 2. Services scenes 4..7: Images 1..4 full-stage scaling & positioning
      // images 1 to 3 on desktop: width = max(W, H * aspect), height = width / aspect, centred at (W/2, H * 0.5)
      // images 1 to 3 on screens 820px wide or less: width = W * 2.2, centred at (W/2, H * 0.46)
      // image 4: width = min(W, H) * 1.25 on desktop and * 1.5 on mobile, centred the same way
      const isMobile = W <= 820;
      for (let imgIdx = 0; imgIdx < 4; imgIdx++) {
        const k = 4 + imgIdx;
        const ar = SERVICES_ART_META.aspect[imgIdx];
        let width = 0;
        let height = 0;
        const centreX = W / 2;
        const centreY = isMobile ? H * 0.46 : H * 0.50;

        if (imgIdx < 3) {
          if (!isMobile) {
            width = Math.max(W, H * ar);
            height = width / ar;
          } else {
            width = W * 2.2;
            height = width / ar;
          }
        } else {
          // Image 4 (smoke ring, aspect 1.0)
          const minDim = Math.min(W, H);
          width = !isMobile ? minDim * 1.25 : minDim * 1.5;
          height = width;
        }

        fit[k] = { fw: width, fh: height, cx: centreX, cy: centreY };

        const sc = scenes[k];
        const X = tx[k];
        const Y = ty[k];
        for (let i = 0; i < N; i++) {
          X[i] = centreX + (sc.u[i] / 65535 - 0.5) * width;
          Y[i] = centreY + (sc.v[i] / 65535 - 0.5) * height;
        }
      }
    }

    layout();
    window.addEventListener("resize", layout);

    // Pointer tracking across the entire window (ignore touch pointers)
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
      ptTX = e.clientX;
      ptTY = e.clientY;
      if (!inside) {
        ptx = ptTX;
        pty = ptTY;
      }
      inside = true;
    };

    const onPointerLeave = () => {
      inside = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    function smooth(x: number) {
      return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
    }

    let animId = 0;
    let hold = 0;
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      if (document.hidden) {
        animId = 0;
        return;
      }

      animId = requestAnimationFrame(loop);

      const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
      lastTime = timestamp;
      hold += dt;
      storyBus.holdTime = hold;

      reduce = reduceMQ.matches;

      // Pointer physics
      if (!reduce) {
        pw += ((inside ? 1 : 0) - pw) * 0.12;
        if (inside) {
          ptx += (ptTX - ptx) * 0.22;
          pty += (ptTY - pty) * 0.22;
        }
        pxn += ((inside ? ptTX / W - 0.5 : 0) - pxn) * 0.06;
        pyn += ((inside ? ptTY / H - 0.5 : 0) - pyn) * 0.06;
      } else {
        pw = 0;
        ptx = -9999;
        pty = -9999;
        pxn = 0;
        pyn = 0;
      }

      // Smooth easing of progress s toward target:
      // With prefers-reduced-motion: s follows scroll without easing
      // Otherwise: s += (target - s) * min(1, dt * 7)
      let s = storyBus.s;
      const targetS = storyBus.targetS;
      if (reduce) {
        s = targetS;
      } else {
        s += (targetS - s) * Math.min(1, dt * 7);
      }
      storyBus.emit(s, targetS);

      // Rendering: Clear canvas
      context.save();
      context.scale(dpr, dpr);
      context.clearRect(0, 0, W, H);

      // Interval a = floor(s) clamped to [0, 6]
      const a = Math.min(6, Math.max(0, Math.floor(s)));
      // Morph value m between scene a and a+1: m = smoothstep((s - a - 0.3) / 0.5)
      const m = smooth((s - a - 0.3) / 0.5);

      // Reveals for story chapters 0 to 3
      const skylineReveal =
        (1 - smooth((s - 0.18) / 0.12)) * smooth((hold - 0.4) / 1.3);
      const networkReveal =
        smooth((s - 0.74) / 0.16) * (1 - smooth((s - 1.2) / 0.1));
      const faceReveal =
        smooth((s - 1.74) / 0.16) * (1 - smooth((s - 2.2) / 0.1));

      // The logo's own crisp fade-in must now release before the morph:
      // multiply it by (1 - smoothstep((s - 3.2) / 0.1))
      const logoRamp = smooth((s - 2.78) / 0.22);
      const logoFadeOut = 1 - smooth((s - 3.2) / 0.1);
      const logoAlpha = logoRamp * logoFadeOut;

      // Crisp reveals for Services scenes 4..7 (Images 1..4):
      // reveal_k = smoothstep((s - (k - 0.26)) / 0.16) * (k < 7 ? (1 - smoothstep((s - (k + 0.2)) / 0.1)) : 1.0)
      const svcReveals = [0, 0, 0, 0];
      for (let imgIdx = 0; imgIdx < 4; imgIdx++) {
        const k = 4 + imgIdx;
        const inStep = smooth((s - (k - 0.26)) / 0.16);
        const outStep = k < 7 ? 1 - smooth((s - (k + 0.2)) / 0.1) : 1.0;
        svcReveals[imgIdx] = inStep * outStep;
      }

      const maxStoryReveal = Math.max(
        skylineReveal,
        networkReveal,
        faceReveal,
        logoAlpha
      );
      const maxSvcReveal = Math.max(...svcReveals);
      const activeReveal = Math.max(maxStoryReveal, maxSvcReveal);

      // While a reveal is up, multiply particle opacity by (1 - 0.72 * reveal_k)
      const particleAlphaScale = 1 - 0.72 * activeReveal;

      const A = tx[a];
      const Ay = ty[a];
      const B = tx[a + 1];
      const By = ty[a + 1];
      const tA = tones[a];
      const tB = tones[a + 1];
      const cxA = cxs[Math.min(3, a)];
      const cxB = cxs[Math.min(3, a + 1)];

      const live = reduce ? 0 : 1;
      const R = 80;
      const R2 = R * R;
      const push = reduce ? 0 : 28 * pw;
      const offX = reduce ? 0 : pxn * 16;
      const offY = reduce ? 0 : pyn * 11;
      let nAcc = 0;

      context.fillStyle = ink;

      for (let i = 0; i < N; i++) {
        // Each particle's own progress: e = smoothstep(clamp((m - delay) * 1.5385, 0, 1))
        const q = Math.max(0, Math.min(1, (m - delay[i]) * 1.5385));
        const e = q * q * (3 - 2 * q);

        let x = A[i] + (B[i] - A[i]) * e;
        let y = Ay[i] + (By[i] - Ay[i]) * e;

        const arc = Math.sin(Math.PI * e);
        if (arc > 0.001) {
          if (a === 0) {
            x += ax[i] * 0.08 * W * arc;
            y += (0.15 + 0.25 * Math.abs(ay[i])) * H * arc;
          } else if (a === 1) {
            const k2 = 0.35 + 0.35 * Math.abs(ax[i]);
            x += (A[i] - cxA) * k2 * arc;
            y += (Ay[i] - cyStory) * k2 * arc;
          } else if (a === 2) {
            const cxt = cxA + (cxB - cxA) * e;
            const th = arc * (0.9 + 0.9 * ax[i]) * (ay[i] < 0 ? -1 : 1);
            const dx0 = x - cxt;
            const dy0 = y - cyStory;
            const cs = Math.cos(th);
            const sn = Math.sin(th);
            x = cxt + dx0 * cs - dy0 * sn;
            y = cyStory + dx0 * sn + dy0 * cs;
          } else {
            // For every transition from a = 3 upwards:
            // sideways bow: x += -(By - Ay) * 0.2 * r * arc and y += (Bx - Ax) * 0.2 * r * arc
            x += -(By[i] - Ay[i]) * 0.2 * r[i] * arc;
            y += (B[i] - A[i]) * 0.2 * r[i] * arc;
          }
        }

        // Idle drift (about 0.9px) scaled by (1 - 0.7 * arc)
        const calm = live * (1 - 0.7 * arc);
        x += Math.sin(hold * 0.7 + ph[i]) * 0.9 * calm;
        y += Math.cos(hold * 0.65 + ph[i] * 1.3) * 0.9 * calm;

        // Depth parallax
        const z = dep[i];
        x += offX * z;
        y += offY * z;

        // Pointer push
        if (push > 0.05) {
          const ddx = x - ptx;
          const ddy = y - pty;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = 1 - d / R;
            x += (ddx / d) * f * f * push;
            y += (ddy / d) * f * f * push;
          }
        }

        const t = tA[i] + (tB[i] - tA[i]) * e;

        // Signal particles in accent color
        if (i % accStep === 0) {
          accX[nAcc] = x;
          accY[nAcc] = y;
          accA[nAcc] =
            (0.55 + 0.45 * Math.sin(hold * 2.1 + ph[i] * 3)) *
            particleAlphaScale;
          nAcc++;
          continue;
        }

        const sz = 1.2 + t * 1.1;
        context.globalAlpha = (0.28 + 0.72 * t) * particleAlphaScale;
        context.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }

      // Draw signal particles
      context.fillStyle = accent;
      for (let j = 0; j < nAcc; j++) {
        context.globalAlpha = accA[j];
        context.fillRect(accX[j] - 1.5, accY[j] - 1.5, 3, 3);
      }

      // Crisp cut-out reveals for chapters 0 to 3
      if (skylineReveal > 0 && skyReady && fit[0]) {
        context.globalAlpha = skylineReveal;
        context.drawImage(
          skCv,
          fit[0].cx - fit[0].fw / 2,
          fit[0].cy - fit[0].fh / 2,
          fit[0].fw,
          fit[0].fh
        );
      }

      if (networkReveal > 0 && circReady && fit[1]) {
        context.globalAlpha = networkReveal;
        context.drawImage(
          ciCv,
          fit[1].cx - fit[1].fw / 2,
          fit[1].cy - fit[1].fh / 2,
          fit[1].fw,
          fit[1].fh
        );
      }

      if (faceReveal > 0 && faceReady && fit[2]) {
        context.globalAlpha = faceReveal;
        context.drawImage(
          fcCv,
          fit[2].cx - fit[2].fw / 2,
          fit[2].cy - fit[2].fh / 2,
          fit[2].fw,
          fit[2].fh
        );
      }

      if (logoAlpha > 0 && markReady && fit[3]) {
        context.globalAlpha = logoAlpha;
        context.drawImage(
          mkCv,
          fit[3].cx - fit[3].fw / 2,
          fit[3].cy - fit[3].fh / 2,
          fit[3].fw,
          fit[3].fh
        );
      }

      // Crisp cut-out reveals for Services scenes 4..7:
      // draw the tinted cut-out at opacity reveal_k * 0.8
      for (let imgIdx = 0; imgIdx < 4; imgIdx++) {
        const rev = svcReveals[imgIdx];
        const k = 4 + imgIdx;
        if (rev > 0 && svcReady[imgIdx] && fit[k]) {
          context.globalAlpha = rev * 0.8;
          context.drawImage(
            svcCvs[imgIdx],
            fit[k].cx - fit[k].fw / 2,
            fit[k].cy - fit[k].fh / 2,
            fit[k].fw,
            fit[k].fh
          );
        }
      }

      context.restore();
    };

    lastTime = performance.now();
    animId = requestAnimationFrame(loop);

    // Pause loop when tab is hidden
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      } else {
        if (!animId) {
          lastTime = performance.now();
          animId = requestAnimationFrame(loop);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      darkMQ.removeEventListener("change", onSystemThemeChange);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
};
