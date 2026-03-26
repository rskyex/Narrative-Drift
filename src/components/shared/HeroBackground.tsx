"use client";

import Image from "next/image";

/**
 * Landing page hero background using the approved face-free visual board.
 * CSS-only animation to avoid framer-motion SSR hydration flash.
 */
export function HeroBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 fade-in-up" style={{ animationDuration: "2.5s" }}>
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-drift-bg/70" />

      {/* Bottom fade to solid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, rgba(10, 10, 10, 0.6) 70%, rgba(10, 10, 10, 0.95) 100%)",
        }}
      />
    </div>
  );
}
