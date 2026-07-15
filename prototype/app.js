/* Prototype logic. Runs entirely from local files — no server, no Sheet yet.
   Progress + coach approvals are stored in one localStorage object so the
   Manager/Coach views can "see" what a Trainee did in the same browser. */

var STORE_KEY = "btc_prototype_v1";

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

function getCompleted(token, courseId) {
  var s = loadStore();
  return (s.progress && s.progress[token] && s.progress[token][courseId]) || [];
}
function markComplete(token, courseId, moduleId) {
  var s = loadStore();
  s.progress = s.progress || {};
  s.progress[token] = s.progress[token] || {};
  s.progress[token][courseId] = s.progress[token][courseId] || [];
  if (s.progress[token][courseId].indexOf(moduleId) === -1) {
    s.progress[token][courseId].push(moduleId);
    saveStore(s);
  }
}
// Coach approvals: default approved unless explicitly set false.
function isApproved(courseId, moduleId) {
  var s = loadStore();
  if (s.approvals && s.approvals[courseId] && s.approvals[courseId][moduleId] === false) return false;
  return true;
}
function toggleApproval(courseId, moduleId) {
  var s = loadStore();
  s.approvals = s.approvals || {};
  s.approvals[courseId] = s.approvals[courseId] || {};
  var cur = s.approvals[courseId][moduleId];
  s.approvals[courseId][moduleId] = (cur === false) ? true : false;
  saveStore(s);
}

