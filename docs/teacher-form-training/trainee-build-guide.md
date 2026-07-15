# Build a Teacher-Info App with Claude — Step-by-Step Guide (Start From Zero)

**Who this is for:** someone who has never coded and has never installed developer tools.
By the end you'll have built a real web app where a teacher signs in with their Microsoft
account, fills in a form, and their answers are saved into an Excel sheet on OneDrive — and
you'll have built it **without writing any code yourself**, then published it online.

> **Read this first — how this works**
>
> You are not going to learn to write code. You are going to learn to **tell Claude what you
> want, and Claude writes the code for you.** Your job is four things, repeated:
>
> **1) Describe what you want → 2) Let Claude build it → 3) Run it → 4) If something breaks, paste the message back to Claude.**
>
> Errors are normal — copying them back to Claude is how you move forward, not a sign you did
> something wrong.
>
> 🟡 **Golden rule:** if you get confused or stuck for more than a few minutes, **stop and
> message your coach.** Don't guess your way forward.

**The journey:** set up tools → put the project under version control → choose the tech →
create the React project → build the app with prompts → connect Microsoft sign-in and save
data → test → publish on Vercel.

---

## Before you start — accounts

Have these ready (your coach can help arrange them):

1. **A Claude account** — the assistant that writes your code.
2. **A GitHub account** — the free online home for your project's code (sign up at github.com).
3. **Your work Microsoft 365 account** — the app signs in with this and saves data to *your* OneDrive.
4. **A Vercel account** (later, for publishing) — you'll sign up using your GitHub account. Free.

You don't need to buy anything. Everything here is free.

---

## Part 1 — Install your tools (about 20 minutes)

Three installs, in order. After each there's a ✅ check.

### 1a. Install VS Code
The app you'll do everything inside — it holds your files, runs commands, and hosts Claude.
1. Go to **https://code.visualstudio.com** → download → install (accept the defaults).

**✅ Check:** VS Code opens to a welcome screen.

### 1b. Install Node.js
The engine that runs your app on your computer (more on this in Part 4).
1. Go to **https://nodejs.org** → click the big **LTS** button → install (accept defaults).

