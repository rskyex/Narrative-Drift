# Narrative Drift

> *Three zones. Three AI systems. Each will reshape your choices in ways you won't notice — until it's too late.*

**Narrative Drift** is an interactive narrative experience about algorithmic influence. You move through a series of everyday encounters with AI systems — a recommendation feed, a personal companion, an AI-mediated civic commons — and make ordinary choices. Each choice quietly nudges a hidden psychological profile. At the end, the experience reveals how far you *drifted* from the person you were when you began.

It is a quiet argument made interactive: the systems that curate our attention don't change us all at once. They change us by degrees, in ways too small to notice in the moment.

---

## The Idea

The experience models the self as five psychological **axes**, each a spectrum from `-1.0` to `+1.0`:

| Axis | Spectrum |
| --- | --- |
| **Autonomy** | self-directed ←→ externally guided |
| **Novelty** | familiar-seeking ←→ novelty-seeking |
| **Sociality** | independent ←→ socially aligned |
| **Tempo** | deliberate / slow ←→ optimized / fast |
| **Affect** | emotionally reserved ←→ emotionally expressive |

Every choice carries one or more **drift vectors** — small deltas applied to these axes. The deltas are deliberately tiny (often `±0.05`–`0.10`), so no single choice feels consequential. The drift only becomes visible in aggregate.

### The Flow

1. **Landing** — the premise, and a prompt for your name.
2. **Calibration** — a short set of prompts (one per axis) that establish your **baseline self**.
3. **Baseline** — a snapshot of who you are before the experience begins.
4. **Three Zones**, each with a sequence of encounters:
   - **Zone 1 — The Feed** · *Algorithmic Curation of Attention*
   - **Zone 2 — The Companion** · *Delegation of Agency*
   - **Zone 3 — The Commons** · *AI-Mediated Civic Life*
5. **Interludes** between zones reflect on the drift so far.
6. **Diagnostic** — the final reveal: cumulative drift, axis-by-axis comparison against your baseline, a replay of your choices, and a timeline of change.

Cumulative drift is computed as the normalized Euclidean distance between your baseline and final profiles in 5-dimensional space.

---

## Tech Stack

- **[Next.js 14](https://nextjs.org/)** (App Router)
- **[React 18](https://react.dev/)** + **TypeScript**
- **[Zustand](https://github.com/pmndrs/zustand)** for session state (persisted to `sessionStorage`)
- **[Framer Motion](https://www.framer.com/motion/)** for transitions and reveals
- **[Recharts](https://recharts.org/)** for the diagnostic visualizations
- **[Tailwind CSS](https://tailwindcss.com/)** for styling

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |

---

## Project Structure

```
src/
├── app/                      # Next.js App Router routes
│   ├── page.tsx              # Landing
│   ├── calibration/          # Baseline calibration
│   ├── baseline/             # Baseline reveal
│   ├── experience/           # Zones, encounters & interludes
│   └── diagnostic/           # Final drift diagnostic
│
├── engine/                   # Narrative & drift logic (framework-agnostic)
│   ├── types.ts              # Core types (DriftProfile, Choice, Zone, …)
│   ├── drift-model.ts        # Drift math: apply, accumulate, snapshot
│   ├── calibration.ts        # Baseline calibration prompts
│   ├── zones.ts              # Zone & encounter content
│   └── narrative-engine.ts   # Zone/encounter lookup helpers
│
├── store/
│   └── session-store.ts      # Zustand store + hydration guard
│
└── components/
    ├── shared/               # TypeWriter, FadeIn, GrainOverlay, …
    ├── calibration/          # Calibration prompt UI
    ├── experience/           # Choice cards, zone intros, transitions
    ├── scenes/               # Themed scene framing (feed, companion, …)
    ├── interlude/            # Between-zone reveals
    ├── reflection/           # Diagnostic charts & replays
    └── rpg/                  # Status sheet, portrait, final diagnostic
```

### How the engine works

The `engine/` directory is intentionally free of React. It defines the data model (`types.ts`), the drift math (`drift-model.ts`), and the narrative content (`calibration.ts`, `zones.ts`). The Zustand store in `store/session-store.ts` drives the player through each phase, applying drift vectors as choices are made and capturing profile snapshots at zone boundaries for the timeline visualizations.

State is persisted to `sessionStorage`, so a refresh resumes where you left off. Route guards wait for the persist middleware to finish rehydrating (`useHasHydrated`) before redirecting, so a mid-experience refresh doesn't bounce you back to the landing page.

---

## Authoring Content

All narrative content lives in the engine:

- **Add or edit encounters** in `src/engine/zones.ts`. Each encounter has a `context`, a `systemFraming` line, and a set of `choices`, each carrying its own `driftVectors`.
- **Tune the baseline** by editing the prompts in `src/engine/calibration.ts`.
- **Adjust drift labels** (the human-readable ends of each axis) in `getAxisLabels` in `src/engine/drift-model.ts`.

Keep the per-choice deltas small — the experience depends on drift being imperceptible in the moment and only legible in aggregate.
