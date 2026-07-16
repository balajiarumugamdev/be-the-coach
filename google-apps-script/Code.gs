/**
 * Leaps Up — Google Apps Script backend
 * ------------------------------------------------------------------
 * One web app that the static React site calls. It owns:
 *   - the Google Sheet (Roster, Attempts, ContentReview, CoachNotes, HelpRequests, AnswerKeys)
 *   - server-side quiz grading (answer keys live in the private AnswerKeys tab, never in the browser)
 *
 * SETUP (once):
 *   1. Create a blank Google Sheet.
 *   2. Extensions → Apps Script. Delete the sample, paste this whole file.
 *   3. Run  setup()  once (authorise when prompted). It creates the tabs + a sample roster.
 *   4. Deploy → New deployment → type "Web app":
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the /exec URL — that is your ENDPOINT.
 *   5. Paste it into app/src/config.js
 *
 * To re-deploy after editing: Deploy → Manage deployments → edit → Version: New version.
 */

var PASS_THRESHOLD = 0.8;

// Correct answers live in the private `AnswerKeys` tab of the Sheet (NOT in this file, so they
// aren't in the public repo). Columns: course_id | question_id | correct_index.
// Populate it once with seedAnswerKeys() (a temporary snippet), then delete that snippet.

var TABS = {
  Roster: ["token", "name", "email", "role", "track", "start_date"],
  Attempts: ["timestamp", "token", "course_id", "module_id", "attempt_no", "score", "passed", "question_results"],
  ContentReview: ["course_id", "module_id", "status", "feedback", "reviewer", "updated_at"],
  CoachNotes: ["course_id", "module_id", "note", "updated_at"],
  HelpRequests: ["timestamp", "token", "course_id", "module_id", "message", "status"],
  AnswerKeys: ["course_id", "question_id", "correct_index"]
};

/* ============================ SETUP ============================ */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(TABS[name]);
  });
  // sample roster (replace with real people; tokens must be unique + unguessable)
  var roster = ss.getSheetByName("Roster");
  if (roster.getLastRow() === 1) {
    roster.appendRow(["nontech-nina", "Nina", "nina@org.com", "trainee-nontech", "non-technical", new Date()]);
    roster.appendRow(["tech-tara", "Tara", "tara@org.com", "trainee-tech", "technical", new Date()]);
    roster.appendRow(["coach-carlos", "Carlos", "carlos@org.com", "coach", "", new Date()]);
    roster.appendRow(["manager-maya", "Maya", "maya@org.com", "manager", "", new Date()]);
  }
  // remove the default "Sheet1" if empty
  var def = ss.getSheetByName("Sheet1");
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(def);
}

/** Generate one unguessable token. Run and read the log (View -> Logs). */
function makeToken() {
  var t = newToken_();
  Logger.log(t);
  return t;
}

/** Best workflow: in the Roster tab, fill name/email/role/track for each person and
 *  leave the `token` column BLANK. Then run this once — it fills a fresh token for
 *  every row that has a name but no token. No redeploy needed (editor run). */
function fillMissingTokens() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Roster");
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var tokenCol = headers.indexOf("token");
  var nameCol = headers.indexOf("name");
  var made = 0;
  for (var i = 1; i < values.length; i++) {
    var hasName = String(values[i][nameCol]).trim() !== "";
    var hasToken = String(values[i][tokenCol]).trim() !== "";
    if (hasName && !hasToken) {
      sh.getRange(i + 1, tokenCol + 1).setValue(newToken_());
      made++;
    }
  }
  Logger.log(made + " token(s) generated. Copy each person's link: <your-site>/?t=<token>");
}

function newToken_() {
  return Utilities.getUuid().replace(/-/g, "").slice(0, 20);
}