**✅ Check (using VS Code's built-in terminal):**
- In VS Code, click **Terminal → New Terminal** (a panel opens at the bottom).
- Type `node --version` and press Enter. Seeing `v20.x.x` means success.
- "not recognised"? Close VS Code, reopen, try again. Still nothing → message your coach.

### 1c. Install the Claude Code extension
Claude living **inside VS Code** — able to create files and run commands for you.
1. Click the **Extensions** icon in the left bar (four squares).
2. Search **Claude Code** → **Install** the official Anthropic one.
3. Click the Claude icon that appears → **sign in** with your Claude account.

**✅ Check:** the Claude chat panel is open, waiting for you to type.

> 💡 If any step fails or looks different, don't push on — screenshot it and send it to your coach.

---

## Part 2 — Working with Claude

Whenever this guide shows a box like **🗣️ Say to Claude: "…"**, you type or paste that text
into the **Claude panel in VS Code**, press Enter, and read the reply.

What to expect:
- Claude **creates and edits your files** — it may ask you to approve a change or command; say **yes/allow**.
- Claude **runs commands in the bottom terminal** — you'll see it working; you don't type them.
- See a red error? Copy it and paste to Claude: *"what does this mean and how do I fix it?"*

**Five habits that make Claude far more useful:**
- **Give context** — remind Claude you're a beginner and what you're building.
- **One thing at a time** — ask for a single change, see it work, then the next.
- **Ask it to explain** — *"explain in plain English what you just did and why."*
- **Ask for a plan before big changes** — *"before changing anything, tell me your plan."*
- **You're the boss** — if something looks wrong or you don't understand it, ask or undo. Don't click "approve" on autopilot.

---

## Part 3 — Set up version control (Git & GitHub)

We do this **first** so every step is saved from the start — and because it's what Vercel will
publish from at the end.

- **Git** = "save points" on your computer. You can rewind to any version that worked.
- **GitHub** = the online home/backup of your project — and what Vercel connects to.

### Create the repository
1. Sign in at **https://github.com** (create a free account if needed).
2. Click **New** → name it e.g. `teacher-form` → choose **Private** → **Create repository**.
3. Copy its web address (URL).

### Link your project to it
In VS Code: **File → Open Folder** → your Desktop (create an empty `teacher-form` folder if
needed and open that). Then:

> 🗣️ **Say to Claude:**
> "Set up Git in this project and connect it to my GitHub repository at PASTE-URL-HERE. I'm a
> beginner — do the steps and tell me if I need to sign in to GitHub. We'll make the first real
> commit after we create the app."

**✅ Check:** approve the GitHub sign-in when prompted; your project is now connected to your repo.

### The Git commands — what Claude runs, and what they mean
You won't type these — **Claude runs them for you** — but knowing what they do makes it far
less mysterious. The everyday flow is **add → commit → push**.

| Command | What it does | Everyday analogy |
|---------|--------------|------------------|
| `git init` | Starts tracking this project with Git (once per project) | Open a fresh logbook |
| `git status` | Shows what has changed since your last save | Check what's new on your desk |
| `git add .` | **Stages** your changes — marks what goes into the next save | Put the items into a box |
| `git commit -m "message"` | **Saves a snapshot** with a short label | Seal and label the box |
| `git push` | Uploads your commits to GitHub (the online copy) | Ship the box to the warehouse |
| `git pull` | Downloads changes from GitHub to your computer | Collect boxes from the warehouse |
| `git log` | Lists your past commits (your history) | Flip through the logbook |
| `git remote add origin <url>` | Links your project to your GitHub repo (once) | Note the warehouse address |
| `git revert` / `git checkout` | Goes back to an earlier saved state | Re-open an older sealed box |

So when you say **"save my work"**, that really means: `git add` (box up the changes) →
`git commit` (seal + label a save point) → `git push` (send it to GitHub).

### The save-points habit (use it throughout)
After every working step:
> 🗣️ **Say to Claude:** "Commit and push my progress to GitHub with a clear message describing what we just did."

To undo a bad change:
> 🗣️ **Say to Claude:** "Something broke. Take me back to the last working commit."

Once you're committing regularly, you never have to fear losing your work.

---

## Part 4 — Choose your tech (HTML/CSS vs React + Tailwind)

There are two common ways to build a web page — you pick based on what you're making.

| Plain HTML / CSS (+ a little JavaScript) | React + Tailwind |
|------------------------------------------|------------------|
| Simple, mostly **static** pages — a flyer, a one-page info site. No tools needed; just open the file. | Interactive **apps** — forms, changing data, sign-in, reusable pieces. More capable; needs Node & npm. |

**How to choose:** static & simple → HTML/CSS. Interactive, handles data, has sign-in, will
grow → React. **Our app** has a form, Microsoft sign-in, and saves data → so we choose
**React + Tailwind**.

**The pieces, in plain English:**
- **React** — a toolkit for building interactive interfaces out of reusable "components."
- **Node.js** — lets your computer run the JavaScript tools React needs, and run the app locally. (Installed in Part 1.)
- **npm** — comes with Node; the "app store" for code libraries. It installs and tracks the pieces (**dependencies**) your app uses.
- **Tailwind** — a styling toolkit: add small class names for a clean, modern look, fast.

> 🏢 **Analogy:** HTML/CSS is a printed poster; React is an interactive kiosk. Node + npm are
> the workshop and the parts catalogue.

---

## Part 5 — Create the React project (Node, npm & dependencies)

Now create the app inside your Git-linked folder. Claude scaffolds it with **Vite**, which
sets React up for you — that's what "installing React" means here.

> 🗣️ **Say to Claude:**
> "Inside this folder, create a React app using Vite (this installs React for me). Install
> everything, then start it and give me the web address to open. Keep it simple, one step at a time."

**✅ Check:** app files appear in the file list; open the `http://localhost:5173` link Claude
shows in the terminal (Ctrl+click it) → a starter page runs. 🎉
*(Stop the app with Ctrl+C in the terminal; restart it by saying "start the app again.")*

### What just happened — dependencies, package.json, node_modules
- **React was added as a dependency** (a library your app uses).
- Dependencies are listed in **`package.json`** — your project's "ingredients list + shortcuts."
- The downloaded library files live in **`node_modules/`**; `npm install` fetched them.

### Add your first extra dependency — Tailwind
> 🗣️ **Say to Claude:**
> "Add Tailwind CSS to this Vite React project and set it up, then give the page a clean, simple look."

This is the pattern you'll reuse: **adding a dependency = npm installs a library and it appears
in `package.json`.** Later you'll add another one (Microsoft sign-in) exactly the same way.

Now save it:
> 🗣️ **Say to Claude:** "Commit and push my progress to GitHub with the message 'set up React + Tailwind'."

---

## Part 6 — Write a specification (and handle errors)

### Write a specification first
Before you ask Claude to build a feature, spend two minutes writing a **spec** — a plain-English
description of *what you want*. A clear spec is the single biggest thing that makes Claude's
output good. It answers five questions:
1. **What is it for?** (the goal)
2. **Who uses it and what do they do?**
3. **What information does it capture?**
4. **What are the rules?** (required fields, validation)
5. **What does success look like?**

> 🗣️ **Say to Claude:**
> "Here's my rough idea for a feature: [paste your five answers]. Turn this into a clear, short
> specification, and ask me about anything unclear before we build."

Do this before **every** new feature — not just the first.

**Your spec is where your tests come from.** The spec defines what "correct" means, so each
rule in it becomes a test case you'll check later:

| Spec rule | Becomes this test case |
|-----------|------------------------|
| Email is required | Submitting with an empty email shows an error |
| Email must be valid | "abc" is rejected; "a@b.com" is accepted |
| All fields are needed | Submitting an empty form is blocked |
| Success = "Thank you, saved!" + a row in Excel | A valid submission shows the thank-you message |

Tip: if you can't write a test for a rule, the rule probably isn't clear enough yet.

### When something breaks (how to handle errors)
Errors are normal — even experts hit them constantly. Follow a process instead of guessing:
1. **Don't panic and don't randomly change things.**
2. **Read the last few lines** — they often hint at the problem.
3. **Copy the *whole* error** and paste it to Claude with context: *"I was trying to [X] and
   expected [Y]. I got this: [paste]. What does it mean and how do I fix it?"*
4. **Try the fix.** A *different* error usually means progress — repeat.
5. **You can always undo:** *"undo your last change"* — or rewind to your last Git commit.

> **Do NOT:** delete files to "clean up", ignore errors, or paste passwords/secret keys.
> (Your **Client ID** is fine to share; passwords and "client secrets" are not.)

**Stop and message your coach if:** you've tried 2–3 times over ~15 minutes with no progress,
the error involves **Microsoft sign-in or permissions**, or you're simply unsure.

---

## Part 7 — Build the teacher form

Now the fun part — you describe the form, Claude builds it.

> 🗣️ **Say to Claude:**
> "Replace the starter page with a clean, simple form titled 'Teacher Information'. It should
> collect: Full name, Email address, Subject taught, and Years of experience. Make Email
> required and check it looks like a real email. Add a Submit button. For now, when I submit,
> just show the details on screen — we'll save them to Excel later."

**✅ Check:** refresh your browser tab — the form appears; fill it in and submit, and the
details show on screen. Then **commit & push** ("save the form to GitHub").

> Want to change something? Just tell Claude, e.g. *"add a dropdown for the teacher's
> department"*, then refresh.

---

## Part 8 — Handling real data safely

From here your app touches **real accounts** and will store **real teacher information**.
A few rules keep everyone safe:

- **Never share secrets.** Your **Client ID** is fine to paste. But passwords, anything called
  a **"client secret"**, and the contents of a **`.env`** file must **never** be pasted into
  chat, email, screenshots, or anywhere public.
- **Keep secrets out of what you publish.** Sensitive values live in a `.env` file, and
  `.gitignore` stops it being pushed to GitHub. If unsure, ask Claude: *"is there anything
  secret in here that shouldn't be shared or published?"*
- **Collect only what you need.** Every field is personal data you're responsible for.
- **Real submissions are real people.** Treat the Excel data as confidential.
- **If you think a secret leaked, tell your coach immediately** — it can be rotated (replaced).

---

## Part 9 — Understand the Microsoft pieces (read before Part 10)

The next parts connect your app to Microsoft. Here's what's actually happening, in plain English.

**Your app needs to:** (1) know who the teacher is (sign them in), and (2) be allowed to save
data into their Excel on OneDrive. Microsoft won't let a random app do either without an
introduction and permission — that's all Parts 10–12 do.

- **Microsoft Graph API** — one doorway to Microsoft 365 data (mail, Teams, OneDrive, **Excel**).
  Your app adds a row to Excel by asking Graph. Think of it as the **reception desk** for M365.
- **Entra app registration** — introducing your app so Microsoft trusts it. Without it, every
  sign-in is rejected. *(Analogy: a contractor signs in at security and gets a visitor badge.)*
- **Tenant ID** — your **organisation's** unique ID (which company's users/data). *The building.*
- **Client ID** (Application ID) — your **app's** unique ID (which app is this). *The badge number.*
- **Client secret** — a *password* for server apps; your browser app usually needs **none**.
  If a step tells you to make one, pause and check with your coach.
