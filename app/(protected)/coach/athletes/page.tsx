// app/(protected)/coach/athletes/page.tsx
import PageHeader from "@/components/page/PageHeader";
import { listMyAthletes, type Athlete } from "./actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function CoachAthletesPage() {
  let error: Error | null = null;
  let athletes: Athlete[] = [];

  try {
    athletes = await listMyAthletes();
  } catch (e) {
    error = e as Error;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My athletes"
        subtitle="Athletes assigned to you."
        href="/coach"
        backLabel="← Back"
      />

      {error ? (
        <div className="rounded-md border border-red-900/60 bg-red-900/20 p-4 text-sm text-red-200">
          Failed to load athletes: {error.message}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-800 overflow-hidden">
        <Table className="min-w-full divide-y divide-slate-800">
          <TableHeader className="bg-slate-900/60">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Athlete ID
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-800 bg-slate-900/20">
            {!athletes || athletes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="px-4 py-6 text-center text-slate-400">
                  No athletes found.
                </TableCell>
              </TableRow>
            ) : (
              athletes.map((a: Athlete) => (
                <TableRow key={a.id} className="hover:bg-slate-900/40">
                  <TableCell className="px-4 py-3 align-top">
                    <span className="text-slate-100 text-sm">{a.name ?? "(no name)"}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 align-top">
                    <code className="text-xs text-slate-400 select-all break-all">{a.id}</code>
                  </TableCell>
                  <TableCell className="px-4 py-3 align-top">
                    <span className="text-xs text-slate-400">
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
