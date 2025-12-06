"use client";

import Link from "next/link";
import GenericTable, { type ColumnDefinition } from "@/components/tables/GenericTable";

export type SessionRow = {
  id: string;
  microcycle_idx: number | null;
  name: string | null;
  planned_date: string | null;
  actual_date: string | null;
  created_at: string | number | Date;
};

type Props = {
  sessions: SessionRow[] | null | undefined;
};

export default function SessionsTable({ sessions }: Props) {
  const columns: ColumnDefinition<SessionRow>[] = [
    {
      header: "Name",
      cell: (s) => (
        <Link href={`/session/${s.id}`} className="text-slate-100 text-sm">
          {s.name && s.name.trim().length > 0 ? s.name : "(no name)"}
        </Link>
      ),
    },
    {
      header: "Index",
      cell: (s) => (
        <Link href={`/session/${s.id}`} className="text-xs text-slate-400">
          {s.microcycle_idx ?? "—"}
        </Link>
      ),
    },
    {
      header: "Planned",
      cell: (s) => (
        <Link href={`/session/${s.id}`} className="text-xs text-slate-400">
          {formatDate(s.planned_date)}
        </Link>
      ),
    },
    {
      header: "Actual",
      cell: (s) => (
        <Link href={`/session/${s.id}`} className="text-xs text-slate-400">
          {formatDate(s.actual_date)}
        </Link>
      ),
    },
    {
      header: "Created",
      cell: (s) => (
        <Link href={`/session/${s.id}`} className="text-xs text-slate-400">
          {new Date(s.created_at).toLocaleString()}
        </Link>
      ),
    },
  ];

  return (
    <GenericTable
      data={sessions ?? []}
      columns={columns}
      emptyMessage="No sessions found."
      rowClassName="cursor-pointer"
    />
  );
}

function formatDate(d: string | null): string {
  return d ? new Date(d).toLocaleDateString() : "—";
}
