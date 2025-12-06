"use server";

import { createClient } from "@/lib/supabase/server";

export type Athlete = {
  id: string;
  name: string | null;
  created_at: string;
};

/**
 * Returns athlete assigned to the currently authenticated tables.
 * Throws an Error if session lookup or queries fail.
 */
export async function listMyAthletes(): Promise<Athlete[]> {
  const supabase = await createClient();

  // Get current tables (authenticated user)
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult?.user) {
    throw new Error("Unable to load user session");
  }

  const coachId = userResult.user.id;

  // Fetch athlete ids related to the current tables from the junction table
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

/**
 * Returns a single athlete assigned to the current tables by id.
 * Throws if the user is not authenticated, athlete is not assigned to this tables, or on query errors.
 */
export async function getAthleteById(id: string): Promise<Athlete> {
  const supabase = await createClient();

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
    .eq("athlete_id", id)
    .maybeSingle();

  if (linkError) {
    throw new Error(linkError.message);
  }

  if (!link) {
    throw new Error("Athlete not found or not assigned to you");
  }

  const { data: athlete, error: athleteError } = await supabase
    .from("athletes")
    .select("id, name, created_at")
    .eq("id", id)
    .maybeSingle();

  if (athleteError) {
    throw new Error(athleteError.message);
  }

  if (!athlete) {
    throw new Error("Athlete not found");
  }

  return athlete as Athlete;
}
