# Leaps Up — Adding a New Course

A course has **two halves that must stay in sync**:

| Half | Lives in | Who sees it |
|------|----------|-------------|
| **Questions + lessons** | `app/src/data/courses.js` (the `COURSES` object) | Ships to the browser — trainees |
| **Answers** | The private **`AnswerKeys`** tab in the Google Sheet | Server only — used for grading |

The golden rule: **question IDs must match exactly** between `courses.js` and the `AnswerKeys`
tab, or those questions won't grade.

> This is a content + deploy task (not a portal button yet). The intended flow is: describe the
> course → **Claude generates both halves in sync** → you paste them in and deploy → coach reviews.

---

## Step 1 — Author the content (with Claude)

Describe the course to Claude and have it produce, with **matching IDs**:
1. a `courses.js` course object (questions as `{ id, q, options }` — **no answers**), and
2. the `AnswerKeys` rows (`course_id | question_id | correct_index`).

Requirements to state:
- track: `non-technical` or `technical`
- an **intro** (what it's about, the 80% / ≥5-question rule, the final project)
- each module: a lesson + a quiz **bank of ≥5 questions** (more is better — they're drawn at random)

## Step 2 — Add the course to `courses.js`

Add a new key to the `COURSES` object. Shape:

```js
"sales-basics": {                       // unique course id (used as a prefix for question ids)
  id: "sales-basics",
  track: "non-technical",               // or "technical"
  title: "Course title",
  description: "One-line description shown on the course card.",
  intro: {
    about: `<p>What this course is about…</p>`,
    passing: `<p>You need <strong>80%</strong> across at least 5 questions to advance…</p>`,
    capstone: `<p><strong>Final project:</strong> what they'll build…</p>`,
  },
  helpNote: `<strong>Stuck?</strong> Stop and reach out to your coach.`,
  modules: [
    {
      id: "sales-basics-m0",            // unique module id
      title: "Module 0 — …",
      minutes: 15,
      approved: true,
      content: `<h2>Module 0 — …</h2><p>Lesson HTML…</p>`,
      quiz: quiz([                       // `quiz()` helper is already defined in courses.js
        { id: "sales-basics-m0q1", q: "Question?", options: ["A", "B", "C", "D"] },
        { id: "sales-basics-m0q2", q: "Question?", options: ["A", "B", "C", "D"] },
        { id: "sales-basics-m0q3", q: "Question?", options: ["A", "B", "C", "D"] },
        { id: "sales-basics-m0q4", q: "Question?", options: ["A", "B", "C", "D"] },
        { id: "sales-basics-m0q5", q: "Question?", options: ["A", "B", "C", "D"] },
      ]),
    },
    // …more modules…
  ],
},
```

Notes:
- **No `answer` field** — answers live only in the Sheet.
- Prefix every question id with the course id (e.g. `sales-basics-m0q1`) so ids are globally unique.
- Modules are **visible to trainees by default**. A coach can hide one by opening the Coach view
  and choosing **Request changes** / **Mark pending** (that writes the `ContentReview` tab).

## Step 3 — Add the answers to the `AnswerKeys` tab

In the Google Sheet's **`AnswerKeys`** tab, **append** one row per question (don't touch existing
rows):

```
course_id      question_id          correct_index
sales-basics   sales-basics-m0q1    2
sales-basics   sales-basics-m0q2    0
…
```

`correct_index` is the 0-based position of the correct option (first option = 0).

> **No Apps Script redeploy needed** for this — grading reads the tab live at submit time. Only
> `courses.js` changes require a deploy (Step 4), because that's what ships the questions.

## Step 4 — Deploy

Commit and push (`git push`) — GitHub Actions rebuilds and republishes the app in ~1–2 min. The
new course appears automatically for trainees on that `track`.

## Step 5 — Assign & review

- Trainees on the course's `track` see it automatically. (Add/adjust people's `track` in the
  `Roster` tab as needed.)
- The **coach** can review each module in the Coach view and leave a trainee note or request changes.

---

## Checklist for a new course
- [ ] Questions added to `courses.js` (no answer fields), ids prefixed with the course id
- [ ] Each module quiz has **≥ 5 questions**
- [ ] Answer rows appended to the **`AnswerKeys`** tab, ids matching exactly
- [ ] `correct_index` is 0-based
- [ ] Pushed (app redeploys); no Apps Script redeploy needed for the answers
- [ ] Spot-check: open the course, take a quiz, confirm it grades correctly

## Prompt to give Claude
> "Create a new Leaps Up course for the **&lt;track&gt;** track called **&lt;title&gt;**. It should
> teach **&lt;topic&gt;** and its final project is **&lt;capstone&gt;**. Give me: (1) the `courses.js`
> course object with an intro and N modules, each with a lesson and a quiz bank of at least 5
> questions as `{id, q, options}` with **no answer fields**, ids prefixed with the course id; and
> (2) the matching `AnswerKeys` rows as `course_id | question_id | correct_index` (0-based).
> Keep the ids identical across both."
