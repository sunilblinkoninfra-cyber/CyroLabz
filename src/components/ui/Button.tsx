import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  icon,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none group";

  const sizeClasses = {
    sm: "text-xs px-3.5 py-1.5 tracking-wider gap-2",
    md: "text-sm px-5 py-2.5 tracking-wider gap-2.5",
    lg: "text-sm sm:text-base px-7 py-3.5 tracking-wider gap-3",
  }[size];

  const variantClasses = {
    primary:
      "bg-accent hover:opacity-90 text-on-accent shadow-glow chamfer-sm active:translate-y-[1px]",
    secondary:
      "bg-transparent hover:bg-surface-subtle text-ink tech-border hover:border-ink chamfer-sm active:translate-y-[1px]",
    ghost:
      "bg-transparent hover:bg-surface-subtle text-ink",
    outline:
      "bg-surface/80 backdrop-blur-sm tech-border hover:border-accent text-ink chamfer-sm",
  }[variant];

  const classes = cn(baseClasses, sizeClasses, variantClasses, className);

  if (href) {
    return (
      <a href={href} className={classes}>
        <span>{children}</span>
        {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      <span>{children}</span>
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
    </button>
  );
}
