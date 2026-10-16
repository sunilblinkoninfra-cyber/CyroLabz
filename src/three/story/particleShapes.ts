import * as THREE from "three";

export const PARTICLE_COUNT = 2600;

/**
 * Chapter 01: Skyline
 * Grid of architectural skyscrapers, window dots, vertical towers, and base particle dissolve
 */
export function generateSkylinePoints(count = PARTICLE_COUNT): Float32Array {
  const points = new Float32Array(count * 3);
  const buildings = [
    { x: -2.4, w: 0.5, h: 2.2, windows: 8 },
    { x: -1.7, w: 0.6, h: 3.1, windows: 12 },
    { x: -0.9, w: 0.8, h: 4.0, windows: 16 }, // Center tallest tower
    { x: 0.1, w: 0.7, h: 3.4, windows: 14 },
    { x: 1.0, w: 0.6, h: 2.8, windows: 10 },
    { x: 1.8, w: 0.5, h: 2.1, windows: 8 },
    { x: 2.5, w: 0.4, h: 1.6, windows: 6 },
  ];

  for (let i = 0; i < count; i++) {
    const b = buildings[i % buildings.length];
    const relX = (Math.random() - 0.5) * b.w;
    const x = b.x + relX;

    // Window grid vs facade lines vs base dissolve
    const type = Math.random();
    let y = 0;
    let z = (Math.random() - 0.5) * 0.4;

    if (type < 0.65) {
      // Window matrix and rooflines
      const floor = Math.floor(Math.random() * b.windows);
      y = -1.8 + (floor / b.windows) * b.h;
      // Step into discrete horizontal window slots
      y += (Math.random() - 0.5) * 0.08;
    } else if (type < 0.85) {
      // Vertical building edge lines
      y = -1.8 + Math.random() * b.h;
    } else {
      // Dissolving digital foundation at bottom
      y = -1.8 - Math.random() * 1.0;
      z = (Math.random() - 0.5) * 0.8;
    }

    points[i * 3 + 0] = x;
    points[i * 3 + 1] = y + 0.3; // Center vertically
    points[i * 3 + 2] = z;
  }

  return points;
}

/**
 * Chapter 02: Circuit Network
 * Radiating PCB traces, 45-degree angle paths, bus lines, and circular terminal pads
 */
