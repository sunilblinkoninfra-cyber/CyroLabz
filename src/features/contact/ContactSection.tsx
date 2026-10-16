"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Contact Cyrolabz"
      className="relative py-28 lg:py-36 bg-surface-subtle/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Inquiries & Value Proposition */}
          <div className="lg:col-span-5 space-y-8">
            <SectionHeading
              eyebrow="04 // INITIATE"
              title="Ready To Build Something Extraordinary?"
              description="Whether you need a flagship 3D interactive web product, an enterprise AI implementation, or an architectural audit before a critical launch—we're ready to engineer it."
            />

            <div className="space-y-6 pt-6 border-t border-line">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-subtle tech-border flex items-center justify-center font-mono text-xs text-ink mt-1">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-display font-medium text-ink">
                    Direct Partner Access
                  </h4>
                  <p className="text-xs font-sans text-muted leading-relaxed mt-1">
                    Every project is led by a principal engineer and senior designer with direct communication channels.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-subtle tech-border flex items-center justify-center font-mono text-xs text-ink mt-1">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-display font-medium text-ink">
                    Rapid Technical Scoping
                  </h4>
                  <p className="text-xs font-sans text-muted leading-relaxed mt-1">
                    We deliver comprehensive architectural estimates and feasibility roadmaps within 48–72 hours of initial discovery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-subtle tech-border flex items-center justify-center font-mono text-xs text-ink mt-1">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-display font-medium text-ink">
                    SLA & Security Guarantees
                  </h4>
                  <p className="text-xs font-sans text-muted leading-relaxed mt-1">
                    Complete IP assignment upon completion with standard enterprise mutual NDAs executed prior to data sharing.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Coordinates */}
            <div className="p-6 bg-surface-card tech-border chamfer-sm space-y-2 shadow-subtle">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted block">
                DIRECT CHANNELS //
              </span>
              <p className="text-sm font-mono text-ink">
                hello@cyrolabz.com
              </p>
              <p className="text-xs font-mono text-muted">
                Encrypted PGP Key Available On Request
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
