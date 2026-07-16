# Demo Prompt Library — Build a To-Do App with Claude (Coach's live demo)

Use this while you teach. **You** build a simple To-Do app live (screen-shared); **trainees**
build the Teacher-Info form alongside using the same moves. The To-Do app deliberately has
**no backend** (tasks are saved in the browser's `localStorage`), so the demo stays focused on
the *workflow* — describe → let Claude build → run → test → commit — not on Microsoft setup.

**How to use:** copy each 🗣️ prompt into the Claude Code panel, run it, and narrate the
*"Point out"* note so trainees see the concept, not just the result. Prompts are in order.

> **The loop to repeat all demo:** spec a feature → let Claude build it → run it → write its
> tests → commit → next feature. Say it out loud every few steps.

---

## 0. The initial idea — tell Claude what you want
**Teaches:** start by describing intent; ask Claude to *plan before coding*.
```
I want to build a simple to-do app, and I'm a beginner — you'll write all the code.
The idea: a web page where I can add tasks, mark them done, delete them, filter by
All / Active / Completed, and my tasks should still be there after I refresh the page.
Don't write any code yet. Confirm you understand, and ask me anything that's unclear.
```
**Point out:** a clear description gets a clear result; we start by aligning, not coding.

## 1. Create the CLAUDE.md — the project's rules
**Teaches:** `CLAUDE.md` is persistent context Claude reads every session, so you don't repeat yourself.
```
Create a CLAUDE.md for this project. Include:
- What it is: a beginner-friendly to-do app.
- Tech: React + Vite + Tailwind, data saved in the browser's localStorage (no backend).
- Rules: keep it simple; explain each change in plain English; build ONE feature at a time;
  always keep the app working; never add a dependency without telling me what and why.
- How to run it (npm run dev) and how to run tests (npm test).
Keep it short.
```
**Point out:** open the file after — this is the "onboarding note" Claude now reads automatically.

## 2. Create the feature plan — FEATURES.md
**Teaches:** plan the work as a checklist before building; smallest first.
```
Create a FEATURES.md listing the features for this to-do app as a checklist, in the order we
should build them, smallest first: add a task, show the task list, mark a task done/undone,
delete a task, edit a task, filter (All/Active/Completed) with a remaining-count, clear
completed, and save to localStorage so tasks persist. For each, one line describing what
"done" looks like. Don't build anything yet.
```
**Point out:** we now have a living plan; we'll check items off as we go.

## 3. Spec the first feature
**Teaches:** spec each feature before building — and the spec becomes the test list.
```
Let's spec just the first feature: "add a task". Turn it into a short spec: what the user
does, the rules (an empty or spaces-only task is rejected; trim the text), and what success
looks like (the new task appears at the top of the list and the input box clears). Ask me
anything unclear, then wait — don't build yet.
```
**Point out:** each rule here will become a test in step 8. "If you can't test a rule, it isn't clear enough."

## 4. Confirm the tech (quick)
**Teaches:** understand *why* React (interactive, stateful, persists) over plain HTML.
```
Quick check before building: this app has changing data that must persist. In one sentence,
confirm React + Vite + Tailwind + localStorage is a sensible choice for a beginner, and why.
```
**Point out:** contrast with the teacher form — same stack, different storage (localStorage vs Excel).

## 5. Scaffold and run
**Teaches:** scaffolding installs React; adding Tailwind is your first *dependency*.
```
Create the React app with Vite in a folder called todo-app, add Tailwind and set it up,
install everything, then start it and give me the web address. One step at a time.
```
**Point out:** show `package.json` — React and Tailwind now listed as dependencies.

## 6. Put it under version control
**Teaches:** save points; the add → commit → push flow.
```
Set up Git for this project and make the first commit with the message "scaffold + tailwind".
Then, in one line each, tell me what git add, git commit, and git push do — because I'll say
"save my work" often and I want to know what's happening.
```
**Point out:** from now, after every working step we "save our work" (commit).

## 7. Build feature 1 — add a task (from the spec)
**Teaches:** build from the spec, one small step, then ask Claude to explain.
```
Build the "add a task" feature exactly from our spec: an input box and an Add button; adding
puts the new task at the TOP of the list; empty or spaces-only input is rejected; the input
clears after adding. Then explain in plain English what you changed.
```
**Point out:** refresh the browser — describe fields in words, get working UI.

## 8. Test feature 1
**Teaches:** unit tests come straight from the spec's rules; they catch regressions later.
```
Write unit tests using Vitest and React Testing Library for the add-task feature: (1) adding a
task shows it in the list, (2) an empty task is rejected, (3) the input clears after adding.
Then give me the command to run them.
```
**Point out:** run `npm test`, watch them pass ✅. Each test mirrors a spec rule.

## 9. Save your work
```
Save my work: commit with the message "add task feature + tests".
```

---

## 10. Build the rest — same loop each time (spec → build → test → commit)

Run these in order. After each, say *"write tests for that"* and *"save my work"* to keep the rhythm.

**Mark done / undone**
```
Add the ability to mark a task done and undone with a checkbox. Done tasks show with a
strikethrough and a lighter colour. Explain the change.
```

**Delete a task**
```
Add a small delete (×) button to each task that removes it, with a quick confirm. Explain.
```

**Edit a task**
```
Let me edit a task's text inline — double-click the task to edit, Enter to save, Escape to
cancel. Reject an empty edit. Explain.
```

**Filter + remaining count**
```
Add filter buttons: All / Active / Completed, and show "N tasks left" for the active count.
Keep the current filter highlighted. Explain.
```

**Clear completed**
```
Add a "Clear completed" button that removes all done tasks at once. Only show it when there
is at least one completed task. Explain.
```

**Persist to localStorage** (the "still there after refresh" requirement)
```
Save the tasks to the browser's localStorage so they survive a page refresh, and load them
when the app starts. Explain in plain English how it works. Then let's test it: I'll add
tasks and refresh.
```

---

## 11. Debug on purpose — handle an error
**Teaches:** errors are normal; the fix is pasting them back with context.
```
I ran the app and got this error: [paste the whole error]. What does it mean, and how do I
fix it? I was trying to [what you did].
```
**Point out:** this is the single most important habit — don't panic, paste it back.

## 12. Understand your files
**Teaches:** what the project files are (so it's not magic).
```
Give me a plain-English tour of my project files: package.json, node_modules, the src folder,
and where my to-do code actually lives.
```

## 13. (Optional) Make a Skill
**Teaches:** when repetition is worth turning into a reusable skill.
```
I keep asking you to build a feature, then write its tests, then commit. Help me create a
Claude Code skill that runs this "feature → tests → commit" flow the same way every time, and
tell me where it gets saved.
```
**Point out:** create a skill only when you've repeated yourself — not for one-offs.

## 14. Deploy it
**Teaches:** shipping; push → auto-redeploy.
```
Help me put this to-do app online for free. It has no backend, so recommend the simplest
option (GitHub Pages or Vercel) and walk me through it step by step. Remind me how future
changes get published.
```

## 15. Capstone — make it yours
**Teaches:** applying the whole loop independently.
```
Add one nice extension of my choice — a due date on each task (and highlight overdue ones).
Spec it briefly first, then build it, write a test, and I'll commit.
```

---

## What this demo teaches (map to the coach guide)

| Demo step | Concept (see Coach Teaching Guide) |
|-----------|-----------------------------------|
| 0, 3 | Describe intent · Write a specification |
| 1 | CLAUDE.md — project memory |
| 2 | Planning the work |
| 5, 6 | Choosing tech · dependencies · Git (add/commit/push) |
| 7 | The build loop (describe → build → run → explain) |
| 8, 10-persist | Test cases · unit tests · regressions |
| 11 | Handling errors |
| 12 | The important project files |
| 13 | Claude Code Skills |
| 14 | Deploy |

**Teaching tip:** keep your To-Do app one step *ahead* of where trainees are on the teacher
form, so when they hit the same concept (a spec, a dependency, a commit, a test), they've just
watched you do it on the simpler app.
