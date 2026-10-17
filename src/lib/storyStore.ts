import { create } from "zustand";

export interface StoryState {
  s: number;
  targetS: number;
  activeChapter: number;
  activeServiceStage: number; // 0: Consulting, 1: Connect, 2: Intelligence, 3: Visibility
  isTraveling: boolean;
  holdTime: number; // in seconds
  setS: (s: number) => void;
  setTargetS: (targetS: number) => void;
  setActiveChapter: (ch: number) => void;
  setActiveServiceStage: (stage: number) => void;
  setIsTraveling: (isTraveling: boolean) => void;
  travelTo: (chapter: number, durationMs?: number) => void;
}

export interface HoverGlowTarget {
  cx: number;
  cy: number;
  rEdges: number;
  rNodes: number;
}

// Global lightweight event bus for high-frequency 60fps canvas loop
type Listener = (s: number, targetS: number) => void;
type GlowListener = (target: HoverGlowTarget | null) => void;
const listeners = new Set<Listener>();
const glowListeners = new Set<GlowListener>();

export const storyBus = {
  s: 0,
  targetS: 0,
  holdTime: 0,
  activeChapter: 0,
  activeServiceStage: 0, // 0: Consulting, 1: Connect, 2: Intelligence, 3: Visibility
  hoverGlow: null as HoverGlowTarget | null,
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  emit(s: number, targetS: number) {
    storyBus.s = s;
    storyBus.targetS = targetS;
    storyBus.activeChapter = Math.min(3, Math.max(0, Math.round(Math.min(3, s))));
    if (s >= 3.8) {
      storyBus.activeServiceStage = Math.min(3, Math.max(0, Math.round(s - 4)));
    } else {
      storyBus.activeServiceStage = 0;
    }
    listeners.forEach((fn) => fn(s, targetS));
  },
  setHoverGlow(target: HoverGlowTarget | null) {
    storyBus.hoverGlow = target;
    glowListeners.forEach((fn) => fn(target));
  },
  subscribeGlow(fn: GlowListener) {
    glowListeners.add(fn);
    return () => {
      glowListeners.delete(fn);
    };
  },
};

if (typeof window !== "undefined") {
  (window as any).__storyBus = storyBus;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  s: 0,
  targetS: 0,
  activeChapter: 0,
  activeServiceStage: 0,
  isTraveling: false,
  holdTime: 0,
  setS: (s: number) => {
    storyBus.s = s;
    storyBus.activeChapter = Math.min(4, Math.max(0, Math.round(s)));
    const stage = s >= 3.5 ? Math.min(3, Math.max(0, Math.floor(s - 3.5))) : 0;
    storyBus.activeServiceStage = stage;
    set({ s, activeChapter: storyBus.activeChapter, activeServiceStage: stage });
  },
  setTargetS: (targetS: number) => {
    storyBus.targetS = targetS;
    set({ targetS });
  },
  setActiveChapter: (activeChapter: number) => {
    storyBus.activeChapter = activeChapter;
    set({ activeChapter });
  },
  setActiveServiceStage: (activeServiceStage: number) => {
    storyBus.activeServiceStage = activeServiceStage;
    set({ activeServiceStage });
  },
  setIsTraveling: (isTraveling: boolean) => set({ isTraveling }),
  travelTo: (chapter: number, durationMs = 800) => {
    const target = Math.min(4, Math.max(0, chapter));
    set({ targetS: target, isTraveling: true });
    storyBus.targetS = target;
    
    // Tween s toward target
    const startS = get().s;
    const startTime = performance.now();
    
    function step(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease in-out cubic
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const current = startS + (target - startS) * eased;
      
      storyBus.s = current;
      storyBus.emit(current, target);
      set({ s: current, activeChapter: Math.round(current) });
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        set({ isTraveling: false });
      }
    }
    requestAnimationFrame(step);
  },
}));

// Route-to-chapter mapping according to architecture
export const ROUTE_CHAPTER_MAP: Record<string, number> = {
  "/": 0, // Home opens on 0, then scroll handles 0..4
  "/services": 1, // Scene 02, connected platform
  "/services/consulting": 0, // Scene 01, Foundation
  "/services/audits": 0, // Scene 01, Foundation
  "/audits": 0,
  "/services/custom-software": 1, // Scene 02, Connect
  "/services/website-development": 1, // Scene 02, Connect
  "/services/3d-interactive-design": 1, // Scene 02, Connect
  "/services/ai-enablement": 2, // Scene 03, Intelligence
  "/services/ai-implementation": 2, // Scene 03, Intelligence
  "/services/seo": 3, // Scene 04, Visibility
  "/services/aeo": 3, // Scene 04, Visibility
  "/services/geo": 3, // Scene 04, Visibility
  "/work": 1, // Scene 02 to 03
  "/about": 3, // Scene 04, settled mark
  "/insights": 3, // Scene 04, settled mark
  "/contact": 3, // Final logo scene
  "/privacy": 3,
  "/terms": 3,
};

export const getTargetChapterForPath = (pathname: string): number => {
  if (ROUTE_CHAPTER_MAP[pathname] !== undefined) {
    return ROUTE_CHAPTER_MAP[pathname];
  }
  if (pathname.startsWith("/work/")) return 2;
  if (pathname.startsWith("/services/ai-")) return 2;
  if (pathname.startsWith("/services/seo") || pathname.startsWith("/services/aeo") || pathname.startsWith("/services/geo")) return 3;
  if (pathname.startsWith("/services/")) return 1;
  if (pathname.startsWith("/insights/")) return 3;
  return 0;
};
