"use server";

import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

const USERS2ROLES = "users_2_roles" as const;
const USERS = "users" as const;
const ROLES = "roles" as const;

export type UserRoleAssignment = {
	user_id: string;
	role_id: string;
};

export type User = {
	id: string;
	email: string;
	name: string;
};

export type Role = {
	id: string;
	role: string;
};

// Read: list users from public.users table for selection
export async function listUsers(): Promise<User[]> {
	const supabase = await createClient();
	const {data, error} = await supabase
		.from(USERS)
		.select("id, email, name")
		.order("name", {ascending: true, nullsFirst: true});
	if (error) throw new Error(error.message);
	console.log("Found:", data)
	return (data ?? []) as User[];
}

// Read: list roles from public.roles table for selection
export async function listRoles(): Promise<Role[]> {
	const supabase = await createClient();
	const {data, error} = await supabase
		.from(ROLES)
		.select("id, role")
		.order("role", {ascending: true});
	if (error) throw new Error(error.message);
	return (data ?? []) as Role[];
}

// Read: list all user-role assignments
export async function listAssignments(): Promise<UserRoleAssignment[]> {
	const supabase = await createClient();
	const {data, error} = await supabase
		.from(USERS2ROLES)
		.select("user_id, role_id")
		.order("user_id", {ascending: true})
		.order("role_id", {ascending: true});
	if (error) throw new Error(error.message);
	return (data ?? []) as UserRoleAssignment[];
}

// Create: assign a role to a user (idempotent via upsert)
export async function assignRole(formData: FormData) {
	const user_id = String(formData.get("user_id") || "").trim();
	const role_id = String(formData.get("role_id") || "").trim();
	if (!user_id) throw new Error("Missing user_id");
	if (!role_id) throw new Error("Missing role_id");

	const supabase = await createClient();
	const {error} = await supabase
		.from(USERS2ROLES)
		.upsert({user_id, role_id}, {onConflict: "user_id,role_id"});
	if (error) throw new Error(error.message);
	revalidatePath("/admin/user-roles");
}

// Delete: revoke a role from a user
export async function revokeRole(formData: FormData) {
	const user_id = String(formData.get("user_id") || "").trim();
	const role_id = String(formData.get("role_id") || "").trim();
	if (!user_id) throw new Error("Missing user_id");
	if (!role_id) throw new Error("Missing role_id");

	const supabase = await createClient();
	const {error} = await supabase
		.from(USERS2ROLES)
		.delete()
		.match({user_id, role_id});
	if (error) throw new Error(error.message);
	revalidatePath("/admin/user-roles");
}
