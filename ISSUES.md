# Bake Ops — Issues & Fix Phases

> Generated from full codebase audit on 2026-02-18

---

## Phase 1: Fix What's Broken (Blocking)

These issues cause runtime errors, crashes, or silently broken features.

| # | Issue | Severity | Files |
|---|-------|----------|-------|
| 1.1 | CLAUDE.md says Next.js 16 / React 19 — actual is Next.js 14 / React 18 | Doc | `CLAUDE.md` |
| 1.2 | `customer_phone`, `is_paid`, `is_draft` columns missing from DB schema | Critical | `supabase/migrations/` |
| 1.3 | No INSERT policy on `orders` table — client-side order creation fails | Critical | `supabase/migrations/002` |
| 1.4 | No INSERT policy on `bakers` table — signup can't create profiles | Critical | `supabase/migrations/002` |
| 1.5 | No DELETE policy on `orders` or `bakers` — delete features broken | Critical | `supabase/migrations/002` |
| 1.6 | Migrations 004/005 `referrals` table schema conflict — 005 silently skipped | Critical | `supabase/migrations/004, 005` |
| 1.7 | `@/hooks/useToast` imported but file doesn't exist — OrderManagementModal crashes | Critical | `OrderManagementModal.tsx` |
| 1.8 | `/api/feedback` route doesn't exist — design feedback silently fails | High | `designs/new/page.tsx:199` |
| 1.9 | `/api/survey` never writes to `survey_responses` table — analytics always empty | High | `api/survey/route.ts` |
| 1.10 | `university-font-medium` typo on login page | Low | `login/page.tsx:68` |
| 1.11 | Backend `src/index.ts` doesn't exist — `npm run dev:backend` crashes | High | `backend/package.json` |
| 1.12 | ESLint `^4.1.1` and `eslint-config-next ^0.2.4` are invalid — linting broken | High | `app/package.json` |
| 1.13 | `@types/react ^19` mismatched with `react ^18` runtime | Medium | `app/package.json` |

---

## Phase 2: Security

These issues expose the app to abuse, data leaks, or financial risk.

| # | Issue | Severity | Files |
|---|-------|----------|-------|
| 2.1 | No `middleware.ts` — zero server-side auth protection | Critical | `app/src/` |
| 2.2 | `/api/generate` has no auth — anyone can burn paid AI credits | Critical | `api/generate/route.ts` |
| 2.3 | `/api/report` exposes analytics data with no auth | High | `api/report/route.ts` |
| 2.4 | `/api/traction-report` fail-open pattern (unprotected if CRON_SECRET unset) | High | `api/traction-report/route.ts` |
| 2.5 | `/api/track-referral` uses service role key on unauthenticated endpoint | High | `api/track-referral/route.ts` |
| 2.6 | `/api/survey` accepts arbitrary data with no auth or validation | Medium | `api/survey/route.ts` |
| 2.7 | No rate limiting on any API endpoint | Medium | All `api/` routes |
| 2.8 | XSS in email HTML — user input interpolated unsanitized | Medium | `traction-report.ts`, `survey/route.ts`, `report/route.ts` |
| 2.9 | CORS `Access-Control-Allow-Origin: *` on waitlist endpoint | Low | `waitlist-signup.ts` |
| 2.10 | `.env.vercel` and `.env.local` contain real production secrets on disk | Low | Root `.env` files |
| 2.11 | Incomplete `.env.example` files — missing many required variables | Low | `app/.env.example`, `backend/.env.example` |

---

## Phase 3: Code Quality & Cleanup

Redundant code, type safety, and developer experience improvements.

| # | Issue | Severity | Files |
|---|-------|----------|-------|
| 3.1 | Waitlist signup implemented 3 times (backend, API route, edge function) | High | 3 files |
| 3.2 | Traction report implemented 2 times with different email services | High | 2 files |
| 3.3 | Widespread `any` types across all pages and components | Medium | All files |
| 3.4 | `useEffect` depends on `supabase` (new instance each render) | Medium | All dashboard pages |
| 3.5 | `alert()` used for user feedback instead of toast/UI | Medium | `designs/new/page.tsx` |
| 3.6 | Duplicated `getStatusColor` function | Low | `dashboard/page.tsx`, `orders/page.tsx` |
| 3.7 | Duplicated `Sparkles` SVG component (inline in dashboard) | Low | `dashboard/page.tsx:194` |
| 3.8 | `landing/` directory is deprecated, still in repo | Low | Root level |
| 3.9 | `autoprefixer` redundant with Tailwind v4 | Low | `postcss.config.js` |
| 3.10 | Duplicate color definitions in `@theme` and `:root` in globals.css | Low | `globals.css` |
| 3.11 | Backend has `next` and `eslint` as production dependencies | Low | `backend/package.json` |
| 3.12 | No root `tsconfig.json` for cross-workspace type checking | Low | Root |

---

## Phase 4: Missing Features & Config

Features that are stubbed but not wired up, plus missing config files.

| # | Issue | Severity | Files |
|---|-------|----------|-------|
| 4.1 | No `next.config.js` — no image domains, redirects, or output config | High | `app/` |
| 4.2 | No `robots.txt` | Medium | `app/public/` |
| 4.3 | Search bar on Orders page is non-functional | Medium | `orders/page.tsx` |
| 4.4 | Filter button on Orders page does nothing | Medium | `orders/page.tsx` |
| 4.5 | Notification toggles on Settings don't persist to database | Medium | `settings/page.tsx` |
| 4.6 | No `updated_at` triggers on `bakers`, `orders`, `prep_tasks` | Medium | `supabase/migrations/` |
| 4.7 | Missing database indexes on foreign keys and query columns | Medium | `supabase/migrations/` |
| 4.8 | Design history has no pagination (loads all) | Low | `designs/page.tsx` |
| 4.9 | OnboardingModal shows every session (no DB completion tracking) | Low | `OnboardingModal.tsx` |
| 4.10 | FeedbackWidget visible for non-authenticated users | Low | `FeedbackWidget.tsx` |
| 4.11 | Social media links are `#` placeholders in footer | Low | `SiteFooter.tsx` |
| 4.12 | No loading/error states on designs and referrals pages | Low | Multiple |
| 4.13 | Env var name inconsistencies across backend/API/edge functions | Low | Multiple |

---

## Progress Tracking

- [x] Phase 1 — Fix What's Broken
- [x] Phase 2 — Security
- [ ] Phase 3 — Code Quality & Cleanup
- [ ] Phase 4 — Missing Features & Config
