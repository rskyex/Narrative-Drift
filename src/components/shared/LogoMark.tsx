"use client";

import Image from "next/image";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * The selected logo mark image, used consistently across the experience.
 */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <span className={`inline-block ${className ?? ""}`} style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="Narrative Drift"
        width={size}
        height={size}
        className="w-full h-full object-contain"
        priority
      />
    </span>
  );
}
