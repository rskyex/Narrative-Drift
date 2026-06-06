# Narrative Drift

An interactive narrative experience exploring how AI systems gradually reshape human choices and identity. Through a series of realistic AI-mediated scenarios, users discover how small algorithmic nudges accumulate into meaningful psychological drift.

## Overview

Narrative Drift guides users through a 10-phase journey where their decisions are tracked across five psychological axes. Starting with a calibration that establishes a baseline personality profile, users navigate three thematic zones — each presenting AI-mediated scenarios drawn from everyday life. By the end, the experience reveals how much their profile has shifted and classifies them into one of ten archetypes.

### The Five Axes

| Axis | Spectrum | Description |
|------|----------|-------------|
| **Autonomy** | Self-directed ↔ Externally guided | Agency in decision-making |
| **Novelty** | Familiar-seeking ↔ Novelty-seeking | Comfort with the unknown |
| **Sociality** | Independent ↔ Socially aligned | Connection to collective patterns |
| **Tempo** | Deliberate ↔ Optimized | Relationship to speed and efficiency |
| **Affect** | Reserved ↔ Expressive | Emotional openness |

### The Three Zones

| Zone | Theme | Encounters |
|------|-------|------------|
| **The Feed** | Algorithmic curation | Music playlists, news feeds, infinite scroll |
| **The Companion** | Agency delegation | Smart replies, recipe recommendations, navigation |
| **The Commons** | Civic AI | Political feeds, civic summarizers, voting guides |

### Experience Flow

```
Landing → Calibration (5 prompts) → Baseline Reveal
  → Zone 1: The Feed (3 encounters) → Interlude 1
  → Zone 2: The Companion (3 encounters) → Interlude 2
  → Zone 3: The Commons (3 encounters) → Interlude 3
  → Final Diagnostic → Closing & Credits
```

## Key Features

### Psychological Profiling
5-axis personality model with baseline calibration, real-time drift tracking, and profile snapshots at zone boundaries. Hover previews during calibration show potential drift before committing to a choice.

### Multi-Stage Diagnostic
The final reveal unfolds across 9 stages: premise, plot twist, archetype classification, timeline visualization, path log of all choices, AI intervention map (2 pages analyzing 5 mechanisms of influence), closing statement, and credits.

### Alternate Path Replay
After completing the experience, users can replay from any encounter to explore a counterfactual path. A side-by-side comparison reveals how different choices produce a different archetype and divergence measurement.

### PDF Export
Download a styled PDF of your diagnostic results — archetype, axis readings, and drift analysis — directly from the closing stage.

### Collective Context
When analytics are enabled, the diagnostic shows how your archetype compares to all previous participants via an aggregate distribution panel.

