// app/(protected)/admin/page.tsx
import PageHeader from "@/components/page/PageHeader";

export default function AdminIndexPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Admin"
				subtitle="Admin tools and management pages."/>
			<ul className="list-disc pl-6 text-slate-200">
				<li>
					<a className="underline underline-offset-4 hover:text-slate-100" href="/admin/roles">
						Manage roles
					</a>
				</li>
				<li>
					<a className="underline underline-offset-4 hover:text-slate-100" href="/admin/user-roles">
						Manage user roles
					</a>
				</li>
			</ul>
		</div>
	);
}
