import { useState } from "react";
import { coursesForTrack } from "../data/courses.js";
import { gradeQuiz, sendHelp } from "../lib/dataLayer.js";
import CourseIntro from "./CourseIntro.jsx";
import CourseView from "./CourseView.jsx";

// Receives the already-loaded bootstrap data + a reload() from App (one shared fetch).
export default function TraineeHome({ user, boot, reload }) {
  const [nav, setNav] = useState({ screen: "list", courseId: null, moduleId: null });
  const courses = coursesForTrack(user.track);

  const passedFor = (cid) => boot.state?.passed?.[cid] || [];
  const attemptsFor = (cid) => boot.state?.attempts?.[cid] || {};
  const reviewFor = (cid) => boot.content?.review?.[cid] || {};
  const notesFor = (cid) => boot.content?.notes?.[cid] || {};

  const onGrade = async ({ course, module, delivered, answers, questions }) => {
    const r = await gradeQuiz({ token: user.token, course, module, delivered, answers, questions });
    await reload();
    return r;
  };
  const onHelp = async ({ course, module, message }) => {
    await sendHelp({ token: user.token, course, module, message });
    await reload();
  };

  if (nav.screen === "intro") {
    const course = courses.find((c) => c.id === nav.courseId);
    return (
      <CourseIntro
        course={course}
        onStart={() => setNav({ screen: "course", courseId: course.id, moduleId: null })}
        onBack={() => setNav({ screen: "list", courseId: null, moduleId: null })}
      />
    );
  }

  if (nav.screen === "course") {
    const course = courses.find((c) => c.id === nav.courseId);
    return (
      <CourseView
        user={user}
        course={course}
        passedList={passedFor(course.id)}
        attemptsMap={attemptsFor(course.id)}
        review={reviewFor(course.id)}
        notes={notesFor(course.id)}
        moduleId={nav.moduleId}
        setModuleId={(id) => setNav((n) => ({ ...n, moduleId: id }))}
        onBack={() => setNav({ screen: "list", courseId: null, moduleId: null })}
        onGrade={onGrade}
        onHelp={onHelp}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Your courses</h1>
      <p className="text-slate-500 mb-6">Select a course to begin. You'll work through modules in order.</p>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setNav({ screen: "intro", courseId: c.id, moduleId: null })}
            className="text-left bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-500 hover:-translate-y-0.5 transition"
          >
            <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
            <p className="text-sm text-slate-500 m-0">{c.description}</p>
            <div className="mt-3 text-xs text-slate-400">
              {passedFor(c.id).length} / {c.modules.length} modules complete
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
