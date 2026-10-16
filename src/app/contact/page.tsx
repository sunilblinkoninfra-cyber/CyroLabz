"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Text3DBlock } from "@/components/ui/Text3DBlock";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email address"),
  company: z.string().min(2, "Company name is required"),
  service: z.enum([
    "Consulting",
    "Audits",
    "Custom Software Development",
    "Website Development",
    "3D Interactive Design",
    "AI Enablement",
    "AI Implementation",
    "SEO (Search Engine Optimisation)",
    "AEO (Answer Engine Optimisation)",
    "GEO (Generative Engine Optimisation)",
  ], {
    errorMap: () => ({ message: "Please select a service" }),
  }),
  budget: z.enum([
    "< $15,000",
    "$15,000 - $35,000",
    "$35,000 - $75,000",
    "$75,000+",
  ], {
    errorMap: () => ({ message: "Please select a budget range" }),
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // Honeypot field: must remain empty
  hp_field: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "Custom Software Development",
      budget: "$15,000 - $35,000",
      message: "",
      hp_field: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // If honeypot filled, silently pretend success
    if (data.hp_field && data.hp_field.length > 0) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    // Simulate brief network submission
    await new Promise((resolve) => setTimeout(resolve, 750));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-[46vh] md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* In Scene 04, art is on the left; form and copy sit on the right */}
      <div className="w-full lg:w-[48%] lg:ml-auto space-y-8">
        {/* Context Header */}
        <Text3DBlock
          headlineAs="h1"
          kicker="04 / CONTACT"
          headline="Start a project with Cyrolabz."
          body="One team takes you from strategy to build to audit. Submit your technical scope below or schedule an architecture discovery session."
        />

        {/* Small decorative detail: hero-orbital.png */}
        <div className="p-4 sm:p-5 rounded-lg border border-line bg-surface/75 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-line flex-shrink-0 bg-black">
              <Image
                src="/assets/hero-orbital.png"
                alt="Orbital System Core detail"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold">
                Direct Engineering Ingestion
              </h4>
              <p className="text-[11px] text-muted">
                Direct response within 24 business hours from a lead system architect.
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-line/60 flex items-center justify-between text-xs font-mono text-muted">
            <span className="text-ink font-medium">engineering@cyrolabz.com</span>
            <span className="text-accent font-semibold">&lt; 24h Response</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-lg border border-line bg-surface/85 backdrop-blur-md shadow-sm">
          {submitted ? (
              <div className="space-y-6 py-8 text-center" role="status" aria-live="polite">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent text-accent mx-auto flex items-center justify-center font-mono text-xl font-bold">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    Project Specifications Received
                  </h3>
                  <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. An engineering lead is reviewing your requirements and will reply within one business day with an initial technical assessment.
                  </p>
                </div>
                <button
                  onClick={() => {
                    reset();
                    setSubmitted(false);
                  }}
                  className="font-mono text-xs uppercase tracking-eyebrow px-5 py-2.5 rounded border border-line hover:border-ink transition-colors font-medium text-ink"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Honeypot field (hidden from view) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="hp_field">Leave this empty</label>
                  <input
                    id="hp_field"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("hp_field")}
                  />
                </div>

                {/* Name & Work Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold"
                    >
                      Your Name <span className="text-accent">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Jane Doe"
                      {...register("name")}
                      className={`w-full px-4 py-3 rounded border bg-bg text-ink placeholder:text-muted/60 text-sm focus:outline-none transition-colors ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-line focus:border-accent"
                      }`}
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 font-mono mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold"
                    >
                      Work Email <span className="text-accent">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="jane@company.com"
                      {...register("email")}
                      className={`w-full px-4 py-3 rounded border bg-bg text-ink placeholder:text-muted/60 text-sm focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-line focus:border-accent"
                      }`}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 font-mono mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-company"
                    className="block font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold"
                  >
                    Company Name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    placeholder="Acme Technologies Ltd"
                    {...register("company")}
                    className={`w-full px-4 py-3 rounded border bg-bg text-ink placeholder:text-muted/60 text-sm focus:outline-none transition-colors ${
                      errors.company
                        ? "border-red-500 focus:border-red-500"
                        : "border-line focus:border-accent"
                    }`}
                    aria-invalid={errors.company ? "true" : "false"}
                  />
                  {errors.company && (
                    <p className="text-xs text-red-500 font-mono mt-1">
                      {errors.company.message}
                    </p>
                  )}
                </div>

                {/* Service of Interest & Budget Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-service"
                      className="block font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold"
                    >
                      Service of Interest <span className="text-accent">*</span>
                    </label>
                    <select
                      id="contact-service"
                      {...register("service")}
                      className="w-full px-4 py-3 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent"
                    >
                      <option value="Custom Software Development">
                        Custom Software Development
                      </option>
                      <option value="Website Development">
                        Website Development
                      </option>
                      <option value="3D Interactive Design">
                        3D Interactive Design
                      </option>
                      <option value="AI Enablement">AI Enablement</option>
                      <option value="AI Implementation">AI Implementation</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Audits">Audits</option>
                      <option value="SEO (Search Engine Optimisation)">
                        SEO (Search Engine Optimisation)
                      </option>
                      <option value="AEO (Answer Engine Optimisation)">
                        AEO (Answer Engine Optimisation)
                      </option>
                      <option value="GEO (Generative Engine Optimisation)">
                        GEO (Generative Engine Optimisation)
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-budget"
                      className="block font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold"
                    >
                      Budget Range <span className="text-accent">*</span>
                    </label>
                    <select
                      id="contact-budget"
                      {...register("budget")}
                      className="w-full px-4 py-3 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent"
                    >
                      <option value="< $15,000">&lt; $15,000</option>
                      <option value="$15,000 - $35,000">$15,000 - $35,000</option>
                      <option value="$35,000 - $75,000">$35,000 - $75,000</option>
                      <option value="$75,000+">$75,000+</option>
                    </select>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-xs uppercase tracking-eyebrow text-ink font-semibold"
                  >
                    Project Details & Goals <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us about your current systems, objectives, timeline, or architecture requirements..."
                    {...register("message")}
                    className={`w-full px-4 py-3 rounded border bg-bg text-ink placeholder:text-muted/60 text-sm focus:outline-none transition-colors ${
                      errors.message
                        ? "border-red-500 focus:border-red-500"
                        : "border-line focus:border-accent"
                    }`}
                    aria-invalid={errors.message ? "true" : "false"}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 font-mono mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded bg-accent text-on-accent hover:bg-accent-hover font-mono text-xs uppercase tracking-eyebrow font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-on-accent/30 border-t-on-accent rounded-full animate-spin" />
                        <span>Transmitting requirements...</span>
                      </>
                    ) : (
                      <span>Transmit Project Specifications →</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
  );
}
