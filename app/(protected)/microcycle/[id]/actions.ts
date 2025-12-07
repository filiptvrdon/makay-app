"use server";

import { createClient } from "@/lib/supabase/server";

export type Microcycle = {
  id: string;
  mesocycle_id: string;
  mesocycle_idx: number;
  name: string;
  description: string | null;
  start_date: string | null; // date
  end_date: string | null; // date
  created_at: string;
  updated_at: string;
};

export type SessionListItem = {
  id: string;
  microcycle_idx: number | null;
  name: string | null;
  planned_date: string | null; // date
  completed_on: string | null; // date
  created_at: string;
};

/**
 * Load a single mesocycle by id belonging to the current coach.
 */
export async function getMicrocycleById(id: string): Promise<Microcycle | null> {
  const supabase = await createClient();

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult?.user) {
    throw new Error("Unable to load user session");
  }

  const { data, error } = await supabase
    .from("microcycles")
    .select(
      "id, mesocycle_id, mesocycle_idx, name, description, start_date, end_date, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Microcycle) ?? null;
}

/**
 * Load sessions for a given microcycle id.
 */
export async function getSessionsForMicrocycle(
  microcycleId: string
): Promise<SessionListItem[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("id, microcycle_idx, name, planned_date, completed_on, created_at")
    .eq("microcycle_id", microcycleId)
    .order("microcycle_idx", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SessionListItem[]) ?? null;
}
