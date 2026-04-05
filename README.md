# Narrative Drift

An interactive narrative experience exploring how AI systems reshape human choices.

## Analytics Setup (Anonymous Data Collection)

Narrative Drift includes optional anonymous session tracking via Supabase. If the environment variables are not set, the app works normally with no tracking.

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a free project.

### 2. Run the schema

Open the SQL Editor in your Supabase dashboard and run the contents of [`supabase-schema.sql`](./supabase-schema.sql). This creates two tables:

- **`sessions`** — one row per anonymous session (id, timestamps, completion status, final archetype)
- **`events`** — ordered log of every meaningful interaction (calibration choices, zone entries, encounter choices, interludes, diagnostic stages)

### 3. Set environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

On Vercel, add these as Environment Variables in your project settings.

### 4. What is tracked

| Event Type | When | Data Captured |
|---|---|---|
| `session_start` | User clicks "Let's begin" | Session ID |
| `calibration_choice` | Each of the 5 calibration prompts | Prompt ID, chosen option ID |
| `calibration_complete` | All 5 calibration prompts answered | — |
| `zone_enter` | Entering each of the 3 zones | Zone number |
| `encounter_choice` | Each of the 9 encounter decisions | Encounter ID, chosen option ID |
| `interlude_view` | Viewing an interlude between zones | Interlude number |
| `diagnostic_reached` | Reaching the final diagnostic | — |
| `session_complete` | Viewing the credits (full completion) | Archetype designation |

### 5. Querying the data

Example queries in the Supabase SQL Editor:

```sql
-- Completion rate
select
  count(*) filter (where completed) as completed,
  count(*) as total,
  round(100.0 * count(*) filter (where completed) / count(*), 1) as pct
from sessions;

-- Most common archetype
select final_result, count(*) as n
from sessions
where completed = true
group by final_result
order by n desc;

-- Most popular choice per encounter
select step_id, option_id, count(*) as n
from events
where event_type = 'encounter_choice'
group by step_id, option_id
order by step_id, n desc;

-- Drop-off funnel
select event_type, count(distinct session_id) as sessions
from events
group by event_type
order by min(sequence);
```

### 6. Privacy

- No login required, no accounts
- Session IDs are random UUIDs generated client-side
- No IP addresses, device fingerprints, or personal data are stored
- Data is stored in your own Supabase project
- If Supabase is unreachable, the app continues working normally

## Changed Files (Analytics Feature)

| File | Change |
|---|---|
| `src/lib/analytics.ts` | **New** — Supabase client, session ID management, all tracking functions |
| `src/store/session-store.ts` | **Modified** — Added tracking calls to each state transition |
| `src/app/diagnostic/page.tsx` | **Modified** — Added session completion tracking when credits are reached |
| `supabase-schema.sql` | **New** — Database schema for sessions and events tables |
| `.env.example` | **New** — Documents required environment variables |
| `package.json` | **Modified** — Added `@supabase/supabase-js` dependency |

## Development

```bash
npm install
npm run dev
```
