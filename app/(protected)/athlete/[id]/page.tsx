// app/(protected)/tables/athlete/[id]/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Page from "@/components/shared/Page";
import { listMesocyclesForAthlete, type Mesocycle } from "./actions";
import MesocyclesTable from "@/components/tables/MesocyclesTable";
import {Athlete, getAthleteById} from "@/app/(protected)/coach/actions";

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
		athlete = await getAthleteById(id);
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

      <MesocyclesTable mesocycles={mesocycles} />
    </Page>
  );
}

// Table rendering moved to client component using GenericTable
