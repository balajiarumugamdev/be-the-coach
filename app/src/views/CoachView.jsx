import { useState } from "react";
import { COURSES, ROSTER } from "../data/courses.js";
import { loadContent, loadHelp, saveReview, saveNote } from "../lib/dataLayer.js";
import { useAsync } from "../lib/useAsync.js";
import Loading from "../components/Loading.jsx";

const STATUS_BADGE = {
  approved: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  changes: "bg-red-100 text-red-800",
};
const STATUS_LABEL = { approved: "Approved", pending: "Pending", changes: "Changes requested" };
const statusOf = (review, cid, mid) => (review[cid]?.[mid]?.status) || "approved";

export default function CoachView() {
  const [sel, setSel] = useState({ courseId: null, moduleId: null });

  const { data, loading, reload } = useAsync(async () => {
    const [content, help] = await Promise.all([loadContent(), loadHelp()]);
    return { content, help };
  }, []);

  if (loading || !data) return <Loading />;
  const { content, help } = data;

  if (!sel.courseId) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Coach — review & approve content</h1>
        <p className="text-slate-500 mb-6">Pick a course to review each module, approve it, request changes, and leave notes for trainees.</p>
        <HelpQueue help={help} />
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {Object.values(COURSES).map((c) => (
            <button
              key={c.id}
              onClick={() => setSel({ courseId: c.id, moduleId: c.modules[0].id })}
              className="text-left bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-500 hover:-translate-y-0.5 transition"
            >
              <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
              <p className="text-sm text-slate-500 m-0">{c.description}</p>
              <div className="mt-3 text-xs text-slate-400">{c.modules.length} modules · track: {c.track}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const course = COURSES[sel.courseId];
  const module = course.modules.find((m) => m.id === sel.moduleId);
  const review = content.review[course.id]?.[module.id] || { status: "approved", feedback: "" };
  const note = content.notes[course.id]?.[module.id] || "";

  return (
    <div>
      <button onClick={() => setSel({ courseId: null, moduleId: null })} className="text-sm text-slate-500 hover:text-blue-600 mb-3">
        ← All courses
      </button>
      <div className="grid gap-6 md:grid-cols-[280px_1fr] items-start">
        <aside className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm md:sticky md:top-4">
          <h4 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">Modules</h4>
          {course.modules.map((m) => {
            const s = statusOf(content.review, course.id, m.id);
            return (
              <button
                key={m.id}
                onClick={() => setSel({ courseId: course.id, moduleId: m.id })}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm text-left ${
                  m.id === sel.moduleId ? "bg-sky-50" : "hover:bg-slate-50"
                }`}
              >
                <span className="flex-1">{m.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${STATUS_BADGE[s]}`}>{STATUS_LABEL[s]}</span>
              </button>
            );
          })}
        </aside>

        <section className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: module.content }} />
          <ReviewControls
            key={module.id}
            courseId={course.id}
            moduleId={module.id}
            review={review}
            note={note}
            reload={reload}
          />
        </section>
      </div>
    </div>
  );
}

function ReviewControls({ courseId, moduleId, review, note, reload }) {
  const [feedback, setFeedback] = useState(review.feedback || "");
  const [noteText, setNoteText] = useState(note);

  const act = async (status) => { await saveReview({ course: courseId, module: moduleId, status, feedback }); await reload(); };
  const doSaveNote = async () => { await saveNote({ course: courseId, module: moduleId, note: noteText }); await reload(); };

  return (
    <div className="mt-7 border-t border-slate-200 pt-5 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Feedback to the content author</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          placeholder="e.g. Module 4 needs a clearer screenshot of the redirect URI step."
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <div className="flex gap-2 mt-2">
          <button onClick={() => act("approved")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Approve</button>
          <button onClick={() => act("changes")} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Request changes</button>
          <button onClick={() => act("pending")} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm hover:border-blue-400">Mark pending</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Note shown to the trainee on this module</label>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={2}
          placeholder="e.g. If Microsoft sign-in fails, check you pasted the Client ID exactly."
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <button onClick={doSaveNote} className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Save note</button>
      </div>
    </div>
  );
}

function HelpQueue({ help }) {
  if (!help.length) return null;
  const label = (token) => ROSTER.find((r) => r.token === token)?.name || token;
  return (
    <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-4">
      <h3 className="font-semibold text-amber-900 mb-2">🙋 Help requests ({help.length})</h3>
      <ul className="text-sm text-amber-900 space-y-1">
        {help.slice().reverse().map((r, i) => (
          <li key={i}>
            <strong>{label(r.token)}</strong> is stuck on <em>{COURSES[r.courseId]?.title}</em> — module <code>{r.moduleId}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
