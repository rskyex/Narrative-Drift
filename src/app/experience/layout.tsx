"use client";

import { ReactNode } from "react";

export default function ExperienceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  );
}
