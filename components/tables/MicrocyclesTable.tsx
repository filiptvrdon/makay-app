"use client";

import GenericTable, { type ColumnDefinition } from "@/components/tables/GenericTable";

export type MicrocycleRow = {
  id: string;
  mesocycle_idx: number;
  name: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | number | Date;
};

type Props = {
  microcycles: MicrocycleRow[] | null | undefined;
};

export default function MicrocyclesTable({ microcycles }: Props) {
  const columns: ColumnDefinition<MicrocycleRow>[] = [
    {
      header: "Name",
      cell: (m) => (
        <span className="text-slate-100 text-sm">{m.name && m.name.trim().length > 0 ? m.name : "(no name)"}</span>
      ),
    },
    {
      header: "Index",
      cell: (m) => <span className="text-xs text-slate-400">{m.mesocycle_idx}</span>,
    },
    {
      header: "Date range",
      cell: (m) => (
        <span className="text-xs text-slate-400">{formatDateRange(m.start_date, m.end_date)}</span>
      ),
    },
    {
      header: "Created",
      cell: (m) => (
        <span className="text-xs text-slate-400">{new Date(m.created_at).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <GenericTable
      data={microcycles ?? []}
      columns={columns}
      emptyMessage="No microcycles found."
      rowClassName="cursor-pointer"
      getRowHref={(m) => `/microcycle/${m.id}`}
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