- **Permissions / scopes** (e.g. `Files.ReadWrite`) — what your app is *allowed* to do; must be
  consented to.
- **Access token** — a short-lived pass Microsoft gives your app after sign-in, proving the user
  is signed in and the app is allowed. Your app shows it to Graph on every request.

```
1. Register the app in Entra ID  -> get Tenant ID + Client ID   (Part 10)
2. App uses the IDs to start sign-in                            (Part 11)
3. Teacher signs in at Microsoft                                (Part 11)
4. Microsoft returns an access token
5. Permission (Files.ReadWrite) is consented                    (Part 12)
6. App calls Graph WITH the token -> adds a row to Excel        (Part 15)
```

If sign-in or saving ever fails, it's almost always one link in this chain — that's where to look.

---

## Part 10 — Register your app with Microsoft (clicks, not code)

Done in Microsoft's portal; Claude guides the clicks. Some steps may need an admin — have your
coach on hand.

> 🗣️ **Say to Claude:**
> "Walk me through registering a new app in Microsoft Entra ID, step by step, as a complete
> beginner. I need to: choose 'Single-page application', set the redirect address to
> `http://localhost:5173`, then find and copy the 'Application (client) ID'. Tell me exactly
> what to click on each screen."

**✅ Check:** you have your **Client ID** copied somewhere safe (also note your **Tenant ID**).

