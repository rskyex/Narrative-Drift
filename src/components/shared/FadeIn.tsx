"use client";

import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

/**
 * CSS-only fade-in to avoid framer-motion SSR hydration flash.
 * Text is immediately in the DOM and visible after the CSS animation runs,
 * even if JS is slow to load.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className,
}: FadeInProps) {
  return (
    <div
      className={`fade-in-up ${className ?? ""}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
