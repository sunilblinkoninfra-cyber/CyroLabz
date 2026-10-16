import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <div className="inline-flex items-center gap-3">
        <span className="w-2 h-2 bg-ink inline-block transform rotate-45" />
        <span className="text-xs uppercase font-mono tracking-eyebrow text-muted font-semibold">
          {eyebrow}
        </span>
        <span className="h-[1px] w-12 bg-line" />
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium tracking-tight text-ink leading-[1.12]">
        {title}
      </h2>

      {description && (
        <p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-2xl font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
