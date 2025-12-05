"use server";

import { createClient } from "@/lib/supabase/server";

export type Athlete = {
  id: string;
  name: string | null;
  created_at: string;
};

/**
 * Returns athletes assigned to the currently authenticated coach.
 * Throws an Error if session lookup or queries fail.
 */
export async function listMyAthletes(): Promise<Athlete[]> {
  const supabase = await createClient();

  // Get current coach (authenticated user)
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult?.user) {
    throw new Error("Unable to load user session");
  }

  const coachId = userResult.user.id;

  // Fetch athlete ids related to the current coach from the junction table
  const { data: links, error: linksError } = await supabase
    .from("athletes_2_coaches")
    .select("athlete_id")
    .eq("coach_id", coachId);

  if (linksError) {
    throw new Error(linksError.message);
  }

  const athleteIds = (links ?? []).map((l: { athlete_id: string }) => l.athlete_id);
  if (athleteIds.length === 0) return [];

  const { data: athletesData, error: athletesError } = await supabase
    .from("athletes")
    .select("id, name, created_at")
    .in("id", athleteIds)
    .order("created_at", { ascending: false });

  if (athletesError) {
    throw new Error(athletesError.message);
  }

  return (athletesData ?? []) as Athlete[];
}
