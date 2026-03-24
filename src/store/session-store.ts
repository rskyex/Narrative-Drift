"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DriftProfile, ChoiceRecord, Phase, Scenario, Choice } from "@/engine/types";
import { createInitialProfile, applyDrift } from "@/engine/drift-model";

interface SessionState {
  userName: string | null;
  initialProfile: DriftProfile;
  currentProfile: DriftProfile;
  choiceHistory: ChoiceRecord[];
  phase: Phase;
  currentScenarioIndex: number;

  setUserName: (name: string) => void;
  startExperience: () => void;
  makeChoice: (scenario: Scenario, choice: Choice) => void;
  advanceToReflection: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userName: null,
      initialProfile: createInitialProfile(),
      currentProfile: createInitialProfile(),
      choiceHistory: [],
      phase: "landing",
      currentScenarioIndex: 0,

      setUserName: (name: string) => set({ userName: name }),

      startExperience: () => set({ phase: "experience" }),

      makeChoice: (scenario: Scenario, choice: Choice) =>
        set((state) => ({
          currentProfile: applyDrift(state.currentProfile, choice.driftVectors),
          choiceHistory: [
            ...state.choiceHistory,
            {
              scenarioId: scenario.id,
              choiceId: choice.id,
              choiceLabel: choice.label,
              driftVectors: choice.driftVectors,
              day: scenario.day,
              dayName: scenario.dayName,
              chapter: scenario.chapter,
            },
          ],
          currentScenarioIndex: state.currentScenarioIndex + 1,
        })),

      advanceToReflection: () => set({ phase: "reflection" }),

      reset: () =>
        set({
          userName: null,
          initialProfile: createInitialProfile(),
          currentProfile: createInitialProfile(),
          choiceHistory: [],
          phase: "landing",
          currentScenarioIndex: 0,
        }),
    }),
    {
      name: "narrative-drift-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
