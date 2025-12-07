import Page from "@/components/shared/Page";
import PageHeader from "@/components/page/PageHeader";
import { getSessionById, type Session } from "./actions";

type PageProps = {
  params: Promise<{ id: string }>; // Next.js 15: async params
};

function formatDate(d: string | null): string {
  return d ? new Date(d).toLocaleDateString() : "—";
}

export default async function SessionPage(props: PageProps) {
  const { id } = await props.params;

  let error: Error | null = null;
  let session: Session | null = null;

  try {
    session = await getSessionById(id);
  } catch (e) {
    error = e as Error;
  }

  const backHref = session ? `/microcycle/${session.microcycle_id}` : "/coach/athlete";

  return (
    <Page>
      <PageHeader
        title={session ? session.name ?? "Session" : "Session"}
        subtitle={session ? `Planned: ${formatDate(session.planned_date)}` : undefined}
        href={backHref}
        backLabel="← Back"
      />

      {error ? (
        <div className="rounded-md border border-red-900/60 bg-red-900/20 p-4 text-sm text-red-200">
          Failed to load session: {error.message}
        </div>
      ) : null}

      {!error && !session ? (
        <div className="rounded-md border border-yellow-900/60 bg-yellow-900/20 p-4 text-sm text-yellow-200">
          Session not found.
        </div>
      ) : null}

      {session ? (
        <section className="grid gap-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/20 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-300">Overview</h2>
            <dl className="grid grid-cols-1 gap-2 text-sm text-slate-300 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Index:</dt>
                <dd className="text-slate-200">{session.microcycle_idx ?? "—"}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Planned Date:</dt>
                <dd className="text-slate-200">{formatDate(session.planned_date)}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Actual Date:</dt>
                <dd className="text-slate-200">{formatDate(session.completed_on)}</dd>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <dt className="text-slate-400">Description:</dt>
                <dd className="text-slate-200 whitespace-pre-wrap">{session.description ?? "—"}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Created:</dt>
                <dd className="text-slate-200">{new Date(session.created_at).toLocaleString()}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-slate-400">Updated:</dt>
                <dd className="text-slate-200">{new Date(session.updated_at).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </section>
      ) : null}
    </Page>
  );
}
