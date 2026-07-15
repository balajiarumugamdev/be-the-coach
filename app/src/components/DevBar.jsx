import { ROSTER, ROLE_LABELS } from "../data/mockData.js";
import { resetAll } from "../lib/store.js";

export default function DevBar({ token }) {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-4 py-2 text-xs text-slate-500 flex items-center gap-2 flex-wrap shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <span className="font-bold text-amber-600">DEMO</span>
      <span>switch role:</span>
      {ROSTER.map((r) => {
        const active = r.token === token;
        return (
          <a
            key={r.token}
            href={`?t=${r.token}`}
            className={`px-2.5 py-1 rounded-md border ${
              active ? "border-blue-500 text-blue-600" : "border-slate-200 text-slate-700"
            } bg-slate-50 hover:border-blue-400 no-underline`}
          >
            {ROLE_LABELS[r.role]}
          </a>
        );
      })}
      <a href="?" className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 bg-slate-50 hover:border-blue-400 no-underline">
        launcher
      </a>
      <button
        onClick={() => { resetAll(); window.location.reload(); }}
        className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 bg-slate-50 hover:border-blue-400"
      >
        reset progress
      </button>
    </div>
  );
}
