// Thin client for the Google Apps Script backend.
// GET actions use query params; POST actions send a JSON string as text/plain
// (text/plain avoids a CORS preflight that Apps Script can't answer).

import { ENDPOINT } from "../config.js";

async function get(action, params = {}) {
  const url = new URL(ENDPOINT);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function post(action, body = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...body }),
  });
  return res.json();
}

// ---- reads ----
export const resolveUser = (token) => get("resolve", { token });
export const bootstrap = (token) => get("bootstrap", { token });   // { user, passed, attempts, review, notes }
export const fetchState = (token) => get("state", { token });     // { passed, attempts }
export const fetchContent = () => get("content");                  // { review, notes }
export const fetchHelp = () => get("help");                        // { help: [...] }
export const fetchDashboard = () => get("dashboard");              // { summaries, missedQuestions }

// ---- writes ----
export const gradeQuiz = ({ token, course, module, delivered, answers }) =>
  post("grade", { token, course, module, delivered, answers });
export const sendHelp = ({ token, course, module, message }) =>
  post("help", { token, course, module, message });
export const setReviewRemote = ({ course, module, status, feedback, reviewer }) =>
  post("review", { course, module, status, feedback, reviewer });
export const setNoteRemote = ({ course, module, note }) =>
  post("note", { course, module, note });
