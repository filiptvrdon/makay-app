// app/(protected)/admin/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Page from "@/components/shared/Page";
import Link from "next/link";

export default function LibraryIndexPage() {
    return (
        <Page>
            <PageHeader
                title="Library"
                subtitle="Movement, activities pages."
                href="/"
                backLabel="← Back"
            />
            <ul className="list-disc pl-6 text-slate-200">
                <li>
                    <Link className="underline underline-offset-4 hover:text-slate-100" href="/library/movements">
                        Manage movements
                    </Link>
                </li>
            </ul>
        </Page>
    );
}
