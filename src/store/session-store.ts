"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState, useEffect } from "react";
import {
  DriftProfile,
  ChoiceRecord,
  ProfileSnapshot,
  Phase,
  Choice,
  Encounter,
} from "@/engine/types";
import { createInitialProfile, applyDrift, getProfileSnapshots } from "@/engine/drift-model";
import { calibrationPrompts } from "@/engine/calibration";
import { getTotalZones, getZoneEncounterCount } from "@/engine/narrative-engine";
import {
  trackSessionStart,
  trackCalibrationChoice,
  trackCalibrationComplete,
  trackZoneEnter,
  trackEncounterChoice,
  trackInterludeView,
  trackDiagnosticReached,
  resetSessionId,
  resetSequence,
} from "@/lib/analytics";

interface SessionState {
  userName: string | null;

  /** Profile after calibration (the "before" snapshot) */
  baselineProfile: DriftProfile;
  /** Live profile that accumulates all drift */
  currentProfile: DriftProfile;
  /** Snapshots captured at zone boundaries */
  profileSnapshots: ProfileSnapshot[];

  choiceHistory: ChoiceRecord[];
  phase: Phase;

  /** Calibration progress */
  calibrationIndex: number;

  /** Current zone (1-3) */
  currentZone: number;
  /** Current encounter position within the zone (1-3) */
  currentEncounterPosition: number;
  /** Which interlude we're on (1-3) */
  currentInterlude: number;

  // Replay mode
  isReplaying: boolean;
  replayFromEncounterId: string | null;
  replayProfile: DriftProfile | null;
  replayChoiceHistory: ChoiceRecord[];

  // Actions
  setUserName: (name: string) => void;
  startCalibration: () => void;
  makeCalibrationChoice: (choice: Choice) => void;
  completeCalibration: () => void;
  enterZone: (zoneId: number) => void;
  makeEncounterChoice: (encounter: Encounter, choice: Choice) => void;
  advanceEncounter: () => void;
  enterInterlude: (interludeNumber: number) => void;
  advanceToDiagnostic: () => void;
  startReplay: (fromEncounterId: string) => void;
  makeReplayChoice: (encounter: Encounter, choice: Choice) => void;
  exitReplay: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      userName: null,
      baselineProfile: createInitialProfile(),
      currentProfile: createInitialProfile(),
      profileSnapshots: [],
      choiceHistory: [],
      phase: "landing",
      calibrationIndex: 0,
      currentZone: 1,
      currentEncounterPosition: 1,
      currentInterlude: 1,

      isReplaying: false,
      replayFromEncounterId: null,
      replayProfile: null,
      replayChoiceHistory: [],

      setUserName: (name: string) => set({ userName: name }),

      startCalibration: () => {
        set({ phase: "calibration", calibrationIndex: 0 });
        trackSessionStart();
      },

      makeCalibrationChoice: (choice: Choice) =>
        set((state) => {
          const newProfile = applyDrift(state.currentProfile, choice.driftVectors);
          const nextIndex = state.calibrationIndex + 1;
          const prompt = calibrationPrompts[state.calibrationIndex];
          if (prompt) {
            trackCalibrationChoice(prompt.id, choice.id);
          }
          return {
            currentProfile: newProfile,
            calibrationIndex: nextIndex,
          };
        }),

      completeCalibration: () =>
        set((state) => {
          trackCalibrationComplete();
          return {
            phase: "baseline",
            baselineProfile: { ...state.currentProfile },
            profileSnapshots: [
              {
                profile: { ...state.currentProfile },
                label: "Baseline Self",
                zoneId: 0,
              },
            ],
          };
        }),

      enterZone: (zoneId: number) => {
        trackZoneEnter(zoneId);
        return set({
          phase: "zone",
          currentZone: zoneId,
          currentEncounterPosition: 1,
        });
      },

      makeEncounterChoice: (encounter: Encounter, choice: Choice) =>
        set((state) => {
          const newProfile = applyDrift(state.currentProfile, choice.driftVectors);
          trackEncounterChoice(encounter.id, choice.id);
          return {
            currentProfile: newProfile,
            choiceHistory: [
              ...state.choiceHistory,
              {
                encounterId: encounter.id,
                choiceId: choice.id,
                choiceLabel: choice.label,
                driftVectors: choice.driftVectors,
                zoneId: encounter.zoneId,
                zoneTitle: `Zone ${encounter.zoneId}`,
              },
            ],
          };
        }),

