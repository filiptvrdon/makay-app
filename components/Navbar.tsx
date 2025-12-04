// app/(protected)/Navbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

type NavbarProps = {
	email: string | null;
};

export function Navbar({ email }: NavbarProps) {
	const router = useRouter();
	const supabase = createSupabaseClient();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.replace("/login");
	};

	return (
		<header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
				<div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-slate-50">
            Training App
          </span>
					<span className="text-xs uppercase tracking-wide text-slate-500">
            Coach & Athlete
          </span>
				</div>

				<div className="flex items-center gap-3">
					{email && (
						<span className="hidden text-sm text-slate-300 sm:inline">
              {email}
            </span>
					)}
					<button
						onClick={handleSignOut}
						className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800"
					>
						Sign out
					</button>
				</div>
			</div>
		</header>
	);
}