export function generateCircuitPoints(count = PARTICLE_COUNT): Float32Array {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const pType = Math.random();

    if (pType < 0.25) {
      // Dense central processor hub
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.55;
      points[i * 3 + 0] = Math.cos(angle) * r;
      points[i * 3 + 1] = Math.sin(angle) * r;
      points[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    } else if (pType < 0.75) {
      // Manhattan / 45-degree circuit traces radiating outward
      const armAngle = (Math.floor(Math.random() * 8) / 8) * Math.PI * 2;
      const dist = 0.5 + Math.random() * 2.6;
      let x = Math.cos(armAngle) * dist;
      let y = Math.sin(armAngle) * dist;

      // Add 45-degree or orthogonal offset dogleg
      if (Math.random() > 0.4) {
        const offset = (Math.random() - 0.5) * 0.6;
        x += offset;
        y += Math.sign(y) * Math.abs(offset);
      }

      points[i * 3 + 0] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    } else {
      // Terminal solder pads and circular nodes
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 2.2;
      const padCenter = {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      };
      // Cluster points into circular pad
      const pr = Math.random() * 0.12;
      const pa = Math.random() * Math.PI * 2;
      points[i * 3 + 0] = padCenter.x + Math.cos(pa) * pr;
      points[i * 3 + 1] = padCenter.y + Math.sin(pa) * pr;
      points[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
  }

  return points;
}

/**
 * Chapter 03: Intelligence (Face & Constellation)
 * Facial 3D contour, brow, jaw, reaching hand, and dispersing cognitive cloud
 */
export function generateFacePoints(count = PARTICLE_COUNT): Float32Array {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const pType = Math.random();

    if (pType < 0.55) {
      // 3D Facial Mask Hemisphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 0.85 - Math.PI * 0.425; // Left-to-right arc
      const phi = v * Math.PI * 0.7 - Math.PI * 0.35; // Top-to-bottom arc

      const r = 1.45;
      let x = r * Math.sin(theta) * Math.cos(phi) - 0.15;
      let y = r * Math.sin(phi) + 0.1;
      let z = r * Math.cos(theta) * Math.cos(phi) - 0.5;

      // Nose bridge / brow prominence
      if (Math.abs(x + 0.15) < 0.35 && y > -0.2 && y < 0.5) {
        z += 0.35 * (1 - Math.abs(x + 0.15) / 0.35);
      }

      points[i * 3 + 0] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    } else if (pType < 0.8) {
      // Reaching hand / finger network on lower-left
      const t = Math.random();
      const fingerIdx = Math.floor(Math.random() * 4);
      const fingerAngle = -0.4 + fingerIdx * 0.25;

      const baseX = -1.6;
      const baseY = -1.5;
      const len = 0.6 + t * 1.2;

      const x = baseX + Math.cos(fingerAngle + 1.2) * len + (Math.random() - 0.5) * 0.12;
      const y = baseY + Math.sin(fingerAngle + 1.2) * len + (Math.random() - 0.5) * 0.12;
      const z = -0.2 + t * 0.6;

      points[i * 3 + 0] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    } else {
      // Upper cognitive particle dispersion / constellation
      const angle = Math.random() * Math.PI;
      const dist = 1.2 + Math.random() * 1.8;
      const x = Math.cos(angle) * dist * 1.2;
      const y = Math.sin(angle) * dist * 0.9 + 0.5;
      const z = (Math.random() - 0.5) * 1.0;

      points[i * 3 + 0] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    }
  }

  return points;
}

/**
 * Chapter 04: Cyrolabz Logo Mark
 * Hexagonal faceted "C" mark with 45-degree chamfers and internal dual circuit traces with node pads
 */
export function generateLogoPoints(count = PARTICLE_COUNT): Float32Array {
  const points = new Float32Array(count * 3);

  // Outer faceted C path segments
  const outerSegments = [
    // Top horizontal bar
    { x1: -1.4, y1: 1.4, x2: 0.8, y2: 1.4 },
    // Top-right 45-deg chamfer
    { x1: 0.8, y1: 1.4, x2: 1.5, y2: 0.7 },
    // Back to inner top
    { x1: 1.5, y1: 0.7, x2: 0.4, y2: 0.7 },
    // Spine (left angled)
    { x1: -1.4, y1: 1.4, x2: -1.9, y2: 0.0 },
    { x1: -1.9, y1: 0.0, x2: -1.4, y2: -1.4 },
    // Bottom horizontal bar
    { x1: -1.4, y1: -1.4, x2: 0.8, y2: -1.4 },
    // Bottom-right 45-deg chamfer
    { x1: 0.8, y1: -1.4, x2: 1.5, y2: -0.7 },
    // Back to inner bottom
    { x1: 1.5, y1: -0.7, x2: 0.4, y2: -0.7 },
  ];

  // Inner circuit lines and solder pads
  const circuitLine1 = { x1: -1.2, y1: -0.4, x2: -0.2, y2: 0.6, padX: -0.2, padY: 0.6 };
  const circuitLine2 = { x1: -1.0, y1: -0.8, x2: -0.3, y2: -0.1, padX: -0.3, padY: -0.1 };

  for (let i = 0; i < count; i++) {
    const pType = Math.random();

    if (pType < 0.62) {
      // Outer faceted "C" outline & thick stroke
      const seg = outerSegments[Math.floor(Math.random() * outerSegments.length)];
      const t = Math.random();
      const x = seg.x1 + (seg.x2 - seg.x1) * t;
      const y = seg.y1 + (seg.y2 - seg.y1) * t;

      // Width stroke thickness
      const thickness = (Math.random() - 0.5) * 0.28;
      points[i * 3 + 0] = x + thickness * 0.5;
      points[i * 3 + 1] = y + thickness * 0.5;
      points[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    } else if (pType < 0.82) {
      // Inner circuit lines
      const line = Math.random() > 0.5 ? circuitLine1 : circuitLine2;
      const t = Math.random();
      const x = line.x1 + (line.x2 - line.x1) * t;
      const y = line.y1 + (line.y2 - line.y1) * t;
      const offset = (Math.random() - 0.5) * 0.08;

      points[i * 3 + 0] = x + offset;
      points[i * 3 + 1] = y + offset;
      points[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    } else {
      // Terminal circular pads of the circuit lines
      const line = Math.random() > 0.5 ? circuitLine1 : circuitLine2;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.22;

      points[i * 3 + 0] = line.padX + Math.cos(angle) * r;
      points[i * 3 + 1] = line.padY + Math.sin(angle) * r;
      points[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
  }

  return points;
}
