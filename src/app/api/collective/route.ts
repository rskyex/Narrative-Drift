import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ distribution: null }, { status: 200 });
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("archetype_distribution")
    .select("final_result, n, pct");

  if (error) {
    return NextResponse.json({ distribution: null }, { status: 200 });
  }

  return NextResponse.json({ distribution: data });
}
