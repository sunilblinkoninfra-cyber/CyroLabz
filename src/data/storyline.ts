export type BeatId = "foundation" | "connect" | "intelligence" | "visibility";

export interface StoryBeat {
  id: BeatId;
  num: string;
  name: string;
  line: string;
  href: string;
  description: string;
}

export interface StoryNode {
  id: string;
  beat: BeatId;
  href: string;
  title: string;
  line: string;
  nextId: string | null;
  stepNum?: string; // "01", "02", etc.
  category?: string;
  deliverable?: string;
}

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "foundation",
    num: "01",
    name: "Foundation",
    line: "Map what you have, and what is holding it back.",
    description: "Legacy systems audit, technical debt inventory, and modernisation blueprints.",
    href: "/services/consulting",
  },
  {
    id: "connect",
    num: "02",
    name: "Connect",
    line: "Wire the systems into one platform.",
    description: "Custom software, unified API platforms, and high-performance web frontends.",
    href: "/services/custom-software",
  },
  {
    id: "intelligence",
    num: "03",
    name: "Intelligence",
    line: "Turn connected data into decisions you can trust.",
    description: "Enterprise AI enablement, private copilots, RAG architectures, and autonomous agents.",
    href: "/services/ai-enablement",
  },
  {
    id: "visibility",
    num: "04",
    name: "Visibility",
    line: "Be found, answered, and cited.",
    description: "Search, answer and generative engine optimisation (SEO, AEO, GEO) with structured authority.",
    href: "/services/seo",
  },
];

/**
 * Sequential 10-discipline engineering journey.
 */
export const CORE_SERVICE_NODES: StoryNode[] = [
  {
    id: "consulting",
    beat: "foundation",
    stepNum: "01",
    href: "/services/consulting",
    title: "Consulting",
    line: "A roadmap your team can start on Monday.",
    category: "Architecture & Strategy",
    deliverable: "Architecture blueprint & technical roadmap",
    nextId: "audits",
  },
  {
    id: "audits",
    beat: "foundation",
    stepNum: "02",
    href: "/services/audits",
    title: "Audits",
    line: "A ranked findings report, with fixes.",
    category: "Forensic Code & Security",
    deliverable: "Ranked severity audit report & remediation guide",
    nextId: "custom-software",
  },
  {
    id: "custom-software",
    beat: "connect",
    stepNum: "03",
    href: "/services/custom-software",
    title: "Custom Software",
    line: "Software you own, and the docs to run it.",
    category: "Platform Engineering",
    deliverable: "Production code, CI/CD pipelines & OpenAPI contracts",
    nextId: "website-development",
  },
  {
    id: "website-development",
    beat: "connect",
    stepNum: "04",
    href: "/services/website-development",
    title: "Website Development",
    line: "A site your team can update itself.",
    category: "High-Performance Web",
    deliverable: "Next.js / SSR frontend & headless CMS integration",
    nextId: "3d-interactive-design",
  },
  {
    id: "3d-interactive-design",
    beat: "connect",
    stepNum: "05",
    href: "/services/3d-interactive-design",
    title: "3D Interactive Design",
    line: "Experiences that run smoothly on real devices.",
    category: "Spatial & WebGL Graphics",
    deliverable: "WebGL 3D canvas, real-time shaders & mobile fallbacks",
    nextId: "ai-enablement",
  },
  {
    id: "ai-enablement",
    beat: "intelligence",
    stepNum: "06",
    href: "/services/ai-enablement",
    title: "AI Enablement",
    line: "A clear AI policy and a team that can apply it.",
    category: "AI Readiness & Governance",
    deliverable: "Governance framework, vector indices & staff enablement",
    nextId: "ai-implementation",
  },
  {
    id: "ai-implementation",
    beat: "intelligence",
    stepNum: "07",
    href: "/services/ai-implementation",
    title: "AI Implementation",
    line: "AI in production that you can measure and trust.",
    category: "Applied Intelligence",
    deliverable: "Production RAG pipelines, fine-tuned models & telemetry",
    nextId: "seo",
  },
  {
    id: "seo",
    beat: "visibility",
    stepNum: "08",
    href: "/services/seo",
    title: "SEO",
    line: "Be found where people search.",
    category: "Search Engine Optimisation",
    deliverable: "Technical schema, semantic hierarchy & indexing pipeline",
    nextId: "aeo",
  },
  {
    id: "aeo",
    beat: "visibility",
    stepNum: "09",
    href: "/services/aeo",
    title: "AEO",
    line: "Be the answer, not just a link.",
    category: "Answer Engine Optimisation",
    deliverable: "Direct snippet targeting & conversational extraction schema",
    nextId: "geo",
  },
  {
    id: "geo",
    beat: "visibility",
    stepNum: "10",
    href: "/services/geo",
    title: "GEO",
    line: "Be cited when AI makes a recommendation.",
    category: "Generative Engine Optimisation",
    deliverable: "Perplexity/ChatGPT citation vectors & multi-source authority",
    nextId: "work",
  },
];

