"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/shared/FadeIn";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { useSessionStore } from "@/store/session-store";

export default function LandingPage() {
  const router = useRouter();
  const { setUserName, startCalibration, reset } = useSessionStore();
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleBegin = useCallback(() => {
    if (name.trim()) {
      setUserName(name.trim());
    }
    setExiting(true);
    setTimeout(() => {
      reset();
      if (name.trim()) {
        setUserName(name.trim());
      }
      startCalibration();
      router.push("/calibration");
    }, 800);
  }, [name, setUserName, startCalibration, reset, router]);

  const handlePremiseComplete = useCallback(() => {
    setShowInput(true);
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <GrainOverlay />

      <AnimatePresence mode="wait">
        {!exiting && (
          <FadeIn key="landing" className="text-center max-w-2xl mx-auto">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight mb-12 text-drift-text">
              Narrative Drift
            </h1>

            <div className="text-lg sm:text-xl leading-relaxed text-drift-muted mb-16 max-w-prose mx-auto">
              <TypeWriter
                text="You are about to enter three zones of mediated experience. In each, an AI system will shape what you see, what you choose, and who you become. The changes will be small. None will feel consequential. That is the point."
                speed={30}
                onComplete={handlePremiseComplete}
              />
            </div>

            <AnimatePresence>
              {showInput && (
                <FadeIn key="input-section" delay={0.3} className="space-y-8">
                  <div className="flex flex-col items-center gap-6">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleBegin()}
                      placeholder="What should we call you?"
                      className="w-full max-w-xs bg-transparent border-b border-drift-border text-drift-text text-center text-lg py-3 placeholder:text-drift-muted/50 focus:outline-none focus:border-drift-accent/50 transition-colors"
                      autoFocus
                    />

                    <button
                      onClick={handleBegin}
                      className="text-drift-muted hover:text-drift-text text-sm tracking-widest uppercase transition-colors duration-300 py-2 px-6"
                    >
                      Begin
                    </button>
                  </div>
                </FadeIn>
              )}
            </AnimatePresence>
          </FadeIn>
        )}
      </AnimatePresence>

      {exiting && (
        <div className="fixed inset-0 bg-drift-bg animate-pulse" />
      )}
    </main>
  );
}
