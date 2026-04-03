# Bake Ops — Current Issues & Resolution Status
Updated: 2026-04-03 (Post-Audit Cleanup)

---

## ✅ Resolved & Hardened
These issues have been fully resolved in the latest push to `main`.

| # | Issue | Status | Resolution Detail |
|---|-------|--------|-------------------|
| 1.1 | Next.js/React Versions | Fixed | Downgraded to stable **Next.js 15.1.7** and React 19 to fix Vercel "Unknown at 1:1" build errors. |
| 1.2 | Missing DB Columns | Fixed | `customer_phone`, `is_paid`, `is_draft` added via migrations 006-009. |
| 1.3 | Orders Insert Policy | Fixed | RLS policy added in migration 006 to allow bakers to create orders. |
| 1.4 | Bakers Insert Policy | Fixed | RLS policy and SQL Trigger added for automatic profile creation. |
| 1.7 | `useToast` Hook | Fixed | Verified existence in `app/src/hooks/useToast.ts`. |
| 1.11| Backend Logic | Fixed | Removed defunct `backend` mono-workspace; unified all logic in `/app`. |
| 2.1 | Middleware | Fixed | `app/src/middleware.ts` now handles auth, public routes, and PWA logic. |
| 2.2 | AI Auth Security | Fixed | `/api/generate` now uses `getAuthUser()` for strict credit protection. |
| 3.4 | Supabase Lifecycle | Fixed | Replaced custom `createBrowserClient` with standard `auth-helpers` context. |
| 4.1 | Next Config | Fixed | `next.config.ts` verified in project root. |
| 4.3 | Order Search | Fixed | Search logic active in `OrdersPage.tsx`. |
| 4.5 | Settings Persistence| Fixed | `zip_code` and notification toggles now correctly persist to `bakers` table. |
| 4.9 | Onboarding Persistence| Fixed | Added `localStorage` fallback to prevent recurring modal popups. |

---

## 🛠️ Remaining Priority Tasks (Phase 3/4)
Items still requiring attention or optimization.

| # | Issue | Target | Notes |
|---|-------|--------|-------|
| 3.3 | Widespread `any` types | High | Systematic sweep of `/app/src` needed to enforce strict types. |
| 4.6 | `updated_at` Triggers | Medium | Ensure triggers are applied to ALL newly created tables (migrations 002-009). |
| 4.11| Social Placeholders | Low | Update `SiteFooter.tsx` with real brand handles (once established). |

---

## 🚀 Deployment Status
- **Vercel**: Deployment now uses `npm run build -w app`.
- **Database**: Supabase SQL Trigger (Setup Guide) is required for full onboarding automation.
- **Environment**: Ensure `AI_IMAGE_API_KEY` and `RESEND_API_KEY` are configured in Vercel UI.
