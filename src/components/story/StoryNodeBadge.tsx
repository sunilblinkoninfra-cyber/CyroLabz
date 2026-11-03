"use client";

import React from "react";
import Link from "next/link";
import { getBeat, getStoryNode, getNodeStepProgress } from "@/data/storyline";

interface StoryNodeBadgeProps {
  nodeId: string;
  className?: string;
  showStep?: boolean;
}

export const StoryNodeBadge: React.FC<StoryNodeBadgeProps> = ({
  nodeId,
  className = "",
  showStep = true,
}) => {
  const node = getStoryNode(nodeId);
  if (!node) return null;

  const beat = getBeat(node.beat);
  const progress = getNodeStepProgress(node.id);

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-line bg-surface/85 backdrop-blur-md shadow-sm font-mono text-[11px] sm:text-xs text-muted ${className}`}
      aria-label={`Story Progress: Chapter ${beat.num} ${beat.name}, Node ${node.title}`}
    >
      <Link
        href={beat.href}
        className="inline-flex items-center gap-1.5 text-accent font-semibold hover:underline"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span>
          {beat.num} / {beat.name.toUpperCase()}
        </span>
      </Link>
      <span className="text-line" aria-hidden="true">
        |
      </span>
      <span className="text-ink font-medium">{node.title}</span>
      {showStep && (
        <>
          <span className="text-line" aria-hidden="true">
            •
          </span>
          <span className="text-muted tracking-tight">{progress.step}</span>
        </>
      )}
    </div>
  );
};

