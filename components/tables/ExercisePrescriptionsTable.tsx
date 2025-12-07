"use client";

import GenericTable, { type ColumnDefinition } from "@/components/tables/GenericTable";

export type ExercisePrescriptionRow = {
  id: string;
  session_id: string;
  exercise: string;
  // TODO use a proper type for this
  prescribed: Record<string, any>;
  actual: Record<string, any> | null;
  coach_notes: string | null;
  athlete_notes: string | null;
  completed_at: string | null;
  created_at: string | number | Date;
};

type Props = {
  prescriptions: ExercisePrescriptionRow[] | null | undefined;
};

export default function ExercisePrescriptionsTable({ prescriptions }: Props) {
  const columns: ColumnDefinition<ExercisePrescriptionRow>[] = [
    {
      header: "Exercise",
      cell: (p) => <span className="text-slate-100 text-sm">{p.exercise}</span>,
    },
    {
      header: "Prescribed",
      cell: (p) => (
        <span className="text-xs text-slate-400 break-words">{formatJsonInline(p.prescribed)}</span>
      ),
    },
    {
      header: "Actual",
      cell: (p) => (
        <span className="text-xs text-slate-400 break-words">{formatJsonInline(p.actual)}</span>
      ),
    },
    {
      header: "Coach notes",
      cell: (p) => <span className="text-xs text-slate-400">{truncate(p.coach_notes)}</span>,
    },
    {
      header: "Athlete notes",
      cell: (p) => <span className="text-xs text-slate-400">{truncate(p.athlete_notes)}</span>,
    },
    {
      header: "Completed",
      cell: (p) => <span className="text-xs text-slate-400">{formatDateTime(p.completed_at)}</span>,
    },
    {
      header: "Created",
      cell: (p) => <span className="text-xs text-slate-400">{new Date(p.created_at).toLocaleString()}</span>,
    },
  ];

  return (
    <GenericTable
      data={prescriptions ?? []}
      columns={columns}
      emptyMessage="No exercise prescriptions found."
    />
  );
}

function formatJsonInline(data: Record<string, any> | null): string {
  if (!data || Object.keys(data).length === 0) return "—";
  try {
    return JSON.stringify(data);
  } catch {
    return "(invalid)";
  }
}

function truncate(text: string | null, max = 80): string {
  if (!text) return "—";
  const t = text.trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function formatDateTime(d: string | null): string {
  return d ? new Date(d).toLocaleString() : "—";
}
