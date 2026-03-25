"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useSessionStore, useHasHydrated } from "@/store/session-store";
import {
  getZone,
  getEncounter,
  getTotalEncounters,
  getGlobalEncounterIndex,
} from "@/engine/narrative-engine";
import { Choice } from "@/engine/types";
import { MomentCard } from "@/components/experience/MomentCard";
import { ZoneIntro } from "@/components/experience/ZoneIntro";
import { InterludeReveal } from "@/components/interlude/InterludeReveal";
import { StatusSheet } from "@/components/rpg/StatusSheet";
import { PathLog } from "@/components/rpg/PathLog";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { LogoMark } from "@/components/shared/LogoMark";

type ViewState = "zone-intro" | "encounter" | "interlude";

export default function ExperiencePage() {
  const router = useRouter();
  const {
    phase,
    currentZone,
    currentEncounterPosition,
    currentInterlude,
    currentProfile,
    baselineProfile,
    profileSnapshots,
    choiceHistory,
    userName,
    makeEncounterChoice,
    advanceEncounter,
    enterZone,
  } = useSessionStore();

  const hasHydrated = useHasHydrated();
  const [viewState, setViewState] = useState<ViewState>("zone-intro");

  const zone = getZone(currentZone);
  const encounter = getEncounter(currentZone, currentEncounterPosition);
  const totalEncounters = getTotalEncounters();

  // Handle phase-based routing
  useEffect(() => {
    if (!hasHydrated) return;
    switch (phase) {
      case "interlude":
        setViewState("interlude");
        break;
      case "diagnostic":
        router.push("/diagnostic");
        break;
      case "zone":
        setViewState("zone-intro");
        break;
      default:
        // landing, calibration, baseline — redirect home
        router.push("/");
        break;
    }
  }, [phase, router, currentZone, hasHydrated]);

  const handleZoneIntroComplete = useCallback(() => {
    setViewState("encounter");
  }, []);

  const handleChoice = useCallback(
    (choice: Choice) => {
      if (!encounter) return;
      makeEncounterChoice(encounter, choice);
      // Brief delay before advancing
      setTimeout(() => {
        advanceEncounter();
      }, 400);
    },
    [encounter, makeEncounterChoice, advanceEncounter]
  );

  // After advanceEncounter, if still in zone phase with a new encounter position, show encounter
  useEffect(() => {
    if (phase === "zone" && viewState !== "zone-intro") {
      setViewState("encounter");
    }
  }, [currentEncounterPosition, phase]);

  const handleInterludeContinue = useCallback(() => {
    const nextZone = currentInterlude + 1;
    enterZone(nextZone);
  }, [currentInterlude, enterZone]);

  if (!hasHydrated || !zone) return null;

  return (
    <main className="relative min-h-screen">
      <HeroBackground />
      <GrainOverlay />

      <div className="relative z-10 flex min-h-screen">
        {/* Left sidebar — Status Sheet & Path Log */}
        <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0 p-4 pt-8 overflow-y-auto max-h-screen sticky top-0">
          <StatusSheet
            profile={currentProfile}
            userName={userName}
            currentZone={currentZone}
            totalZones={3}
          />
          <PathLog choices={choiceHistory} compact />
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center py-20">
          <AnimatePresence mode="wait">
            {viewState === "zone-intro" && phase === "zone" && (
              <ZoneIntro
                key={`zone-intro-${zone.id}`}
                zone={zone}
                onComplete={handleZoneIntroComplete}
              />
            )}

            {viewState === "encounter" && phase === "zone" && encounter && (
              <MomentCard
                key={`encounter-${encounter.id}`}
                encounter={encounter}
                globalIndex={getGlobalEncounterIndex(currentZone, currentEncounterPosition)}
                totalEncounters={totalEncounters}
                onChoice={handleChoice}
              />
            )}

            {viewState === "interlude" && phase === "interlude" && (
              <InterludeReveal
                key={`interlude-${currentInterlude}`}
                interludeNumber={currentInterlude}
                baselineProfile={baselineProfile}
                currentProfile={currentProfile}
                previousProfile={
                  profileSnapshots.length >= 2
                    ? profileSnapshots[profileSnapshots.length - 2]?.profile
                    : baselineProfile
                }
                snapshots={profileSnapshots}
                onContinue={handleInterludeContinue}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right gutter — zone indicator */}
        <aside className="hidden lg:flex flex-col items-center justify-center w-16 flex-shrink-0">
          <div className="writing-mode-vertical text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 select-none">
            {zone.subtitle}
          </div>
        </aside>
      </div>

      {/* Fixed logo */}
      <div className="fixed top-4 left-6 z-50">
        <LogoMark size={36} className="text-drift-accent/50" />
      </div>

      {/* Progress thread */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[1px] bg-drift-border/20">
        <div
          className="h-full bg-drift-accent/35 transition-all duration-1000 ease-out"
          style={{
            width: `${(choiceHistory.length / totalEncounters) * 100}%`,
          }}
        />
      </div>
    </main>
  );
}
