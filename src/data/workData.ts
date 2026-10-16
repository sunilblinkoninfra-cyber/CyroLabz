export interface CaseStudyBeat {
  foundation: string;
  connect: string;
  intelligence: string;
  result: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  clientIndustry: string;
  timeline: string;
  serviceCategory: string;
  beats: CaseStudyBeat;
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "global-supply-chain-modernisation": {
    slug: "global-supply-chain-modernisation",
    title: "Global Supply Platform Legacy Migration",
    subtitle:
      "Modernising fragmented logistics software into an event-driven global order orchestration system.",
    clientIndustry: "Global Logistics & Freight",
    timeline: "16 Weeks",
    serviceCategory: "Consulting & Custom Software",
    beats: {
      foundation:
        "14 regional legacy ERPs and inventory spreadsheets operating in isolation. Order processing required manual reconciliation across 5 time zones, resulting in average tracking delays of 36 hours and frequent shipping discrepancies.",
      connect:
        "Engineered an event-driven integration layer using Apache Kafka and Go microservices. Standardised canonical data contracts across all freight forwarders, customs brokers, and inventory nodes into unified real-time telemetry streams.",
      intelligence:
        "Deployed automated anomaly detection and dynamic route re-calculation agents. The system autonomously flags port congestion, computes alternate modal transfers, and predicts tariff hold-ups before containers arrive.",
      result: [
        "-68% integration latency across all 14 enterprise endpoints",
        "36 hours tracking lag reduced to <1.2 seconds real-time updates",
        "$4.2M estimated annual savings in demurrage and expedited shipping fines",
        "Zero downtime recorded across initial 12-month production rollout",
      ],
    },
  },

  "fintech-security-compliance-audit": {
    slug: "fintech-security-compliance-audit",
    title: "Fintech Core Banking Architecture Audit",
    subtitle:
      "Forensic codebase and cloud security audit for a tier-one payments processor processing $12B annually.",
    clientIndustry: "Financial Services & Payments",
    timeline: "6 Weeks",
    serviceCategory: "Audits",
    beats: {
      foundation:
        "Monolithic payment authorization ledger preparing for Series C and SOC 2 Type II audit. The engineering team had accumulated significant untyped legacy code and lacked deterministic load testing profiles.",
      connect:
        "Implemented continuous dependency scanning, network boundary inspection, and automated database connection pooling profiles. Profiled distributed database deadlocks and mapped all unauthenticated egress vectors.",
      intelligence:
        "Implemented real-time transaction heuristics and automated anomaly score generation for cross-border settlement requests, ensuring strict adherence to anti-money laundering (AML) protocols.",
      result: [
        "100% elimination of critical CVE vulnerabilities before regulatory submission",
        "4.2x transaction throughput increase under synthetic load tests",
        "SOC 2 Type II and ISO 27001 certifications achieved without qualification",
        "Zero data leaks or security incidents reported post-audit",
      ],
    },
  },

  "autonomous-fleet-routing-engine": {
    slug: "autonomous-fleet-routing-engine",
    title: "Autonomous Fleet Dispatch Platform",
    subtitle:
      "Sub-millisecond vehicle dispatch and route optimization engine handling 180,000 queries per second.",
    clientIndustry: "Autonomous Transportation",
    timeline: "20 Weeks",
    serviceCategory: "Custom Software Development",
    beats: {
      foundation:
        "A legacy relational database bottlenecking vehicle telematics. Geofencing queries took 450ms, causing vehicles to drop routing packets at dense urban intersections.",
      connect:
        "Architected an in-memory spatial indexing engine in Rust with low-overhead gRPC communication channels. Connected 12,000 active telemetry streams directly to edge compute dispatch pods.",
      intelligence:
        "Integrated predictive traffic flow models and reinforcement learning dispatch agents that dynamically balance fleet density against upcoming passenger pickup clusters.",
      result: [
        "99.995% service availability processing 180,000 requests/sec",
        "Routing latency dropped from 450ms to 3.8ms at p99",
        "22% reduction in unladen vehicle idle miles",
        "Zero lost telematics packets recorded in stress testing",
      ],
    },
  },

  "fintech-portal-modernisation": {
    slug: "fintech-portal-modernisation",
    title: "Next-Gen Fintech Brand & Portal",
    subtitle:
      "Bespoke web application with sub-second performance, hardware-accelerated charting, and dark mode design.",
    clientIndustry: "Wealth Management & Trading",
    timeline: "10 Weeks",
    serviceCategory: "Website Development",
    beats: {
      foundation:
        "An outdated single-page app with 6.2s load times, layout shifts on mobile, and an unbranded off-the-shelf theme that damaged investor credibility.",
      connect:
        "Rebuilt the entire platform with Next.js App Router, strict TypeScript, and a unified token-based CSS system supporting seamless Auto, Light, and Dark themes.",
      intelligence:
        "Integrated automated portfolio rebalancing previews and natural language transaction filtering copilots with client-side edge streaming.",
      result: [
        "0.8s Largest Contentful Paint (LCP) verified on mobile 4G",
        "+140% conversion rate increase for qualified investor signups",
        "100/100 Lighthouse score across SEO, Accessibility, and Best Practices",
        "Zero layout shifts (CLS 0.000) across all breakpoints",
      ],
    },
  },

  "aerospace-3d-digital-twin": {
    slug: "aerospace-3d-digital-twin",
    title: "Aerospace Component Digital Twin",
    subtitle:
      "Real-time 3D interactive assembly browser with interactive exploded views and thermal simulation shaders.",
    clientIndustry: "Aerospace & Defense",
    timeline: "12 Weeks",
    serviceCategory: "3D Interactive Design",
    beats: {
      foundation:
        "Static 2D technical drawings and 500MB CAD files that could only be opened on dedicated CAD workstations, leaving field engineers without interactive component diagnostics.",
      connect:
        "Retopologised 450+ precision mechanical components into browser-optimized GLTF models under 1.8MB total payload. Built a bespoke Three.js rendering engine with custom GLSL shaders.",
      intelligence:
        "Mapped real-time sensor streams to 3D heat-map shaders on the engine casing, allowing engineers to visualize live thermal dissipation and stress points in real time.",
      result: [
        "60 FPS steady performance on iOS and Android field tablets",
        "Interactive exploration of 450+ individual subcomponents",
        "40% reduction in field maintenance diagnostic troubleshooting time",
        "Zero external plugins or software installs required",
      ],
    },
  },

  "healthcare-data-ai-governance": {
    slug: "healthcare-data-ai-governance",
    title: "Healthcare Data Platform AI Governance",
    subtitle:
      "HIPAA-compliant data pipelines, model benchmarking, and deterministic safety guardrails for clinical AI.",
    clientIndustry: "Healthcare & Diagnostics",
    timeline: "14 Weeks",
    serviceCategory: "AI Enablement",
    beats: {
      foundation:
        "Terabytes of multi-hospital EHR records and radiology reports stored in unindexed siloes, with strict regulatory risk preventing any commercial LLM adoption.",
      connect:
        "Engineered an automated PII de-identification pipeline and private embeddings index. Built a deterministic policy validation firewall between clinical users and model endpoints.",
      intelligence:
        "Benchmarked and deployed fine-tuned medical models for clinical trial matching and discharge summary synthesis with citation grounding.",
      result: [
        "HIPAA-compliant data pipeline enabling 12 internal clinical copilots",
        "100% precision in redaction of direct and indirect patient identifiers",
        "85% reduction in physician documentation administrative burden",
        "Zero data transmission to unverified third-party endpoints",
      ],
    },
  },

  "legal-contract-analysis-agent": {
    slug: "legal-contract-analysis-agent",
    title: "Legal Contract Analysis Autonomous Agent",
    subtitle:
      "Production multi-agent RAG system for autonomous commercial contract risk review and redlining.",
    clientIndustry: "Legal & Corporate Compliance",
    timeline: "8 Weeks",
    serviceCategory: "AI Implementation",
    beats: {
      foundation:
        "Senior legal counsel spending 40+ hours per week manually reviewing boilerplate indemnification clauses, non-competes, and liabilities in 50-page vendor agreements.",
      connect:
        "Developed a hybrid vector-keyword retrieval pipeline and multi-agent consensus workflow that extracts definitions, cross-references clauses, and identifies missing safeguards.",
      intelligence:
        "Autonomous review agents compare contract terms against corporate negotiation playbooks, automatically generating redline suggestions and risk score breakdowns.",
      result: [
        "94% review time reduction per 50-page commercial agreement",
        "99.8% precision rate across 10,000 tested clauses",
        "Instant identification of non-standard indemnification liabilities",
        "$1.8M in external outside-counsel fee savings in the first 6 months",
      ],
    },
  },
};
