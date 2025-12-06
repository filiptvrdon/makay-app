"use client";

import Link from "next/link";
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
      cell: (m) => (
        <Link href={`/mesocycle/${m.id}`} className="text-slate-100 text-sm">
          {m.name}
        </Link>
      ),
    },
    {
      header: "Date range",
      cell: (m) => (
        <Link href={`/mesocycle/${m.id}`} className="text-xs text-slate-400">
          {formatDateRange(m.start_date, m.end_date)}
        </Link>
      ),
    },
    {
      header: "Created",
      cell: (m) => (
        <Link href={`/mesocycle/${m.id}`} className="text-xs text-slate-400">
          {new Date(m.created_at).toLocaleString()}
        </Link>
      ),
    },
  ];

  return (
    <GenericTable
      data={mesocycles ?? []}
      columns={columns}
      emptyMessage="No mesocycles found."
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
