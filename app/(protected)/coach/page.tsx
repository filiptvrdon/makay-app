// app/(protected)/admin/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Page from "@/components/shared/Page";
import Link from "next/link";

export default function CoachIndexPage() {
    return (
        <>
            <Page>
                <PageHeader
                    title="Coach"
                    subtitle="Coach tools and management pages."
                    href="/"
                    backLabel="← Back"
                />
                <ul className="list-disc pl-6 text-slate-200">
                    <li>
                        <Link className="underline underline-offset-4 hover:text-slate-100" href="/coach/athletes">
                            My athletes
                        </Link>
                    </li>
                </ul>
            </Page>


        </>
    );
}
