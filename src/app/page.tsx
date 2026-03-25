"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/shared/FadeIn";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { LogoMark } from "@/components/shared/LogoMark";
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
      <HeroBackground />
      <GrainOverlay />

      <AnimatePresence mode="wait">
        {!exiting && (
          <FadeIn key="landing" className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-8">
              <LogoMark size={40} className="text-drift-accent/40" />
            </div>

            <h1 className="wordmark text-4xl sm:text-5xl md:text-6xl mb-14">
              Narrative Drift
            </h1>

            <div className="text-lg sm:text-xl leading-[1.7] text-drift-muted mb-20 max-w-prose mx-auto">
              <TypeWriter
                text="You are about to enter three zones of mediated experience. In each, an AI system will shape what you see, what you choose, and who you become. The changes will be imperceptible. None will feel consequential. That is precisely the point."
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
                      placeholder="Enter a subject identifier"
                      className="w-full max-w-xs bg-transparent border-b border-drift-border text-drift-text text-center text-lg py-3 placeholder:text-drift-muted/50 focus:outline-none focus:border-drift-accent/50 transition-colors"
                      autoFocus
                    />

                    <button
                      onClick={handleBegin}
                      className="text-drift-muted/70 hover:text-drift-text text-[11px] tracking-[0.25em] uppercase transition-all duration-500 py-3 px-8 border border-drift-border/0 hover:border-drift-border/30 rounded"
                    >
                      Initiate
                    </button>
                  </div>
                </FadeIn>
              )}
            </AnimatePresence>
          </FadeIn>
        )}
      </AnimatePresence>

      {exiting && (
        <div className="fixed inset-0 bg-drift-bg transition-opacity duration-700" />
      )}
    </main>
  );
}
