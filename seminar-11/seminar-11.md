---
marp: true
theme: pb138
paginate: true
---

<!-- _class: lead -->

# Seminar 11 — CI/CD

## PB138 — Basics of Web Development

_"If it's not automated, it's not shipped"_

---

## Why CI/CD?

- **CI** — every push proves the branch builds. No more "works on my machine".
- **CD** — every merge to `main` deploys. No manual SSH, no forgotten steps.
- **Preview deploys** — every PR gets a shareable URL. Reviewers click, not clone.

---

## Our Stack

| Concern | Tool | Free |
|---|---|---|
| CI | GitHub Actions | ✅ |
| Frontend hosting | Vercel | ✅ |
| Backend hosting | Render | ✅ (CC for verification) |
| Postgres | Neon | ✅ |

All four log in with GitHub. No Docker, no servers to ssh into.

---

## Architecture

```
                ┌──────────────┐
git push ─────► │   GitHub     │
                └──────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  ┌──────────┐  ┌──────────┐   ┌──────────┐
  │ Actions  │  │  Vercel  │   │  Render  │ ◄── pulls Postgres
  │ (CI)     │  │  (web)   │   │ (server) │     from Neon
  └──────────┘  └──────────┘   └──────────┘
```

CI gates the merge. Vercel and Render watch `main` and redeploy automatically.

---

## Today's Demo (~45 min)

1. **CI** — write `.github/workflows/ci.yml`, push, watch green checkmark
2. **Frontend → Vercel** — connect repo, env vars, see PR preview
3. **DB + server → Neon + Render** — `DATABASE_URL`, `FRONTEND_URL`, migrations on deploy

End: open the cloud URL, see the same app you built in seminar 06 — but live on the internet.

---

## Key Concepts

- **Secrets** — never commit; set in the provider dashboard or as repo secrets
- **Env vars** — same code, different config per environment (`VITE_API_URL` is `localhost:3000` in dev, `*.onrender.com` in prod)
- **Migrations on deploy** — `db:migrate` runs before the server starts. Schema is part of the build, not a manual step.
- **Config as code** — `render.yaml` versions infra alongside the code. Anyone can fork the repo and reproduce the deploy.

---

## After the Seminar

Apply the same pattern to your own project:

1. Push your project to GitHub (private is fine on Hobby).
2. Copy `.github/workflows/ci.yml` and `apps/server/render.yaml` from `seminar-11-solution`.
3. Sign up: Vercel → Neon → Render. Connect each to your repo.
4. Set env vars; deploy.
5. Open a PR; share the preview link with classmates.

Branch reference: [`seminar-11-solution`](../../tree/seminar-11-solution)

---

<!-- _class: lead -->

# Questions?
