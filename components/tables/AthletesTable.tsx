"use client";

import Link from "next/link";
import GenericTable, { type ColumnDefinition } from "@/components/tables/GenericTable";

// Local lightweight type to avoid importing server modules into a client component
export type AthleteRow = {
	id: string;
	name?: string | null;
	created_at: string | number | Date;
};

type Props = {
	athletes: AthleteRow[] | null | undefined;
};

export default function AthletesTable({ athletes }: Props) {
	const columns: ColumnDefinition<AthleteRow>[] = [
		{
			header: "Name",
			cell: (a) => (
				<Link href={`/athlete/${a.id}`} className="text-slate-100 text-sm">
					{a.name ?? "(no name)"}
				</Link>
			),
		},
		{
			header: "Athlete ID",
			cell: (a) => (
				<Link href={`/athlete/${a.id}`} className="text-xs text-slate-400">
					<code className="select-all break-all">{a.id}</code>
				</Link>
			),
		},
		{
			header: "Created",
			cell: (a) => (
				<Link href={`/athlete/${a.id}`} className="text-xs text-slate-400">
					{new Date(a.created_at).toLocaleString()}
				</Link>
			),
		},
	];

	return (
		<GenericTable
			data={athletes ?? []}
			columns={columns}
			emptyMessage="No athletes found."
			rowClassName="cursor-pointer"
		/>
	);
}
