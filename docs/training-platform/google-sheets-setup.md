# Google Sheets Backend — Setup & Deploy

This stands up the shared data store + API for Leaps Up. It runs entirely inside **your
Google account** (free). ~15 minutes.

> **Prerequisite:** a Google account (personal or Google Workspace) that can create Sheets
> and Apps Script. This is separate from your Microsoft 365 accounts — only whoever *manages*
> the platform needs it; trainees do not.

## What you're creating

```
React site  ──fetch──►  Apps Script web app (/exec)  ──►  Google Sheet (5 tabs)
                         (grades quizzes, reads/writes)
```

The Apps Script is the backend. The Sheet is the database. Answer keys live in a private
`AnswerKeys` tab in the Sheet (not in the code or the browser), so grading is server-side only.

## Steps

### 1. Create the Sheet
- Go to [sheets.new](https://sheets.new). Name it e.g. **"Leaps Up Data"**.

### 2. Add the script
- In the Sheet: **Extensions → Apps Script**.
- Delete the sample `function myFunction() {}`.
- Open `google-apps-script/Code.gs` from this repo, copy **everything**, paste it in.
- Click **Save** (💾).

### 3. Initialise the tabs
- In the Apps Script toolbar, choose the function **`setup`** and click **Run**.
- Approve the permission prompt (it's your own script acting on your own Sheet).
- Back in the Sheet you should now see 5 tabs: `Roster`, `Attempts`, `ContentReview`,
  `CoachNotes`, `HelpRequests`, and a sample roster of 4 people.

### 4. Deploy as a web app
- Apps Script → **Deploy → New deployment**.
- Click the gear ⚙ → **Web app**.
- Set:
  - **Description:** Leaps Up API
  - **Execute as:** *Me*
  - **Who has access:** *Anyone*
- **Deploy**, approve, and **copy the Web app URL** (ends in `/exec`).

### 5. Connect the site
- Open `app/src/config.js`, paste the URL into `ENDPOINT`, set `USE_BACKEND = true`.
- (I'll then wire the React views to use the endpoint.)

### 6. Enrol real people (make tokens)
In the `Roster` tab, add one row per person filling **name, email, role, track** — and leave
the **`token`** column **blank**. Then generate tokens automatically:

1. Open **Extensions → Apps Script** (or the script editor).
2. In the function dropdown (top toolbar), select **`fillMissingTokens`** → click **Run**.
   (Approve the permission prompt the first time. No redeploy needed — this runs in the editor.)
3. Back in the `Roster` tab, every row that had a name but no token now has a fresh, unguessable
   token in the `token` column.

Give each person their personal link: `https://<your-site>/?t=<their-token>`
(during local testing that's `http://localhost:5173/?t=<their-token>`).

> Need just one token? Run **`makeToken`** instead and read it from **View → Logs**.

**Valid values:**
- `role` — one of `trainee-nontech`, `trainee-tech`, `coach`, `manager`.
- `track` (trainees only) — `non-technical` or `technical` (leave blank for coach/manager).

> ⚠️ A token is the login — anyone with the link gets in as that person (honor-system). To
> revoke access, delete/replace that row's token and re-run `fillMissingTokens` for a new one.

## Updating the script later
After editing `Code.gs`: **Deploy → Manage deployments → ✏ edit → Version: New version → Deploy.**
(Keeps the same `/exec` URL.)

## API reference (what the site calls)

| Method | Action | Purpose |
|--------|--------|---------|
| GET | `resolve&token=` | token → `{ name, email, role, track }` |
| GET | `state&token=` | that person's passed modules + attempt counts |
| GET | `content` | approval statuses + coach notes |
| GET | `help` | help-request queue (coach) |
| GET | `dashboard` | aggregate progress + missed-question stats (manager) |
| POST | `grade` | grade a quiz server-side, record the attempt |
| POST | `help` | log an "I'm stuck" request |
| POST | `review` | coach approve / request-changes + feedback |
| POST | `note` | coach note shown to the trainee |

## Notes & limits
- **Grading is server-side:** the browser sends the delivered question ids + the trainee's
  chosen options; the script scores them against the `AnswerKeys` tab and returns only pass/fail.
- **Answer keys** live only in the private **`AnswerKeys`** tab (not in the code, not in the
  browser). Populate it once with the throwaway `seedAnswerKeys()` snippet, then delete that snippet.
- **Quotas:** Apps Script is fine for small cohorts (well within free quotas). Not built for
  thousands of concurrent writes — that's the signal to move to the Supabase approach.
