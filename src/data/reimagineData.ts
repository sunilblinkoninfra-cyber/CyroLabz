export type SignatureId = "foundation" | "connect" | "intelligence" | "visibility";

export interface SignatureDiscipline {
  slug: string;
  title: string;
  deliverable: string;
  href: string;
}

export interface TransformationSignature {
  id: SignatureId;
  index: string;
  name: string;
  headline: string;
  seamFailure: string;
  engineeredFix: string;
  clientOwnership: string;
  artworkSrc: string;
  artworkAlt: string;
  disciplines: SignatureDiscipline[];
}

export const TRANSFORMATION_SIGNATURES: TransformationSignature[] = [
  {
    id: "foundation",
    index: "01",
    name: "Foundation",
    headline: "Your business, as it stands.",
    seamFailure:
      "Years of tools, spreadsheets, and legacy codebases accumulate silent bottlenecks. Advisory decks diagnose symptoms on slides without inspecting the actual running architecture.",
    engineeredFix:
      "We inspect your codebase, map infrastructure dependencies, and evaluate security and AI readiness before a single production line is rewritten.",
    clientOwnership:
      "Architecture Blueprint, ranked severity audit report, and a costed modernisation roadmap your engineering team can execute on Monday.",
    artworkSrc: "/assets/skyline.webp",
    artworkAlt: "Cyrolabz Foundation chapter pixel skyline artwork",
    disciplines: [
      {
        slug: "consulting",
        title: "Consulting",
        deliverable: "Architecture Blueprint & Technical Roadmap",
        href: "/services/consulting",
      },
      {
        slug: "audits",
        title: "Technical Audits",
        deliverable: "Ranked Findings Report & Remediation Guide",
        href: "/services/audits",
      },
    ],
  },
  {
    id: "connect",
    index: "02",
    name: "Connect",
    headline: "Every system becomes a signal.",
    seamFailure:
      "Feature shops build isolated apps and marketing sites that never share data contracts with internal operations, forcing manual reconciliation across teams.",
    engineeredFix:
      "We wire platforms, APIs, custom software, accessible web builds, and real-time 3D interfaces into one coherent, strictly typed system.",
    clientOwnership:
      "Full source repositories, OpenAPI contracts, CI/CD pipelines, and content workflows your own team controls with zero vendor lock-in.",
    artworkSrc: "/assets/circuit.webp",
    artworkAlt: "Cyrolabz Connect chapter circuit network artwork",
    disciplines: [
      {
        slug: "custom-software",
        title: "Custom Software",
        deliverable: "Production Code, CI/CD & OpenAPI Contracts",
        href: "/services/custom-software",
      },
      {
        slug: "website-development",
        title: "Website Development",
        deliverable: "Next.js SSR Frontend & Design System",
        href: "/services/website-development",
      },
      {
        slug: "3d-interactive-design",
        title: "3D Interactive Design",
        deliverable: "WebGL Spatial Canvas & Mobile Fallbacks",
        href: "/services/3d-interactive-design",
      },
    ],
  },
  {
    id: "intelligence",
    index: "03",
    name: "Intelligence",
    headline: "Then the system starts to think.",
    seamFailure:
      "Bolt-on AI demos hallucinate on unindexed records, leak sensitive context across tenants, and stall before reaching governed production.",
    engineeredFix:
      "We ground language models, copilots, and workflow automation directly in your connected data with clear governance policies and telemetry.",
    clientOwnership:
      "Private-tenant RAG pipelines, AI governance playbooks, evaluation telemetry, and trained operational playbooks owned by your team.",
    artworkSrc: "/assets/face.webp",
    artworkAlt: "Cyrolabz Intelligence chapter figure and hand artwork",
    disciplines: [
      {
        slug: "ai-enablement",
        title: "AI Enablement",
        deliverable: "Governance Framework & Team Playbooks",
        href: "/services/ai-enablement",
      },
      {
        slug: "ai-implementation",
        title: "AI Implementation",
        deliverable: "Production RAG Pipelines & Evaluation Telemetry",
        href: "/services/ai-implementation",
      },
    ],
  },
  {
    id: "visibility",
    index: "04",
    name: "Visibility",
    headline: "Transformation, engineered and verified.",
    seamFailure:
      "High-craft software goes unseen when search crawlers, answer engines, and generative models cannot parse or verify your domain authority.",
    engineeredFix:
      "We unify engineering delivery with Search, Answer, and Generative Engine Optimisation (SEO, AEO, GEO) grounded in structured schema and verifiable proof.",
    clientOwnership:
      "Semantic entity schema, indexing pipelines, and one continuous Cyrolabz engineering thread from initial audit to measurable authority.",
    artworkSrc: "/assets/mark.webp",
    artworkAlt: "Cyrolabz brand mark particle artwork",
    disciplines: [
      {
        slug: "seo",
        title: "SEO",
        deliverable: "Technical Schema & Indexing Pipeline",
        href: "/services/seo",
      },
      {
        slug: "aeo",
        title: "AEO",
        deliverable: "Structured Answer Entities & Knowledge Graph",
        href: "/services/aeo",
      },
      {
        slug: "geo",
        title: "GEO",
        deliverable: "Verifiable Citation Authority for Generative Models",
        href: "/services/geo",
      },
    ],
  },
];

export interface ComparisonRow {
  dimension: string;
  before: string;
  reimagined: string;
}

export const STATEMENT_COMPARISON: ComparisonRow[] = [
  {
    dimension: "Visual World",
    before:
      "Cool paper (#F4F5F7) + translucent glassmorphic cards (.copy-plate, backdrop-blur) floating over a 460vh scroll runway.",
    reimagined:
      "Exposed-spine engineering monograph on unbleached cotton rag (#F6F2E9) and obsidian board (#151311), with zero decorative blur.",
  },
  {
    dimension: "Structural Metaphor",
    before:
      "Four equal bordered cards in a 4-column grid with corner reticles and pulse dots.",
    reimagined:
      "Live SVG chain-stitch spine joining four flat-open signatures on one shared axis—making Cyrolabz's 'no hidden seams' thesis physical.",
  },
  {
    dimension: "Typography & Restraint",
    before:
      "Michroma uppercase eyebrows and numbered markers (01 → 02 → 03 → 04) above every section heading.",
    reimagined:
      "Archivo display + Source Serif 4 thesis prose + Manrope body; headings carry their own weight without eyebrow clutter.",
  },
  {
    dimension: "First-Viewport Action",
    before:
      "Scroll-gated chapters before reaching services or an external /contact link.",
    reimagined:
      "Immediate two-folio spread: active chapter specification on the left, working deliverable-scoped project intake on the right.",
  },
];

