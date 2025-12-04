// app/(protected)/admin/page.tsx
import PageHeader from "@/components/page/PageHeader";

export default function LibraryIndexPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Library"
				subtitle="Movement, activities pages."
				href="/"
				backLabel="← Back"
			/>
			<ul className="list-disc pl-6 text-slate-200">
				<li>
					<a className="underline underline-offset-4 hover:text-slate-100" href="/library/movements">
						Manage movements
					</a>
				</li>
			</ul>
		</div>
	);
}