      advanceEncounter: () =>
        set((state) => {
          const zoneEncounterCount = getZoneEncounterCount(state.currentZone);
          const nextPosition = state.currentEncounterPosition + 1;

          if (nextPosition > zoneEncounterCount) {
            // Zone complete — snapshot and move to interlude or diagnostic
            const totalZones = getTotalZones();
            const snapshot: ProfileSnapshot = {
              profile: { ...state.currentProfile },
              label: `After Zone ${state.currentZone}`,
              zoneId: state.currentZone,
            };

            if (state.currentZone >= totalZones) {
              // All zones complete — go to diagnostic
              trackDiagnosticReached();
              return {
                profileSnapshots: [...state.profileSnapshots, snapshot],
                phase: "diagnostic",
              };
            } else {
              // Go to interlude
              trackInterludeView(state.currentZone);
              return {
                profileSnapshots: [...state.profileSnapshots, snapshot],
                phase: "interlude",
                currentInterlude: state.currentZone,
              };
            }
          }

          return { currentEncounterPosition: nextPosition };
        }),

      enterInterlude: (interludeNumber: number) => {
        trackInterludeView(interludeNumber);
        return set({
          phase: "interlude",
          currentInterlude: interludeNumber,
        });
      },

      advanceToDiagnostic: () => {
        trackDiagnosticReached();
        return set({ phase: "diagnostic" });
      },

      startReplay: (fromEncounterId: string) =>
        set((state) => {
          const divergeIndex = state.choiceHistory.findIndex(
            (c) => c.encounterId === fromEncounterId
          );
          const choicesBefore = divergeIndex > 0
            ? state.choiceHistory.slice(0, divergeIndex)
            : [];
          // Reconstruct profile at the divergence point
          const snapshots = getProfileSnapshots(choicesBefore, state.baselineProfile);
          const profileAtDivergence = snapshots.length > 0
            ? { ...snapshots[snapshots.length - 1].profile }
            : { ...state.baselineProfile };
          return {
            isReplaying: true,
            replayFromEncounterId: fromEncounterId,
            replayProfile: profileAtDivergence,
            replayChoiceHistory: [...choicesBefore],
          };
        }),

      makeReplayChoice: (encounter: Encounter, choice: Choice) =>
        set((state) => {
          if (!state.replayProfile) return {};
          const newProfile = applyDrift(state.replayProfile, choice.driftVectors);
          return {
            replayProfile: newProfile,
            replayChoiceHistory: [
              ...state.replayChoiceHistory,
              {
                encounterId: encounter.id,
                choiceId: choice.id,
                choiceLabel: choice.label,
                driftVectors: choice.driftVectors,
                zoneId: encounter.zoneId,
                zoneTitle: `Zone ${encounter.zoneId}`,
              },
            ],
          };
        }),

      exitReplay: () =>
        set({
          isReplaying: false,
          replayFromEncounterId: null,
          replayProfile: null,
          replayChoiceHistory: [],
        }),

      reset: () => {
        resetSessionId();
        resetSequence();
        return set({
          userName: null,
          baselineProfile: createInitialProfile(),
          currentProfile: createInitialProfile(),
          profileSnapshots: [],
          choiceHistory: [],
          phase: "landing",
          calibrationIndex: 0,
          currentZone: 1,
          currentEncounterPosition: 1,
          currentInterlude: 1,
          isReplaying: false,
          replayFromEncounterId: null,
          replayProfile: null,
          replayChoiceHistory: [],
        });
      },
    }),
    {
      name: "narrative-drift-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

/**
 * Returns true only after the Zustand persist middleware has finished
 * rehydrating state from sessionStorage. Route guards must wait for
 * this before redirecting, otherwise they read default state ("landing")
 * and incorrectly push to "/".
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // persist API is only available on the client
    if (useSessionStore.persist?.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useSessionStore.persist?.onFinishHydration(() =>
        setHydrated(true)
      );
      return unsub;
    }
  }, []);

  return hydrated;
}
