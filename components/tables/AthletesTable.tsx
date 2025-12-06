"use client";

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
      cell: (a) => <span className="text-slate-100 text-sm">{a.name ?? "(no name)"}</span>,
    },
    {
      header: "Athlete ID",
      cell: (a) => (
        <span className="text-xs text-slate-400">
          <code className="select-all break-all">{a.id}</code>
        </span>
      ),
    },
    {
      header: "Created",
      cell: (a) => <span className="text-xs text-slate-400">{new Date(a.created_at).toLocaleString()}</span>,
    },
  ];

  return (
    <GenericTable
      data={athletes ?? []}
      columns={columns}
      emptyMessage="No athletes found."
      rowClassName="cursor-pointer"
      getRowHref={(a) => `/athlete/${a.id}`}
    />
  );
}
