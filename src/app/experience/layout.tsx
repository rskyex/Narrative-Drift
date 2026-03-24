"use client";

import { ReactNode } from "react";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { ProgressThread } from "@/components/experience/ProgressThread";

export default function ExperienceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <GrainOverlay />
      <ProgressThread />
      {children}
    </div>
  );
}
