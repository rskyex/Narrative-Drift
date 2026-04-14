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

      {/* Radial + vertical gradient for readability without flat overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)",
            "linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.5) 40%, rgba(10,10,10,0.75) 70%, rgba(10,10,10,0.95) 100%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