> 🟡 If Microsoft says you don't have permission to register an app, **stop — this needs your
> IT admin or coach.** This is expected in some organisations.

---

## Part 11 — Add "Sign in with Microsoft" (a new dependency)

This is the **"add a dependency"** pattern again — the Microsoft sign-in library
(`@azure/msal-react`) gets installed by npm and added to your `package.json`.

> 🗣️ **Say to Claude:**
> "Add 'Sign in with Microsoft' using @azure/msal-react. My Client ID is PASTE-HERE and Tenant
> ID is PASTE-HERE. Add a Sign in and Sign out button, and only show the Teacher Information form
> after the user has signed in. Tell me if I need to restart the app."

**✅ Check:** refresh — a **Sign in with Microsoft** button appears; sign in with your work
account and the form appears. Then **commit & push**. (Approve any Microsoft permission pop-up.)

---

## Part 12 — Allow the app to save files (Graph permission)

> 🗣️ **Say to Claude:**
> "In Microsoft Entra ID, walk me through adding the Microsoft Graph permission `Files.ReadWrite`
> (delegated) to my app registration, and how to grant consent. Step by step, beginner-friendly."

**✅ Check:** the permission shows a green tick (granted) in the portal.

> 🟡 If it says "admin consent required", **stop and ask your coach/IT** — only an admin can approve.

---

## Part 13 — Prepare the Excel sheet

Your app saves each teacher as a **row in a table** inside an Excel file — so make that first.

1. Go to **office.com**, sign in, open **Excel**, create a **new blank workbook**.
2. In row 1, type these headings across columns A–D: `Name` `Email` `Subject` `Experience`.
3. Select those headings **and a few empty rows below**, then **Insert → Table** (tick "My table has headers").
4. Name the file **TeacherData**. It saves to OneDrive automatically.

**✅ Check:** an Excel file on OneDrive with a table that has those four column headings.

---

## Part 14 — Save form answers into Excel

> 🗣️ **Say to Claude:**
> "When the Teacher Information form is submitted, use the signed-in user's Microsoft account to
> save the answers as a new row in my Excel table using Microsoft Graph. The file is 'TeacherData'
> in my OneDrive and the table has columns Name, Email, Subject, Experience. Show a 'Thank you,
> saved!' message when it works. Help me find any IDs you need."

Claude may ask for the file or table name/ID — it will tell you how to find them. Then **commit & push**.

**✅ Check:** we test this in the next part.

---

## Part 15 — Test the whole thing (the big moment)

