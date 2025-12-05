// app/(protected)/admin/roles/page.tsx
import {listRoles, createRole, updateRole, deleteRole} from "./actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import PageHeader from "@/components/page/PageHeader";

type Role = {
	id: string;
	role: string;
};

export default async function RolesPage() {
	const roles = (await listRoles()) as Role[];

	return (
		<div className="space-y-8">
			<PageHeader
				title="Roles"
				subtitle="Create, edit and delete roles."
				href="/admin"
				backLabel="← Back to Admin"
			/>

			{/* Create role */}
			<section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
				<h2 className="mb-3 text-lg font-semibold text-slate-100">Create role</h2>
				<form action={createRole} className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<input
						type="text"
						name="role"
						placeholder="Role name (e.g. admin)"
						className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
						required
					/>
 				<Button
 					type="submit"
 					className="inline-flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 sm:w-auto"
 				>
 					Add role
 				</Button>
 				</form>
 			</section>

			{/* List and edit roles */}
			<section className="rounded-lg border border-slate-800 overflow-hidden">
				<Table className="min-w-full divide-y divide-slate-800">
					<TableHeader className="bg-slate-900/60">
						<TableRow>
							<TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
								Role
							</TableHead>
							<TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="divide-y divide-slate-800 bg-slate-900/20">
						{roles.length === 0 && (
							<TableRow>
								<TableCell colSpan={3} className="px-4 py-6 text-center text-slate-400">
									No roles yet.
								</TableCell>
							</TableRow>
						)}
						{roles.map((r) => (
							<TableRow key={r.id} className="hover:bg-slate-900/40">
								<TableCell className="px-4 py-3 align-top">
									{/* Update role form */}
									<form action={updateRole} className="flex items-center gap-2">
										<input type="hidden" name="id" value={r.id}/>
										<input
											type="text"
											name="role"
											defaultValue={r.role}
											className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
											required
										/>
									</form>
								</TableCell>
								<TableCell className="px-4 py-3 align-top">
									{/* Delete role form */}
									<form action={deleteRole} className="flex justify-end">
										<input type="hidden" name="id" value={r.id}/>
										<Button
											type="submit"
											className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700"
											title="Save"
										>
											Save
										</Button>
										<Button
											type="submit"
											className="inline-flex items-center justify-center rounded-md border border-red-900/60 bg-red-900/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/50"
										>
											Delete
										</Button>

									</form>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</section>
		</div>
	);
}
