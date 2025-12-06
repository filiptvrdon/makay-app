// app/(protected)/coach/athletes/[id]/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Page from "@/components/shared/Page";
import { listMesocyclesForAthlete, type Mesocycle } from "./actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {Athlete, getMyAthleteById} from "@/app/(protected)/coach/athletes/actions";

type PageProps = {
  params: Promise<{ id: string }>; // Next 15: params is async
};

// TODO - make it possible to pass athlete data from parent page
export default async function CoachAthleteMesocyclesPage(props: PageProps) {
  const { id } = await props.params;

  let error: Error | null = null;
  let mesocycles: Mesocycle[] = [];

  try {
    mesocycles = await listMesocyclesForAthlete(id);
  } catch (e) {
    error = e as Error;
  }

	let athlete: Athlete | null = null;

	try {
		athlete = await getMyAthleteById(id);
	} catch (e) {
		error = e as Error;
	}


	return (
    <Page>
      <PageHeader
        title={athlete ? (athlete.name || "Athlete profile") : "Athlete profile"}
        subtitle={athlete ? "Basic info" : undefined}
        href="/coach/athletes"
        backLabel="← Back"
      />

      {error ? (
        <div className="rounded-md border border-red-900/60 bg-red-900/20 p-4 text-sm text-red-200">
          Failed to load mesocycles: {error.message}
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
                Date range
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-800 bg-slate-900/20">
            {!mesocycles || mesocycles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="px-4 py-6 text-center text-slate-400">
                  No mesocycles found.
                </TableCell>
              </TableRow>
            ) : (
              mesocycles.map((m: Mesocycle) => (
                <TableRow key={m.id} className="hover:bg-slate-900/40">
                  <TableCell className="px-4 py-3 align-top text-slate-100 text-sm">
                    {m.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 align-top text-xs text-slate-400">
                    {formatDateRange(m.start_date, m.end_date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 align-top text-xs text-slate-400">
                    {new Date(m.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </Page>
  );
}

function formatDateRange(start: string | null, end: string | null): string {
  const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString() : "—");
  const s = fmt(start);
  const e = fmt(end);
  if (s === "—" && e === "—") return "—";
  return `${s} – ${e}`;
}
