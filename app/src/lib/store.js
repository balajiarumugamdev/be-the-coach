/* Local persistence + simulated backend for the mock build.
   In production these functions call the Google Apps Script endpoint instead:
   - grade(): POST answers -> server grades using AnswerKeys (answers never reach the browser)
   - getProgress/recordAttempt(): read/write the Attempts tab
   - approvals/feedback/coachNotes/help: ContentReview, CoachNotes, HelpRequests tabs
   For now everything lives in one localStorage object so Coach/Manager views can see
   what a Trainee did in the same browser. */

import { COURSES } from "../data/courses.js";

const KEY = "leapsup_v1";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
export function resetAll() { localStorage.removeItem(KEY); }

/* ---------- progress (derived from passed attempts) ---------- */
export function getPassed(token, courseId) {
  const s = load();
  return s?.progress?.[token]?.[courseId] || [];
}
function markPassed(token, courseId, moduleId) {
  const s = load();
  s.progress = s.progress || {};
  s.progress[token] = s.progress[token] || {};
  s.progress[token][courseId] = s.progress[token][courseId] || [];
  if (!s.progress[token][courseId].includes(moduleId)) {
    s.progress[token][courseId].push(moduleId);
    save(s);
  }
}

/* ---------- attempts ---------- */
export function getAttempts(token, courseId, moduleId) {
  const s = load();
  return s?.attempts?.[token]?.[courseId]?.[moduleId] || [];
}
function addAttempt(token, courseId, moduleId, record) {
  const s = load();
  s.attempts = s.attempts || {};
  s.attempts[token] = s.attempts[token] || {};
  s.attempts[token][courseId] = s.attempts[token][courseId] || {};
  const arr = s.attempts[token][courseId][moduleId] || [];
  arr.push(record);
  s.attempts[token][courseId][moduleId] = arr;
  save(s);
}

/* ---------- grading (simulates the server-side endpoint) ---------- */
// selected = { questionId: optionIndex }, questions = the delivered subset
// NOTE: answers were stripped from courses.js (they now live only server-side in Code.gs),
// so this LOCAL grader can no longer validate answers — it's a dev stub. Real grading always
// runs server-side (USE_BACKEND=true → api.gradeQuiz). Local mock mode will not pass quizzes.
export function grade(token, courseId, moduleId, questions, selected) {
  const course = COURSES[courseId];
  const module = course.modules.find((m) => m.id === moduleId);
  const threshold = module.quiz.passThreshold;

  let correct = 0;
  const questionResults = questions.map((q) => {
    const bankQ = module.quiz.bank.find((b) => b.id === q.id);
    const ok = selected[q.id] === bankQ.answer;
    if (ok) correct++;
    return { id: q.id, correct: ok };
  });
  const score = correct / questions.length;
  const passed = score >= threshold;

  const attemptNo = getAttempts(token, courseId, moduleId).length + 1;
  addAttempt(token, courseId, moduleId, {
    attemptNo, score, passed, questionResults, ts: Date.now(),
  });
  if (passed) markPassed(token, courseId, moduleId);

  return { passed, score, correct, total: questions.length, attemptNo };
}

/* ---------- coach: approval + feedback ---------- */
// status: 'approved' | 'pending' | 'changes'
export function getReview(courseId, moduleId) {
  const s = load();
  return s?.review?.[courseId]?.[moduleId] || { status: "approved", feedback: "" };
}
export function setReview(courseId, moduleId, status, feedback) {
  const s = load();
  s.review = s.review || {};
  s.review[courseId] = s.review[courseId] || {};
  s.review[courseId][moduleId] = { status, feedback: feedback || "", updatedAt: Date.now() };
  save(s);
}
export function isApproved(courseId, moduleId) {
  return getReview(courseId, moduleId).status === "approved";
}

/* ---------- coach notes shown to trainee ---------- */
export function getCoachNote(courseId, moduleId) {
  const s = load();
  return s?.coachNotes?.[courseId]?.[moduleId] || "";
}
export function setCoachNote(courseId, moduleId, note) {
  const s = load();
  s.coachNotes = s.coachNotes || {};
  s.coachNotes[courseId] = s.coachNotes[courseId] || {};
  s.coachNotes[courseId][moduleId] = note;
  save(s);
}

/* ---------- help requests ("I'm stuck") ---------- */
export function addHelpRequest(token, courseId, moduleId, message) {
  const s = load();
  s.help = s.help || [];
  s.help.push({ token, courseId, moduleId, message: message || "", status: "open", ts: Date.now() });
  save(s);
}
export function getHelpRequests() {
  const s = load();
  return s.help || [];
}
