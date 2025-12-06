"use client";

import GenericTable, { type ColumnDefinition } from "@/components/tables/GenericTable";

export type MesocycleRow = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string | number | Date;
};

type Props = {
  mesocycles: MesocycleRow[] | null | undefined;
};

export default function MesocyclesTable({ mesocycles }: Props) {
  const columns: ColumnDefinition<MesocycleRow>[] = [
    {
      header: "Name",
      cell: (m) => <span className="text-slate-100 text-sm">{m.name}</span>,
    },
    {
      header: "Date range",
      cell: (m) => <span className="text-xs text-slate-400">{formatDateRange(m.start_date, m.end_date)}</span>,
    },
    {
      header: "Created",
      cell: (m) => <span className="text-xs text-slate-400">{new Date(m.created_at).toLocaleString()}</span>,
    },
  ];

  return (
    <GenericTable
      data={mesocycles ?? []}
      columns={columns}
      emptyMessage="No mesocycles found."
      rowClassName="cursor-pointer"
      getRowHref={(m) => `/mesocycle/${m.id}`}
    />
  );
}

function formatDateRange(start: string | null, end: string | null): string {
  const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString() : "—");
  const s = fmt(start);
  const e = fmt(end);
  if (s === "—" && e === "—") return "—";
  return `${s} – ${e}`;
}
