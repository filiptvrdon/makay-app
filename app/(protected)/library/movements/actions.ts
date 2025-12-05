"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const TABLE = "movements" as const;

function parseResourceUrls(input: string | null | undefined): string[] | null {
  if (!input) return null;
  // Split by comma or newline, trim, and remove empties
  const parts = String(input)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : null;
}

export type Movement = {
  id: string;
  name: string;
  instructions: string | null;
  resource_urls: string[] | null;
};

export async function listMovements(): Promise<Movement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, name, instructions, resource_urls")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Movement[]) ?? [];
}

export async function createMovement(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const instructions = String(formData.get("instructions") || "").trim();
  const resourceUrlsRaw = String(formData.get("resource_urls") || "");

  if (!name) throw new Error("Name is required");

  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).insert({
    name,
    instructions: instructions || null,
    resource_urls: parseResourceUrls(resourceUrlsRaw),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/movements");
}

export async function updateMovement(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const instructions = String(formData.get("instructions") || "").trim();
  const resourceUrlsRaw = String(formData.get("resource_urls") || "");

  if (!id) throw new Error("Missing movement id");
  if (!name) throw new Error("Name is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLE)
    .update({
      name,
      instructions: instructions || null,
      resource_urls: parseResourceUrls(resourceUrlsRaw),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/movements");
}

export async function deleteMovement(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Missing movement id");
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/movements");
}
