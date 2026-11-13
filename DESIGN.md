---
name: Cyrolabz Reimagined Monograph
description: Exposed-spine engineering monograph. Unbleached cotton rag paper and deep carbon ink paired with cobalt blueprint stitching—nothing hidden between strategy, build, intelligence, and audit.
colors:
  board-light: "#eae3d5"
  paper-light: "#f6f2e9"
  paper-inset-light: "#eee8da"
  ink-light: "#141311"
  ink-soft-light: "#2d2a26"
  muted-light: "#575148"
  rule-light: "#cfc6b4"
  rule-strong-light: "#8d8474"
  thread-light: "#1846d6"
  thread-hover-light: "#1034a6"
  board-dark: "#0c0b0a"
  paper-dark: "#151311"
  paper-inset-dark: "#1d1a17"
  ink-dark: "#efeae0"
  ink-soft-dark: "#d4cec2"
  muted-dark: "#a8a092"
  rule-dark: "#2e2a25"
  rule-strong-dark: "#5a5347"
  thread-dark: "#7ea6ff"
  thread-hover-dark: "#a1bfff"
typography:
  display:
    fontFamily: "Archivo, Sora, sans-serif"
    fontSize: "2.85rem"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  thesis:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
rounded:
  folio: "0px"
spacing:
  folio-pad: "2.5rem"
  gutter: "7.25rem"
components:
  primary-dispatch:
    backgroundColor: "{colors.thread-light}"
    textColor: "{colors.paper-light}"
    rounded: "{rounded.folio}"
    padding: "10px 20px"
---

# Design System — Cyrolabz Reimagined Monograph

## Overview

Creative North Star: **The Exposed-Spine Engineering Monograph** (adapted from `pbakaus/impeccable` `craft-making-coptic-exposed-binding`). Instead of hiding structural transitions behind floating glassmorphism or a 4-column card grid, the four transformation stages (`01 Foundation`, `02 Connect`, `03 Intelligence`, `04 Visibility`) are stitched visibly along a shared central chain-stitch axis. Clicking any stitch opens that signature completely flat across the two-folio spread.

## Colors

- **Light Ground (Unbleached Rag & Birch Board):** `#EAE3D5` board, `#F6F2E9` paper, `#EEE8DA` inset plate well, `#141311` carbon ink, `#575148` graphite secondary text.
- **Dark Ground (Obsidian Binding):** `#0C0B0A` board, `#151311` paper, `#1D1A17` inset plate well, `#EFEAE0` bone ink, `#A8A092` warm muted ink.
- **Signal Thread (Cobalt Blueprint):** `#1846D6` (light) / `#7EA6FF` (dark), reserved exclusively for active spine stitches, focus rings, links, and the primary scope dispatch action.

## Typography

- **Display (`Archivo`):** Weight 600, `-0.025em` tracking. Headlines stand without uppercase eyebrow kickers above them.
- **Thesis Prose (`Source Serif 4`):** Editorial authority for the core design statement thesis.
- **Body (`Manrope`):** Clean, legible technical descriptions constrained to 58–68ch.
- **Tabular Measurements (`JetBrains Mono`):** Used strictly for signature indices (`01`–`04`), reference codes, and tabular data—never as decorative chrome.

## Layout

- Centered `1320px` spread with a `116px` central exposed-spine gutter separating the Statement/Signature folio (`1.12fr`) from the Working Scope Intake folio (`0.88fr`) on desktop (`lg:`).
- Collapses below `1024px` to a horizontal stitched rail pinned above the active folio so `360px` viewports stay clean with zero horizontal scroll.

## Elevation & Depth

- Zero `backdrop-blur` glassmorphism and zero glowing halos. Depth comes strictly from the recessed board (`--rg-board`), the crisp `1px` blind-tooled folio rule (`--rg-rule`), and a single directional folio drop shadow (`--rg-shadow`).

## Shapes

- Sharp architectural `0px` folio corners and rectangular stitched tabs, contrasting purposefully with generic rounded-pill SaaS cards.

## Do's and Don'ts

- **Do** keep the primary working action (scoping an engagement and selecting deliverables) inside the first-viewport spread.
- **Do** tint chapter plate imagery (`skyline.webp`, `circuit.webp`, `face.webp`, `mark.webp`) with theme-aware blend modes (`multiply` on rag paper, `invert` + `screen` on obsidian).
- **Don't** add eyebrow labels above headings, gradient text, decorative CSS grid backgrounds, or identical 4-card rows.