1. Open your app → click **Sign in with Microsoft** and sign in.
2. Fill in the form → click **Submit** → you should see **"Thank you, saved!"**
3. Open your **TeacherData** Excel file on OneDrive.

**✅ Check:** a new row appeared with what you just typed. **You built a working app!** 🎉

> **If the row didn't appear:** copy the whole error and say *"I submitted the form and got this
> — please help me fix it."* Common causes: a wrong table name, or a step from Parts 10–12
> (sign-in / permissions). Stuck after a couple of tries? Message your coach with a screenshot.

---

## Part 16 — Deploy with Vercel (publish it)

Right now the app only runs on your computer. **Vercel** puts it online for free and connects to
your GitHub repo, so it **auto-updates whenever you push changes**.

1. Go to **https://vercel.com** and sign up **with your GitHub account**.
2. **Add New… → Project** → import your `teacher-form` repository.
3. Vercel detects it's a Vite/React app → click **Deploy**.
4. You get a live web address.

> 🗣️ **Say to Claude (if you want guidance):**
> "Walk me through deploying my Vite React app to Vercel by importing my GitHub repo, step by
> step, and remind me what to update in Entra ID afterwards."

> **Two must-dos after deploying:**
> 1. Add the new **Vercel URL as a redirect URI** in Entra ID (the same place as Part 10) — or
>    sign-in won't work on the live site.
> 2. If your Client ID / Tenant ID are in environment variables, add them in **Vercel → Project
>    Settings → Environment Variables**.

**✅ Check:** the app opens at the Vercel URL, and sign-in and submit work from it. From now on,
**commit & push → Vercel redeploys automatically.**

---

## 🎓 Capstone — make it your own

Using only prompts, add one improvement of your choice — a confirmation screen with the
teacher's name, an extra field (e.g. Department), or preventing double submits. Then commit,
push, and watch it go live on Vercel. **That's the skill — you can now direct Claude to build,
change, and ship real software.**

---

## Going deeper — things every builder should understand

### Ask Claude to write test cases — and why they matter

**What is a test case?** One specific check: an *input* plus the *result you expect*. For
example: *"Given an empty email, submitting should show an error."* It's the idea of what to verify.

**What is a unit test?** A small *automated* test that checks one "unit" (a small piece) of your
app on its own — e.g. the email validation, or that the form shows an error when email is blank.
It runs in code, in about a second, with no clicking.

**The purpose of a unit test:**
- Prove a small piece works as intended.
- Catch mistakes early — before a real user hits them.
- Catch **regressions** — if a later change breaks it, the test fails immediately.
- Let you (and Claude) change code with confidence.
- Document what "correct" means, checked automatically.

They matter because every time Claude changes your app, something that used to work *might*
quietly break — automated tests catch that for you.

**Where do your tests come from? Your spec.** Each rule you wrote (Part 6) is one test case —
so your specification doubles as your ready-made test checklist.

- **Manual test list (always):** *"List the things I should test by hand for this form —
  include the empty/invalid cases, not just the happy path."* Then click through it.
- **Automated tests (for anything important):** *"Write automated tests using Vitest and React
  Testing Library covering: email required, invalid email rejected, valid submission shows the
  thank-you message. Tell me the command to run them."* You'll then run `npm test`.

Re-run tests after any change to be sure you didn't break what worked (a **regression**).

### The important files in your project
| File / folder | What it is |
|---------------|-----------|
| **`package.json`** | Your project's "ingredients list + shortcuts": the libraries (dependencies) and commands like `npm run dev` / `npm test`. |
| `node_modules/` | The downloaded libraries. Never edit; can be rebuilt. |
| **`src/`** | **Your app's real code** — the form, the pages. |
| `.env` | Secret settings (e.g. your Client ID). **Never share or push it.** |
| `.gitignore` | Files that should NOT be pushed to GitHub (like `.env`, `node_modules`). |
| `README.md` | Plain notes about the project. |

### Claude Code Skills — what they are and when you need one
A **Skill** is a set of instructions you teach Claude Code **once**, so it follows them every
time without re-explaining. Worth creating when you keep repeating the same instructions, have a
multi-step process you do often, or want consistency across a team. Not for one-offs.
> 🗣️ *"I keep asking you to do [the repeated thing]. Help me create a Claude Code skill so you
> do it the same way every time, and tell me where it's saved."*

