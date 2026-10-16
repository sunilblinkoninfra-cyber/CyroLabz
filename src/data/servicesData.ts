export interface ServiceItem {
  slug: string;
  chapter: string;
  chapterNum: string;
  sceneTarget: number;
  title: string;
  promise: string;
  whoItIsFor: string;
  whatWeDo: string[];
  howWeWork: { step: string; title: string; description: string }[];
  whatYouGet: string[];
  caseStudy: {
    title: string;
    slug: string;
    metric: string;
  };
  relatedServices: { title: string; slug: string }[];
}

export const SERVICES_DATA: Record<string, ServiceItem> = {
  consulting: {
    slug: "consulting",
    chapter: "Foundation",
    chapterNum: "01",
    sceneTarget: 0,
    title: "Consulting",
    promise:
      "Architecture, tech roadmap, and modernisation strategy for businesses ready to move past legacy friction.",
    whoItIsFor:
      "Executive and engineering leaders managing fragmented enterprise systems, siloed tools, or preparing for high-scale modernisation.",
    whatWeDo: [
      "Technical debt and system architecture mapping across distributed stacks",
      "Cloud infrastructure, API interoperability, and platform topology audit",
      "Technology selection with zero vendor bias and concrete risk profiles",
      "Multi-quarter engineering roadmaps with phased migration milestones",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Discover",
        description:
          "Deep-dive interviews, codebase inspection, and infrastructure dependency mapping.",
      },
      {
        step: "02",
        title: "Evaluate",
        description:
          "Rigorous stress-testing of assumptions, data pipelines, latency, and compliance requirements.",
      },
      {
        step: "03",
        title: "Blueprint",
        description:
          "Authoring exact target architectures, integration contracts, and phased rollout plans.",
      },
      {
        step: "04",
        title: "Enable",
        description:
          "Engineering team handoff, technical steering, and measurable benchmark reviews.",
      },
    ],
    whatYouGet: [
      "Comprehensive Architecture Blueprint & Topology Specification",
      "System Modernisation Roadmap with Capex/Opex projections",
      "API & Data Governance Protocol Documentation",
      "Quarterly Milestone & Risk Mitigation Register",
    ],
    caseStudy: {
      title: "Global Supply Platform Legacy Migration",
      slug: "global-supply-chain-modernisation",
      metric: "-68% integration latency across 14 enterprise endpoints",
    },
    relatedServices: [
      { title: "Audits", slug: "audits" },
      { title: "Custom Software", slug: "custom-software" },
    ],
  },

  audits: {
    slug: "audits",
    chapter: "Foundation",
    chapterNum: "01",
    sceneTarget: 0,
    title: "Technical Audits",
    promise:
      "Forensic codebase, performance, security, and infrastructure assessments before you scale or acquire.",
    whoItIsFor:
      "Founders, CTOs, and investment teams requiring independent verification of security posture, performance ceilings, and code quality.",
    whatWeDo: [
      "Static and dynamic vulnerability analysis, secret exposure, and OWASP compliance",
      "Core Web Vitals, memory footprint, runtime bottleneck, and LCP profiling",
      "Database schema query execution plans, indexing sanity, and connection pooling audits",
      "Infrastructure reliability, failover tolerance, and blast-radius modeling",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Telemetry Capture",
        description:
          "Non-invasive profiling of production traces, runtime metrics, and source repos.",
      },
      {
        step: "02",
        title: "Forensic Analysis",
        description:
          "Automated scanning paired with manual line-by-line inspection of critical paths.",
      },
      {
        step: "03",
        title: "Vulnerability Ranking",
        description:
          "Quantifying severity scores, exploitability, and real business impact.",
      },
      {
        step: "04",
        title: "Remediation Playbook",
        description:
          "Prioritised patch prescriptions with immediate quick wins and architectural refactors.",
      },
    ],
    whatYouGet: [
      "Full Forensic Audit Report with executive and engineering breakdown",
      "Severity-Ranked Vulnerability & Performance Register",
      "Actionable Step-by-Step Remediation Patches",
      "Post-remediation re-verification review and sign-off",
    ],
    caseStudy: {
      title: "Fintech Core Banking Architecture Audit",
      slug: "fintech-security-compliance-audit",
      metric: "Zero critical CVEs; 4.2x throughput increase under load",
    },
    relatedServices: [
      { title: "Consulting", slug: "consulting" },
      { title: "Custom Software", slug: "custom-software" },
    ],
  },

  "custom-software": {
    slug: "custom-software",
    chapter: "Connect",
    chapterNum: "02",
    sceneTarget: 1,
    title: "Custom Software Development",
    promise:
      "Production-grade distributed backends, resilient internal tools, and high-concurrency systems built to your domain.",
    whoItIsFor:
      "Enterprises outgrowing off-the-shelf SaaS or needing proprietary software systems with strict uptime, performance, and compliance controls.",
    whatWeDo: [
      "Event-driven microservices, asynchronous pipelines, and high-throughput queues",
      "Complex relational and non-relational database architecture and migrations",
      "Custom internal workflow software, admin consoles, and operations command centers",
      "Fault-tolerant third-party and legacy system API integrations",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Domain Modeling",
        description:
          "Strict typing of business entities, boundaries, state transitions, and error domains.",
      },
      {
        step: "02",
        title: "Prototyping & Specs",
        description:
          "Contract-first API definitions (OpenAPI/gRPC) and database schema migrations.",
      },
      {
        step: "03",
        title: "Iterative Build",
        description:
          "Test-driven engineering with automated CI/CD and immutable deployment environments.",
      },
      {
        step: "04",
        title: "Load Test & Ship",
        description:
          "Extreme concurrency stress tests, chaos engineering checks, and staged zero-downtime cutover.",
      },
    ],
    whatYouGet: [
      "Complete typed source code repository with comprehensive automated test suites",
      "Containerised infrastructure definitions (Docker, IaC) and CI/CD pipelines",
      "Architectural Decision Records (ADRs) and integration API documentation",
      "12-month post-launch warranty and SLAs",
    ],
    caseStudy: {
      title: "Autonomous Fleet Dispatch Platform",
      slug: "autonomous-fleet-routing-engine",
      metric: "99.995% uptime processing 180,000 requests/sec",
    },
    relatedServices: [
      { title: "Website Development", slug: "website-development" },
      { title: "3D Interactive Design", slug: "3d-interactive-design" },
    ],
  },

  "website-development": {
    slug: "website-development",
    chapter: "Connect",
    chapterNum: "02",
    sceneTarget: 1,
    title: "Website Development",
    promise:
      "Ultra-fast, accessible, and high-converting web applications with sub-second page loads and zero layout shift.",
    whoItIsFor:
      "Ambitious brands requiring a digital flagship that pairs bespoke design and motion with strict technical performance and search visibility.",
    whatWeDo: [
      "Next.js App Router architectures with server-side rendering and edge caching",
      "Custom CSS design token systems with perfect theme toggling and dark mode",
      "Hardware-accelerated micro-interactions, scroll-driven narratives, and fluid transitions",
      "WCAG 2.1 AA accessibility, complete keyboard navigation, and semantic HTML",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Design System",
        description:
          "Tokenising typography, color palettes, spacing units, and responsive layouts.",
      },
      {
        step: "02",
        title: "Component Engine",
        description:
          "Building atomic, accessible components with zero bloat and typed props.",
      },
      {
        step: "03",
        title: "Motion & Integration",
        description:
          "Wiring smooth scrolling, dynamic data fetching, CMS bindings, and custom Canvas effects.",
      },
      {
        step: "04",
        title: "Lighthouse 100",
        description:
          "Aggressive asset compression, preloading fonts, responsive WebP cut-outs, and SEO verification.",
      },
    ],
    whatYouGet: [
      "Next.js App Router codebase with TypeScript strict mode and Tailwind CSS",
      "Custom headless CMS integration or static file management",
      "Lighthouse 95+ verified score across Performance, SEO, and Accessibility",
      "Open Graph asset generation and complete technical metadata",
    ],
    caseStudy: {
      title: "Next-Gen Fintech Brand & Portal",
      slug: "fintech-portal-modernisation",
      metric: "0.8s LCP; +140% conversion rate increase on desktop and mobile",
    },
    relatedServices: [
      { title: "3D Interactive Design", slug: "3d-interactive-design" },
      { title: "Custom Software", slug: "custom-software" },
    ],
  },

  "3d-interactive-design": {
    slug: "3d-interactive-design",
    chapter: "Connect",
    chapterNum: "02",
    sceneTarget: 1,
    title: "3D Interactive Design",
    promise:
      "Browser-native real-time 3D experiences, spatial interfaces, and hardware-accelerated interactive web graphics.",
    whoItIsFor:
      "Product companies, industrial manufacturers, and digital innovators who want visitors to physically explore, manipulate, and experience concepts in 3D.",
    whatWeDo: [
      "Three.js, WebGL, and WebGPU real-time rendering pipelines in the browser",
      "Custom shaders (GLSL), procedural geometries, dynamic lighting, and particle effects",
      "Interactive 3D product configurators, digital twins, and exploded assembly views",
      "Optimised low-draw-call GLTF/GLB models with compressed KTX2/Draco geometry",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Model & Optimize",
        description:
          "Retopologising 3D CAD/meshes down to lightweight browser-ready budgets.",
      },
      {
        step: "02",
        title: "Shaders & Lighting",
        description:
          "Writing bespoke vertex and fragment shaders that react to page theme and pointer events.",
      },
      {
        step: "03",
        title: "Interaction Logic",
        description:
          "Mapping smooth orbit controls, camera transitions, and click/tap raycasting.",
      },
      {
        step: "04",
        title: "Performance Polish",
        description:
          "Cap DPR at 2, instancing identical meshes, frustum culling, and 60fps mobile verification.",
      },
    ],
    whatYouGet: [
      "Interactive Three.js scene integrated into Next.js React component tree",
      "Custom GLSL shader source code with responsive uniforms",
      "Draco-compressed 3D model assets under 2MB total payload",
      "Touch gesture and gyroscope controls with reduced-motion fallback",
    ],
    caseStudy: {
      title: "Aerospace Component Digital Twin",
      slug: "aerospace-3d-digital-twin",
      metric: "60 FPS steady on mobile; interactive exploration of 450+ parts",
    },
    relatedServices: [
      { title: "Website Development", slug: "website-development" },
      { title: "Custom Software", slug: "custom-software" },
    ],
  },

  "ai-enablement": {
    slug: "ai-enablement",
    chapter: "Intelligence",
    chapterNum: "03",
    sceneTarget: 2,
    title: "AI Enablement",
    promise:
      "Data readiness, model evaluation, and governance guardrails to prepare your enterprise for production AI.",
    whoItIsFor:
      "Organizations with rich proprietary datasets looking to identify high-ROI AI use cases while preventing data leakage and compliance exposure.",
    whatWeDo: [
      "Enterprise data readiness audits, schema normalization, and embedding readiness",
      "Foundation model benchmarking (evaluating latency, cost, and hallucination rates)",
      "Role-based access control (RBAC), data sanitization, and PII anonymization pipelines",
      "AI ROI modeling, capability mapping, and operational safety governance frameworks",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Audit Data",
        description:
          "Inspecting structured and unstructured repositories for signal quality and leakage vectors.",
      },
      {
        step: "02",
        title: "Model Match",
        description:
          "Empirical testing of open and closed weights on your domain tasks.",
      },
      {
        step: "03",
        title: "Guardrails",
        description:
          "Designing deterministic boundary checks, output validation, and compliance policies.",
      },
      {
        step: "04",
        title: "Rollout Plan",
        description:
          "Phased deployment roadmap from pilot proofs-of-concept to full enterprise rollout.",
      },
    ],
    whatYouGet: [
      "Enterprise AI Readiness Audit & Capability Matrix",
      "Model Evaluation Report comparing benchmark cost/latency metrics",
      "PII Sanitization & Data Security Governance Architecture",
      "Executive AI Enablement Roadmap with ROI projections",
    ],
    caseStudy: {
      title: "Healthcare Data Platform AI Governance",
      slug: "healthcare-data-ai-governance",
      metric: "HIPAA-compliant data pipeline enabling 12 internal AI copilots",
    },
    relatedServices: [
      { title: "AI Implementation", slug: "ai-implementation" },
      { title: "Consulting", slug: "consulting" },
    ],
  },

  "ai-implementation": {
    slug: "ai-implementation",
    chapter: "Intelligence",
    chapterNum: "03",
    sceneTarget: 2,
    title: "AI Implementation",
    promise:
      "Production LLM agents, deterministic RAG pipelines, fine-tuned models, and autonomous workflow systems.",
    whoItIsFor:
      "Companies ready to deploy custom AI agents, automated decision loops, and intelligent knowledge assistants directly into their production software.",
    whatWeDo: [
      "Multi-agent orchestration systems with tool-calling, memory, and recovery loops",
      "Hybrid retrieval-augmented generation (dense vector + sparse keyword search)",
      "Fine-tuning and LoRA adaptations of specialized open-weight models",
      "End-to-end evaluation harnesses (RAGAS, prompt regression suites) and real-time observability",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Architecture",
        description:
          "Designing vector stores, chunking strategies, prompt schemas, and fallback trees.",
      },
      {
        step: "02",
        title: "Pipeline Build",
        description:
          "Implementing embedding indexing, retrieval re-ranking, and structured tool calling.",
      },
      {
        step: "03",
        title: "Eval Harness",
        description:
          "Continuous testing against golden question-answer test sets to eliminate hallucinations.",
      },
      {
        step: "04",
        title: "Deploy & Monitor",
        description:
          "Production container deployment with token streaming, rate limiting, and latency alerts.",
      },
    ],
    whatYouGet: [
      "Production-ready AI microservice with streaming WebSocket/HTTP APIs",
      "Hybrid Vector Search and Knowledge Base indexing pipeline",
      "Automated prompt regression and safety evaluation suite",
      "Live operational telemetry dashboard and token cost tracking",
    ],
    caseStudy: {
      title: "Legal Contract Analysis Autonomous Agent",
      slug: "legal-contract-analysis-agent",
      metric: "94% review time reduction with 99.8% precision across 50-page agreements",
    },
    relatedServices: [
      { title: "AI Enablement", slug: "ai-enablement" },
      { title: "Custom Software", slug: "custom-software" },
    ],
  },

  seo: {
    slug: "seo",
    chapter: "Visibility",
    chapterNum: "04",
    sceneTarget: 3,
    title: "SEO",
    promise: "Be found where people search.",
    whoItIsFor:
      "Businesses with digital platforms or web applications aiming to improve technical indexability, structured authority, and qualified organic search discovery.",
    whatWeDo: [
      "Technical audit: crawling, speed and indexing",
      "Content and keyword strategy built on intent",
      "Structured data and authority building",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Crawl & Audit",
        description:
          "In-depth technical analysis of core web vitals, indexation barriers, and information architecture.",
      },
      {
        step: "02",
        title: "Strategy & Intent",
        description:
          "Mapping user query intents to content schemas and high-relevance topical clusters.",
      },
      {
        step: "03",
        title: "Markup & Build",
        description:
          "Deploying JSON-LD schema, canonical hierarchies, and performance optimizations.",
      },
      {
        step: "04",
        title: "Measure & Iterate",
        description:
          "Tracking crawl telemetry, search impressions, and organic conversions without artificial rank guarantees.",
      },
    ],
    whatYouGet: [
      "A search plan with measurable targets.",
      "Technical crawling and indexing remediation specification",
      "Structured JSON-LD schema architecture across primary entity models",
      "Intent-aligned content and keyword cluster map",
    ],
    caseStudy: {
      title: "Global Supply Platform Legacy Migration",
      slug: "global-supply-chain-modernisation",
      metric: "Comprehensive technical indexation across 14 enterprise subdomains",
    },
    relatedServices: [
      { title: "AEO", slug: "aeo" },
      { title: "GEO", slug: "geo" },
      { title: "Website Development", slug: "website-development" },
    ],
  },

  aeo: {
    slug: "aeo",
    chapter: "Visibility",
    chapterNum: "04",
    sceneTarget: 3,
    title: "AEO",
    promise: "Be the answer, not just a link.",
    whoItIsFor:
      "Brands seeking direct representation in conversational search, voice assistants, and algorithmic featured snippet engines.",
    whatWeDo: [
      "Content structured as clear questions and answers",
      "FAQ, how-to and entity schema markup",
      "Built for featured snippets, voice and AI answer panels",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Question Discovery",
        description:
          "Isolating primary intent questions, voice queries, and factual inquiries across customer journeys.",
      },
      {
        step: "02",
        title: "Entity Modeling",
        description:
          "Connecting brand attributes, definitions, and facts to standard ontology entities.",
      },
      {
        step: "03",
        title: "Schema Engineering",
        description:
          "Authoring explicit FAQPage, HowTo, and ItemList structured microdata.",
      },
      {
        step: "04",
        title: "Answer Verification",
        description:
          "Testing extraction fidelity across featured snippets and voice response engines.",
      },
    ],
    whatYouGet: [
      "Pages that answer engines can quote with confidence.",
      "Entity schema architecture tailored for direct answer extraction",
      "Structured Q&A content blueprints built for voice and snippets",
      "Query disambiguation and factual validation registry",
    ],
    caseStudy: {
      title: "Legal Contract Analysis Autonomous Agent",
      slug: "legal-contract-analysis-agent",
      metric: "Deterministic question-answer retrieval across structured enterprise corpora",
    },
    relatedServices: [
      { title: "SEO", slug: "seo" },
      { title: "GEO", slug: "geo" },
      { title: "AI Implementation", slug: "ai-implementation" },
    ],
  },

  geo: {
    slug: "geo",
    chapter: "Visibility",
    chapterNum: "04",
    sceneTarget: 3,
    title: "GEO",
    promise: "Be cited when AI makes a recommendation.",
    whoItIsFor:
      "Enterprises and growth companies wanting verifiable brand accuracy and trusted citations across LLMs and generative assistants.",
    whatWeDo: [
      "Consistent, verifiable facts about your brand across the web",
      "Original, evidence-backed content worth citing",
      "Track how ChatGPT, Gemini, Perplexity and Claude describe you",
    ],
    howWeWork: [
      {
        step: "01",
        title: "Citation Baseline",
        description:
          "Benchmarking current multi-model descriptions, sentiment, and factual accuracy across LLMs.",
      },
      {
        step: "02",
        title: "Knowledge Graph Alignment",
        description:
          "Publishing verifiable corporate facts, whitepapers, and authoritative source references.",
      },
      {
        step: "03",
        title: "Evidence Structuring",
        description:
          "Formatting technical documentation and research for semantic model retrieval.",
      },
      {
        step: "04",
        title: "Continuous Monitoring",
        description:
          "Regular multi-engine perception audits to catch hallucinations and update brand citations.",
      },
    ],
    whatYouGet: [
      "A visibility baseline across AI assistants, and a plan to improve it.",
      "Multi-LLM brand perception and factual accuracy audit report",
      "Evidence-backed digital asset and entity verification registry",
      "Generative citation monitoring and corrective action roadmap",
    ],
    caseStudy: {
      title: "Healthcare Data Platform AI Governance",
      slug: "healthcare-data-ai-governance",
      metric: "Verifiable entity tracking and zero-hallucination factual consistency",
    },
    relatedServices: [
      { title: "SEO", slug: "seo" },
      { title: "AEO", slug: "aeo" },
      { title: "AI Enablement", slug: "ai-enablement" },
    ],
  },
};
