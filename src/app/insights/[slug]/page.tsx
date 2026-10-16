import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { INSIGHTS_DATA, Article } from "@/data/insightsData";
import { Text3DBlock } from "@/components/ui/Text3DBlock";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(INSIGHTS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = INSIGHTS_DATA[slug];
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Cyrolabz Insights`,
    description: article.excerpt,
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article: Article | undefined = INSIGHTS_DATA[slug];

  if (!article) {
    notFound();
  }

  return (
    <article className="pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back link */}
      <div className="mb-10">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-eyebrow text-muted hover:text-ink transition-colors"
        >
          <span>←</span>
          <span>Back to Insights</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-16">
        <Text3DBlock
          headlineAs="h1"
          kicker={`CHAPTER ${article.chapterNum} / ${article.chapter.toUpperCase()}`}
          headline={article.title}
          tags={
            <div className="flex items-center gap-4 text-xs font-mono text-muted">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
              <span>•</span>
              <span className="text-accent font-semibold">Cyrolabz Architecture</span>
            </div>
          }
        />
      </div>

      {/* Article Content */}
      <div className="p-8 sm:p-12 rounded-lg border border-line bg-surface/75 space-y-6 text-base sm:text-lg text-ink font-sans leading-relaxed">
        {article.content.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Author / CTA strip */}
      <div className="mt-16 p-8 rounded border border-line/60 bg-surface/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h4 className="font-display text-lg font-semibold text-ink">
            Discuss this architecture with our team
          </h4>
          <p className="text-xs text-muted mt-1">
            We provide concrete architectural feedback and technical scope evaluations.
          </p>
        </div>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-eyebrow px-5 py-3 rounded bg-accent text-on-accent hover:bg-accent-hover font-semibold transition-colors"
          >
            Start a project
          </Link>
        </div>
      </div>
    </article>
  );
}
