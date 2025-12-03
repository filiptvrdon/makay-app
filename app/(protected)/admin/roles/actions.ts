"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Helper to get the table name in a single place
const TABLE = "roles" as const;

export async function listRoles() {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).select("id, role").order("role", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createRole(formData: FormData) {
  const role = String(formData.get("role") || "").trim();
  if (!role) {
    throw new Error("Role is required");
  }
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).insert({ role });
  if (error) throw new Error(error.message);
  // Note: route groups like (protected) are not part of the URL path
  revalidatePath("/admin/roles");
}

export async function updateRole(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const role = String(formData.get("role") || "").trim();
  if (!id) throw new Error("Missing role id");
  if (!role) throw new Error("Role is required");
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/roles");
}

export async function deleteRole(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Missing role id");
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/roles");
}
