"use client";

import React, { useEffect, useRef } from "react";
import { STORY_META, STORY_DATA } from "@/features/story/storyData";
import { storyBus, useStoryStore, HoverGlowTarget } from "@/lib/storyStore";

interface NetworkNode {
  x: number;
  y: number;
  col?: number;
  row?: number;
  layer?: number;
  cluster?: number;
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
    // 9,000 desktop, 5,000 mobile
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

    // Add tone buffers for Services Stages (4: Consulting, 5: Connect, 6: Intelligence, 7: Visibility)
    tones.push(new Float32Array(N)); // 4: Consulting
    tones.push(new Float32Array(N)); // 5: Connect
    tones.push(new Float32Array(N)); // 6: Intelligence
    tones.push(new Float32Array(N)); // 7: Visibility

    // Target positions array (0..3 Story, 4..7 Services)
    const tx: Float32Array[] = [];
    const ty: Float32Array[] = [];
    for (let k = 0; k < 8; k++) {
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
      delay[i] = rnd() * 0.35;
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

    const skCv = document.createElement("canvas");
    const ciCv = document.createElement("canvas");
    const fcCv = document.createElement("canvas");
    const mkCv = document.createElement("canvas");

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

    // Distinct Graph structures for the Four Stages
    let nodesStage1: NetworkNode[] = [];
    let edgesStage1: NetworkEdge[] = [];

    let nodesStage2: NetworkNode[] = [];
    let edgesStage2: NetworkEdge[] = [];

    let nodesStage3: NetworkNode[] = [];
    let edgesStage3: NetworkEdge[] = [];
    let travelSignalsStage3: TravelSignal[] = [];

    let nodesStage4: NetworkNode[] = [];
    let edgesStage4: NetworkEdge[] = [];
    let ringRadiiStage4: number[] = [];

    // Rebuild targets and layouts on resize with seeded random
    function layout() {
      W = window.innerWidth;
      H = window.innerHeight;
      wide = wideMQ.matches;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
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

      let netSeed = 20261017;
      function netRnd() {
        netSeed = (netSeed * 1664525 + 1013904223) >>> 0;
        return netSeed / 4294967296;
      }

      // =========================================================================
      // STAGE ONE: CONSULTING | Diagnose (k = 4)
      // Dispersed, interconnected network with fine discovery lines.
      // 4 cluster hubs representing system components; fine lines connect neighbors.
      // =========================================================================
      nodesStage1 = [];
      edgesStage1 = [];
      const clusters = [
        { cx: W * 0.22, cy: H * 0.35, r: Math.min(W, H) * 0.18 },
        { cx: W * 0.36, cy: H * 0.68, r: Math.min(W, H) * 0.20 },
        { cx: W * 0.68, cy: H * 0.32, r: Math.min(W, H) * 0.19 },
        { cx: W * 0.80, cy: H * 0.66, r: Math.min(W, H) * 0.21 },
      ];

      for (let c = 0; c < clusters.length; c++) {
        const cl = clusters[c];
        const nNodes = wide ? 8 : 6;
        const cNodes: NetworkNode[] = [];
        for (let j = 0; j < nNodes; j++) {
          const ang = netRnd() * Math.PI * 2;
          const rad = Math.sqrt(netRnd()) * cl.r;
          const node: NetworkNode = {
            x: cl.cx + rad * Math.cos(ang),
            y: cl.cy + rad * Math.sin(ang),
            cluster: c,
          };
          cNodes.push(node);
          nodesStage1.push(node);
        }

        // Intra-cluster discovery lines
        for (let a = 0; a < cNodes.length; a++) {
          for (let b = a + 1; b < cNodes.length; b++) {
            const d = Math.hypot(cNodes[a].x - cNodes[b].x, cNodes[a].y - cNodes[b].y);
            if (d < cl.r * 1.1) {
              edgesStage1.push({
                u: cNodes[a],
                v: cNodes[b],
                len: d,
                mx: (cNodes[a].x + cNodes[b].x) / 2,
                my: (cNodes[a].y + cNodes[b].y) / 2,
              });
            }
          }
        }
      }

      // Inter-cluster diagnostic bridge lines
      for (let i = 0; i < clusters.length - 1; i++) {
        const nA = nodesStage1.filter((n) => n.cluster === i);
        const nB = nodesStage1.filter((n) => n.cluster === i + 1);
        if (nA.length > 0 && nB.length > 0) {
          const u = nA[Math.floor(netRnd() * nA.length)];
          const v = nB[Math.floor(netRnd() * nB.length)];
          edgesStage1.push({
            u,
            v,
            len: Math.hypot(u.x - v.x, u.y - v.y),
            mx: (u.x + v.x) / 2,
            my: (u.y + v.y) / 2,
          });
        }
      }

      // Stage 1 Particle assignment:
      const X4 = tx[4];
      const Y4 = ty[4];
      const T4 = tones[4];
      const nNodes1 = Math.round(N * 0.12);
      for (let i = 0; i < nNodes1; i++) {
        const node = nodesStage1[i % nodesStage1.length];
        const r = netRnd() * 3.5;
        const th = netRnd() * Math.PI * 2;
        X4[i] = node.x + r * Math.cos(th);
        Y4[i] = node.y + r * Math.sin(th);
        T4[i] = 0.85;
      }
      let eIdx1 = nNodes1;
      let totalLen1 = edgesStage1.reduce((acc, e) => acc + e.len, 0) || 1;
      for (const e of edgesStage1) {
        const count = Math.round((e.len / totalLen1) * (N * 0.72));
        for (let j = 0; j < count && eIdx1 < N; j++) {
          const t = netRnd();
          const jitter = (netRnd() * 2 - 1) * 2;
          X4[eIdx1] = e.u.x + (e.v.x - e.u.x) * t + jitter;
          Y4[eIdx1] = e.u.y + (e.v.y - e.u.y) * t + jitter;
          T4[eIdx1] = 0.45;
          eIdx1++;
        }
      }
      while (eIdx1 < N) {
        // Dispersed floating discovery nodes
        X4[eIdx1] = W * (0.1 + netRnd() * 0.8);
        Y4[eIdx1] = H * (0.1 + netRnd() * 0.8);
        T4[eIdx1] = 0.25;
        eIdx1++;
      }

      // =========================================================================
      // STAGE TWO: CONNECT | Build (k = 5)
      // Geometric architectural structure, horizontal API data buses & vertical pipelines.
      // =========================================================================
      nodesStage2 = [];
      edgesStage2 = [];

      const busYs = [H * 0.28, H * 0.50, H * 0.72];
      const pipeXs = wide
        ? [W * 0.14, W * 0.32, W * 0.50, W * 0.68, W * 0.86]
        : [W * 0.16, W * 0.50, W * 0.84];

      for (const x of pipeXs) {
        for (const y of busYs) {
          nodesStage2.push({ x, y });
        }
      }

      // Horizontal bus edges
      for (const y of busYs) {
        for (let i = 0; i < pipeXs.length - 1; i++) {
          const u = nodesStage2.find((n) => Math.abs(n.x - pipeXs[i]) < 1 && Math.abs(n.y - y) < 1)!;
          const v = nodesStage2.find((n) => Math.abs(n.x - pipeXs[i + 1]) < 1 && Math.abs(n.y - y) < 1)!;
          if (u && v) {
            edgesStage2.push({
              u,
              v,
              len: v.x - u.x,
              mx: (u.x + v.x) / 2,
              my: y,
            });
          }
        }
      }

      // Vertical pipeline edges
      for (const x of pipeXs) {
        for (let j = 0; j < busYs.length - 1; j++) {
          const u = nodesStage2.find((n) => Math.abs(n.x - x) < 1 && Math.abs(n.y - busYs[j]) < 1)!;
          const v = nodesStage2.find((n) => Math.abs(n.x - x) < 1 && Math.abs(n.y - busYs[j + 1]) < 1)!;
          if (u && v) {
            edgesStage2.push({
              u,
              v,
              len: v.y - u.y,
              mx: x,
              my: (u.y + v.y) / 2,
            });
          }
        }
      }

      // Diagonal cross-connects (45° engineering routes)
      for (let i = 0; i < pipeXs.length - 1; i++) {
        if (i % 2 === 0) {
          const u = nodesStage2.find((n) => Math.abs(n.x - pipeXs[i]) < 1 && Math.abs(n.y - busYs[0]) < 1);
          const v = nodesStage2.find((n) => Math.abs(n.x - pipeXs[i + 1]) < 1 && Math.abs(n.y - busYs[1]) < 1);
          if (u && v) {
            edgesStage2.push({
              u,
              v,
              len: Math.hypot(v.x - u.x, v.y - u.y),
              mx: (u.x + v.x) / 2,
              my: (u.y + v.y) / 2,
            });
          }
        }
      }

      // Stage 2 Particle assignment:
      const X5 = tx[5];
      const Y5 = ty[5];
      const T5 = tones[5];
      const nNodes2 = Math.round(N * 0.15);
      for (let i = 0; i < nNodes2; i++) {
        const node = nodesStage2[i % nodesStage2.length];
        const r = netRnd() * 3.0;
        const th = netRnd() * Math.PI * 2;
        X5[i] = node.x + r * Math.cos(th);
        Y5[i] = node.y + r * Math.sin(th);
        T5[i] = 0.90;
      }
      let eIdx2 = nNodes2;
      let totalLen2 = edgesStage2.reduce((acc, e) => acc + e.len, 0) || 1;
      for (const e of edgesStage2) {
        const count = Math.round((e.len / totalLen2) * (N * 0.85));
        for (let j = 0; j < count && eIdx2 < N; j++) {
          const t = netRnd();
          const jitter = (netRnd() * 2 - 1) * 0.8; // Clean architectural precision
          X5[eIdx2] = e.u.x + (e.v.x - e.u.x) * t + jitter;
          Y5[eIdx2] = e.u.y + (e.v.y - e.u.y) * t + jitter;
          T5[eIdx2] = 0.55;
          eIdx2++;
        }
      }
      while (eIdx2 < N) {
        const e = edgesStage2[eIdx2 % edgesStage2.length];
        const t = netRnd();
        X5[eIdx2] = e.u.x + (e.v.x - e.u.x) * t;
        Y5[eIdx2] = e.u.y + (e.v.y - e.u.y) * t;
        T5[eIdx2] = 0.5;
        eIdx2++;
      }

      // =========================================================================
      // STAGE THREE: INTELLIGENCE | Think (k = 6)
      // Neural network organic wave/ribbon with dense synaptic mesh.
      // Direct homage to user reference image: flowing 3D ribbon of connected intelligence.
      // =========================================================================
      nodesStage3 = [];
      edgesStage3 = [];
      const C3 = wide ? 9 : 6;
      const layers: NetworkNode[][] = [];

      for (let c = 0; c < C3; c++) {
        const layerNodes: NetworkNode[] = [];
        const xFrac = (c + 0.5) / C3;
        const x = W * (0.06 + xFrac * 0.88);
        // Parametric wave curve across canvas
        const centerY = H * (0.50 + 0.16 * Math.sin(2.8 * Math.PI * xFrac) + 0.05 * Math.cos(4.2 * Math.PI * xFrac));
        const thickness = H * (0.24 * (0.8 + 0.4 * Math.sin(Math.PI * xFrac)));
        const nInCol = wide ? 7 + Math.floor(netRnd() * 3) : 5 + Math.floor(netRnd() * 2);

        for (let r = 0; r < nInCol; r++) {
          const y = centerY + ((r + 0.5) / nInCol - 0.5) * thickness + (netRnd() - 0.5) * 16;
          const node: NetworkNode = { x, y, col: c, row: r, layer: c };
          layerNodes.push(node);
          nodesStage3.push(node);
        }
        layers.push(layerNodes);
      }

      // Dense synaptic connections between layers
      for (let c = 0; c < C3 - 1; c++) {
        const curr = layers[c];
        const next = layers[c + 1];
        for (const u of curr) {
          const sorted = [...next]
            .map((v) => ({ v, d: Math.hypot(v.x - u.x, v.y - u.y) }))
            .sort((a, b) => a.d - b.d);
          // Connect to 3 nearest in next layer
          for (let k = 0; k < Math.min(3, sorted.length); k++) {
            const v = sorted[k].v;
            edgesStage3.push({
              u,
              v,
              len: sorted[k].d,
              mx: (u.x + v.x) / 2,
              my: (u.y + v.y) / 2,
            });
          }
        }
      }

      // Stage 3 travel signals (data pulses travelling along synaptic connections)
      travelSignalsStage3 = [];
      for (let i = 0; i < (wide ? 32 : 18); i++) {
        travelSignalsStage3.push({
          edgeIdx: Math.floor(netRnd() * edgesStage3.length),
          speed: 0.15 + netRnd() * 0.22,
          offset: netRnd(),
        });
      }

      // Stage 3 Particle assignment:
      const X6 = tx[6];
      const Y6 = ty[6];
      const T6 = tones[6];
      const nNodes3 = Math.round(N * 0.15);
      for (let i = 0; i < nNodes3; i++) {
        const node = nodesStage3[i % nodesStage3.length];
        const r = netRnd() * 4.0;
        const th = netRnd() * Math.PI * 2;
        X6[i] = node.x + r * Math.cos(th);
        Y6[i] = node.y + r * Math.sin(th);
        T6[i] = 0.85 + netRnd() * 0.15;
      }
      let eIdx3 = nNodes3;
      let totalLen3 = edgesStage3.reduce((acc, e) => acc + e.len, 0) || 1;
      for (const e of edgesStage3) {
        const count = Math.round((e.len / totalLen3) * (N * 0.80));
        const dx = (e.v.x - e.u.x) / (e.len || 1);
        const dy = (e.v.y - e.u.y) / (e.len || 1);
        const nx = -dy;
        const ny = dx;
        for (let j = 0; j < count && eIdx3 < N; j++) {
          const t = netRnd();
          const jitter = (netRnd() * 2 - 1) * 2.0;
          X6[eIdx3] = e.u.x + (e.v.x - e.u.x) * t + nx * jitter;
          Y6[eIdx3] = e.u.y + (e.v.y - e.u.y) * t + ny * jitter;
          T6[eIdx3] = 0.4 + netRnd() * 0.45;
          eIdx3++;
        }
      }
      while (eIdx3 < N) {
        const e = edgesStage3[eIdx3 % edgesStage3.length];
        const t = netRnd();
        X6[eIdx3] = e.u.x + (e.v.x - e.u.x) * t;
        Y6[eIdx3] = e.u.y + (e.v.y - e.u.y) * t;
        T6[eIdx3] = 0.5;
        eIdx3++;
      }

      // =========================================================================
      // STAGE FOUR: VISIBILITY | Discover (k = 7)
      // Outward-propagating information hub: concentric signal patterns & radial citation vectors.
      // =========================================================================
      nodesStage4 = [];
      edgesStage4 = [];
      const hubX = W * 0.50;
      const hubY = H * 0.48;
      const minDim = Math.min(W, H);

      ringRadiiStage4 = [
        minDim * 0.08,
        minDim * 0.18,
        minDim * 0.30,
        minDim * 0.44,
        minDim * 0.60,
      ];

      // Central Hub Node
      const centralNode: NetworkNode = { x: hubX, y: hubY };
      nodesStage4.push(centralNode);

      // Radial rays & orbital nodes
      const nRays = wide ? 16 : 12;
      for (let ri = 0; ri < ringRadiiStage4.length; ri++) {
        const rad = ringRadiiStage4[ri];
        for (let ray = 0; ray < nRays; ray++) {
          const ang = (ray / nRays) * Math.PI * 2;
          const node: NetworkNode = {
            x: hubX + rad * Math.cos(ang),
            y: hubY + rad * Math.sin(ang),
          };
          nodesStage4.push(node);

          // Radial connection from inner ring or center
          if (ri === 0) {
            edgesStage4.push({
              u: centralNode,
              v: node,
              len: rad,
              mx: (centralNode.x + node.x) / 2,
              my: (centralNode.y + node.y) / 2,
            });
          }
        }
      }

      // Stage 4 Particle assignment:
      const X7 = tx[7];
      const Y7 = ty[7];
      const T7 = tones[7];
      const nCenter = Math.round(N * 0.15);
      for (let i = 0; i < nCenter; i++) {
        const node = nodesStage4[i % nodesStage4.length];
        const r = netRnd() * 3.5;
        const th = netRnd() * Math.PI * 2;
        X7[i] = node.x + r * Math.cos(th);
        Y7[i] = node.y + r * Math.sin(th);
        T7[i] = 0.90;
      }
      // Concentric orbital particles (45%)
      const nRings = Math.round(N * 0.45);
      for (let i = 0; i < nRings; i++) {
        const rad = ringRadiiStage4[i % ringRadiiStage4.length];
        const ang = netRnd() * Math.PI * 2;
        const jitter = (netRnd() * 2 - 1) * 1.5;
        X7[nCenter + i] = hubX + (rad + jitter) * Math.cos(ang);
        Y7[nCenter + i] = hubY + (rad + jitter) * Math.sin(ang);
        T7[nCenter + i] = 0.55;
      }
      // Outward radiating citation vectors (40%)
      let pIdx4 = nCenter + nRings;
      while (pIdx4 < N) {
        const ray = Math.floor(netRnd() * nRays);
        const ang = (ray / nRays) * Math.PI * 2;
        const dist = netRnd() * (minDim * 0.65);
        const jitter = (netRnd() * 2 - 1) * 1.5;
        X7[pIdx4] = hubX + dist * Math.cos(ang) - Math.sin(ang) * jitter;
        Y7[pIdx4] = hubY + dist * Math.sin(ang) + Math.cos(ang) * jitter;
        T7[pIdx4] = 0.45;
        pIdx4++;
      }
    }

    layout();
    window.addEventListener("resize", layout);

    // Mouse pointer repulsion over window
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
    let glowIntensity = 0;

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function render(now: number) {
      animId = requestAnimationFrame(render);
      if (!isTabVisible) return;

      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      hold += dt;
      storyBus.holdTime = hold;

      reduce = reduceMQ.matches;

      // Ease s toward target
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
      if (s >= 3.5) {
        storyBus.activeServiceStage = Math.min(3, Math.max(0, Math.floor(s - 3.5)));
      } else {
        storyBus.activeServiceStage = 0;
      }

      if (Math.abs(s - lastEmittedS) > 0.002) {
        lastEmittedS = s;
        storyBus.emit(s, target);
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, W, H);

      // Active integer chapter/stage k (0 to 6)
      const k = Math.min(6, Math.max(0, Math.floor(s)));

      // Morph progress between k and k+1
      let m = 0;
      if (k < 3) {
        m = smooth((s - k - 0.3) / 0.5);
      } else if (k === 3) {
        // Logo to Stage 1 (Consulting)
        m = smooth((s - 3.3) / 0.5);
      } else if (k === 4) {
        // Stage 1 (Consulting) to Stage 2 (Connect)
        m = smooth((s - 4.3) / 0.7);
      } else if (k === 5) {
        // Stage 2 (Connect) to Stage 3 (Intelligence)
        m = smooth((s - 5.1) / 0.8);
      } else {
        // Stage 3 (Intelligence) to Stage 4 (Visibility)
        m = smooth((s - 6.1) / 0.8);
      }

      // Story reveals for chapters 0 to 3
      const skylineReveal =
        (1 - smooth((s - 0.18) / 0.12)) * smooth((hold - 0.4) / 1.3);
      const networkReveal =
        smooth((s - 0.74) / 0.16) * (1 - smooth((s - 1.2) / 0.1));
      const faceReveal =
        smooth((s - 1.74) / 0.16) * (1 - smooth((s - 2.2) / 0.1));

      const logoRamp = smooth((s - 2.78) / 0.22);
      const logoFadeOut = 1 - smooth((s - 3.2) / 0.1);
      const logoAlpha = logoRamp * logoFadeOut;

      const maxReveal = Math.max(
        skylineReveal,
        networkReveal,
        faceReveal,
        logoAlpha
      );

      let particleAlphaScale = 1 - 0.72 * maxReveal;

      // NetAmt for services section (s >= 3.55)
      const netAmt = smooth((s - 3.55) / 0.45);
      if (netAmt > 0) {
        // Dim base particles slightly so structured network lines read cleanly through frosted glass
        particleAlphaScale *= 1 - 0.32 * netAmt;
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
      const R = 80;
      const R2 = R * R;
      const push = 28 * pw;
      const offX = reduce ? 0 : pxn * 16;
      const offY = reduce ? 0 : pyn * 11;
      let nAcc = 0;

      context.fillStyle = ink;

      for (let i = 0; i < N; i++) {
        const q = (m - delay[i]) * 1.5385;
        const e = q <= 0 ? 0 : q >= 1 ? 1 : q * q * (3 - 2 * q);

        let x = A[i] + (B[i] - A[i]) * e;
        let y = Ay[i] + (By[i] - Ay[i]) * e;

        // Dynamic arc morph trajectories
        const arc = Math.sin(Math.PI * e);
        if (arc > 0.001) {
          if (k === 0) {
            x += ax[i] * 0.08 * W * arc;
            y += (0.15 + 0.25 * Math.abs(ay[i])) * H * arc;
          } else if (k === 1) {
            const k2 = 0.35 + 0.35 * Math.abs(ax[i]);
            x += (A[i] - cxA) * k2 * arc;
            y += (Ay[i] - cy) * k2 * arc;
          } else if (k === 2) {
            const cxt = cxA + (cxB - cxA) * e;
            const th = arc * (0.9 + 0.9 * ax[i]) * (ay[i] < 0 ? -1 : 1);
            const dx0 = x - cxt;
            const dy0 = y - cy;
            const cs = Math.cos(th);
            const sn = Math.sin(th);
            x = cxt + dx0 * cs - dy0 * sn;
            y = cy + dx0 * sn + dy0 * cs;
          } else {
            // Smooth curved trajectories between service stages
            const dist = Math.hypot(B[i] - A[i], By[i] - Ay[i]);
            if (dist > 0.01) {
              const dx = (B[i] - A[i]) / dist;
              const dy = (By[i] - Ay[i]) / dist;
              const nx = -dy;
              const ny = dx;
              const offset = 0.18 * ax[i] * dist * arc;
              x += nx * offset;
              y += ny * offset;
            }
          }
        }

        // Idle drift
        const calm = live * (1 - 0.7 * arc);
        x += Math.sin(hold * 0.7 + ph[i]) * 0.85 * calm;
        y += Math.cos(hold * 0.65 + ph[i] * 1.3) * 0.85 * calm;

        // Depth parallax
        const z = dep[i];
        x += offX * z;
        y += offY * z;

        // Pointer repulsion
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

      // =======================================================================
      // SERVICES SECTION VISUAL NARRATIVE (s >= 3.5)
      // Progressively transforms across the 4 stages as user scrolls!
      // =======================================================================
      if (netAmt > 0.001) {
        // Compute stage weights for smooth transitions between network states
        // Stage 1 (Consulting): centered ~4.0 to 4.4
        // Stage 2 (Connect): centered ~5.0
        // Stage 3 (Intelligence): centered ~6.0
        // Stage 4 (Visibility): centered ~7.0
        const w1 = Math.max(0, 1 - Math.abs(s - 4.2) / 0.9);
        const w2 = Math.max(0, 1 - Math.abs(s - 5.0) / 0.9);
        const w3 = Math.max(0, 1 - Math.abs(s - 6.0) / 0.9);
        const w4 = Math.max(0, Math.min(1, (s - 6.2) / 0.8));

        // 1. Stage 1 Network (CONSULTING | Diagnose):
        // Dispersed discovery lines and diagnostic node clusters
        if (w1 > 0.01 && edgesStage1.length > 0) {
          // As s progresses through Consulting & Audits (4.0 -> 4.4), lines become clearer
          const stage1Clarity = 0.09 + 0.10 * smooth((s - 3.8) / 0.6);
          context.strokeStyle = ink;
          context.lineWidth = 1;
          context.globalAlpha = stage1Clarity * w1 * netAmt;
          context.beginPath();
          for (let i = 0; i < edgesStage1.length; i++) {
            const e = edgesStage1[i];
            context.moveTo(e.u.x, e.u.y);
            context.lineTo(e.v.x, e.v.y);
          }
          context.stroke();

          // Nodes
          context.fillStyle = ink;
          context.globalAlpha = 0.45 * w1 * netAmt;
          context.beginPath();
          for (let i = 0; i < nodesStage1.length; i++) {
            const n = nodesStage1[i];
            context.moveTo(n.x + 2.4, n.y);
            context.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
          }
          context.fill();
        }

        // 2. Stage 2 Network (CONNECT | Build):
        // Geometric architectural bus lines & orthogonal API highways
        if (w2 > 0.01 && edgesStage2.length > 0) {
          context.strokeStyle = ink;
          context.lineWidth = 1.2;
          context.globalAlpha = 0.16 * w2 * netAmt;
          context.beginPath();
          for (let i = 0; i < edgesStage2.length; i++) {
            const e = edgesStage2[i];
            context.moveTo(e.u.x, e.u.y);
            context.lineTo(e.v.x, e.v.y);
          }
          context.stroke();

          // Architectural junction nodes
          context.fillStyle = ink;
          context.globalAlpha = 0.60 * w2 * netAmt;
          context.beginPath();
          for (let i = 0; i < nodesStage2.length; i++) {
            const n = nodesStage2[i];
            context.moveTo(n.x + 2.8, n.y);
            context.arc(n.x, n.y, 2.8, 0, Math.PI * 2);
          }
          context.fill();
        }

        // 3. Stage 3 Network (INTELLIGENCE | Think):
        // Dense neural network wave & synaptic pulses (User reference image)
        if (w3 > 0.01 && edgesStage3.length > 0) {
          context.strokeStyle = ink;
          context.lineWidth = 0.9;
          context.globalAlpha = 0.15 * w3 * netAmt;
          context.beginPath();
          for (let i = 0; i < edgesStage3.length; i++) {
            const e = edgesStage3[i];
            context.moveTo(e.u.x, e.u.y);
            context.lineTo(e.v.x, e.v.y);
          }
          context.stroke();

          // Sequential activating neural nodes
          for (let i = 0; i < nodesStage3.length; i++) {
            const n = nodesStage3[i];
            // Sequential wave pulse across columns
            const pulse = Math.sin(hold * 2.5 - (n.col || 0) * 0.7);
            const isLit = pulse > 0.6;
            context.fillStyle = isLit ? accent : ink;
            context.globalAlpha = (isLit ? 0.85 : 0.40) * w3 * netAmt;
            context.beginPath();
            const rad = isLit ? 3.0 : 2.2;
            context.arc(n.x, n.y, rad, 0, Math.PI * 2);
            context.fill();
          }

          // Data pulses travelling along synaptic connections
          if (!reduce) {
            context.fillStyle = accent;
            context.globalAlpha = 0.85 * w3 * netAmt;
            for (let si = 0; si < travelSignalsStage3.length; si++) {
              const sig = travelSignalsStage3[si];
              const e = edgesStage3[sig.edgeIdx];
              if (!e) continue;
              const progressAlong = ((hold * sig.speed + sig.offset) % 1 + 1) % 1;
              const sx = e.u.x + (e.v.x - e.u.x) * progressAlong;
              const sy = e.u.y + (e.v.y - e.u.y) * progressAlong;
              context.fillRect(sx - 1.5, sy - 1.5, 3, 3);
            }
          }
        }

        // 4. Stage 4 Network (VISIBILITY | Discover):
        // Outward-propagating information hub & concentric discovery waves
        if (w4 > 0.01 && nodesStage4.length > 0) {
          const hubX = W * 0.50;
          const hubY = H * 0.48;

          // Radial citation vectors
          context.strokeStyle = ink;
          context.lineWidth = 1;
          context.globalAlpha = 0.12 * w4 * netAmt;
          context.beginPath();
          for (let i = 0; i < edgesStage4.length; i++) {
            const e = edgesStage4[i];
            context.moveTo(e.u.x, e.u.y);
            context.lineTo(e.v.x, e.v.y);
          }
          context.stroke();

          // Concentric signal rings
          context.strokeStyle = ink;
          context.lineWidth = 1;
          for (let ri = 0; ri < ringRadiiStage4.length; ri++) {
            const rad = ringRadiiStage4[ri];
            context.globalAlpha = (0.16 - ri * 0.02) * w4 * netAmt;
            context.beginPath();
            context.arc(hubX, hubY, rad, 0, Math.PI * 2);
            context.stroke();
          }

          // Dynamic outward-expanding signal waves (answers & citations being discovered across platforms)
          if (!reduce) {
            const maxWaveR = Math.min(W, H) * 0.65;
            for (let wi = 0; wi < 3; wi++) {
              const waveProgress = ((hold * 0.35 + wi * 0.33) % 1 + 1) % 1;
              const waveR = waveProgress * maxWaveR;
              const waveAlpha = (1 - waveProgress) * 0.35 * w4 * netAmt;
              if (waveAlpha > 0.01) {
                context.strokeStyle = accent;
                context.lineWidth = 1.2;
                context.globalAlpha = waveAlpha;
                context.beginPath();
                context.arc(hubX, hubY, waveR, 0, Math.PI * 2);
                context.stroke();
              }
            }
          }

          // Hub and satellite nodes
          context.fillStyle = ink;
          context.globalAlpha = 0.65 * w4 * netAmt;
          context.beginPath();
          for (let i = 0; i < nodesStage4.length; i++) {
            const n = nodesStage4[i];
            context.moveTo(n.x + 2.5, n.y);
            context.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
          }
          context.fill();

          // Central Hub highlight
          context.fillStyle = accent;
          context.globalAlpha = 0.90 * w4 * netAmt;
          context.beginPath();
          context.arc(hubX, hubY, 4.5, 0, Math.PI * 2);
          context.fill();
        }

        // =====================================================================
        // HOVER GLOW AROUND ACTIVE SERVICE CARDS
        // Subtly illuminates lines & nodes behind frosted card
        // =====================================================================
        const activeGlow = storyBus.hoverGlow;
        if (activeGlow) {
          glowIntensity += (1.0 - glowIntensity) * Math.min(1, dt * 7);
        } else {
          glowIntensity += (0.0 - glowIntensity) * Math.min(1, dt * 7);
        }

        if (glowIntensity > 0.01 && activeGlow) {
          const rEdges = activeGlow.rEdges;
          const rNodes = activeGlow.rNodes;
          const gcx = activeGlow.cx;
          const gcy = activeGlow.cy;

          // Select edges from the currently prominent stages
          const activeEdges =
            w3 > 0.3
              ? edgesStage3
              : w2 > 0.3
              ? edgesStage2
              : w4 > 0.3
              ? edgesStage4
              : edgesStage1;

          const activeNodes =
            w3 > 0.3
              ? nodesStage3
              : w2 > 0.3
              ? nodesStage2
              : w4 > 0.3
              ? nodesStage4
              : nodesStage1;

          context.strokeStyle = accent;
          context.lineWidth = 1.5;
          context.globalAlpha = 0.80 * netAmt * glowIntensity;
          context.beginPath();
          for (let ei = 0; ei < activeEdges.length; ei++) {
            const e = activeEdges[ei];
            if (Math.hypot(e.mx - gcx, e.my - gcy) <= rEdges) {
              context.moveTo(e.u.x, e.u.y);
              context.lineTo(e.v.x, e.v.y);
            }
          }
          context.stroke();

          context.fillStyle = accent;
          context.globalAlpha = 0.90 * netAmt * glowIntensity;
          context.beginPath();
          for (let ni = 0; ni < activeNodes.length; ni++) {
            const n = activeNodes[ni];
            if (Math.hypot(n.x - gcx, n.y - gcy) <= rNodes) {
              context.moveTo(n.x + 3.6, n.y);
              context.arc(n.x, n.y, 3.6, 0, Math.PI * 2);
            }
          }
          context.fill();
        }
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
