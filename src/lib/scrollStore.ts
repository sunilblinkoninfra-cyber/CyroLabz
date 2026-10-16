import type { ActiveSection } from "@/types";

export interface HeroMotionState {
  introProgress: number; // 0 to 1 over ~2s intro
  pointer: {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  };
  scrollExitProgress: number; // 0 to 1 as hero scrolls out
  scrollProgress: number; // 0 to 1 across whole page
  sectionProgress: number; // 0 to 1 within active section
  isQualityDowngraded: boolean;
  isCanvasReady: boolean;
  isTabVisible: boolean;
  isHeroInView: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  activeSection: ActiveSection;
  hoveredServiceIndex: number;
}

export const heroMotionState: HeroMotionState = {
  introProgress: 0,
  pointer: {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  },
  scrollExitProgress: 0,
  scrollProgress: 0,
  sectionProgress: 0,
  isQualityDowngraded: false,
  isCanvasReady: false,
  isTabVisible: true,
  isHeroInView: true,
  prefersReducedMotion: false,
  isTouchDevice: false,
  activeSection: "hero",
  hoveredServiceIndex: -1,
};

// Backward-compatible alias for existing imports
export const sceneState = heroMotionState;

export function updateHoveredService(index: number): void {
  heroMotionState.hoveredServiceIndex = index;
}

export function updateScrollProgress(
  progress: number,
  activeSection: ActiveSection,
  sectionProgress = 0
): void {
  heroMotionState.activeSection = activeSection;
  heroMotionState.scrollProgress = progress;
  heroMotionState.sectionProgress = sectionProgress;
  // Hero exit progress is normalized 0 to 1 during the hero's exit
  heroMotionState.scrollExitProgress = Math.min(1, Math.max(0, progress * 4.5));
}