### Good working habits
- **Starting a new session:** open VS Code → **File → Open Folder** → your `teacher-form`
  folder → open the Claude panel → *"start the app and give me the web address."* Your work is
  exactly where you left it.
- **"It runs" ≠ "it's correct":** no error only means it didn't crash. Always check against your
  spec and run your tests.
- **Commit & push after every working step** — it's your backup *and* your deploy trigger.
- **Usage limits:** if Claude says you've hit a limit, nothing is broken — wait for the reset or
  ask your coach. Because you save with Git, you can stop and resume anytime.

### A simple "done" checklist for each feature
- [ ] I wrote a short spec of what I wanted
- [ ] Claude built it and explained what it did
- [ ] I tested it — including the empty/invalid cases
- [ ] It matches the spec
- [ ] I committed and pushed a save point

---

## If you get stuck — quick help

| What you see | What to do |
|--------------|-----------|
| A red error message | Copy the whole thing → paste to Claude: "how do I fix this?" |
| "not recognised" after a command | Restart VS Code, try again; else ask coach |
| Microsoft says "permission" / "admin consent" | Stop — this needs your coach/IT admin |
| Sign-in fails after deploying | Add the Vercel URL as a redirect URI in Entra ID (Part 10) |
| The app page is blank | Say to Claude: "my app page is blank, here's what the terminal says: …" |
| You're just confused | **Stop and message your coach.** Don't guess. |

## Mini-glossary (plain English)

- **VS Code** — the app that holds your project's files and hosts Claude.
- **Node.js** — the engine that runs your app and its tools.
- **npm** — installs and tracks code libraries (dependencies).
- **Dependency** — a library your app uses (listed in `package.json`).
- **React / Vite / Tailwind** — UI toolkit / project setup tool / styling toolkit.
- **Claude Code** — the Claude extension inside VS Code that creates files and runs commands.
- **Terminal** — the panel at the bottom of VS Code where commands run.
- **Git** — a tool that saves snapshots ("save points") you can rewind to.
- **GitHub** — the online home/backup of your code; what Vercel deploys from.
- **Repository (repo)** — your project on GitHub.
- **Commit** — one saved snapshot in Git, with a message.
- **git add / commit / push** — box up changes / seal + label a save point / send it to GitHub.
- **Vercel** — free hosting that publishes your app from GitHub.
- **Specification (spec)** — a short plain-English description of what you want, written before building.
- **Test case / regression** — a check that something works / when a change breaks what used to work.
- **Skill** — instructions you teach Claude Code once so it follows them automatically.
- **Entra ID (Azure AD)** — Microsoft's system for signing people in.
- **App registration** — introducing your app to Microsoft so it's trusted.
- **Tenant ID / Client ID** — your organisation's ID / your app's ID.
- **Client secret** — a password for server apps; a browser app usually needs none.
- **MSAL** — Microsoft's sign-in library (a dependency you add).
- **Microsoft Graph** — the doorway to read/write Microsoft 365 data (like Excel).
- **Permission / scope** — what your app is allowed to do (e.g. `Files.ReadWrite`).
- **Access token** — a short-lived pass proving the user is signed in and the app is allowed.
- **Redirect URI** — the web address Microsoft is allowed to send users back to after sign-in.

---

## Appendix — for the coach (prerequisites & gotchas)

Have these sorted before a trainee reaches the relevant parts:

- **GitHub access.** Trainees need a GitHub account and the ability to create repos and
  authenticate (browser/device-code sign-in). Pre-creating repos avoids first-session friction.
- **App registration rights.** Trainees may lack permission to register an app in Entra ID.
  Pre-create a registration per trainee, or do Parts 10 & 12 with them.
- **Admin consent.** `Files.ReadWrite` (OneDrive) is usually user-consentable; switching the
  target to SharePoint needs `Sites.ReadWrite.All` + a tenant admin.
- **Redirect URIs.** Dev uses `http://localhost:5173`; after the Vercel deploy, the live URL
  must be added too. A post-deploy sign-in error is almost always this.
- **Vercel environment variables.** If IDs live in `.env`, they must be re-entered in Vercel's
  Environment Variables — `.env` is not pushed to GitHub.
- **The Excel table must exist first** (Part 13) — Graph writes into an existing table, not a blank sheet.
- **Tenant policies.** Confirm your org allows app registrations and this sign-in flow before a cohort.
