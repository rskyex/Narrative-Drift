"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Landing page hero background using the approved face-free visual board.
 * Restrained placement with dark overlay to preserve text readability.
 */
export function HeroBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      >
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

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
