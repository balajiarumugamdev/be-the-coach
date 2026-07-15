# Leaps Up — Build Spec (locked decisions)

> Authoritative reference for the training platform build. Captures decisions made as of
> 2026-07-15. Supersedes the exploratory notes where they differ.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Approach | **A — static frontend + Google Sheets** (not Supabase, for now) |
| Frontend | **React + Tailwind**, built with **Vite**, deployed static to **GitHub Pages** |
| Identity / login | **Unguessable per-person token** in the URL (`?t=…`), honor-system |
| Progress source | **Sheet-as-truth** (read on load; localStorage is only a cache) |
| Quiz grading | **Server-side** in Google Apps Script (answer keys never shipped to the browser) |
| Pass rule | **≥ 5 questions per module, 80% required** to advance |
| Sequencing | Strict: a module unlocks only when the previous module is passed |

## Roles & access

| Role (Roster value) | Label | Can see |
|---------------------|-------|---------|
| `trainee-nontech` | Non-Technical Trainee | Their track's course(s): content + own progress |
| `trainee-tech` | Technical Trainee | Their track's course(s): content + own progress |
| `coach` | Coach | All content; approve / request-changes + feedback |
| `manager` | Program Manager | **Course/module titles + stats only — NOT lesson content** |

## Identity (token)

- Token = long random string (16–24 chars, crypto RNG). **Unique = one token → one person.**
- Resolved by looking it up in the `Roster` tab → returns `{ name, email, role, track }`.
- Unknown token → "Access denied". Lost/leaked → issue a new token, retire the old row.

## Content model (lives in the git repo, versioned)

```
content/
  <track>/                       # non-technical | technical
    roadmap.json                 # course-level: intro, passing rule, capstone, ordered modules + approved flags
    <module-id>/
      content.md                 # the lesson
      quiz.json                  # questions + options ONLY (no answers shipped)
```

**`roadmap.json` (per course)** includes:
- `title`, `description`
- `intro` — shown before Module 0: **what the course is**, **the passing rule (80%, ≥5 Qs)**, and **the final project the trainee will build**
- `helpNote` — the "if you're stuck, stop and reach out to your coach" message
- `modules[]` — ordered `{ id, title, minutes, approved }`

**`quiz.json` (per module)**
- `questions[]` — each `{ id, q, options[] }` (≥ 5; a larger **question bank** is allowed)
- `deliverCount` — how many to show per attempt (e.g. 5, randomly drawn from the bank)
- `passThreshold` — `0.8`
- **Answer keys are NOT here** — see grading below.

## Google Sheet (dynamic, per-person data — never content)

| Tab | Columns | Purpose |
|-----|---------|---------|
| `Roster` | token, name, email, role, track, start_date | Identity + role resolution |
| `Attempts` | timestamp, token, course_id, module_id, attempt_no, score, passed, question_results | Every quiz attempt (`question_results` = per-question correct/incorrect, for analytics) |
| `ContentReview` | course_id, module_id, status, feedback, reviewer, updated_at | Coach approval + feedback history |
| `HelpRequests` | timestamp, token, course_id, module_id, message, status | "I'm stuck" flags for the coach queue |
| `CoachNotes` | token, course_id, module_id, note, updated_at | Coach guidance shown to the trainee on a module |
| `AnswerKeys` | course_id, module_id, question_id, correct_index | **Server-side answer keys** (never shipped to browser) |

## Quiz grading (server-side)

```
Trainee submits answers ─► POST to Apps Script endpoint
                           ├─ look up correct answers in AnswerKeys
                           ├─ score it; pass = score ≥ 80%
                           ├─ append a row to Attempts (with attempt_no)
                           └─ return { passed, score } only
Client unlocks next module only if the server says passed.
```

