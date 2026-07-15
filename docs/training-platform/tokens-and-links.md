# Leaps Up — Generating Tokens & Sharing Links

How to enrol a person, create their unguessable token, and give them their personal link.

> Prerequisite: the Google Sheet + Apps Script backend is set up and deployed. See
> [`google-sheets-setup.md`](./google-sheets-setup.md).

## The idea

- A **token** is a person's login. It's a long, unguessable string tied to one row in the
  `Roster` tab (their name, email, role, track).
- Their **link** is just your app's URL plus `?t=<their-token>`.
- Opening that link signs them in as that person and sends them to the right screen for their
  role (trainee course / coach console / manager dashboard).

## Step 1 — Add people to the Roster

In the Google Sheet's **`Roster`** tab, add one row per person. Fill **name, email, role,
track** and leave **`token` blank**:

| token | name | email | role | track |
|-------|------|-------|------|-------|
| *(blank)* | Shivayini | shivayini@… | `trainee-nontech` | `non-technical` |
| *(blank)* | Abhinaya | abhinaya@… | `trainee-tech` | `technical` |
| *(blank)* | (coach) | coach@… | `coach` | *(blank)* |
| *(blank)* | (manager) | mgr@… | `manager` | *(blank)* |

**Valid values**
- `role` — exactly one of `trainee-nontech`, `trainee-tech`, `coach`, `manager`.
- `track` — trainees only: `non-technical` or `technical` (leave blank for coach/manager).

## Step 2 — Generate the tokens

In the Apps Script editor:

- **Many at once (recommended):** select **`fillMissingTokens`** in the function dropdown →
  **Run**. It fills a fresh token for every row that has a name but no token. Run it again
  whenever you add new people — it only fills blanks.
- **Just one:** run **`makeToken`** and copy the value from **View → Logs**.

No redeploy is needed — these run inside the editor.

## Step 3 — Build each person's link

```
<your-app-url>/?t=<their-token>
```

- **Before deploying (local testing on your PC only):**
  `http://localhost:5173/?t=<token>`
- **After deploying** (see [`deployment.md`](./deployment.md)) — use your live URL, e.g.:
  `https://<you>.github.io/<repo>/?t=<token>`

Give each person **only their own link.**

## Step 4 — Revoking or reissuing a link

- To revoke access: **clear that row's `token`** in the Roster, re-run `fillMissingTokens`
  to mint a new one, and send the new link. The old link stops working immediately.

## Security note (honor-system)

The token *is* the login — anyone with a person's link can act as them. That's the accepted
trade-off for simple internal training (no passwords). Quiz **grading is server-side**, so the
80% rule can't be bypassed from the browser, and the authoritative record of who did what lives
in the Sheet regardless. If you ever need verified identities, that's the trigger to move to the
Supabase approach.
