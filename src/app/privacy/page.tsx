import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Cyrolabz",
  description: "Cyrolabz Privacy Policy, enterprise data handling, and confidentiality standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-12 border-b border-line pb-6">
        <div className="font-mono text-xs uppercase tracking-eyebrow text-accent mb-2">
          Legal & Compliance
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-muted mt-2">
          Effective Date: October 14, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            1. Commitment to Data Confidentiality
          </h2>
          <p>
            Cyrolabz (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) designs software, runs forensic code audits, and implements enterprise AI systems. We treat all client source code, infrastructure telemetry, database schemas, and proprietary data under strict non-disclosure agreements (NDAs) and confidentiality protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            2. Information We Collect
          </h2>
          <p>
            When you submit an enquiry via our website, we collect your name, work email address, company name, service interest, budget estimate, and project description. We use this information solely to evaluate project suitability and communicate with you directly. We never sell, lease, or distribute your information to third-party data brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            3. AI Training and Client IP Safeguards
          </h2>
          <p>
            We strictly enforce that client codebase artifacts, proprietary business logic, and customer data are never passed to public foundation model training sets or external third-party logging sinks without explicit written permission and dedicated enterprise private-tenant SLAs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            4. Contact
          </h2>
          <p>
            For privacy inquiries or compliance verification, contact our Data Protection Officer at{" "}
            <a href="mailto:privacy@cyrolabz.com" className="text-ink underline hover:text-accent font-mono">
              privacy@cyrolabz.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
