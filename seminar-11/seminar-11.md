---
marp: true
theme: pb138
paginate: true
---

<!-- _class: lead -->

# Seminar 11 — CI/CD + Quality Gates

## PB138 — Basics of Web Development

_"If it's not automated, it's not shipped — and if it's not tested, it's not shipped either"_

---

## Why CI/CD?

- **CI** — every push proves the branch builds, lints, and tests. No more "works on my machine".
- **CD** — every merge to `main` deploys. No manual SSH, no forgotten steps.
- **Preview deploys** — every PR gets a shareable URL. Reviewers click, not clone.

A green checkmark is only meaningful if it actually checks something useful.

---

## Our Stack

| Concern | Tool | Free |
|---|---|---|
| CI | GitHub Actions | ✅ |
| Frontend hosting | Vercel | ✅ |
| Backend hosting | Render | ✅ (CC for verification) |
| Postgres | Neon | ✅ |
| Lint + format | Biome | ✅ |
| Unit tests | Vitest (+ React Testing Library) | ✅ |
| E2E tests | Playwright | ✅ |

---

## Architecture

```
                  ┌──────────────┐
git push ───────► │   GitHub     │
                  └──────┬───────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
┌──────────────┐   ┌──────────┐      ┌──────────┐
│   Actions    │   │  Vercel  │      │  Render  │ ◄── Neon
│ (5 jobs)     │   │  (web)   │      │ (server) │
└──────────────┘   └──────────┘      └──────────┘
```

Actions gates the merge. Vercel + Render watch `main` and auto-deploy.

---

## Why lint + tests in CI?

Build alone proves the code **compiles**. It doesn't prove anything else.

- **Lint** — catches dead code, type-import bugs, accidental `console.log`s in PRs
- **Unit tests** — pin behavior of components and route handlers in isolation
- **E2E tests** — prove the whole app actually works end to end (SPA → API → DB)

A PR with all three jobs green is a PR you can merge with confidence.

---

## The Test Pyramid

```
                  /\
                 /  \      Few, slow, real
                /E2E \     (Playwright — full stack)
               /──────\
              /        \    Many, medium
             / Integration \  (Vitest BE — DB-backed)
            /──────────────\
           /                \   Most, fast, isolated
          /     Unit         \   (Vitest FE — RTL in jsdom)
         /────────────────────\
```

Most tests fast and cheap; few slow ones at the top — safety net for the whole stack.

---

## CI Pipeline — 5 Parallel Jobs

```
              git push / PR open
                     │
       ┌──────┬──────┼──────┬──────┐
       ▼      ▼      ▼      ▼      ▼
   ┌─────┐ ┌────┐ ┌─────┐ ┌─────┐ ┌─────┐
   │build│ │lint│ │test │ │test │ │test │
   │     │ │    │ │ -be │ │ -fe │ │-e2e │
   └─────┘ └────┘ └─────┘ └─────┘ └─────┘
   typcheck biome  vitest  vitest  playwright
   bundle          + PG    + jsdom + PG + browsers
```

All 5 must pass before merge. Total wall time ≈ slowest job (~3-4 min for E2E).

---

## Today's Demo (~90 min)

1. **CI** — write `ci.yml` build step, push, watch green
2. **Frontend → Vercel** — connect repo, env vars, see PR preview
3. **DB + server → Neon + Render** — `DATABASE_URL`, migrations on deploy
4. **Biome lint job** — `bun run check` in CI, fail a PR with bad style
5. **Vitest BE job** — Postgres service container, real DB tests
6. **Vitest FE job** — `CourseCard` rendered in jsdom, no DB
7. **Playwright E2E job** — Chromium, webServer config, full app

End: open a PR — five green checks, merge, deploy.

---

## Key Concepts

- **Secrets** — set in provider dashboard / repo secrets, never in code
- **Env vars** — same binary, different config per env (`DATABASE_URL_TEST` ≠ `DATABASE_URL`)
- **Service containers** — GitHub Actions spins up Postgres as a sidecar; jobs talk to `localhost:5432`
- **Migrations on deploy** — `db:migrate && bun run start` in Render's start command
- **Test isolation** — separate `pb138_test` DB; truncate between BE tests; jsdom resets between FE tests
- **Config as code** — `biome.json`, `vitest.config.ts`, `playwright.config.ts`, `render.yaml` all in git

---

## Quality Gates

Pipeline going green is only useful if **passing is required**. Configure on GitHub:

- **Branch protection** on `main` → require PRs, require checks to pass
- **Required status checks** → all 5 CI jobs must succeed
- **No direct push to main** → everyone goes through PR + review

Without protection, a green pipeline is decoration. With it, it's the floor.

---

## After the Seminar

Apply the same pattern to your own project:

1. Push to GitHub (private is fine on Hobby).
2. Copy from `seminar-11-solution`: `biome.json`, `vitest.config.ts` (per app), `apps/e2e/`, `.github/workflows/ci.yml`, `apps/server/render.yaml`.
3. Sign up: Vercel → Neon → Render. Connect each to your repo.
4. Add a `pb138_test` DB to your `docker-compose.yml`.
5. Open a PR — five green checks, share the preview link.

Branch reference: [`seminar-11-solution`](../../tree/seminar-11-solution)

---

<!-- _class: lead -->

# Questions?
