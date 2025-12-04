// components/page/PageHeader.tsx
import type {ReactNode} from "react";

type PageHeaderProps = {
	title: ReactNode;
	subtitle?: ReactNode;
	href?: string;
	backLabel?: ReactNode;
};

export default function PageHeader({title, subtitle, href, backLabel}: PageHeaderProps) {
	return (
		<header className={href ? "flex items-end justify-between" : undefined}>
			<div>
				<h1 className="text-2xl font-bold text-slate-100">{title}</h1>
				{subtitle ? (
					<p className="text-sm text-slate-400">{subtitle}</p>
				) : null}
			</div>
			{href ? (
				<a
					href={href}
					className="text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4"
				>
					{backLabel ?? "← Back"}
				</a>
			) : null}
		</header>
	);
}
