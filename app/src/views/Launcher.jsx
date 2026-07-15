import { ROSTER, ROLE_LABELS } from "../data/mockData.js";

export default function Launcher() {
  return (
    <div>
      <div className="text-center mb-9">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Leaps Up — Prototype</h1>
        <p className="text-slate-500">
          Pick a role to open its personal link. Each link is what a real person would receive.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {ROSTER.map((r) => (
          <a
            key={r.token}
            href={`?t=${r.token}`}
            className="block bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-500 hover:-translate-y-0.5 transition no-underline"
          >
            <h3 className="font-semibold text-slate-900 mb-1">{ROLE_LABELS[r.role]}</h3>
            <p className="text-sm text-slate-500 m-0">
              Open as <strong>{r.name}</strong>
            </p>
            <div className="mt-3 text-xs text-slate-400">?t={r.token}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
