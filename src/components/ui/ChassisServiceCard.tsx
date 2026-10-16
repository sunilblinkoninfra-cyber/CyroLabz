"use client";

import React from "react";
import Link from "next/link";

interface ChassisServiceCardProps {
  code: string;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export const ChassisServiceCard: React.FC<ChassisServiceCardProps> = ({
  code,
  title,
  description,
  href,
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`group relative block p-3.5 sm:p-4 rounded-xl glass-card overflow-hidden ${className}`}
    >
      {/* Precision Drafting Corner Brackets */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-muted/30 group-hover:border-accent transition-colors duration-200" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-muted/30 group-hover:border-accent transition-colors duration-200" />

      {/* Specular top reflection sheen */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between gap-2.5 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border border-line/70 dark:border-white/10 bg-white/50 dark:bg-white/[0.04] text-muted group-hover:text-accent group-hover:border-accent/40 transition-colors">
            {code}
          </span>
          <span className="font-display font-medium text-ink text-sm sm:text-[14.5px] tracking-tight group-hover:text-accent transition-colors">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted group-hover:text-accent transition-colors">
          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline tracking-wider">
            EXPLORE
          </span>
          <span className="transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>

      <p className="font-sans text-xs sm:text-[12.5px] text-muted leading-relaxed line-clamp-2">
        {description}
      </p>
    </Link>
  );
};
