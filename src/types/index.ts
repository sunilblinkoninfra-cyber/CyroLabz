export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  ringIndex: number;
}

export interface ProofTile {
  title: string;
  subtitle: string;
  description: string;
  specs: string[];
}

export interface ProcessStep {
  number: string;
  phase: string;
  title: string;
  duration: string;
  description: string;
  milestones: string[];
}

export type ActiveSection = "hero" | "services" | "about" | "process" | "contact";

export interface ScrollProgressState {
  progress: number; // 0 to 1 across the whole page
  activeSection: ActiveSection;
  hoveredServiceIndex: number | null;
}
