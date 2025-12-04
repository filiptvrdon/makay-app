// app/(protected)/layout.tsx
import {redirect} from "next/navigation";
import {createClient as createServerSupabaseClient} from "@/lib/supabase/server";
import {Navbar} from "@/components/Navbar";


export default async function ProtectedLayout({
	                                              children,
                                              }: {
	children: React.ReactNode;
}) {
	const supabase = await createServerSupabaseClient();

	const data = await supabase.auth.getUser();
	const session = data.data;

	if (!session) {
		redirect("/login");
	}

	const email = session.user?.email ?? null;

	return (
		<div className="min-h-screen bg-slate-950 text-slate-50">
			<Navbar email={email}/>
			<main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
		</div>
	);
}
