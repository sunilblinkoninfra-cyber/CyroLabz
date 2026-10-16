import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Cyrolabz",
  description: "Cyrolabz Terms of Service and Master Service Agreement foundations.",
};

export default function TermsOfServicePage() {
  return (
    <div className="pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-12 border-b border-line pb-6">
        <div className="font-mono text-xs uppercase tracking-eyebrow text-accent mb-2">
          Legal & Compliance
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-muted mt-2">
          Effective Date: October 14, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            1. Scope of Engagement
          </h2>
          <p>
            Cyrolabz provides Website Development, 3D Interactive Design, AI Enablement & Implementation, Custom Software Development, Consulting, and Technical Audits. Specific deliverables, delivery milestones, acceptance criteria, and warranties are governed by individual Statements of Work (SOWs) executed under our Master Services Agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            2. Intellectual Property Ownership
          </h2>
          <p>
            Upon full settlement of agreed invoices, clients retain complete and exclusive ownership of all custom software code, designs, models, and documentation created specifically for their engagement, free from vendor lock-in.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            3. Independent Technical Opinions
          </h2>
          <p>
            All forensic audits and architecture consulting assessments represent our independent, professional engineering evaluations grounded in verifiable empirical telemetry and source code inspection.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            4. Inquiries
          </h2>
          <p>
            For legal notices, please write to{" "}
            <a href="mailto:legal@cyrolabz.com" className="text-ink underline hover:text-accent font-mono">
              legal@cyrolabz.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
