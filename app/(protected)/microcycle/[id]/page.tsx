import Page from "@/components/shared/Page";
import PageHeader from "@/components/page/PageHeader";
import { getMicrocycleById, type Microcycle, getSessionsForMicrocycle } from "./actions";
import SessionsTable, { type SessionRow } from "@/components/tables/SessionsTable";

type PageProps = {
  params: Promise<{ id: string }>; // Next.js 15: async params
};

function formatDateRange(start: string | null, end: string | null): string {
  const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString() : "—");
  const s = fmt(start);
  const e = fmt(end);
  if (s === "—" && e === "—") return "—";
  return `${s} – ${e}`;
}

export default async function MesocyclePage(props: PageProps) {
  const { id } = await props.params;

  let error: Error | null = null;
  let microcycle: Microcycle | null = null;
  let sessions: SessionRow[] | null = null;
  let sessionsError: Error | null = null;

  try {
    microcycle = await getMicrocycleById(id);
  } catch (e) {
    error = e as Error;
  }

  if (!error) {
    try {
      sessions = (await getSessionsForMicrocycle(id)) as SessionRow[] | null;
    } catch (e) {
      sessionsError = e as Error;
    }
  }

  return (
    <Page>
      <PageHeader
        title={microcycle ? microcycle.name : "Microcycle"}
        subtitle={microcycle ? `Planned: ${formatDateRange(microcycle.start_date, microcycle.end_date)}` : undefined}
        href="/coach"
        backLabel="← Back"
      />

      {error ? (
        <div className="rounded-md border border-red-900/60 bg-red-900/20 p-4 text-sm text-red-200">
          Failed to load mesocycle: {error.message}
        </div>
      ) : null}

      {!error && !microcycle ? (
        <div className="rounded-md border border-yellow-900/60 bg-yellow-900/20 p-4 text-sm text-yellow-200">
          Mesocycle not found.
        </div>
      ) : null}

      {microcycle ? (
        <section className="grid gap-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/20 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-300">Overview</h2>
            <dl className="grid grid-cols-1 gap-2 text-sm text-slate-300 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Date Range:</dt>
                <dd className="text-slate-200">
                  {formatDateRange(microcycle.start_date, microcycle.end_date)}
                </dd>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <dt className="text-slate-400">Description:</dt>
                <dd className="text-slate-200 whitespace-pre-wrap">{microcycle.description ?? "—"}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Created:</dt>
                <dd className="text-slate-200">{new Date(microcycle.created_at).toLocaleString()}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Updated:</dt>
                <dd className="text-slate-200">{new Date(microcycle.updated_at).toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold text-slate-300">Sessions</h2>
            {sessionsError ? (
              <div className="rounded-md border border-red-900/60 bg-red-900/20 p-3 text-sm text-red-200">
                Failed to load sessions: {sessionsError.message}
              </div>
            ) : (
              <SessionsTable sessions={sessions ?? []} />
            )}
          </div>
        </section>
      ) : null}
    </Page>
  );
}
