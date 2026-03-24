"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/session-store";
import { getScenario, getTotalScenarios } from "@/engine/narrative-engine";
import { Choice } from "@/engine/types";
import { MomentCard } from "@/components/experience/MomentCard";
import { DayTransition } from "@/components/experience/DayTransition";
import { AmbientContext } from "@/components/experience/AmbientContext";
import { StatusSheet } from "@/components/rpg/StatusSheet";
import { PathLog } from "@/components/rpg/PathLog";

type ViewState = "transition" | "scenario";

export default function ExperiencePage() {
  const router = useRouter();
  const {
    currentScenarioIndex,
    makeChoice,
    advanceToReflection,
    currentProfile,
    choiceHistory,
    userName,
  } = useSessionStore();
  const [viewState, setViewState] = useState<ViewState>("transition");

  const scenario = getScenario(currentScenarioIndex);
  const totalChapters = getTotalScenarios();

  useEffect(() => {
    if (!scenario) {
      advanceToReflection();
      router.push("/reflection");
    }
  }, [scenario, advanceToReflection, router]);

  const handleTransitionComplete = useCallback(() => {
    setViewState("scenario");
  }, []);

  const handleChoice = useCallback(
    (choice: Choice) => {
      if (!scenario) return;
      makeChoice(scenario, choice);
      setViewState("transition");
    },
    [scenario, makeChoice]
  );

  if (!scenario) return null;

  return (
    <main className="relative min-h-screen">
      <AmbientContext timeOfDay={scenario.timeOfDay} />

      {/* RPG Layout: sidebar + main content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left sidebar — Status Sheet & Path Log (hidden on small screens) */}
        <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0 p-4 pt-8 overflow-y-auto max-h-screen sticky top-0">
          <StatusSheet
            profile={currentProfile}
            userName={userName}
            currentChapter={scenario.chapter.number}
            totalChapters={totalChapters}
          />
          <PathLog choices={choiceHistory} compact />
        </aside>

        {/* Main encounter area */}
        <div className="flex-1 flex items-center justify-center py-20">
          <AnimatePresence mode="wait">
            {viewState === "transition" ? (
              <DayTransition
                key={`transition-${scenario.id}`}
                day={scenario.day}
                dayName={scenario.dayName}
                chapter={scenario.chapter}
                onComplete={handleTransitionComplete}
              />
            ) : (
              <MomentCard
                key={`scenario-${scenario.id}`}
                scenario={scenario}
                onChoice={handleChoice}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right gutter — chapter zone indicator (hidden on small screens) */}
        <aside className="hidden lg:flex flex-col items-center justify-center w-16 flex-shrink-0">
          <div className="writing-mode-vertical text-[10px] uppercase tracking-[0.3em] text-drift-muted/20 select-none">
            {scenario.chapter.zone}
          </div>
        </aside>
      </div>
    </main>
  );
}
