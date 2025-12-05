// app/(protected)/admin/page.tsx
import PageHeader from "@/components/page/PageHeader";
import Link from "next/link";

export default function AdminIndexPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Admin"
				subtitle="Admin tools and management pages."
				href="/"
				backLabel="← Back"
			/>
			<ul className="list-disc pl-6 text-slate-200">
				<li>
					<Link className="underline underline-offset-4 hover:text-slate-100" href="/admin/roles">
						Manage roles
					</Link>
				</li>
				<li>
					<Link className="underline underline-offset-4 hover:text-slate-100" href="/admin/user-roles">
						Manage user roles
					</Link>
				</li>
			</ul>
		</div>
	);
}
