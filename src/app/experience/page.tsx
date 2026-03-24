"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/session-store";
import { getScenario } from "@/engine/narrative-engine";
import { Choice } from "@/engine/types";
import { MomentCard } from "@/components/experience/MomentCard";
import { DayTransition } from "@/components/experience/DayTransition";
import { AmbientContext } from "@/components/experience/AmbientContext";

type ViewState = "transition" | "scenario";

export default function ExperiencePage() {
  const router = useRouter();
  const { currentScenarioIndex, makeChoice, advanceToReflection } = useSessionStore();
  const [viewState, setViewState] = useState<ViewState>("transition");

  const scenario = getScenario(currentScenarioIndex);

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
    <main className="relative min-h-screen flex items-center justify-center py-20">
      <AmbientContext timeOfDay={scenario.timeOfDay} />

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {viewState === "transition" ? (
            <DayTransition
              key={`transition-${scenario.id}`}
              day={scenario.day}
              dayName={scenario.dayName}
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
    </main>
  );
}
