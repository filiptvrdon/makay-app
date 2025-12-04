// app/(protected)/admin/page.tsx

export default function AdminIndexPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Admin</h1>
        <p className="text-sm text-slate-400">Admin tools and management pages.</p>
      </header>
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
