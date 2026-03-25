"use client";

import Image from "next/image";

interface LogoMarkProps {
  size?: number | string;
  className?: string;
}

/**
 * The selected logo mark image, used consistently across the experience.
 */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  const isNumeric = typeof size === "number";
  return (
    <span className={`inline-block ${className ?? ""}`} style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="Narrative Drift"
        width={isNumeric ? size : 200}
        height={isNumeric ? size : 200}
        className="w-full h-full object-contain"
        priority
      />
    </span>
  );
}
