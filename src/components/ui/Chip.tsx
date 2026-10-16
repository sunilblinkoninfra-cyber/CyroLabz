import React from "react";
import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Chip({ label, active, className, onClick }: ChipProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 select-none",
        "tech-border bg-surface/70 backdrop-blur-sm chamfer-sm",
        active
          ? "border-accent text-accent bg-accent/10 shadow-subtle"
          : "text-muted hover:text-ink hover:border-ink hover:bg-surface",
        onClick && "cursor-pointer",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full transition-colors duration-200",
          active ? "bg-accent shadow-subtle" : "bg-muted"
        )}
      />
      <span>{label}</span>
    </div>
  );
}