- Answer keys stay in the Sheet, so they can't be read from page source.
- **Question bank + randomize:** draw N questions per attempt from the bank so retries can't be memorized.
- **Repo visibility (current):** the repo is **public** so it can deploy free on GitHub Pages.
  As a result, **quiz answers are exposed** — `ANSWER_KEYS` in `google-apps-script/Code.gs` and
  the `answer` fields in `app/src/data/mockData.js` are readable in source (and mockData already
  ships in the client bundle). **Accepted for now** because the repo link is not shared and the
  quizzes are low-stakes internal checks (honor-system). See "Known trade-offs" below.

## Coach approval & feedback loop

```
Claude drafts module → Coach view → read
   ├─ Approve          → visible to trainees
   └─ Request changes  → feedback saved to ContentReview → we revise → re-review
```
Trainees only ever see **approved** modules.

## Program Manager dashboard (titles + stats, no content)

Planned metrics:
- Per-trainee: modules complete / total, % progress, last-active, stalled flag.
- Per-module: completion rate, **average attempts**, average score.
- **Struggling flag:** learner+module where attempts ≥ 3 or low average score.
- **Per-question failure rate** — pinpoints confusing lesson content.

## Required content conventions

- Every course opens with the **intro** (purpose, 80%/5-question rule, the capstone project).
- Every module shows the **"stuck? stop and contact your coach"** note.
- Every module quiz has **≥ 5 questions**; **80%** to advance.
- Attempts are tracked per module for struggle analysis.

## Committed features (all in scope)

| # | Feature | What it does | Data / impl impact |
|---|---------|--------------|--------------------|
| 1 | **Server-side grading** | Endpoint grades, hides answer keys, enforces the 80% gate | `AnswerKeys` tab; grade in Apps Script |
| 2 | **Question bank + randomize** | Draw N questions per attempt from a larger bank so retries can't be memorized | `quiz.json` holds bank; `deliverCount` per attempt |
| 3 | **"I'm stuck — notify my coach" button** | Learner flags they're stuck on a module; coach gets a queue | `HelpRequests` tab; coach view shows the queue |
| 4 | **Per-question failure analytics** | Dashboard shows which question is failed most → pinpoints confusing content | Derived from `Attempts` (store per-question result) |
| 5 | **Struggling flag** | Auto-flag learner+module when attempts ≥ 3 or low average score | Derived from `Attempts` |
| 6 | **Stalled flag** | Flag learners inactive for N days mid-course | Derived from `Attempts` timestamps |
| 7 | **Completion certificate/badge** | Issued when a learner passes all modules of a course | Derived (all modules passed); render a printable certificate |
| 8 | **Retake cooldown** | After repeated fails on a module, enforce a wait / require coach contact before retrying | Endpoint checks recent `Attempts` before accepting a submit |
| 9 | **Email reminders** | Nudge stalled learners automatically | Scheduled Apps Script trigger; emails from `Roster` |
| 10 | **Coach notes visible to trainee** | Coach can leave guidance the trainee sees on a module | `CoachNotes` tab (token, module, note, updated_at) |

To support #4, `Attempts` should also record the per-question outcome (e.g. a
`question_results` column: which question ids were correct/incorrect that attempt).

## Known trade-offs (revisit later)

- **Public repo → answers exposed (accepted for now, 2026-07-15).** Deploying on GitHub Pages
  free requires a public repo, which exposes the quiz answer keys (see Repo visibility above).
  This weakens the "80% gate can't be bypassed" guarantee. Mitigation for now: the repo link is
  not shared. **Planned fix:** switch to a **private repo + Vercel** (Vercel deploys private
  repos free), and move answer keys out of the client — then the gate is meaningful again.

## Open items

- [x] Repo visibility → **public** for GitHub Pages (answers exposed, accepted for now; revisit with private + Vercel).
- [x] Token-generation helper for the coach (`fillMissingTokens` / `makeToken` in Code.gs).
- [ ] Define exact course intro copy + capstone description for the non-technical track.
- [ ] (Later) Move answer keys to a private `AnswerKeys` Sheet tab + strip answers from the client bundle.
