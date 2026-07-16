/* Single data-access layer used by every view.
   Switches between local mock (localStorage) and the Google Sheets backend
   based on USE_BACKEND in config.js. All functions are async so the two modes
   are interchangeable. Views never import store.js or api.js directly. */

import { USE_BACKEND } from "../config.js";
import { COURSES, ROSTER, findUser, coursesForTrack } from "../data/courses.js";
import * as local from "./store.js";
import * as api from "./api.js";

export async function resolveUser(token) {
  if (!USE_BACKEND) {
    const u = findUser(token);
    return u ? { name: u.name, email: u.email, role: u.role, track: u.track } : null;
  }
  const r = await api.resolveUser(token);
  return r && r.ok ? r.user : null;
}

// One-shot load: user + progress + content. Cuts the on-load waterfall to a single request.
// Returns { user, state:{passed,attempts}, content:{review,notes} } (user null if unknown token).
export async function loadBootstrap(token) {
  if (!USE_BACKEND) {
    const user = await resolveUser(token);
    if (!user) return { user: null };
    const [state, content] = await Promise.all([loadState(token), loadContent()]);
    return { user, state, content };
  }
  const r = await api.bootstrap(token);
  if (!r || !r.ok) return { user: null };
  return {
    user: r.user,
    state: { passed: r.passed || {}, attempts: r.attempts || {} },
    content: { review: r.review || {}, notes: r.notes || {} },
  };
}

// { passed: {courseId:[moduleIds]}, attempts: {courseId:{moduleId:count}} }
export async function loadState(token) {
  if (!USE_BACKEND) {
    const passed = {}, attempts = {};
    Object.values(COURSES).forEach((c) => {
      passed[c.id] = local.getPassed(token, c.id);
      attempts[c.id] = {};
      c.modules.forEach((m) => {
        const n = local.getAttempts(token, c.id, m.id).length;
        if (n) attempts[c.id][m.id] = n;
      });
    });
    return { passed, attempts };
  }
  const r = await api.fetchState(token);
  return { passed: r.passed || {}, attempts: r.attempts || {} };
}

// { review: {courseId:{moduleId:{status,feedback}}}, notes: {courseId:{moduleId:note}} }
export async function loadContent() {
  if (!USE_BACKEND) {
    const review = {}, notes = {};
    Object.values(COURSES).forEach((c) => {
      review[c.id] = {}; notes[c.id] = {};
      c.modules.forEach((m) => {
        review[c.id][m.id] = local.getReview(c.id, m.id);
        const note = local.getCoachNote(c.id, m.id);
        if (note) notes[c.id][m.id] = note;
      });
    });
    return { review, notes };
  }
  const r = await api.fetchContent();
  return { review: r.review || {}, notes: r.notes || {} };
}

// args: { token, course, module, delivered, answers, questions }
export async function gradeQuiz(args) {
  if (!USE_BACKEND) {
    return local.grade(args.token, args.course, args.module, args.questions, args.answers);
  }
  return api.gradeQuiz({
    token: args.token, course: args.course, module: args.module,
    delivered: args.delivered, answers: args.answers,
  });
}

export async function sendHelp({ token, course, module, message }) {
  if (!USE_BACKEND) { local.addHelpRequest(token, course, module, message); return { ok: true }; }
  return api.sendHelp({ token, course, module, message });
}

export async function saveReview({ course, module, status, feedback, reviewer }) {
  if (!USE_BACKEND) { local.setReview(course, module, status, feedback); return { ok: true }; }
  return api.setReviewRemote({ course, module, status, feedback, reviewer });
}

export async function saveNote({ course, module, note }) {
  if (!USE_BACKEND) { local.setCoachNote(course, module, note); return { ok: true }; }
  return api.setNoteRemote({ course, module, note });
}

export async function loadHelp() {
  if (!USE_BACKEND) {
    return local.getHelpRequests().map((h) => ({
      token: h.token, courseId: h.courseId, moduleId: h.moduleId, message: h.message,
    }));
  }
  const r = await api.fetchHelp();
  return (r.help || []).map((h) => ({
    token: h.token, courseId: h.course_id, moduleId: h.module_id, message: h.message,
  }));
}

// { summaries: [{token,name,track,passed:['c/m'],attemptCounts:{'c/m':n},lastActive,totalAttempts}],
//   missedQuestions: [{id,miss,seen,course,module}] }
export async function loadDashboard() {
  if (!USE_BACKEND) {
    const trainees = ROSTER.filter((r) => r.role.startsWith("trainee"));
    const summaries = trainees.map((t) => {
      const passed = [], attemptCounts = {};
      let lastActive = 0, totalAttempts = 0;
      coursesForTrack(t.track).forEach((c) => {
        local.getPassed(t.token, c.id).forEach((mid) => passed.push(`${c.id}/${mid}`));
        c.modules.forEach((m) => {
          const arr = local.getAttempts(t.token, c.id, m.id);
          if (arr.length) {
            attemptCounts[`${c.id}/${m.id}`] = arr.length;
            totalAttempts += arr.length;
            arr.forEach((a) => { if (a.ts > lastActive) lastActive = a.ts; });
          }
        });
      });
      return { token: t.token, name: t.name, track: t.track, passed, attemptCounts, lastActive, totalAttempts };
    });

    const miss = {};
    trainees.forEach((t) => {
      coursesForTrack(t.track).forEach((c) => {
        c.modules.forEach((m) => {
          local.getAttempts(t.token, c.id, m.id).forEach((a) => {
            (a.questionResults || []).forEach((qr) => {
              miss[qr.id] = miss[qr.id] || { id: qr.id, miss: 0, seen: 0, course: c.id, module: m.id };
              miss[qr.id].seen++;
              if (!qr.correct) miss[qr.id].miss++;
            });
          });
        });
      });
    });
    return { summaries, missedQuestions: Object.values(miss) };
  }
  const r = await api.fetchDashboard();
  return { summaries: r.summaries || [], missedQuestions: r.missedQuestions || [] };
}