/* ============================ ROUTING ============================ */
function doGet(e) {
  var action = (e.parameter.action || "").toLowerCase();
  var out;
  try {
    if (action === "resolve") out = resolve_(e.parameter.token);
    else if (action === "bootstrap") out = bootstrap_(e.parameter.token);
    else if (action === "state") out = state_(e.parameter.token);
    else if (action === "content") out = content_();
    else if (action === "help") out = { ok: true, help: readRows_("HelpRequests") };
    else if (action === "dashboard") out = dashboard_();
    else out = { ok: false, error: "unknown action" };
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return reply_(out, e.parameter.callback);
}

function doPost(e) {
  var out;
  try {
    var body = JSON.parse(e.postData.contents);
    var action = (body.action || "").toLowerCase();
    if (action === "grade") out = grade_(body);
    else if (action === "help") out = help_(body);
    else if (action === "review") out = review_(body);
    else if (action === "note") out = note_(body);
    else out = { ok: false, error: "unknown action" };
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return reply_(out, null);
}

/* ============================ ACTIONS ============================ */
function resolve_(token) {
  var u = findRoster_(token);
  if (!u) return { ok: false, error: "not found" };
  return { ok: true, user: { name: u.name, email: u.email, role: u.role, track: u.track } };
}

// One call that returns everything a trainee needs on load (user + progress + content),
// so the app pays the round-trip once instead of three times.
function bootstrap_(token) {
  var u = findRoster_(token);
  if (!u) return { ok: false, error: "not found" };
  var st = state_(token);      // { passed, attempts }
  var ct = content_();         // { review, notes }
  return {
    ok: true,
    user: { name: u.name, email: u.email, role: u.role, track: u.track },
    passed: st.passed, attempts: st.attempts,
    review: ct.review, notes: ct.notes
  };
}

// passed modules + attempt counts for one token
function state_(token) {
  var rows = readRows_("Attempts").filter(function (r) { return r.token === token; });
  var passed = {}, attempts = {};
  rows.forEach(function (r) {
    attempts[r.course_id] = attempts[r.course_id] || {};
    attempts[r.course_id][r.module_id] = (attempts[r.course_id][r.module_id] || 0) + 1;
    if (String(r.passed) === "true" || r.passed === true) {
      passed[r.course_id] = passed[r.course_id] || [];
      if (passed[r.course_id].indexOf(r.module_id) === -1) passed[r.course_id].push(r.module_id);
    }
  });
  return { ok: true, passed: passed, attempts: attempts };
}

// approval statuses + coach notes (used by trainee + coach views)
function content_() {
  var review = {}, notes = {};
  readRows_("ContentReview").forEach(function (r) {
    review[r.course_id] = review[r.course_id] || {};
    review[r.course_id][r.module_id] = { status: r.status, feedback: r.feedback };
  });
  readRows_("CoachNotes").forEach(function (r) {
    notes[r.course_id] = notes[r.course_id] || {};
    notes[r.course_id][r.module_id] = r.note;
  });
  return { ok: true, review: review, notes: notes };
}

function answerKey_(courseId) {
  var map = {};
  readRows_("AnswerKeys").forEach(function (r) {
    if (String(r.course_id) === String(courseId)) map[r.question_id] = Number(r.correct_index);
  });
  return map;
}

function grade_(body) {
  var keys = answerKey_(body.course);
  var delivered = body.delivered || [];      // array of question ids shown
  var answers = body.answers || {};          // { qid: optionIndex }
  var correct = 0;
  // Full per-question detail (incl. the correct answer) is returned for the results modal —
  // safe because it only covers the questions already answered, after submission.
  var results = delivered.map(function (qid) {
    var ok = answers[qid] === keys[qid];
    if (ok) correct++;
    return { id: qid, correct: ok, correctIndex: keys[qid], chosen: answers[qid] };
  });
  var total = delivered.length || 1;
  var score = correct / total;
  var passed = score >= PASS_THRESHOLD;

  var attemptNo = countAttempts_(body.token, body.course, body.module) + 1;
  var stored = results.map(function (r) { return { id: r.id, correct: r.correct }; });
  appendRow_("Attempts", {
    timestamp: new Date(), token: body.token, course_id: body.course, module_id: body.module,
    attempt_no: attemptNo, score: score, passed: passed, question_results: JSON.stringify(stored)
  });
  return { ok: true, passed: passed, score: score, correct: correct, total: total, attemptNo: attemptNo, results: results };
}

function help_(body) {
  appendRow_("HelpRequests", {
    timestamp: new Date(), token: body.token, course_id: body.course,
    module_id: body.module, message: body.message || "", status: "open"
  });
  return { ok: true };
}

function review_(body) {
  upsert_("ContentReview", ["course_id", "module_id"], {
    course_id: body.course, module_id: body.module, status: body.status,
    feedback: body.feedback || "", reviewer: body.reviewer || "coach", updated_at: new Date()
  });
  return { ok: true };
}

function note_(body) {
  upsert_("CoachNotes", ["course_id", "module_id"], {
    course_id: body.course, module_id: body.module, note: body.note || "", updated_at: new Date()
  });
  return { ok: true };
}

function dashboard_() {
  var roster = readRows_("Roster");
  var attempts = readRows_("Attempts");
  var trainees = roster.filter(function (r) { return r.role.indexOf("trainee") === 0; });

  var summaries = trainees.map(function (t) {
    var rows = attempts.filter(function (a) { return a.token === t.token; });
    var passedSet = {}, count = {}, lastActive = 0;
    rows.forEach(function (a) {
      var key = a.course_id + "/" + a.module_id;
      count[key] = (count[key] || 0) + 1;
      var ts = new Date(a.timestamp).getTime();
      if (ts > lastActive) lastActive = ts;
      if (String(a.passed) === "true" || a.passed === true) passedSet[key] = true;
    });
    return {
      token: t.token, name: t.name, track: t.track,
      passed: Object.keys(passedSet), attemptCounts: count, lastActive: lastActive,
      totalAttempts: rows.length
    };
  });

  // per-question miss rates
  var miss = {};
  attempts.forEach(function (a) {
    try {
      JSON.parse(a.question_results || "[]").forEach(function (qr) {
        miss[qr.id] = miss[qr.id] || { id: qr.id, miss: 0, seen: 0, course: a.course_id, module: a.module_id };
        miss[qr.id].seen++;
        if (!qr.correct) miss[qr.id].miss++;
      });
    } catch (e2) {}
  });
  return { ok: true, summaries: summaries, missedQuestions: Object.keys(miss).map(function (k) { return miss[k]; }) };
}

/* ============================ HELPERS ============================ */
function sheet_(name) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); }

function readRows_(name) {
  var sh = sheet_(name);
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  return values.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function appendRow_(name, obj) {
  var sh = sheet_(name);
  var headers = sh.getDataRange().getValues()[0];
  sh.appendRow(headers.map(function (h) { return obj[h] !== undefined ? obj[h] : ""; }));
}

function upsert_(name, keyCols, obj) {
  var sh = sheet_(name);
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  for (var i = 1; i < values.length; i++) {
    var match = keyCols.every(function (k) { return String(values[i][headers.indexOf(k)]) === String(obj[k]); });
    if (match) {
      headers.forEach(function (h, c) { if (obj[h] !== undefined) sh.getRange(i + 1, c + 1).setValue(obj[h]); });
      return;
    }
  }
  appendRow_(name, obj);
}

function findRoster_(token) {
  var rows = readRows_("Roster");
  for (var i = 0; i < rows.length; i++) if (String(rows[i].token) === String(token)) return rows[i];
  return null;
}

function countAttempts_(token, course, module) {
  return readRows_("Attempts").filter(function (r) {
    return r.token === token && r.course_id === course && r.module_id === module;
  }).length;
}

function reply_(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
