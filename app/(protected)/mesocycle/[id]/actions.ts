"use server";

import { createClient } from "@/lib/supabase/server";

export type Mesocycle = {
  id: string;
  athlete_id: string;
  coach_id: string | null;
  name: string;
  description: string | null;
  goal: string | null;
  start_date: string | null; // date
  end_date: string | null; // date
  created_at: string;
  updated_at: string;
};

/**
 * Load a single mesocycle by id belonging to the current coach.
 */
export async function getMesocycleById(id: string): Promise<Mesocycle | null> {
  const supabase = await createClient();

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult?.user) {
    throw new Error("Unable to load user session");
  }

  const coachId = userResult.user.id;

  const { data, error } = await supabase
    .from("mesocycles")
    .select(
      "id, athlete_id, coach_id, name, description, goal, start_date, end_date, created_at, updated_at"
    )
    .eq("id", id)
    .eq("coach_id", coachId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Mesocycle) ?? null;
}
