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
    </div>
  );
}
