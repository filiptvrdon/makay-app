// app/(protected)/coach/athletes/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Page from "@/components/shared/Page";
import { listMyAthletes, type Athlete } from "./actions";
import AthletesTable from "@/components/coach/athletes/AthletesTable";

export default async function CoachAthletesPage() {
  let error: Error | null = null;
  let athletes: Athlete[] = [];

  try {
    athletes = await listMyAthletes();
  } catch (e) {
    error = e as Error;
  }

  return (
    <Page>
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

      <AthletesTable athletes={athletes} />
    </Page>
  );
}
