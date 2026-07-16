import { COURSES, coursesForTrack } from "../data/courses.js";
import { loadDashboard } from "../lib/dataLayer.js";
import { useAsync } from "../lib/useAsync.js";
import Loading from "../components/Loading.jsx";

const DAY = 24 * 60 * 60 * 1000;
const STRUGGLE_ATTEMPTS = 3;
const STALLED_DAYS = 7;

function relTime(ts) {
  if (!ts) return "—";
  const d = Math.floor((Date.now() - ts) / DAY);
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

// question text lookup for the analytics section
function questionText(courseId, qid) {
  const course = COURSES[courseId];
  if (!course) return qid;
  for (const m of course.modules) {
    const q = m.quiz.bank.find((b) => b.id === qid);
    if (q) return `${q.q}  (${m.title})`;
  }
  return qid;
}

export default function ManagerDashboard() {
  const { data, loading } = useAsync(() => loadDashboard(), []);
  if (loading || !data) return <Loading />;

  const { summaries, missedQuestions } = data;

  const rows = [];
  summaries.forEach((s) => {
    coursesForTrack(s.track).forEach((c) => {
      const done = c.modules.filter((m) => s.passed.includes(`${c.id}/${m.id}`)).length;
      const total = c.modules.length;
      let attempts = 0;
      const struggling = [];
      c.modules.forEach((m) => {
        const n = s.attemptCounts[`${c.id}/${m.id}`] || 0;
        attempts += n;
        if (n >= STRUGGLE_ATTEMPTS && !s.passed.includes(`${c.id}/${m.id}`)) struggling.push(m.title);
      });
      const complete = done === total;
      const stalled = !complete && s.lastActive > 0 && Date.now() - s.lastActive > STALLED_DAYS * DAY;
      rows.push({
        name: s.name, course: c.title,
        done, total, pct: Math.round((done / total) * 100),
        attempts, lastActive: s.lastActive, struggling, complete, stalled,
      });
    });
  });

  const attention = rows.filter((r) => r.struggling.length || r.stalled);
  const missed = (missedQuestions || [])
    .filter((m) => m.miss > 0)
    .sort((a, b) => b.miss / b.seen - a.miss / a.seen)
    .slice(0, 6);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Program Manager — dashboard</h1>
      <p className="text-slate-500 mb-6">
        Live view of every trainee (titles &amp; stats only — no lesson content).
      </p>

      {attention.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-4">
          <h3 className="font-semibold text-amber-900 mb-2">⚠ Needs attention</h3>
          <ul className="text-sm text-amber-900 space-y-1">
            {attention.map((r, i) => (
              <li key={i}>
                <strong>{r.name}</strong>
                {r.stalled && <span> — stalled (last active {relTime(r.lastActive)})</span>}
                {r.struggling.length > 0 && <span> — struggling on: {r.struggling.join(", ")}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <Th>Name</Th><Th>Course</Th><Th>Progress</Th><Th>Attempts</Th><Th>Last active</Th><Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                <Td>{r.name}</Td>
                <Td>{r.course}</Td>
                <Td>
                  <span className="inline-block align-middle w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-2">
                    <span className="block h-full bg-emerald-500" style={{ width: `${r.pct}%` }} />
                  </span>
                  {r.done}/{r.total} ({r.pct}%)
                </Td>
                <Td>{r.attempts}</Td>
                <Td>{relTime(r.lastActive)}</Td>
                <Td>
                  {r.complete ? <Badge c="emerald">Complete</Badge>
                    : r.stalled ? <Badge c="red">Stalled</Badge>
                    : r.struggling.length ? <Badge c="amber">Struggling</Badge>
                    : r.done ? <Badge c="sky">In progress</Badge>
                    : <Badge c="slate">Not started</Badge>}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-1">Most-missed questions</h3>
        {missed.length === 0 ? (
          <p className="text-sm text-slate-500 m-0">
            No failed answers recorded yet. Fail a quiz as a trainee to see which questions trip people up.
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-500 mb-3">High miss-rates usually pinpoint confusing lesson content to fix.</p>
            <ul className="text-sm text-slate-600 space-y-1">
              {missed.map((m) => (
                <li key={m.id}>
                  <span className="text-red-600 font-semibold">{Math.round((m.miss / m.seen) * 100)}% missed</span>
                  {" — "}{questionText(m.course, m.id)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

const Th = ({ children }) => <th className="text-left font-semibold px-4 py-3">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-3">{children}</td>;
const Badge = ({ c, children }) => {
  const map = {
    emerald: "bg-emerald-100 text-emerald-800", red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-800", sky: "bg-sky-100 text-sky-800", slate: "bg-slate-100 text-slate-600",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[c]}`}>{children}</span>;
};
