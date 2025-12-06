"use client";

import Link from "next/link";
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
        <Link href={`/microcycle/${m.id}`} className="text-slate-100 text-sm">
          {m.name && m.name.trim().length > 0 ? m.name : "(no name)"}
        </Link>
      ),
    },
    {
      header: "Index",
      cell: (m) => (
        <Link href={`/microcycle/${m.id}`} className="text-xs text-slate-400">
          {m.mesocycle_idx}
        </Link>
      ),
    },
    {
      header: "Date range",
      cell: (m) => (
        <Link href={`/microcycle/${m.id}`} className="text-xs text-slate-400">
          {formatDateRange(m.start_date, m.end_date)}
        </Link>
      ),
    },
    {
      header: "Created",
      cell: (m) => (
        <Link href={`/microcycle/${m.id}`} className="text-xs text-slate-400">
          {new Date(m.created_at).toLocaleString()}
        </Link>
      ),
    },
  ];

  return (
    <GenericTable
      data={microcycles ?? []}
      columns={columns}
      emptyMessage="No microcycles found."
      rowClassName="cursor-pointer"
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
