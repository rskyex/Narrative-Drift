"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useSessionStore, useHasHydrated } from "@/store/session-store";
import { zones } from "@/engine/zones";
import { Choice, Encounter } from "@/engine/types";
import { MomentCard } from "@/components/experience/MomentCard";
import { ZoneIntro } from "@/components/experience/ZoneIntro";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { LogoMark } from "@/components/shared/LogoMark";

type ReplayView = "zone-intro" | "encounter";

export default function ReplayPage() {
  const router = useRouter();
  const {
    isReplaying,
    replayFromEncounterId,
    replayChoiceHistory,
    makeReplayChoice,
  } = useSessionStore();
  const hasHydrated = useHasHydrated();

  // Build the ordered list of encounters from the divergence point onward
  const remainingEncounters = useMemo(() => {
    const allEncounters: Encounter[] = [];
    for (const zone of zones) {
      for (const enc of zone.encounters) {
        allEncounters.push(enc);
      }
    }
    const divergeIndex = allEncounters.findIndex(
      (e) => e.id === replayFromEncounterId
    );
    if (divergeIndex === -1) return allEncounters;
    return allEncounters.slice(divergeIndex);
  }, [replayFromEncounterId]);

  // How many replay choices have been made (starting from the divergence point)
  const replayChoicesMade = useMemo(() => {
    if (!replayFromEncounterId) return 0;
    const divergeIndex = replayChoiceHistory.findIndex(
      (c) => c.encounterId === replayFromEncounterId
    );
    if (divergeIndex === -1) {
      // No replay choices yet for encounters at/after divergence point
      // Count choices that are in remainingEncounters
      const remainingIds = new Set(remainingEncounters.map((e) => e.id));
      return replayChoiceHistory.filter((c) => remainingIds.has(c.encounterId)).length;
    }
    return replayChoiceHistory.length - divergeIndex;
  }, [replayChoiceHistory, replayFromEncounterId, remainingEncounters]);

  const currentEncounterIndex = replayChoicesMade;
  const currentEncounter = remainingEncounters[currentEncounterIndex] ?? null;
  const totalReplayEncounters = remainingEncounters.length;

  // Track which zone we're in for zone intros
  const [lastSeenZoneId, setLastSeenZoneId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<ReplayView>("encounter");

  // Redirect if not replaying
  useEffect(() => {
    if (!hasHydrated) return;
    if (!isReplaying) {
      router.push("/diagnostic");
    }
  }, [hasHydrated, isReplaying, router]);

  // Show zone intro when entering a new zone
  useEffect(() => {
    if (!currentEncounter) return;
    if (currentEncounter.zoneId !== lastSeenZoneId) {
      setViewState("zone-intro");
    }
  }, [currentEncounter, lastSeenZoneId]);

  // Check if all encounters are done
  useEffect(() => {
    if (!hasHydrated || !isReplaying) return;
    if (currentEncounterIndex >= totalReplayEncounters) {
      router.push("/replay/result");
    }
  }, [currentEncounterIndex, totalReplayEncounters, hasHydrated, isReplaying, router]);

  const handleZoneIntroComplete = useCallback(() => {
    if (currentEncounter) {
      setLastSeenZoneId(currentEncounter.zoneId);
    }
    setViewState("encounter");
  }, [currentEncounter]);

  const handleChoice = useCallback(
    (choice: Choice) => {
      if (!currentEncounter) return;
      makeReplayChoice(currentEncounter, choice);
    },
    [currentEncounter, makeReplayChoice]
  );

  if (!hasHydrated || !isReplaying) return null;
  if (!currentEncounter) return null;

  const currentZone = zones.find((z) => z.id === currentEncounter.zoneId);
  // Global index for the progress display within the replay
  const globalIndex = currentEncounterIndex + 1;

  return (
    <main className="relative min-h-screen">
      <HeroBackground />
      <GrainOverlay />

      {/* Replay indicator */}
      <div className="fixed top-4 right-6 z-50">
        <p className="text-xs uppercase tracking-[0.2em] text-drift-accent/70">
          Alternate Path
        </p>
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="flex-1 flex items-center justify-center py-20">
          <AnimatePresence mode="wait">
            {viewState === "zone-intro" && currentZone && (
              <ZoneIntro
                key={`replay-zone-intro-${currentZone.id}`}
                zone={currentZone}
                onComplete={handleZoneIntroComplete}
              />
            )}

            {viewState === "encounter" && (
              <MomentCard
                key={`replay-encounter-${currentEncounter.id}`}
                encounter={currentEncounter}
                globalIndex={globalIndex}
                totalEncounters={totalReplayEncounters}
                onChoice={handleChoice}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed logo */}
      <div className="fixed top-4 left-6 z-50 hidden md:block">
        <LogoMark size={104} />
      </div>

      {/* Progress thread */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[1px] bg-drift-border/20">
        <div
          className="h-full bg-drift-accent/35 transition-all duration-1000 ease-out"
          style={{
            width: `${(currentEncounterIndex / totalReplayEncounters) * 100}%`,
          }}
        />
      </div>
    </main>
  );
}
