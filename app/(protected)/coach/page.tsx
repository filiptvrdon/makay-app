// app/(protected)/admin/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Page from "@/components/shared/Page";
import AthletesTable from "@/components/tables/AthletesTable";
import {Athlete, listMyAthletes} from "@/app/(protected)/coach/actions";

export default async function CoachIndexPage() {
	let error: Error | null = null;
	let athletes: Athlete[] = [];

	try {
		athletes = await listMyAthletes();
	} catch (e) {
		error = e as Error;
	}
    return (
        <>
            <Page>
                <PageHeader
                    title="Coach"
                    subtitle="Coach tools and management pages."
                    href="/"
                    backLabel="← Back"
                />

	            <h2>My Trainees</h2>

	            {error ? (
		            <div className="rounded-md border border-red-900/60 bg-red-900/20 p-4 text-sm text-red-200">
			            Failed to load athletes: {error.message}
		            </div>
	            ) : null}

	            <AthletesTable athletes={athletes} />
            </Page>


        </>
    );
}
