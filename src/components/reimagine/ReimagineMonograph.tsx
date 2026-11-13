"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TRANSFORMATION_SIGNATURES,
  STATEMENT_COMPARISON,
  type SignatureId,
} from "@/data/reimagineData";
import { ExposedSpine } from "./ExposedSpine";

interface ScopeSubmission {
  email: string;
  company: string;
  stage: string;
  deliverables: string[];
  notes: string;
  referenceCode: string;
}

export const ReimagineMonograph: React.FC = () => {
  const [activeId, setActiveId] = useState<SignatureId>("foundation");
  const [intakeStageId, setIntakeStageId] = useState<SignatureId>("foundation");
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    TRANSFORMATION_SIGNATURES[0].disciplines[0].deliverable,
  ]);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [deliverableError, setDeliverableError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ScopeSubmission | null>(null);
  const [showDiff, setShowDiff] = useState(true);
  const [themeLabel, setThemeLabel] = useState<"light" | "dark">("light");

  useEffect(() => {
    const syncTheme = () => {
      const explicit = document.documentElement.getAttribute("data-theme");
      if (explicit === "dark" || explicit === "light") {
        setThemeLabel(explicit);
      } else {
        setThemeLabel(
          window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        );
      }
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const togglePaperTheme = () => {
    const next = themeLabel === "dark" ? "light" : "dark";
    setThemeLabel(next);
    try {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("cyrolabz-theme", next);
    } catch {
      // Ignore storage failures in restricted contexts
    }
  };

  const activeSig =
    TRANSFORMATION_SIGNATURES.find((s) => s.id === activeId) ??
    TRANSFORMATION_SIGNATURES[0];
  const activeIdx = TRANSFORMATION_SIGNATURES.findIndex((s) => s.id === activeId);

  const intakeSig =
    TRANSFORMATION_SIGNATURES.find((s) => s.id === intakeStageId) ??
    TRANSFORMATION_SIGNATURES[0];

  const handleSelectSignature = (id: SignatureId) => {
    setActiveId(id);
    setIntakeStageId(id);
    const sig = TRANSFORMATION_SIGNATURES.find((s) => s.id === id);
    if (sig && sig.disciplines.length > 0) {
      setSelectedDeliverables([sig.disciplines[0].deliverable]);
      setDeliverableError(null);
    }
  };

  const handleSelectIntakeStage = (id: SignatureId) => {
    setIntakeStageId(id);
    const sig = TRANSFORMATION_SIGNATURES.find((s) => s.id === id);
    if (sig && sig.disciplines.length > 0) {
      setSelectedDeliverables([sig.disciplines[0].deliverable]);
      setDeliverableError(null);
    }
  };

  const toggleDeliverable = (deliverable: string) => {
    setDeliverableError(null);
    setSelectedDeliverables((prev) =>
      prev.includes(deliverable)
        ? prev.filter((d) => d !== deliverable)
        : [...prev, deliverable]
    );
  };

  const handleScopeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setDeliverableError(null);

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
      setEmailError("Enter a valid work email so a lead architect can reply.");
      return;
    }

    if (selectedDeliverables.length === 0) {
      setDeliverableError("Select at least one deliverable to scope the session.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 420));
    setIsSubmitting(false);

    const code = `CLZ-${intakeSig.index}-${Math.abs(
      trimmedEmail.split("").reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7)
    )
      .toString(36)
      .toUpperCase()
      .slice(0, 5)}`;

    setReceipt({
      email: trimmedEmail,
      company: company.trim() || "Unspecified organisation",
      stage: `${intakeSig.index} ${intakeSig.name}`,
      deliverables: selectedDeliverables,
      notes: notes.trim(),
      referenceCode: code,
    });
  };

  const handlePrev = () => {
    const prev =
      TRANSFORMATION_SIGNATURES[
        (activeIdx - 1 + TRANSFORMATION_SIGNATURES.length) %
          TRANSFORMATION_SIGNATURES.length
      ];
    handleSelectSignature(prev.id);
  };

  const handleNext = () => {
    const next =
      TRANSFORMATION_SIGNATURES[
        (activeIdx + 1) % TRANSFORMATION_SIGNATURES.length
      ];
    handleSelectSignature(next.id);
  };

  return (
    <div className="reimagine-world relative z-20 min-h-screen pt-20 sm:pt-24 pb-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Monograph Binding Bar (Clean single-line utility strip) */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 mb-4 border-b border-[var(--rg-rule-strong)]">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-[var(--rg-ink)]">
              Cyrolabz Design Statement
            </span>
            <span className="text-[var(--rg-muted)]">
              Demo preview · Local checkout only
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={togglePaperTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] hover:border-[var(--rg-thread)] transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="3.5" />
                <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1" />
              </svg>
              <span>{themeLabel === "dark" ? "Obsidian Folio" : "Rag Paper"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDiff((v) => !v)}
              aria-expanded={showDiff}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] hover:border-[var(--rg-thread)] transition-colors"
            >
              <span>{showDiff ? "Hide" : "Show"} Statement Comparison</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[var(--rg-thread)] hover:text-[var(--rg-thread-hover)] underline font-medium"
            >
              <span>View Current Homepage</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Open Two-Folio Monograph Spread */}
        <article
          aria-label="Cyrolabz Reimagined Design Statement Monograph"
          className="reimagine-folio-spread grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_116px_minmax(0,0.88fr)]"
        >
          {/* Mobile Spine sits at top; on Desktop we place it in column 2 via order */}
          <div className="lg:order-2 flex flex-col">
            <ExposedSpine
              signatures={TRANSFORMATION_SIGNATURES}
              activeId={activeId}
              onSelect={handleSelectSignature}
            />
          </div>

          {/* LEFT FOLIO: Statement & Active Signature */}
          <section
            aria-label="Design statement and active transformation chapter"
            className="lg:order-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8"
          >
            <div className="space-y-6">
              <h1 className="reimagine-display text-3xl sm:text-4xl lg:text-[2.85rem] font-semibold leading-[1.06] text-[var(--rg-ink)] max-w-[18ch]">
                Transformation, engineered without hidden seams.
              </h1>

              <p className="reimagine-serif text-base sm:text-lg leading-relaxed text-[var(--rg-ink-soft)] max-w-[58ch]">
                Advisory decks stop at slides. Feature shops ship isolated
                tickets. Bolt-on AI stalls on unindexed data. One Cyrolabz team
                carries your architecture continuously from audit to custom
                software, intelligence, and visibility—so you own every line.
              </p>
            </div>

            {/* Active Flat-Open Signature Sheet */}
            <div
              key={activeSig.id}
              className="border-t border-[var(--rg-rule)] pt-6 space-y-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="reimagine-display text-xl sm:text-2xl font-semibold text-[var(--rg-ink)]">
                  <span className="reimagine-mono text-base text-[var(--rg-thread)] mr-2.5">
                    {activeSig.index}
                  </span>
                  {activeSig.name} — {activeSig.headline}
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous transformation signature"
                    className="p-2 border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] hover:border-[var(--rg-thread)] transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path d="M10 3L5 8l5 5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next transformation signature"
                    className="p-2 border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] hover:border-[var(--rg-thread)] transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Copperplate Artwork + Seam Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-6 items-start">
                <figure className="py-2 border-y border-[var(--rg-rule)] flex flex-col items-center">
                  <div className="relative w-36 h-36 sm:w-full sm:h-36">
                    <Image
                      src={activeSig.artworkSrc}
                      alt={activeSig.artworkAlt}
                      fill
                      sizes="170px"
                      className="object-contain reimagine-plate-img"
                    />
                  </div>
                  <figcaption className="mt-2 pt-2 border-t border-[var(--rg-rule)] w-full flex items-center justify-between text-xs text-[var(--rg-muted)]">
                    <span>Plate {activeSig.index}</span>
                    <span className="reimagine-mono">{activeSig.name}</span>
                  </figcaption>
                </figure>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--rg-muted)] mb-1">
                      Where the seam breaks
                    </h3>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--rg-ink-soft)] max-w-[60ch]">
                      {activeSig.seamFailure}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--rg-thread)] mb-1">
                      What Cyrolabz engineers
                    </h3>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--rg-ink)] max-w-[60ch]">
                      {activeSig.engineeredFix}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--rg-rule)]">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--rg-muted)] mb-1">
                      What you own outright
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--rg-ink-soft)] max-w-[60ch]">
                      {activeSig.clientOwnership}
                    </p>
                  </div>
                </div>
              </div>

              {/* Linked Service Disciplines */}
              <div className="pt-4 border-t border-[var(--rg-rule)] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-medium text-[var(--rg-muted)]">
                  Disciplines stitched into {activeSig.name}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeSig.disciplines.map((disc) => (
                    <Link
                      key={disc.slug}
                      href={disc.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] hover:border-[var(--rg-thread)] hover:text-[var(--rg-thread)] transition-colors"
                    >
                      <span>{disc.title}</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        aria-hidden="true"
                      >
                        <path d="M4 12L12 4M6 4h6v6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT FOLIO: Working Project Scope & Engineering Intake */}
          <section
            aria-label="Scope an engineering engagement"
            className="lg:order-3 p-6 sm:p-8 lg:p-10 border-t lg:border-t-0 border-[var(--rg-rule)] flex flex-col justify-between gap-6"
          >
            {receipt ? (
              <div className="space-y-5 my-auto border-t-2 border-[var(--rg-thread)] pt-6">
                <div className="flex items-center justify-between border-b border-[var(--rg-rule)] pb-3">
                  <span className="text-sm font-semibold text-[var(--rg-ink)]">
                    Scope Dispatch Recorded
                  </span>
                  <span className="reimagine-mono text-xs font-semibold text-[var(--rg-thread)]">
                    {receipt.referenceCode}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[var(--rg-ink-soft)]">
                  Demo scope captured locally for{" "}
                  <strong className="text-[var(--rg-ink)]">{receipt.email}</strong>{" "}
                  ({receipt.company}) entering at{" "}
                  <strong className="text-[var(--rg-ink)]">{receipt.stage}</strong>.
                </p>

                <div>
                  <span className="block text-xs font-semibold text-[var(--rg-muted)] mb-2">
                    Selected deliverables
                  </span>
                  <ul className="space-y-1.5">
                    {receipt.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-[var(--rg-ink)]"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="var(--rg-thread)"
                          strokeWidth="1.8"
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M3 8.5l3 3 7-7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {receipt.notes && (
                  <p className="text-sm text-[var(--rg-muted)] border-t border-[var(--rg-rule)] pt-3">
                    Context: {receipt.notes}
                  </p>
                )}

                <div className="pt-3 border-t border-[var(--rg-rule)] flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setReceipt(null)}
                    className="px-4 py-2 text-xs font-semibold border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] hover:border-[var(--rg-thread)] transition-colors"
                  >
                    Adjust Scope
                  </button>
                  <Link
                    href="/contact"
                    className="px-4 py-2 text-xs font-semibold bg-[var(--rg-thread)] text-[var(--rg-on-thread)] hover:bg-[var(--rg-thread-hover)] transition-colors"
                  >
                    Open Full Contact Page
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleScopeSubmit} noValidate className="space-y-6">
                <div className="space-y-2">
                  <h2 className="reimagine-display text-2xl font-semibold text-[var(--rg-ink)]">
                    Scope an engagement.
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--rg-muted)]">
                    Pick where your system stands today. A senior architect reviews
                    every technical scope before a single line of code is written.
                  </p>
                </div>

                {/* Step 1: Entry Stage */}
                <fieldset className="space-y-2">
                  <legend className="text-xs font-semibold text-[var(--rg-ink)]">
                    Entry signature
                  </legend>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-[var(--rg-rule)]">
                    {TRANSFORMATION_SIGNATURES.map((sig) => {
                      const selected = sig.id === intakeStageId;
                      return (
                        <button
                          key={sig.id}
                          type="button"
                          onClick={() => handleSelectIntakeStage(sig.id)}
                          aria-pressed={selected}
                          className={`px-2 py-2.5 text-left border-b-2 -mb-[1px] transition-colors ${
                            selected
                              ? "border-[var(--rg-thread)] text-[var(--rg-ink)]"
                              : "border-transparent text-[var(--rg-muted)] hover:text-[var(--rg-ink)]"
                          }`}
                        >
                          <span
                            className="reimagine-mono text-xs mr-1"
                            style={{
                              color: selected ? "var(--rg-thread)" : "var(--rg-muted)",
                            }}
                          >
                            {sig.index}
                          </span>
                          <span className="text-xs font-semibold">{sig.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Step 2: Concrete Deliverables */}
                <fieldset className="space-y-2">
                  <legend className="text-xs font-semibold text-[var(--rg-ink)]">
                    Deliverables in {intakeSig.name}
                  </legend>
                  <div className="divide-y divide-[var(--rg-rule)] border-y border-[var(--rg-rule)]">
                    {intakeSig.disciplines.map((disc) => {
                      const checked = selectedDeliverables.includes(disc.deliverable);
                      return (
                        <label
                          key={disc.slug}
                          className="flex items-start gap-3 py-2.5 px-1 cursor-pointer transition-colors hover:text-[var(--rg-ink)]"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleDeliverable(disc.deliverable)}
                            className="mt-0.5 h-4 w-4 accent-[var(--rg-thread)]"
                          />
                          <span className="text-sm leading-snug">
                            <span className="block font-semibold text-[var(--rg-ink)]">
                              {disc.title}
                            </span>
                            <span className="block text-xs text-[var(--rg-muted)] mt-0.5">
                              {disc.deliverable}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {deliverableError && (
                    <p role="alert" className="text-sm font-medium text-[var(--rg-error)]">
                      {deliverableError}
                    </p>
                  )}
                </fieldset>

                {/* Step 3: Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reimagine-email"
                      className="block text-xs font-semibold text-[var(--rg-ink)] mb-1.5"
                    >
                      Work email
                    </label>
                    <input
                      id="reimagine-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="cto@company.com"
                      className="w-full px-3 py-2 text-sm bg-[var(--rg-paper)] border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] placeholder:text-[var(--rg-muted)] focus:border-[var(--rg-thread)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reimagine-company"
                      className="block text-xs font-semibold text-[var(--rg-ink)] mb-1.5"
                    >
                      Organisation
                    </label>
                    <input
                      id="reimagine-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 text-sm bg-[var(--rg-paper)] border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] placeholder:text-[var(--rg-muted)] focus:border-[var(--rg-thread)] focus:outline-none"
                    />
                  </div>
                </div>

                {emailError && (
                  <p role="alert" className="text-sm font-medium text-[var(--rg-error)]">
                    {emailError}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="reimagine-notes"
                    className="block text-xs font-semibold text-[var(--rg-ink)] mb-1.5"
                  >
                    System bottleneck or target deadline
                  </label>
                  <textarea
                    id="reimagine-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe the seam you need connected or audited."
                    className="w-full px-3 py-2 text-sm bg-[var(--rg-paper)] border border-[var(--rg-rule-strong)] text-[var(--rg-ink)] placeholder:text-[var(--rg-muted)] focus:border-[var(--rg-thread)] focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[var(--rg-thread)] text-[var(--rg-on-thread)] hover:bg-[var(--rg-thread-hover)] disabled:opacity-60 transition-colors"
                  >
                    <span>
                      {isSubmitting ? "Preparing Scope..." : "Generate Technical Scope"}
                    </span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      aria-hidden="true"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>

                  <span className="text-xs text-[var(--rg-muted)]">
                    Zero vendor lock-in · You own all code
                  </span>
                </div>
              </form>
            )}
          </section>
        </article>

        {/* Below-the-Fold Colophon: Statement Reimagination Ledger */}
        {showDiff && (
          <section
            aria-label="Design statement comparison"
            className="mt-10 border border-[var(--rg-rule-strong)] bg-[var(--rg-paper)] p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 mb-6 border-b border-[var(--rg-rule)]">
              <div>
                <h2 className="reimagine-display text-xl sm:text-2xl font-semibold text-[var(--rg-ink)]">
                  How Impeccable reimagined the Cyrolabz design statement
                </h2>
                <p className="text-sm text-[var(--rg-muted)] mt-1 max-w-[68ch]">
                  This demo applies pbakaus/impeccable&rsquo;s craft floor and
                  direction engine to replace generic SaaS glassmorphism with
                  Cyrolabz&rsquo;s core engineering thesis.
                </p>
              </div>
              <span className="text-xs font-medium text-[var(--rg-thread)]">
                Pending your approval for GitHub / Vercel deployment
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--rg-rule-strong)] text-xs font-semibold text-[var(--rg-muted)]">
                    <th className="py-3 pr-4 w-44">Dimension</th>
                    <th className="py-3 px-4">Current Site Statement</th>
                    <th className="py-3 pl-4 text-[var(--rg-ink)]">
                      Reimagined Statement (Exposed-Spine Monograph)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--rg-rule)] text-sm">
                  {STATEMENT_COMPARISON.map((row) => (
                    <tr key={row.dimension} className="align-top">
                      <th
                        scope="row"
                        className="py-4 pr-4 font-semibold text-[var(--rg-ink)] whitespace-nowrap"
                      >
                        {row.dimension}
                      </th>
                      <td className="py-4 px-4 text-[var(--rg-muted)] leading-relaxed">
                        {row.before}
                      </td>
                      <td className="py-4 pl-4 text-[var(--rg-ink-soft)] leading-relaxed">
                        {row.reimagined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