### AI Intervention Analysis
Two-page breakdown of how AI systems shaped your decisions across 5 mechanisms: Exposure Shaping, Reinforcement Loops, Memory Mediation, Preference Construction, and Judgment Acceleration.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js](https://nextjs.org/) 14 | Framework & routing |
| [React](https://react.dev/) 18 | UI rendering |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Zustand](https://github.com/pmndrs/zustand) | State management (with localStorage persistence) |
| [Recharts](https://recharts.org/) | Data visualizations |
| [jsPDF](https://github.com/parallax/jsPDF) | Client-side PDF generation |
| [Supabase](https://supabase.com/) | Optional anonymous analytics |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/rskyex/narrative-drift.git
cd narrative-drift
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                        # Next.js app router pages
│   ├── page.tsx                # Landing page
│   ├── calibration/page.tsx    # 5-prompt calibration flow
│   ├── baseline/page.tsx       # Pre-drift profile reveal
│   ├── experience/page.tsx     # Zone/encounter/interlude loop
│   ├── diagnostic/page.tsx     # Final multi-stage archetype reveal
│   ├── replay/page.tsx         # Alternate path encounter replay
│   ├── replay/result/page.tsx  # Side-by-side counterfactual comparison
│   └── api/collective/route.ts # Archetype distribution API endpoint
│
├── engine/                     # Core narrative logic
│   ├── types.ts                # TypeScript interfaces
│   ├── calibration.ts          # Calibration prompt definitions
│   ├── zones.ts                # Zone & encounter definitions
│   ├── narrative-engine.ts     # Zone/encounter lookup
│   └── drift-model.ts          # Profile math (drift vectors, snapshots)
│
├── components/
│   ├── scenes/                 # Zone-specific UI mockups (Feed, Companion, Commons)
│   ├── experience/             # Encounter cards, zone intros, progress indicators
│   ├── rpg/                    # RPG-style diagnostic displays (portraits, status sheets)
│   ├── reflection/             # Post-experience visualizations & analysis
│   │   ├── AIInterventionMap   # 2-page intervention mechanism breakdown
│   │   ├── CollectiveContext   # Aggregate archetype distribution
│   │   ├── ChoiceReplay        # Timeline of choices with drift vectors
│   │   ├── TimelineOfChange    # Zone-by-zone drift visualization
│   │   ├── ClosingStatement    # Philosophical closing text
│   │   └── ClosingCredits      # Credits & project links
│   ├── interlude/              # Between-zone reveal components
│   └── shared/                 # TypeWriter, FadeIn, GrainOverlay, HeroBackground, LogoMark
│
├── store/
│   └── session-store.ts        # Zustand store (profile, choices, phases, replay mode)
│
└── lib/
    ├── analytics.ts            # Optional Supabase tracking
    ├── generate-pdf.ts         # PDF export generation
    └── utils.ts                # Utility functions
```

## Archetypes

Based on the dominant axis of drift and its direction, users are classified into one of ten archetypes:

| Axis | Positive Direction | Negative Direction |
|------|-------------------|-------------------|
| Autonomy | The Unmediated | The Delegated |
| Novelty | The Divergent | The Convergent |
| Sociality | The Networked | The Singular |
| Tempo | The Optimized | The Unhurried |
| Affect | The Resonant | The Contained |

Users with balanced drift across all axes are classified as **The Composite**.

## Analytics Setup (Optional)

Narrative Drift includes optional anonymous session tracking via Supabase. The app works normally without it. When enabled, it also powers the Collective Context panel in the diagnostic, showing how your archetype compares to all previous participants.

### Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Run [`supabase-schema.sql`](./supabase-schema.sql) in the Supabase SQL Editor — this creates the `sessions` and `events` tables plus an `archetype_distribution` view
3. Copy `.env.example` to `.env.local` and add your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Tracked Events

| Event | Trigger |
|-------|---------|
| `session_start` | User clicks "Let's begin" |
| `calibration_choice` | Each calibration prompt answered |
| `calibration_complete` | All 5 calibration prompts answered |
| `zone_enter` | Entering a zone |
| `encounter_choice` | Each encounter decision |
| `interlude_view` | Viewing an interlude |
| `diagnostic_reached` | Reaching the final diagnostic |
| `session_complete` | Viewing credits (full completion) |

### Example Queries

```sql
-- Completion rate
SELECT
  count(*) FILTER (WHERE completed) AS completed,
  count(*) AS total,
  round(100.0 * count(*) FILTER (WHERE completed) / count(*), 1) AS pct
FROM sessions;

-- Most common archetype (also available via the archetype_distribution view)
SELECT final_result, count(*) AS n
FROM sessions
WHERE completed = true
GROUP BY final_result
ORDER BY n DESC;

-- Drop-off funnel
SELECT event_type, count(DISTINCT session_id) AS sessions
FROM events
GROUP BY event_type
ORDER BY min(sequence_index);
```

### Privacy

- No login or accounts required
- Session IDs are random UUIDs generated client-side
- No IP addresses, device fingerprints, or personal data stored
- Data lives in your own Supabase project
- App continues working if Supabase is unreachable

## License

This project is proprietary. All rights reserved.
