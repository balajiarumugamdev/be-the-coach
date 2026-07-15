export default function Certificate({ user, course, onBack }) {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
  return (
    <div>
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 mb-3 print:hidden">
        ← Back to course
      </button>

      <div className="bg-white border-4 border-emerald-600 rounded-xl p-10 shadow-sm text-center max-w-2xl mx-auto">
        <div className="text-emerald-600 text-5xl mb-3">🎓</div>
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Certificate of Completion</div>
        <div className="text-slate-500 mb-1">This certifies that</div>
        <div className="text-3xl font-bold text-slate-900 mb-3">{user.name}</div>
        <div className="text-slate-500 mb-1">has successfully completed</div>
        <div className="text-xl font-semibold text-slate-800 mb-6">{course.title}</div>
        <div className="flex items-center justify-center gap-10 text-sm text-slate-500 border-t border-slate-200 pt-5">
          <div>
            <div className="font-semibold text-slate-700">{date}</div>
            <div>Date</div>
          </div>
          <div>
            <div className="font-semibold text-slate-700">Leaps Up</div>
            <div>Issued by</div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
