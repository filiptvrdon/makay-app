"use server";

import { createClient } from "@/lib/supabase/server";

export type Session = {
  id: string;
  microcycle_id: string;
  microcycle_idx: number | null;
  name: string | null;
  description: string | null;
  planned_date: string | null; // date
  completed_on: string | null; // date
  created_at: string;
  updated_at: string;
};

/**
 * Load a single session by id belonging to the current coach (if row-level policies apply).
 */
export async function getSessionById(id: string): Promise<Session | null> {
  const supabase = await createClient();

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult?.user) {
    throw new Error("Unable to load user session");
  }

  const { data, error } = await supabase
    .from("sessions")
    .select(
      "id, microcycle_id, microcycle_idx, name, description, planned_date, completed_on, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Session) ?? null;
}
