export default function CourseIntro({ course, onStart, onBack }) {
  const { intro, helpNote } = course;
  return (
    <div>
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 mb-3">
        ← Your courses
      </button>
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{course.title}</h1>

        <Section title="About this course" html={intro.about} />
        <Section title="How passing works" html={intro.passing} />
        <Section title="What you'll build" html={intro.capstone} />

        <div
          className="mt-6 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg px-4 py-3 text-sm"
          dangerouslySetInnerHTML={{ __html: helpNote }}
        />

        <button
          onClick={onStart}
          className="mt-7 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Start course →
        </button>
      </div>
    </div>
  );
}

function Section({ title, html }) {
  return (
    <div className="mb-5">
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-700 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
