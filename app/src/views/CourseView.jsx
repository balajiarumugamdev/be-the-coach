import { useMemo, useState } from "react";
import Certificate from "./Certificate.jsx";

function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

const approvedOf = (review, id) => (review[id] ? review[id].status === "approved" : true);

export default function CourseView({
  user, course, passedList, attemptsMap, scoresMap = {}, review, notes,
  onBack, onGrade, onHelp,
}) {
  const modules = course.modules;
  const completed = passedList;
  const unlockedIndex = (idx) => idx === 0 || completed.includes(modules[idx - 1].id);

  const [showCert, setShowCert] = useState(false);
  // Pin the active module in state so a *pass* doesn't auto-advance and dismiss the results
  // modal. It only changes when the learner clicks a module or the modal's Next button.
  const [activeId, setActiveId] = useState(() => {
    const firstIncomplete = modules.find((m) => !completed.includes(m.id));
    return (firstIncomplete || modules[modules.length - 1]).id;
  });

  if (showCert) return <Certificate user={user} course={course} onBack={() => setShowCert(false)} />;

  const activeIdx = modules.findIndex((m) => m.id === activeId);
  const module = modules[activeIdx];
  const allDone = completed.length === modules.length;
  const pct = Math.round((completed.length / modules.length) * 100);

  return (
    <div>
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 mb-3">
        ← Your courses
      </button>

      <div className="grid gap-6 md:grid-cols-[280px_1fr] items-start">
        <aside className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm md:sticky md:top-4">
          <h4 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">{course.title}</h4>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-slate-500 mb-3">
            {completed.length} of {modules.length} complete ({pct}%)
          </div>

          {modules.map((m, idx) => {
            const done = completed.includes(m.id);
            const unlocked = unlockedIndex(idx);
            const active = m.id === activeId;
            const attempts = attemptsMap[m.id] || 0;
            const scorePct = scoresMap[m.id] != null ? Math.round(scoresMap[m.id] * 100) : null;
            const dot = done ? "✓" : unlocked ? "•" : "🔒";
            const dotColor = done ? "text-emerald-600" : unlocked ? "text-blue-600" : "text-slate-400";
            return (
              <button
                key={m.id}
                disabled={!unlocked}
                onClick={() => setActiveId(m.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left ${
                  active ? "bg-sky-50" : "hover:bg-slate-50"
                } ${unlocked ? "" : "text-slate-400 cursor-not-allowed"}`}
              >
                <span className={`w-5 text-center flex-none ${dotColor}`}>{dot}</span>
                <span className="flex-1">{idx}. {m.title}</span>
                {attempts > 0 && (
                  <span className="text-[10px] text-slate-400 whitespace-nowrap" title={`${attempts} attempt(s)`}>
                    {done && scorePct != null ? `${scorePct}% · ` : ""}{attempts}×
                  </span>
                )}
              </button>
            );
          })}

          {allDone && (
            <button
              onClick={() => setShowCert(true)}
              className="mt-4 w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              🎓 View certificate
            </button>
          )}
        </aside>

        <section className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
          {!approvedOf(review, module.id) ? (
            <div className="text-slate-500">
              This module isn't available yet — your coach is still reviewing it.
            </div>
          ) : (
            <>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: module.content }} />

              {notes[module.id] && (
                <div className="mt-5 bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-sm text-sky-900">
                  <span className="font-semibold">Note from your coach: </span>{notes[module.id]}
                </div>
              )}

              <HelpBox
                course={course}
                onStuck={() => onHelp({ course: course.id, module: module.id, message: "" })}
              />

              <Quiz
                key={module.id}
                course={course}
                module={module}
                isLast={activeIdx === modules.length - 1}
                nextTitle={activeIdx + 1 < modules.length ? modules[activeIdx + 1].title : null}
                alreadyPassed={completed.includes(module.id)}
                onGrade={onGrade}
                onProceed={() => {
                  const next = modules[activeIdx + 1];
                  if (next) setActiveId(next.id);
                  else setShowCert(true);
                }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function HelpBox({ course, onStuck }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="mt-5 bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-sm text-amber-900 flex items-center justify-between gap-3">
      <span dangerouslySetInnerHTML={{ __html: course.helpNote }} />
      {sent ? (
        <span className="text-emerald-700 font-medium whitespace-nowrap">✓ Coach notified</span>
      ) : (
        <button
          onClick={async () => { await onStuck(); setSent(true); }}
          className="whitespace-nowrap px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
        >
          I'm stuck — notify my coach
        </button>
      )}
    </div>
  );
}

function Quiz({ course, module, isLast, nextTitle, alreadyPassed, onGrade, onProceed }) {
  const [round, setRound] = useState(0);
  const questions = useMemo(
    () => pickRandom(module.quiz.bank, module.quiz.deliverCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [module.id, round]
  );
  const [selected, setSelected] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const passPct = Math.round(module.quiz.passThreshold * 100);

  const submit = async () => {
    if (Object.keys(selected).length < questions.length) {
      setError(`Please answer all ${questions.length} questions.`);
      return;
    }
    setError("");
    setBusy(true);
    try {
      const r = await onGrade({
        course: course.id,
        module: module.id,
        delivered: questions.map((q) => q.id),
        answers: selected,
        questions,
      });
      setResult(r);
    } finally {
      setBusy(false);
    }
  };

  const tryAgain = () => { setSelected({}); setResult(null); setRound((n) => n + 1); };

  return (
    <div className="mt-8 border-t border-dashed border-slate-300 pt-6">
      <h3 className="font-semibold text-slate-900">Quick check</h3>
      <p className="text-sm text-slate-500 -mt-1 mb-4">
        {questions.length} questions · {passPct}% to {isLast ? "finish the course" : `unlock "${nextTitle}"`}
        {alreadyPassed && <span className="text-emerald-600 font-medium"> · already passed ✓</span>}
      </p>

      {questions.map((q, qi) => (
        <div key={q.id} className="mb-4">
          <p className="font-medium mb-2">{qi + 1}. {q.q}</p>
          {q.options.map((o, oi) => (
            <label
              key={oi}
              className={`block px-3 py-2 border rounded-lg mb-1.5 cursor-pointer text-sm ${
                selected[q.id] === oi ? "border-blue-500 bg-sky-50" : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <input
                type="radio"
                name={q.id}
                className="mr-2"
                checked={selected[q.id] === oi}
                onChange={() => setSelected((s) => ({ ...s, [q.id]: oi }))}
                disabled={!!result || busy}
              />
              {o}
            </label>
          ))}
        </div>
      ))}

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      {!result && (
        <button
          onClick={submit}
          disabled={busy}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? "Checking…" : "Submit answers"}
        </button>
      )}

      {result && (
        <ResultModal
          result={result}
          questions={questions}
          selected={selected}
          isLast={isLast}
          nextTitle={nextTitle}
          passPct={passPct}
          onProceed={onProceed}
          onTryAgain={tryAgain}
        />
      )}
    </div>
  );
}

