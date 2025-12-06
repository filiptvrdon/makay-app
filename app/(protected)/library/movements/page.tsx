// app/(protected)/admin/movements/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Page from "@/components/shared/Page";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  listMovements,
  createMovement,
  updateMovement,
  deleteMovement,
  type Movement,
} from "./actions";

export default async function MovementsPage() {
  const movements = (await listMovements()) as Movement[];

  return (
    <Page>
      <PageHeader
        title="Movements"
        subtitle="Create, edit and delete movements."
        href="/admin"
        backLabel="← Back to Admin"
      />

      {/* Create movement */}
      <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Create movement</h2>
        <form action={createMovement} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Squat"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-slate-300">Instructions</label>
            <textarea
              name="instructions"
              placeholder="How to perform the movement"
              rows={3}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-slate-300">Resource URLs (comma or newline separated)</label>
            <textarea
              name="resource_urls"
              placeholder="https://..., https://..."
              rows={2}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
            >
              Add movement
            </Button>
          </div>
        </form>
      </section>

      {/* List and edit movements */}
      <section className="rounded-lg border border-slate-800 overflow-hidden">
        <Table className="min-w-full divide-y divide-slate-800">
          <TableHeader className="bg-slate-900/60">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Instructions</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Resource URLs</TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-800 bg-slate-900/20">
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No movements yet.
                </TableCell>
              </TableRow>
            )}
            {movements.map((m) => (
              <TableRow key={m.id} className="hover:bg-slate-900/40 align-top">
                <TableCell className="px-4 py-3">
                  <input
                    type="text"
                    name="name"
                    defaultValue={m.name}
                    form={`update-${m.id}`}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    required
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <textarea
                    name="instructions"
                    defaultValue={m.instructions ?? ""}
                    rows={3}
                    form={`update-${m.id}`}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <textarea
                    name="resource_urls"
                    defaultValue={(m.resource_urls ?? []).join(", ")}
                    rows={3}
                    form={`update-${m.id}`}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form id={`update-${m.id}`} action={updateMovement}>
                      <input type="hidden" name="id" value={m.id} />
                      <Button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700"
                        title="Save"
                      >
                        Save
                      </Button>
                    </form>
                    <form action={deleteMovement}>
                      <input type="hidden" name="id" value={m.id} />
                      <Button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md border border-red-900/60 bg-red-900/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/50"
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </Page>
  );
}
