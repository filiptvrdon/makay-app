// app/(protected)/admin/user-roles/page.tsx
import {
	assignRole,
	revokeRole,
	listAssignments,
	listRoles as listRolesAction,
	listUsers as listUsersAction
} from "./actions";

type User = {
	id: string;
	email: string;
	name: string;
};

type Role = {
	id: string;
	role: string;
};

type User2Role = {
	user_id: string;
	role_id: string;
};

export default async function UserRolesPage() {
	const [users, roles, assignments] = (await Promise.all([
		listUsersAction(),
		listRolesAction(),
		listAssignments(),
	])) as [User[], Role[], User2Role[]];

	const userLabel = (u: User) => u.email ?? u.id;
	const usersById = new Map(users.map((u) => [u.id, u] as const));
	const rolesById = new Map(roles.map((r) => [r.id, r] as const));

	const hasData = users.length > 0 && roles.length > 0;

	return (
		<div className="space-y-8">
			<header className="flex items-end justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-100">User roles</h1>
					<p className="text-sm text-slate-400">Assign and revoke roles for users.</p>
				</div>
				<a
					href="/admin"
					className="text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4"
				>
					← Back to Admin
				</a>
			</header>

			{/* Assign role */}
			<section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
				<h2 className="mb-3 text-lg font-semibold text-slate-100">Assign role to user</h2>
				{!hasData ? (
					<p className="text-sm text-slate-400">
						You need at least one user and one role to create assignments.
					</p>
				) : (
					<form action={assignRole} className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<select
							name="user_id"
							className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
							required
							defaultValue=""
						>
							<option value="" disabled>
								Select user
							</option>
							{users.map((u) => (
								<option key={u.id} value={u.id}>
									{userLabel(u)}
								</option>
							))}
						</select>
						<select
							name="role_id"
							className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
							required
							defaultValue=""
						>
							<option value="" disabled>
								Select role
							</option>
							{roles.map((r) => (
								<option key={r.id} value={r.id}>
									{r.role}
								</option>
							))}
						</select>
						<button
							type="submit"
							className="inline-flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 sm:w-auto"
						>
							Assign
						</button>
					</form>
				)}
			</section>

			{/* Current assignments */}
			<section className="rounded-lg border border-slate-800 overflow-hidden">
				<table className="min-w-full divide-y divide-slate-800">
					<thead className="bg-slate-900/60">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
							User
						</th>
						<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
							Role
						</th>
						<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
							Actions
						</th>
					</tr>
					</thead>
					<tbody className="divide-y divide-slate-800 bg-slate-900/20">
					{assignments.length === 0 && (
						<tr>
							<td colSpan={3} className="px-4 py-6 text-center text-slate-400">
								No assignments yet.
							</td>
						</tr>
					)}
					{assignments.map((a, idx) => {
						const u = usersById.get(a.user_id);
						const r = rolesById.get(a.role_id);
						return (
							<tr key={`${a.user_id}-${a.role_id}-${idx}`} className="hover:bg-slate-900/40">
								<td className="px-4 py-3 align-top">
									<div className="flex flex-col">
										<span className="text-slate-100 text-sm">{u ? userLabel(u) : a.user_id}</span>
										<span className="text-xs text-slate-500">
                        <code className="select-all break-all">{a.user_id}</code>
                      </span>
									</div>
								</td>
								<td className="px-4 py-3 align-top">
									<div className="flex flex-col">
										<span className="text-slate-100 text-sm">{r ? r.role : a.role_id}</span>
										<span className="text-xs text-slate-500">
                        <code className="select-all break-all">{a.role_id}</code>
                      </span>
									</div>
								</td>
								<td className="px-4 py-3 align-top">
									<form action={revokeRole} className="flex justify-end gap-2">
										<input type="hidden" name="user_id" value={a.user_id}/>
										<input type="hidden" name="role_id" value={a.role_id}/>
										<button
											type="submit"
											className="inline-flex items-center justify-center rounded-md border border-red-900/60 bg-red-900/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/50"
										>
											Revoke
										</button>
									</form>
								</td>
							</tr>
						);
					})}
					</tbody>
				</table>
			</section>
		</div>
	);
}
