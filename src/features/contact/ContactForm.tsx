"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid work email address"),
  company: z.string().min(2, "Company name is required"),
  need: z.enum([
    "Website Development",
    "3D Interactive Design",
    "AI Enablement & Implementation",
    "Custom Software Development",
    "Technical Consulting",
    "Architecture & Code Audits",
    "Comprehensive Studio Engagement",
  ], {
    errorMap: () => ({ message: "Please select an area of collaboration" }),
  }),
  details: z
    .string()
    .min(10, "Please provide at least a brief summary of project requirements (min 10 characters)")
    .max(2000, "Maximum character limit exceeded"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [transmissionId] = useState(() => Math.floor(100000 + Math.random() * 900000));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      need: "AI Enablement & Implementation",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    console.log("[CYROLABZ_INQUIRY_RECEIVED]", data);
    await new Promise((res) => setTimeout(res, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="bg-surface-card tech-border p-8 sm:p-10 chamfer-sm text-center space-y-6 shadow-subtle animate-in fade-in duration-300">
        <div className="w-14 h-14 mx-auto rounded-full bg-ink text-bg flex items-center justify-center font-mono text-xl shadow-glow">
          ✓
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-semibold block">
            TRANSMISSION CONFIRMED // ID #{transmissionId}
          </span>
          <h3 className="text-2xl font-display font-medium text-ink">
            Project Brief Received
          </h3>
          <p className="text-sm font-sans text-muted max-w-md mx-auto leading-relaxed">
            Thank you for reaching out. A senior partner will review your requirements and respond within 1 business day with an initial technical assessment.
          </p>
        </div>

        <div className="pt-4 border-t border-line">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleReset}
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-surface-card tech-border p-8 sm:p-10 chamfer-sm space-y-6 shadow-subtle"
    >
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <span className="text-xs font-mono uppercase tracking-widest text-muted">
          INQUIRY PROTOCOL //
        </span>
        <span className="text-[10px] font-mono text-muted">ENCRYPTED</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-xs font-mono uppercase tracking-wider text-muted"
          >
            Your Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ada Lovelace"
            {...register("name")}
            className="w-full px-4 py-2.5 text-sm bg-surface-subtle tech-border chamfer-sm text-ink placeholder-muted/60 focus:bg-surface transition-colors"
          />
          {errors.name && (
            <p className="text-xs font-mono text-red-500 pt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Work Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-xs font-mono uppercase tracking-wider text-muted"
          >
            Work Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="ada@company.com"
            {...register("email")}
            className="w-full px-4 py-2.5 text-sm bg-surface-subtle tech-border chamfer-sm text-ink placeholder-muted/60 focus:bg-surface transition-colors"
          />
          {errors.email && (
            <p className="text-xs font-mono text-red-500 pt-1">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Company */}
        <div className="space-y-2">
          <label
            htmlFor="company"
            className="block text-xs font-mono uppercase tracking-wider text-muted"
          >
            Company / Organization <span className="text-accent">*</span>
          </label>
          <input
            id="company"
            type="text"
            placeholder="Acme Technologies"
            {...register("company")}
            className="w-full px-4 py-2.5 text-sm bg-surface-subtle tech-border chamfer-sm text-ink placeholder-muted/60 focus:bg-surface transition-colors"
          />
          {errors.company && (
            <p className="text-xs font-mono text-red-500 pt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Primary Need Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="need"
            className="block text-xs font-mono uppercase tracking-wider text-muted"
          >
            Primary Need <span className="text-accent">*</span>
          </label>
          <select
            id="need"
            {...register("need")}
            className="w-full px-4 py-2.5 text-sm bg-surface-subtle tech-border chamfer-sm text-ink focus:bg-surface transition-colors"
          >
            <option value="AI Enablement & Implementation">
              AI Enablement & Implementation
            </option>
            <option value="Website Development">Website Development</option>
            <option value="3D Interactive Design">3D Interactive Design</option>
            <option value="Custom Software Development">
              Custom Software Development
            </option>
            <option value="Technical Consulting">Technical Consulting</option>
            <option value="Architecture & Code Audits">
              Architecture & Code Audits
            </option>
            <option value="Comprehensive Studio Engagement">
              Comprehensive Studio Engagement
            </option>
          </select>
          {errors.need && (
            <p className="text-xs font-mono text-red-500 pt-1">
              {errors.need.message}
            </p>
          )}
        </div>
      </div>

      {/* Details Textarea */}
      <div className="space-y-2">
        <label
          htmlFor="details"
          className="block text-xs font-mono uppercase tracking-wider text-muted"
        >
          Project Details & Objectives <span className="text-accent">*</span>
        </label>
        <textarea
          id="details"
          rows={4}
          placeholder="Briefly describe your timeline, core technical requirements, and target outcomes..."
          {...register("details")}
          className="w-full px-4 py-2.5 text-sm bg-surface-subtle tech-border chamfer-sm text-ink placeholder-muted/60 focus:bg-surface transition-colors resize-y"
        />
        {errors.details && (
          <p className="text-xs font-mono text-red-500 pt-1">
            {errors.details.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full justify-center"
        >
          {submitting ? "Transmitting Requirements..." : "Submit Project Inquiry →"}
        </Button>
      </div>

      <p className="text-[11px] font-mono text-muted text-center pt-2">
        STRICT CONFIDENTIALITY GUARANTEED · NON-DISCLOSURE BY DEFAULT
      </p>
    </form>
  );
}
