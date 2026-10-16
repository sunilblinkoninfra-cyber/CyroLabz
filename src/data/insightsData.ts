export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  chapter: string;
  chapterNum: string;
  content: string[];
}

export const INSIGHTS_DATA: Record<string, Article> = {
  "evaluating-rag-hallucinations-in-production": {
    slug: "evaluating-rag-hallucinations-in-production",
    title: "Evaluating RAG Hallucinations: Moving Past Faithfulness Scores",
    excerpt:
      "Why standard benchmark evals fail in real-world enterprise RAG pipelines, and how deterministic verification harnesses catch subtle failure modes before users do.",
    date: "Oct 12, 2026",
    readTime: "6 min read",
    chapter: "Intelligence",
    chapterNum: "03",
    content: [
      "Most enterprise retrieval-augmented generation (RAG) initiatives stall right after the pilot stage. In demo environments with curated queries, the model appears brilliant. In production, edge cases compound: slight variations in document formatting degrade chunk semantic relevance, and the LLM confidently interpolates facts from its training weights rather than retrieved source chunks.",
      "Traditional evaluation frameworks like RAGAS or basic cosine similarity calculate aggregate metric scores that mask critical failures. A 94% average faithfulness score means that 6 out of every 100 client-facing answers contain hallucinations. In legal, healthcare, or financial domains, a 6% failure rate is an unacceptable operational risk.",
      "To achieve production-grade reliability, engineering teams must implement multi-stage deterministic assertion trees. Rather than allowing the LLM to generate unstructured prose directly, the generation pipeline must be constrained by strict JSON schema contracts, citation token anchoring, and secondary verification agents that cross-examine each extracted factual claim against raw chunk byte ranges.",
      "By isolating retrieval quality, context condensation, and token generation into separate testable units, teams can isolate regressions automatically whenever models or vector embeddings are upgraded.",
    ],
  },

  "decoupling-legacy-erps-event-driven-architecture": {
    slug: "decoupling-legacy-erps-event-driven-architecture",
    title: "Decoupling Legacy Systems with Event-Driven Contracts",
    excerpt:
      "A pragmatic engineering blueprint for carving modern services out of monolithic legacy databases without risking transaction integrity or downtime.",
    date: "Sep 28, 2026",
    readTime: "8 min read",
    chapter: "Connect",
    chapterNum: "02",
    content: [
      "The standard trap of enterprise software modernisation is the big-bang rewrite. Organizations spend 18 months and millions of dollars attempting to replace an established legacy ERP all at once, only to discover countless undocumented business rules, edge-case tax calculations, and silent database triggers.",
      "The resilient path is the Strangler Fig pattern, augmented with event-driven change data capture (CDC). By tapping into the transaction log of the legacy database (using tools like Debezium or PostgreSQL logical replication), every insert, update, and delete is broadcast as a strictly typed event stream.",
      "New custom software modules consume these events and build domain-specific read models (CQRS). Writes to the new system execute validation rules before issuing synthetic updates back to the legacy core via narrow, reversible adapter interfaces.",
      "This approach delivers immediate business value in weeks rather than years, while preserving continuous rollback guarantees at every single deployment phase.",
    ],
  },

  "what-to-look-for-in-codebase-audits": {
    slug: "what-to-look-for-in-codebase-audits",
    title: "What Forensic Technical Audits Look For Before a Tech Acquisition",
    excerpt:
      "A technical due diligence checklist covering architectural debt, dependency licensing, hidden security vulnerabilities, and real scaling ceilings.",
    date: "Sep 15, 2026",
    readTime: "7 min read",
    chapter: "Foundation",
    chapterNum: "01",
    content: [
      "When investment teams or strategic buyers evaluate a technology asset, marketing claims and slide decks say very little about the software’s actual durability. A forensic technical audit cuts through the narrative to inspect the raw artifacts.",
      "First is the dependency posture: identifying abandoned open-source libraries, GPL licensing contaminations that threaten IP exclusivity, and unpatched CVE vulnerabilities tucked inside nested node_modules or Docker images.",
      "Second is the concurrency and performance ceiling: profiling database query execution plans, inspecting indexing strategies, and testing how connection pools behave under synthetic spikes. Many software systems that run fine for 5,000 users suffer catastrophic cascading lock deadlocks at 50,000 users.",
      "Finally, code health and bus factor: verifying whether unit tests test real business invariants or merely pad coverage metrics, and confirming that the system can be built, tested, and deployed from scratch without relying on undocumented tribal knowledge.",
    ],
  },

  "webgl-and-webgpu-for-enterprise-applications": {
    slug: "webgl-and-webgpu-for-enterprise-applications",
    title: "Real-Time 3D in the Browser: When to Use Three.js vs Plain Canvas",
    excerpt:
      "Navigating the performance trade-offs between Canvas 2D, WebGL, and WebGPU for enterprise data visualization and product interactive experiences.",
    date: "Aug 30, 2026",
    readTime: "5 min read",
    chapter: "Connect",
    chapterNum: "02",
    content: [
      "Modern web graphics give engineers unprecedented rendering capabilities, but choosing the wrong rendering abstraction can destroy mobile performance and battery life.",
      "For 2D particle systems, morphing diagrams, and lightweight charts with up to 15,000 points, Canvas 2D with hardware-accelerated integer blitting is frequently lighter, boots faster, and incurs less memory overhead than full 3D frameworks.",
      "When the user experience requires true depth, spatial navigation, camera raycasting, or custom GLSL light shading (such as digital twins, exploded product views, or spatial configurators), Three.js and WebGL/WebGPU become essential.",
      "The critical discipline is asset optimization: aggressive Draco compression, KTX2 textures, frustum culling, and strict devicePixelRatio caps ensure that the experience runs at a rock-solid 60 FPS even on mid-tier mobile hardware.",
    ],
  },
};