/**
 * Top-level destination nodes connecting the broader studio storyline.
 */
export const STUDIO_NODES: StoryNode[] = [
  {
    id: "services",
    beat: "connect",
    href: "/services",
    title: "All Services",
    line: "Ten disciplines, one continuous sequence.",
    category: "Transformation Matrix",
    deliverable: "Full suite of engineering capabilities",
    nextId: "consulting",
  },
  {
    id: "work",
    beat: "connect",
    href: "/work",
    title: "Work & Proof",
    line: "The same four beats, measured in production.",
    category: "Verified Case Studies",
    deliverable: "Production telemetry & quantitative client metrics",
    nextId: "about",
  },
  {
    id: "about",
    beat: "visibility",
    href: "/about",
    title: "About the Studio",
    line: "One team, from the map to the build to the audit.",
    category: "Studio Principles",
    deliverable: "Founding thesis & engineering governance standards",
    nextId: "insights",
  },
  {
    id: "insights",
    beat: "intelligence",
    href: "/insights",
    title: "Technical Insights",
    line: "Field notes and telemetry from the work.",
    category: "Engineering Analysis",
    deliverable: "Forensic articles on modern architectures & AI systems",
    nextId: "contact",
  },
  {
    id: "contact",
    beat: "visibility",
    href: "/contact",
    title: "Start a Project",
    line: "Tell us what you want to change.",
    category: "Consultation & Scoping",
    deliverable: "Direct architectural discovery & 48-hour initial scope",
    nextId: "consulting", // Loops back cleanly
  },
];

export const STORY_NODES: StoryNode[] = [...CORE_SERVICE_NODES, ...STUDIO_NODES];

const NODE_BY_ID = Object.fromEntries(STORY_NODES.map((node) => [node.id, node]));

export function getStoryNode(id: string): StoryNode | undefined {
  return NODE_BY_ID[id];
}

export function getNextNode(id: string): StoryNode | null {
  const current = NODE_BY_ID[id];
  if (!current?.nextId) return null;
  return NODE_BY_ID[current.nextId] ?? null;
}

export function getPreviousNode(id: string): StoryNode | null {
  // First check if current is one of the core service nodes
  const idx = CORE_SERVICE_NODES.findIndex((n) => n.id === id);
  if (idx > 0) {
    return CORE_SERVICE_NODES[idx - 1];
  }
  // Otherwise check studio nodes or find who points to this id
  return STORY_NODES.find((node) => node.nextId === id) ?? null;
}

export function getBeat(id: BeatId): StoryBeat {
  return STORY_BEATS.find((beat) => beat.id === id) ?? STORY_BEATS[0];
}

export function getNodeStepProgress(id: string): {
  step: string;
  total: number;
  beatNum: string;
  beatName: string;
} {
  const node = NODE_BY_ID[id];
  const beat = node ? getBeat(node.beat) : STORY_BEATS[0];
  const serviceIndex = CORE_SERVICE_NODES.findIndex((n) => n.id === id);

  if (serviceIndex !== -1) {
    return {
      step: `${serviceIndex + 1} of 10`,
      total: 10,
      beatNum: beat.num,
      beatName: beat.name,
    };
  }

  // Top-level destinations
  const studioLabels: Record<string, string> = {
    services: "All Services Hub",
    work: "Proof & Case Studies",
    about: "Studio Principles",
    insights: "Engineering Insights",
    contact: "Transformation Gateway",
  };

  return {
    step: studioLabels[id] || "Story Node",
    total: 10,
    beatNum: beat.num,
    beatName: beat.name,
  };
}

/** Case studies re-enter the story at the service that matches the work. */
export const CASE_STUDY_NODE: Record<string, string> = {
  "global-supply-chain-modernisation": "custom-software",
  "fintech-security-compliance-audit": "audits",
  "autonomous-fleet-routing-engine": "custom-software",
  "fintech-portal-modernisation": "website-development",
  "aerospace-3d-digital-twin": "3d-interactive-design",
  "healthcare-data-ai-governance": "ai-enablement",
  "legal-contract-analysis-agent": "ai-implementation",
};

export const INSIGHT_NODE: Record<string, string> = {
  "what-to-look-for-in-codebase-audits": "audits",
  "decoupling-legacy-erps-event-driven-architecture": "custom-software",
  "webgl-and-webgpu-for-enterprise-applications": "3d-interactive-design",
  "evaluating-rag-hallucinations-in-production": "ai-implementation",
};
