# Leaps Up — Deploy to GitHub (Pages)

Publish the app so people's `?t=<token>` links work from anywhere (not just your laptop).

> **Current setup:** the repo is **public** and deploys free via **GitHub Pages**. This exposes
> quiz answer keys in source — accepted for now because the repo link isn't shared (see the
> "Known trade-offs" section of `leaps-up-build-spec.md`). The cleaner long-term option is a
> **private repo + Vercel** — see the bottom of this guide.

## What deploys

The app lives in **`/app`** (Vite + React). The included workflow
`.github/workflows/deploy-pages.yml` builds `app/` and publishes `app/dist` to Pages. Nothing
else in the repo is served.

## Prerequisites
- A GitHub account.
- The backend already deployed and connected (it is — `app/src/config.js` has the endpoint and
  `USE_BACKEND = true`).

## Steps

### 1. Push the repo to GitHub (public)
Create a **public** repo on GitHub named e.g. `leaps-up` (or `be-the-coach`). Then, from the
project root:

```bash
git add .
git commit -m "Deploy Leaps Up"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git   # skip if already added
git push -u origin main
```

*(Already have a remote? Just `git push`.)*

### 2. Turn on Pages (one-time)
In the repo on GitHub: **Settings → Pages → Build and deployment → Source: “GitHub Actions.”**
(Do **not** pick "Deploy from a branch.")

### 3. Let the workflow run
Pushing to `main` triggers **`Deploy Leaps Up to GitHub Pages`** automatically. Watch it under
the repo's **Actions** tab. When it's green, your site is live.

### 4. Get your live URL
It'll be:
```
https://<you>.github.io/<repo>/
```
Open it — you should see the Leaps Up launcher (or Access denied without a token, which is
correct).

### 5. Share the real links
Each person's link is now:
```
https://<you>.github.io/<repo>/?t=<their-token>
```
(See [`tokens-and-links.md`](./tokens-and-links.md) for generating tokens.)

## Good to know
- **No config change needed.** `base: './'` in `vite.config.js` makes assets load correctly
  from the `/<repo>/` sub-path, and the app uses a `?t=` query (not path routing), so refreshes
  work with no SPA rewrite.
- **Backend/CORS:** the Apps Script endpoint is deployed "Anyone", so it responds to the new
  domain with no changes.
- **Future updates auto-deploy:** every `git push` to `main` rebuilds and republishes.
- **First load is slower** (Apps Script cold start) then warms up; re-opens are instant (session cache).

## Later: private repo + Vercel (removes the answer-exposure trade-off)
When you want the 80% gate to be tamper-resistant again:
1. Make the repo **private**.
2. Import it into **Vercel** (free; deploys private repos). Set the project's **Root Directory**
   to `app`. Vercel auto-detects Vite → Deploy.
3. Use the Vercel URL for links instead of github.io.
4. (Recommended) move answer keys out of the client: keep `ANSWER_KEYS` only in the Apps Script
   / a private `AnswerKeys` Sheet tab, and strip `answer` fields from `mockData.js` before build.

Vercel also cold-starts nothing on the frontend, but note the *backend* (Apps Script) cold start
is unchanged either way — that's a separate service.
