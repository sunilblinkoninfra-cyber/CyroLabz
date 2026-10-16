"use client";

import React, { useEffect, useRef } from "react";
import { STORY_META, STORY_DATA } from "@/features/story/storyData";
import { storyBus, useStoryStore, HoverGlowTarget } from "@/lib/storyStore";

interface NetworkNode {
  x: number;
  y: number;
  col: number;
  row: number;
}

interface NetworkEdge {
  u: NetworkNode;
  v: NetworkNode;
  len: number;
  mx: number;
  my: number;
}

interface TravelSignal {
  edgeIdx: number;
  speed: number;
  offset: number;
}

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

    const M = STORY_META.M; // 11,000 max points
    const isSmall =
      window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4;
    // Keep particle counts as specified: 9,000 desktop, 5,000 phones
    const N = isSmall ? 5000 : 9000;

    const SIDES = [1, -1, 1, -1];
    const ASPECTS = STORY_META.aspect;

    // Decode base64 uint16 u, uint16 v, uint8 tone
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

    const scenes = STORY_DATA.map(decodePointCloud);
    const tones = scenes.map((sc) => {
      const arr = new Float32Array(N);
      for (let i = 0; i < N; i++) arr[i] = sc.t[i] / 255;
      return arr;
    });
    // Tone buffer for Scene 5 (network)
    tones.push(new Float32Array(N));

    // Target positions array (0: Skyline, 1: Circuit, 2: Face, 3: Logo, 4: Network)
    const tx: Float32Array[] = [];
    const ty: Float32Array[] = [];
    for (let k = 0; k < 5; k++) {
      tx.push(new Float32Array(N));
      ty.push(new Float32Array(N));
    }

    // Deterministic random generator for delays and wander vectors
    let seed = 20261014;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    const delay = new Float32Array(N);
    const ax = new Float32Array(N);
    const ay = new Float32Array(N);
    const dep = new Float32Array(N);
    const ph = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      delay[i] = rnd() * 0.35; // Per-particle delay up to 0.35
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
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cy = H * 0.50;
    const cxs = [0, 0, 0, 0];
    const fit: { fw: number; fh: number }[] = [];

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

    // Cut-out images
    const skyImg = new Image();
    const circImg = new Image();
    const faceImg = new Image();
    const markImg = new Image();

    let skyReady = false;
    let circReady = false;
    let faceReady = false;
    let markReady = false;

    // Tinted offscreen canvases
    const skCv = document.createElement("canvas");
    const ciCv = document.createElement("canvas");
    const fcCv = document.createElement("canvas");
    const mkCv = document.createElement("canvas");

    function tintCutouts() {
      // 1. Skyline
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

      // 2. Circuit
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

      // 3. Face
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

      // 4. Logo mark
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

    // Network graph structures for lines & hover glow
    let networkNodes: NetworkNode[] = [];
    let networkEdges: NetworkEdge[] = [];
    let travelSignals: TravelSignal[] = [];

    // Rebuild network targets on resize with seeded random
    function layout() {
      W = window.innerWidth;
      H = window.innerHeight;
      wide = wideMQ.matches;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      // Chapters 0-3 art center: 50% on desktop, 16% on mobile (retained)
      cy = wide ? H * 0.50 : H * 0.16;

      // 1. Chapters 0 to 3 retain their exact placement & bounds
      for (let k = 0; k < 4; k++) {
        const ar = ASPECTS[k];
        const fw = wide
          ? Math.min(W * 0.38, H * 0.65 * ar)
          : Math.min(W * 0.70, H * 0.20 * ar);
        const fh = fw / ar;
        const cx = wide ? W * (0.5 + 0.28 * SIDES[k]) : W / 2;
        cxs[k] = cx;
        fit[k] = { fw, fh };

        const sc = scenes[k];
        const X = tx[k];
        const Y = ty[k];
        for (let i = 0; i < N; i++) {
          X[i] = cx + (sc.u[i] / 65535 - 0.5) * fw;
          Y[i] = cy + (sc.v[i] / 65535 - 0.5) * fh;
        }
      }

      // 2. Scene 5: Network targets across full stage with seeded random generator
      let netSeed = 20261016;
      function netRnd() {
        netSeed = (netSeed * 1664525 + 1013904223) >>> 0;
        return netSeed / 4294967296;
      }

      // Desktop: 8 columns; Phones: 5 columns
      const C = wide ? 8 : 5;
      const padX = W * (wide ? 0.05 : 0.04);
      const padY = H * (wide ? 0.08 : 0.06);
      const usableW = W - 2 * padX;
      const usableH = H - 2 * padY;

      const columns: NetworkNode[][] = [];
      networkNodes = [];

      for (let c = 0; c < C; c++) {
        const colNodes: NetworkNode[] = [];
        // Each column has 6 to 8 nodes, evenly spread vertically with a little random offset
        const nRows = 6 + Math.floor(netRnd() * 3);
        const colBaseX = padX + ((c + 0.5) / C) * usableW;

        for (let r = 0; r < nRows; r++) {
          const x = colBaseX + (netRnd() - 0.5) * ((usableW / C) * 0.45);
          const y = padY + ((r + 0.5 + (netRnd() - 0.5) * 0.6) / nRows) * usableH;
          const node: NetworkNode = { x, y, col: c, row: r };
          colNodes.push(node);
          networkNodes.push(node);
        }
        colNodes.sort((a, b) => a.y - b.y);
        columns.push(colNodes);
      }

      // Connect every node to its 2 nearest nodes in next column, plus 3rd with 30% probability
      networkEdges = [];
      const incomingEdgesCount = new Map<NetworkNode, number>();
      networkNodes.forEach((n) => incomingEdgesCount.set(n, 0));

      for (let c = 0; c < C - 1; c++) {
        const currCol = columns[c];
        const nextCol = columns[c + 1];

        for (const u of currCol) {
          const sortedNext = [...nextCol]
            .map((v) => ({
              node: v,
              dist: Math.hypot(v.x - u.x, v.y - u.y),
            }))
            .sort((a, b) => a.dist - b.dist);

          // 2 nearest
          for (let ki = 0; ki < Math.min(2, sortedNext.length); ki++) {
            const v = sortedNext[ki].node;
            const len = sortedNext[ki].dist;
            networkEdges.push({
              u,
              v,
              len,
              mx: (u.x + v.x) / 2,
              my: (u.y + v.y) / 2,
            });
            incomingEdgesCount.set(v, (incomingEdgesCount.get(v) || 0) + 1);
          }

          // 3rd with 30% probability
          if (sortedNext.length >= 3 && netRnd() < 0.3) {
            const v = sortedNext[2].node;
            const len = sortedNext[2].dist;
            networkEdges.push({
              u,
              v,
              len,
              mx: (u.x + v.x) / 2,
              my: (u.y + v.y) / 2,
            });
            incomingEdgesCount.set(v, (incomingEdgesCount.get(v) || 0) + 1);
          }
        }
      }

      // Make sure every node has at least one incoming edge
      for (let c = 1; c < C; c++) {
        const prevCol = columns[c - 1];
        for (const v of columns[c]) {
          if ((incomingEdgesCount.get(v) || 0) === 0) {
            let nearestU = prevCol[0];
            let minDist = Math.hypot(nearestU.x - v.x, nearestU.y - v.y);
            for (let i = 1; i < prevCol.length; i++) {
              const d = Math.hypot(prevCol[i].x - v.x, prevCol[i].y - v.y);
              if (d < minDist) {
                minDist = d;
                nearestU = prevCol[i];
              }
            }
            networkEdges.push({
              u: nearestU,
              v,
              len: minDist,
              mx: (nearestU.x + v.x) / 2,
              my: (nearestU.y + v.y) / 2,
            });
            incomingEdgesCount.set(v, 1);
          }
        }
      }

      // About 24 small accent-colour squares (3px) travelling along random edges at slow constant speed
      travelSignals = [];
      for (let i = 0; i < 24; i++) {
        travelSignals.push({
          edgeIdx: Math.floor(netRnd() * networkEdges.length),
          speed: 0.12 + netRnd() * 0.16,
          offset: netRnd(),
        });
      }

      // Assign about 10% particles to nodes (small disc radius up to 4px)
      const N_nodes = Math.round(N * 0.10);
      const N_edges = N - N_nodes;
      const X4 = tx[4];
      const Y4 = ty[4];
      const tone4 = tones[4];

      for (let i = 0; i < N_nodes; i++) {
        const node = networkNodes[i % networkNodes.length];
        const r = netRnd() * 4.0;
        const theta = netRnd() * Math.PI * 2;
        X4[i] = node.x + r * Math.cos(theta);
        Y4[i] = node.y + r * Math.sin(theta);
        tone4[i] = 0.8 + netRnd() * 0.2;
      }

      // Assign rest (90%) along edges in proportion to edge length, with 1 to 2px of sideways jitter
      let totalEdgeLen = 0;
      for (const e of networkEdges) totalEdgeLen += e.len;

      let pIdx = N_nodes;
      for (const e of networkEdges) {
        const edgeParticles = Math.round((e.len / (totalEdgeLen || 1)) * N_edges);
        const dx = (e.v.x - e.u.x) / (e.len || 1);
        const dy = (e.v.y - e.u.y) / (e.len || 1);
        const nx = -dy;
        const ny = dx;

        for (let j = 0; j < edgeParticles && pIdx < N; j++) {
          const t = netRnd();
          const jitter = (netRnd() * 2 - 1) * 1.5; // 1 to 2px sideways jitter
          X4[pIdx] = e.u.x + (e.v.x - e.u.x) * t + nx * jitter;
          Y4[pIdx] = e.u.y + (e.v.y - e.u.y) * t + ny * jitter;
          tone4[pIdx] = 0.3 + netRnd() * 0.5;
          pIdx++;
        }
      }
      while (pIdx < N) {
        const e = networkEdges[pIdx % networkEdges.length];
        const t = netRnd();
        X4[pIdx] = e.u.x + (e.v.x - e.u.x) * t;
        Y4[pIdx] = e.u.y + (e.v.y - e.u.y) * t;
        tone4[pIdx] = 0.5;
        pIdx++;
      }
    }
    layout();
    window.addEventListener("resize", layout);

    // Mouse pointer push effect: listen on window, ignore touch pointers
    let ptx = -9999;
    let pty = -9999;
    let pw = 0;
    let pxn = 0;
    let pyn = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      ptx = e.clientX;
      pty = e.clientY;
      pw = 1;
      pxn = (e.clientX / W - 0.5) * 2;
      pyn = (e.clientY / H - 0.5) * 2;
    };
    const onPointerLeave = () => {
      pw = 0;
      pxn = 0;
      pyn = 0;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    function clamp01(x: number) {
      return x < 0 ? 0 : x > 1 ? 1 : x;
    }
    function smooth(x: number) {
      x = clamp01(x);
      return x * x * (3 - 2 * x);
    }

    let s = storyBus.s;
    let hold = 0;
    let lastTime = performance.now();
    let animId = 0;
    let isTabVisible = !document.hidden;
    let lastEmittedS = -999;
    let glowIntensity = 0; // Eased hover glow alpha

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function render(now: number) {
      animId = requestAnimationFrame(render);
      // Pause rendering when tab is hidden
      if (!isTabVisible) return;

      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      hold += dt;
      storyBus.holdTime = hold;

      reduce = reduceMQ.matches;

      // Ease s toward target: s += (target - s) * min(1, dt * 7)
      const target = storyBus.targetS;
      if (useStoryStore.getState().isTraveling) {
        s = storyBus.s;
      } else if (reduce) {
        s = target;
      } else {
        s += (target - s) * Math.min(1, dt * 7);
      }
      storyBus.s = s;
      storyBus.activeChapter = Math.min(4, Math.max(0, Math.round(s)));
      if (Math.abs(s - lastEmittedS) > 0.002) {
        lastEmittedS = s;
        storyBus.emit(s, target);
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, W, H);

      // Chapter k index (0, 1, 2, 3)
      const k = Math.min(3, Math.max(0, Math.floor(s)));

      // Morph progress between k and k+1:
      // For k=0..2: smoothstep((s - k - 0.3) / 0.5)
      // For k=3 (logo to network): runs from s = 3.3 to 3.8
      let m = 0;
      if (k < 3) {
        m = smooth((s - k - 0.3) / 0.5);
      } else {
        // Morph itself runs from s = 3.3 to 3.8
        m = smooth((s - 3.3) / 0.5);
      }

      // Artwork reveals:
      const skylineReveal =
        (1 - smooth((s - 0.18) / 0.12)) * smooth((hold - 0.4) / 1.3);
      const networkReveal =
        smooth((s - 0.74) / 0.16) * (1 - smooth((s - 1.2) / 0.1));
      const faceReveal =
        smooth((s - 1.74) / 0.16) * (1 - smooth((s - 2.2) / 0.1));

      // Release crisp logo image just before morph:
      // fade-in multiplied by (1 - smoothstep((s - 3.2) / 0.1))
      const logoRamp = smooth((s - 2.78) / 0.22);
      const logoFadeOut = 1 - smooth((s - 3.2) / 0.1);
      const logoAlpha = logoRamp * logoFadeOut;

      const maxReveal = Math.max(
        skylineReveal,
        networkReveal,
        faceReveal,
        logoAlpha
      );

      // Dim particles while sharp reveal is active
      let particleAlphaScale = 1 - 0.72 * maxReveal;

      // After morph: netAmt = smoothstep((s - 3.55) / 0.45)
      const netAmt = smooth((s - 3.55) / 0.45);
      if (netAmt > 0) {
        // Dim particles by 35% so lines read as structure
        particleAlphaScale *= (1 - 0.35 * netAmt);
      }

      const A = tx[k];
      const Ay = ty[k];
      const B = tx[k + 1];
      const By = ty[k + 1];
      const tA = tones[k];
      const tB = tones[k + 1];
      const cxA = cxs[Math.min(3, k)];
      const cxB = cxs[Math.min(3, k + 1)];

      const live = reduce ? 0 : 1;
      const R = 75;
      const R2 = R * R;
      const push = 28 * pw;
      const offX = reduce ? 0 : pxn * 16;
      const offY = reduce ? 0 : pyn * 11;
      let nAcc = 0;

      context.fillStyle = ink;

      for (let i = 0; i < N; i++) {
        // Per-particle delay up to 0.35 so particles stream rather than slide
        const q = (m - delay[i]) * 1.5385;
        const e = q <= 0 ? 0 : q >= 1 ? 1 : q * q * (3 - 2 * q);

        let x = A[i] + (B[i] - A[i]) * e;
        let y = Ay[i] + (By[i] - Ay[i]) * e;

        // Dynamic arc morph trajectories
        const arc = Math.sin(Math.PI * e);
        if (arc > 0.001) {
          if (k === 0) {
            // Skyline windows fall and form network
            x += ax[i] * 0.08 * W * arc;
            y += (0.15 + 0.25 * Math.abs(ay[i])) * H * arc;
          } else if (k === 1) {
            // Network bursts outward and gathers into face
            const k2 = 0.35 + 0.35 * Math.abs(ax[i]);
            x += (A[i] - cxA) * k2 * arc;
            y += (Ay[i] - cy) * k2 * arc;
          } else if (k === 2) {
            // Face spirals into logo mark
            const cxt = cxA + (cxB - cxA) * e;
            const th = arc * (0.9 + 0.9 * ax[i]) * (ay[i] < 0 ? -1 : 1);
            const dx0 = x - cxt;
            const dy0 = y - cy;
            const cs = Math.cos(th);
            const sn = Math.sin(th);
            x = cxt + dx0 * cs - dy0 * sn;
            y = cy + dx0 * sn + dy0 * cs;
          } else {
            // Logo-to-network morph: curved path offset sideways by 0.2 * ax[i] * dist * sin(pi * e)
            const dist = Math.hypot(B[i] - A[i], By[i] - Ay[i]);
            if (dist > 0.01) {
              const dx = (B[i] - A[i]) / dist;
              const dy = (By[i] - Ay[i]) / dist;
              const nx = -dy;
              const ny = dx;
              const offset = 0.2 * ax[i] * dist * arc;
              x += nx * offset;
              y += ny * offset;
            }
          }
        }

        // Idle drift (skipped with prefers-reduced-motion)
        const calm = live * (1 - 0.7 * arc);
        x += Math.sin(hold * 0.8 + ph[i]) * 0.9 * calm;
        y += Math.cos(hold * 0.7 + ph[i] * 1.3) * 0.9 * calm;

        // Depth parallax
        const z = dep[i];
        x += offX * z;
        y += offY * z;

        // Pointer repulsion (works over whole window)
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
          cxs[0] - fit[0].fw / 2,
          cy - fit[0].fh / 2,
          fit[0].fw,
          fit[0].fh
        );
      }

      if (networkReveal > 0 && circReady && fit[1]) {
        context.globalAlpha = networkReveal;
        context.drawImage(
          ciCv,
          cxs[1] - fit[1].fw / 2,
          cy - fit[1].fh / 2,
          fit[1].fw,
          fit[1].fh
        );
      }

      if (faceReveal > 0 && faceReady && fit[2]) {
        context.globalAlpha = faceReveal;
        context.drawImage(
          fcCv,
          cxs[2] - fit[2].fw / 2,
          cy - fit[2].fh / 2,
          fit[2].fw,
          fit[2].fh
        );
      }

      if (logoAlpha > 0 && markReady && fit[3]) {
        context.globalAlpha = logoAlpha;
        context.drawImage(
          mkCv,
          cxs[3] - fit[3].fw / 2,
          cy - fit[3].fh / 2,
          fit[3].fw,
          fit[3].fh
        );
      }

      // After morph (netAmt > 0): draw crisp lines, node circles, and traveling signals
      if (netAmt > 0.001 && networkEdges.length > 0) {
        // 1. Every edge as a 1px line in the ink colour at 12% opacity
        context.strokeStyle = ink;
        context.lineWidth = 1;
        context.globalAlpha = 0.12 * netAmt;
        context.beginPath();
        for (let ei = 0; ei < networkEdges.length; ei++) {
          const e = networkEdges[ei];
          context.moveTo(e.u.x, e.u.y);
          context.lineTo(e.v.x, e.v.y);
        }
        context.stroke();

        // 2. Every node as a 2.4px circle at 50% opacity
        context.fillStyle = ink;
        context.globalAlpha = 0.50 * netAmt;
        context.beginPath();
        for (let ni = 0; ni < networkNodes.length; ni++) {
          const n = networkNodes[ni];
          context.moveTo(n.x + 2.4, n.y);
          context.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
        }
        context.fill();

        // 3. About 24 small accent-colour squares (3px) travelling along random edges at slow constant speed
        if (!reduce) {
          context.fillStyle = accent;
          context.globalAlpha = 0.85 * netAmt;
          for (let si = 0; si < travelSignals.length; si++) {
            const sig = travelSignals[si];
            const e = networkEdges[sig.edgeIdx];
            if (!e) continue;
            const progressAlong = ((hold * sig.speed + sig.offset) % 1 + 1) % 1;
            const sx = e.u.x + (e.v.x - e.u.x) * progressAlong;
            const sy = e.u.y + (e.v.y - e.u.y) * progressAlong;
            context.fillRect(sx - 1.5, sy - 1.5, 3, 3);
          }
        }
      }

      // Hover glow around active service card
      const activeGlow = storyBus.hoverGlow;
      if (activeGlow && netAmt > 0.001) {
        glowIntensity += (1.0 - glowIntensity) * Math.min(1, dt * 7);
      } else {
        glowIntensity += (0.0 - glowIntensity) * Math.min(1, dt * 7);
      }

      if (glowIntensity > 0.01 && activeGlow && netAmt > 0.001) {
        const rEdges = activeGlow.rEdges;
        const rNodes = activeGlow.rNodes;
        const gcx = activeGlow.cx;
        const gcy = activeGlow.cy;

        // Glowing edges: 1.5px, 80% opacity in accent
        context.strokeStyle = accent;
        context.lineWidth = 1.5;
        context.globalAlpha = 0.80 * netAmt * glowIntensity;
        context.beginPath();
        for (let ei = 0; ei < networkEdges.length; ei++) {
          const e = networkEdges[ei];
          if (Math.hypot(e.mx - gcx, e.my - gcy) <= rEdges) {
            context.moveTo(e.u.x, e.u.y);
            context.lineTo(e.v.x, e.v.y);
          }
        }
        context.stroke();

        // Glowing nodes: 3.6px circle in accent
        context.fillStyle = accent;
        context.globalAlpha = 0.90 * netAmt * glowIntensity;
        context.beginPath();
        for (let ni = 0; ni < networkNodes.length; ni++) {
          const n = networkNodes[ni];
          if (Math.hypot(n.x - gcx, n.y - gcy) <= rNodes) {
            context.moveTo(n.x + 3.6, n.y);
            context.arc(n.x, n.y, 3.6, 0, Math.PI * 2);
          }
        }
        context.fill();
      }

      context.globalAlpha = 1;
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
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
