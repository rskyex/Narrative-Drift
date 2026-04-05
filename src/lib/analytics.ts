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
  sequence: number;
}

// ─── Supabase client (singleton) ─────────────────────────────────

let supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

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

// ─── Core tracking functions ─────────────────────────────────────

async function trackEvent(event: TrackingEvent): Promise<void> {
  const client = getClient();
  if (!client) return;

  try {
    await client.from("events").insert({
      session_id: event.session_id,
      event_type: event.event_type,
      step_id: event.step_id ?? null,
      option_id: event.option_id ?? null,
      result_id: event.result_id ?? null,
      sequence: event.sequence,
    });
  } catch {
    // Analytics failure must never break the user experience
  }
}

export async function trackSessionStart(): Promise<void> {
  const client = getClient();
  if (!client) return;

  const sessionId = getOrCreateSessionId();

  try {
    await client.from("sessions").insert({
      id: sessionId,
      started_at: new Date().toISOString(),
      completed: false,
    });
  } catch {
    // Silently fail
  }

  await trackEvent({
    session_id: sessionId,
    event_type: "session_start",
    sequence: nextSequence(),
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
    sequence: nextSequence(),
  });
}

export async function trackCalibrationComplete(): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "calibration_complete",
    sequence: nextSequence(),
  });
}

export async function trackZoneEnter(zoneId: number): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "zone_enter",
    step_id: `zone-${zoneId}`,
    sequence: nextSequence(),
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
    sequence: nextSequence(),
  });
}

export async function trackInterludeView(
  interludeNumber: number
): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "interlude_view",
    step_id: `interlude-${interludeNumber}`,
    sequence: nextSequence(),
  });
}

export async function trackDiagnosticReached(): Promise<void> {
  await trackEvent({
    session_id: getOrCreateSessionId(),
    event_type: "diagnostic_reached",
    sequence: nextSequence(),
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
    sequence: nextSequence(),
  });

  try {
    await client
      .from("sessions")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        final_result: finalResult,
      })
      .eq("id", sessionId);
  } catch {
    // Silently fail
  }
}
