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
 * Lists mesocycles for a given athlete, verifying the athlete is assigned to the current tables.
 * Throws on auth errors, missing link, or query errors.
 */
export async function listMesocyclesForAthlete(
  athleteId: string
): Promise<Mesocycle[]> {
  const supabase = await createClient();

  // Current user (tables)
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult?.user) {
    throw new Error("Unable to load user session");
  }

  const coachId = userResult.user.id;

  // Verify the athlete is linked to this tables
  const { data: link, error: linkError } = await supabase
    .from("athletes_2_coaches")
    .select("athlete_id")
    .eq("coach_id", coachId)
    .eq("athlete_id", athleteId)
    .maybeSingle();

  if (linkError) {
    throw new Error(linkError.message);
  }

  if (!link) {
    throw new Error("Athlete not found or not assigned to you");
  }

  const { data, error } = await supabase
    .from("mesocycles")
    .select(
      "id, athlete_id, coach_id, name, description, goal, start_date, end_date, created_at, updated_at"
    )
    .eq("athlete_id", athleteId)
    .eq("coach_id", coachId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Mesocycle[];
}
