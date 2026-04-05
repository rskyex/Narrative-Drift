-- Narrative Drift — Analytics Schema
-- Run this in your Supabase SQL Editor to create the tracking tables.

-- Sessions table
create table if not exists sessions (
  id uuid primary key,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  final_result text,
  completed boolean not null default false
);

-- Events table
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  event_type text not null,
  step_id text,
  option_id text,
  result_id text,
  sequence integer not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_events_session_id on events(session_id);
create index if not exists idx_events_event_type on events(event_type);
create index if not exists idx_sessions_completed on sessions(completed);

-- Row Level Security (RLS)
-- Enable RLS but allow anonymous inserts (anon key usage)
alter table sessions enable row level security;
alter table events enable row level security;

-- Allow anonymous inserts (the app uses the anon key)
create policy "Allow anonymous insert" on sessions
  for insert with check (true);

create policy "Allow anonymous update" on sessions
  for update using (true) with check (true);

create policy "Allow anonymous insert" on events
  for insert with check (true);

-- Read access (optional — enable if you want to query from a dashboard)
-- create policy "Allow read" on sessions for select using (true);
-- create policy "Allow read" on events for select using (true);