/* ---------- routing helpers ---------- */
function getToken() { return new URLSearchParams(location.search).get("t"); }
function findUser(token) {
  return APP_DATA.roster.filter(function (r) { return r.token === token; })[0];
}
function coursesForTrack(track) {
  return Object.keys(APP_DATA.courses)
    .map(function (k) { return APP_DATA.courses[k]; })
    .filter(function (c) { return c.track === track; });
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* ---------- in-memory view state ---------- */
var state = { courseId: null, moduleId: null };

function go(patch) { Object.assign(state, patch); render(); }
window.go = go;

/* ---------- render ---------- */
function render() {
  var token = getToken();
  var top = document.getElementById("topbar");
  var app = document.getElementById("app");
  renderDevBar(token);

  if (!token) { top.innerHTML = brandOnly(); return renderLauncher(app); }
  var user = findUser(token);
  if (!user) { top.innerHTML = brandOnly(); return renderDenied(app); }

  top.innerHTML = brandOnly() +
    '<div class="who">' + esc(user.name) +
    '<span class="role-chip">' + esc(APP_DATA.roleLabels[user.role]) + "</span></div>";

  if (user.role === "coach") return renderCoach(app, user);
  if (user.role === "manager") return renderManager(app, user);
  return renderTrainee(app, user); // trainee-tech / trainee-nontech
}

function brandOnly() { return '<div class="brand">Leaps&nbsp;Up</div>'; }

/* ---------- launcher (no token) ---------- */
function renderLauncher(app) {
  var cards = APP_DATA.roster.map(function (r) {
    return '<div class="card" onclick="location.search=\'?t=' + r.token + '\'">' +
      "<h3>" + esc(APP_DATA.roleLabels[r.role]) + "</h3>" +
      "<p>Open as <strong>" + esc(r.name) + "</strong></p>" +
      '<div class="meta">?t=' + r.token + "</div></div>";
  }).join("");
  app.innerHTML =
    '<div class="launcher-hero"><h1>Leaps Up — Prototype</h1>' +
    "<p>Pick a role to open its personal link. Each link is what a real person would receive.</p></div>" +
    '<div class="grid">' + cards + "</div>";
}

function renderDenied(app) {
  app.innerHTML = '<div class="denied"><h2>Access denied</h2>' +
    "<p>This link isn't recognised. Ask your coach for your personal link.</p>" +
    '<div class="btn-row" style="justify-content:center"><a class="btn" href="?">Back to demo launcher</a></div></div>';
}

/* ---------- trainee ---------- */
function renderTrainee(app, user) {
  var courses = coursesForTrack(user.track);
  if (!state.courseId) {
    var cards = courses.map(function (c) {
      var done = getCompleted(user.token, c.id).length;
      return '<div class="card" onclick="go({courseId:\'' + c.id + '\'})">' +
        "<h3>" + esc(c.title) + "</h3><p>" + esc(c.description) + "</p>" +
        '<div class="meta">' + done + " / " + c.modules.length + " modules complete</div></div>";
    }).join("");
    app.innerHTML = "<h1>Your courses</h1>" +
      "<p style='color:var(--muted)'>Select a course to begin. You'll work through modules in order.</p>" +
      '<div class="grid">' + cards + "</div>";
    return;
  }
  renderCourse(app, user, APP_DATA.courses[state.courseId]);
}

function moduleUnlocked(user, course, idx) {
  if (idx === 0) return true;
  var completed = getCompleted(user.token, course.id);
  return completed.indexOf(course.modules[idx - 1].id) !== -1;
}

function renderCourse(app, user, course) {
  var completed = getCompleted(user.token, course.id);
  // default open module = first not-completed & unlocked, else the selected one
  if (!state.moduleId) {
    var firstIdx = 0;
    for (var i = 0; i < course.modules.length; i++) {
      if (completed.indexOf(course.modules[i].id) === -1) { firstIdx = i; break; }
      firstIdx = Math.min(i + 1, course.modules.length - 1);
    }
    state.moduleId = course.modules[firstIdx].id;
  }

  var pct = Math.round((completed.length / course.modules.length) * 100);

  var items = course.modules.map(function (m, idx) {
    var isDone = completed.indexOf(m.id) !== -1;
    var unlocked = moduleUnlocked(user, course, idx);
    var isActive = m.id === state.moduleId;
    var dot = isDone ? '<span class="dot status-done">✓</span>'
      : (unlocked ? '<span class="dot status-current">•</span>' : '<span class="dot status-locked">🔒</span>');
    var cls = "track-item" + (isActive ? " active" : "") + (unlocked ? "" : " locked");
    var click = unlocked ? " onclick=\"go({moduleId:'" + m.id + "'})\"" : "";
    return '<div class="' + cls + '"' + click + ">" + dot +
      "<span>" + (idx) + ". " + esc(m.title) + "</span></div>";
  }).join("");

  var tracker =
    '<aside class="tracker"><h4>' + esc(course.title) + "</h4>" +
    '<div class="progressbar"><span style="width:' + pct + '%"></span></div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:12px">' + completed.length +
    " of " + course.modules.length + " complete (" + pct + "%)</div>" +
    items + "</aside>";

  var module = course.modules.filter(function (m) { return m.id === state.moduleId; })[0];
  var idx = course.modules.indexOf(module);
  var main = '<section class="content-panel">' + module.content +
    renderQuiz(user, course, module, idx) + "</section>";

  app.innerHTML =
    '<div class="breadcrumb"><a onclick="go({courseId:null,moduleId:null})">Your courses</a> › ' +
    esc(course.title) + "</div>" +
    '<div class="course-layout">' + tracker + main + "</div>";
}

function renderQuiz(user, course, module, idx) {
  var completed = getCompleted(user.token, course.id).indexOf(module.id) !== -1;
  var qs = module.quiz.questions.map(function (q, qi) {
    var opts = q.options.map(function (o, oi) {
      return '<label><input type="radio" name="q' + qi + '" value="' + oi + '"> ' + esc(o) + "</label>";
    }).join("");
    return '<div class="q"><p>' + (qi + 1) + ". " + esc(q.q) + "</p>" + opts + "</div>";
  }).join("");

  var doneNote = completed
    ? '<div class="quiz-result pass">✓ You already passed this module.</div>'
    : "";

  var nextLabel = (idx + 1 < course.modules.length)
    ? "unlock Module " + (idx + 1) : "finish the course";

  return '<div class="quiz"><h3>Quick check</h3>' +
    "<p style='color:var(--muted);margin-top:-6px'>Pass to " + nextLabel + ".</p>" +
    qs +
    '<div class="btn-row"><button class="btn primary" onclick="submitQuiz(\'' + course.id + "','" + module.id + "')\">Submit answers</button></div>" +
    '<div id="quiz-feedback">' + doneNote + "</div></div>";
}

window.submitQuiz = function (courseId, moduleId) {
  var user = findUser(getToken());
  var course = APP_DATA.courses[courseId];
  var module = course.modules.filter(function (m) { return m.id === moduleId; })[0];
  var correct = 0, answered = 0;
  module.quiz.questions.forEach(function (q, qi) {
    var sel = document.querySelector('input[name="q' + qi + '"]:checked');
    if (sel) { answered++; if (parseInt(sel.value, 10) === q.answer) correct++; }
  });
  var total = module.quiz.questions.length;
  var fb = document.getElementById("quiz-feedback");
  if (answered < total) {
    fb.innerHTML = '<div class="quiz-result fail">Please answer all ' + total + " questions.</div>";
    return;
  }
  var ratio = correct / total;
  if (ratio >= module.quiz.passThreshold) {
    markComplete(user.token, courseId, moduleId);
    fb.innerHTML = '<div class="quiz-result pass">✓ Passed — ' + correct + "/" + total +
      " correct. The next module is now unlocked.</div>";
    // re-render tracker so the next module unlocks; keep the same module open
    setTimeout(render, 700);
  } else {
    fb.innerHTML = '<div class="quiz-result fail">Not quite — ' + correct + "/" + total +
      " correct. Review the module and try again.</div>";
  }
};

/* ---------- coach ---------- */
function renderCoach(app, user) {
  if (!state.courseId) {
    var cards = Object.keys(APP_DATA.courses).map(function (k) {
      var c = APP_DATA.courses[k];
      return '<div class="card" onclick="go({courseId:\'' + c.id + '\'})">' +
        "<h3>" + esc(c.title) + "</h3><p>" + esc(c.description) + "</p>" +
        '<div class="meta">' + c.modules.length + " modules · track: " + c.track + "</div></div>";
    }).join("");
    app.innerHTML = "<h1>Coach — review & approve content</h1>" +
      "<p style='color:var(--muted)'>Pick a course to review each module and approve it for trainees.</p>" +
      '<div class="grid">' + cards + "</div>";
    return;
  }
  var course = APP_DATA.courses[state.courseId];
  if (!state.moduleId) state.moduleId = course.modules[0].id;

  var rows = course.modules.map(function (m) {
    var approved = isApproved(course.id, m.id);
    var badge = approved ? '<span class="badge approved">Approved</span>'
      : '<span class="badge pending">Pending</span>';
    var active = m.id === state.moduleId ? " active" : "";
    return '<div class="track-item' + active + '" onclick="go({moduleId:\'' + m.id + '\'})">' +
      "<span style='flex:1'>" + esc(m.title) + "</span>" + badge + "</div>";
  }).join("");

  var module = course.modules.filter(function (m) { return m.id === state.moduleId; })[0];
  var approved = isApproved(course.id, module.id);
  var toggle = '<div class="btn-row">' +
    '<button class="btn ' + (approved ? "" : "primary") + '" onclick="coachToggle(\'' + course.id + "','" + module.id + "')\">" +
    (approved ? "Mark as Pending" : "Approve for trainees") + "</button></div>";

  app.innerHTML =
    '<div class="breadcrumb"><a onclick="go({courseId:null,moduleId:null})">All courses</a> › ' + esc(course.title) + "</div>" +
    '<div class="course-layout">' +
      '<aside class="tracker"><h4>Modules</h4>' + rows + "</aside>" +
      '<section class="content-panel">' + module.content + toggle + "</section>" +
    "</div>";
}

window.coachToggle = function (courseId, moduleId) {
  toggleApproval(courseId, moduleId);
  render();
};

/* ---------- manager dashboard ---------- */
function renderManager(app, user) {
  var trainees = APP_DATA.roster.filter(function (r) { return r.role.indexOf("trainee") === 0; });
  var rows = trainees.map(function (t) {
    var courses = coursesForTrack(t.track);
    return courses.map(function (c) {
      var done = getCompleted(t.token, c.id).length;
      var total = c.modules.length;
      var pct = Math.round((done / total) * 100);
      return "<tr><td>" + esc(t.name) + "</td>" +
        "<td>" + esc(APP_DATA.roleLabels[t.role]) + "</td>" +
        "<td>" + esc(c.title) + "</td>" +
        "<td><span class='mini-bar'><span style='width:" + pct + "%'></span></span>" +
        done + " / " + total + " (" + pct + "%)</td></tr>";
    }).join("");
  }).join("");

  app.innerHTML = "<h1>Program Manager — progress dashboard</h1>" +
    "<p style='color:var(--muted)'>Live view of every trainee. In the real build this reads the Google Sheet; " +
    "here it reflects progress made in this browser — open as a trainee, pass a few quizzes, then come back.</p>" +
    "<table><thead><tr><th>Name</th><th>Role</th><th>Course</th><th>Progress</th></tr></thead><tbody>" +
    rows + "</tbody></table>";
}

/* ---------- dev bar (role switcher) ---------- */
function renderDevBar(token) {
  var links = APP_DATA.roster.map(function (r) {
    var on = r.token === token ? " style='border-color:var(--accent);color:var(--accent)'" : "";
    return "<a href='?t=" + r.token + "'" + on + ">" + esc(APP_DATA.roleLabels[r.role]) + "</a>";
  }).join("");
  document.getElementById("devbar").innerHTML =
    "<span class='tag'>DEMO</span> switch role:" + links +
    "<a href='?'>launcher</a>" +
    "<a href='#' onclick=\"localStorage.removeItem('" + STORE_KEY + "');location.reload();return false;\">reset progress</a>";
}

/* reset view state when the token in the URL changes */
render();