function ResultModal({ result, questions, selected, isLast, nextTitle, passPct, onProceed, onTryAgain }) {
  const pct = Math.round(result.score * 100);
  const byId = {};
  (result.results || []).forEach((r) => { byId[r.id] = r; });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className={`px-6 py-4 ${result.passed ? "bg-emerald-50" : "bg-red-50"}`}>
          <div className={`text-lg font-bold ${result.passed ? "text-emerald-800" : "text-red-800"}`}>
            {result.passed ? "Passed 🎉" : "Not quite"}
          </div>
          <div className="text-sm text-slate-600">
            You scored {result.correct}/{result.total} ({pct}%). Need {passPct}% to{" "}
            {isLast ? "finish the course" : "advance"}. · Attempt #{result.attemptNo}
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          {questions.map((q, qi) => {
            const r = byId[q.id] || {};
            const chosen = r.chosen != null ? r.chosen : selected[q.id];
            const correctIndex = r.correctIndex;
            return (
              <div key={q.id}>
                <p className="font-medium mb-1.5">
                  <span className={r.correct ? "text-emerald-600" : "text-red-600"}>{r.correct ? "✓" : "✗"}</span>{" "}
                  {qi + 1}. {q.q}
                </p>
                <ul className="space-y-1">
                  {q.options.map((o, oi) => {
                    const isCorrect = oi === correctIndex;
                    const isChosen = oi === chosen;
                    let cls = "text-sm px-3 py-1.5 rounded-lg border ";
                    if (isCorrect) cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
                    else if (isChosen) cls += "border-red-400 bg-red-50 text-red-800";
                    else cls += "border-slate-200 text-slate-600";
                    return (
                      <li key={oi} className={cls}>
                        {o}
                        {isCorrect && <span className="font-medium"> — correct answer</span>}
                        {isChosen && !isCorrect && <span className="font-medium"> — your answer</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          {result.passed ? (
            <button onClick={onProceed} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
              {isLast ? "Finish course →" : `Next: ${nextTitle} →`}
            </button>
          ) : (
            <button onClick={onTryAgain} className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
