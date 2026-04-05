import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── Types ───────────────────────────────────────────────────────

export type EventType =
  | "session_start"
  | "calibration_choice"
  | "calibration_complete"
  | "zone_enter"
  | "encounter_choice"
  | "interlude_view"
  | "diagnostic_reached"
  | "session_complete";

interface TrackingEvent {
  session_id: string;
  event_type: EventType;
  step_id?: string;
  option_id?: string;
  result_id?: string;
  sequence_index: number;
}

// ─── Supabase client (singleton) ─────────────────────────────────

let supabase: SupabaseClient | null = null;
let envWarned = false;

function getClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (!envWarned) {
      console.warn(
        "[analytics] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Tracking disabled."
      );
      envWarned = true;
    }
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}

// ─── Session ID ──────────────────────────────────────────────────

const SESSION_KEY = "narrative-drift-analytics-id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function resetSessionId(): string {
  if (typeof window === "undefined") return "";
  const id = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

// ─── Sequence counter ────────────────────────────────────────────

const SEQ_KEY = "narrative-drift-analytics-seq";

function nextSequence(): number {
  if (typeof window === "undefined") return 0;
  const current = parseInt(sessionStorage.getItem(SEQ_KEY) || "0", 10);
  const next = current + 1;
  sessionStorage.setItem(SEQ_KEY, next.toString());
  return next;
}

export function resetSequence(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SEQ_KEY, "0");
}

// ─── Session creation tracking ───────────────────────────────────
// Track which session IDs have been successfully created in the DB
// to avoid FK violations when inserting events.

let createdSessionId: string | null = null;

async function ensureSession(
  client: SupabaseClient,
  sessionId: string
): Promise<boolean> {
  if (createdSessionId === sessionId) return true;

  const { error } = await client.from("sessions").upsert(
    {
      id: sessionId,
      started_at: new Date().toISOString(),
      completed: false,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.warn("[analytics] Failed to create session:", error.message);
    return false;
  }

  createdSessionId = sessionId;
  return true;
}

// ─── Core tracking functions ─────────────────────────────────────

async function trackEvent(event: TrackingEvent): Promise<void> {
  const client = getClient();
  if (!client) return;

  // Ensure the session row exists before inserting an event (FK constraint)
  const sessionReady = await ensureSession(client, event.session_id);
  if (!sessionReady) return;

  const { error } = await client.from("events").insert({
    session_id: event.session_id,
    event_type: event.event_type,
    step_id: event.step_id ?? null,
    option_id: event.option_id ?? null,
    result_id: event.result_id ?? null,
    sequence_index: event.sequence_index,
  });

  if (error) {
    console.warn("[analytics] Failed to insert event:", error.message);
  }
}

export async function trackSessionStart(): Promise<void> {
  const sessionId = getOrCreateSessionId();

  await trackEvent({
    session_id: sessionId,
    event_type: "session_start",
    sequence_index: nextSequence(),
  });
}

export async function trackCalibrationChoice(
  promptId: string,
  choiceId: string
): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "calibration_choice",
    step_id: promptId,
    option_id: choiceId,
    sequence_index: nextSequence(),
  });
}

export async function trackCalibrationComplete(): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "calibration_complete",
    sequence_index: nextSequence(),
  });
}

export async function trackZoneEnter(zoneId: number): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "zone_enter",
    step_id: `zone-${zoneId}`,
    sequence_index: nextSequence(),
  });
}

export async function trackEncounterChoice(
  encounterId: string,
  choiceId: string
): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "encounter_choice",
    step_id: encounterId,
    option_id: choiceId,
    sequence_index: nextSequence(),
  });
}

export async function trackInterludeView(
  interludeNumber: number
): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "interlude_view",
    step_id: `interlude-${interludeNumber}`,
    sequence_index: nextSequence(),
  });
}

export async function trackDiagnosticReached(): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "diagnostic_reached",
    sequence_index: nextSequence(),
  });
}

export async function trackSessionComplete(
  finalResult: string
): Promise<void> {
  const client = getClient();
  if (!client) return;

  const sessionId = getOrCreateSessionId();

  await trackEvent({
    session_id: sessionId,
    event_type: "session_complete",
    result_id: finalResult,
    sequence_index: nextSequence(),
  });

  const { error } = await client
    .from("sessions")
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      final_result: finalResult,
    })
    .eq("id", sessionId);

  if (error) {
    console.warn("[analytics] Failed to update session:", error.message);
  }
}
