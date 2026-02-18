# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bake Ops is a web-based platform for custom bakers to accept orders through AI-powered cake design and automated pricing. The application features AI image generation, dynamic pricing, production planning, and payment processing.

## Monorepo Structure

This is an npm workspaces monorepo with two main packages:

- `app/` - Next.js 14 frontend application (React 18, TypeScript, Tailwind CSS v4)
- `backend/` - TypeScript backend (primarily serverless functions)

Additional directories:
- `supabase/` - Database migrations and edge functions
- `landing/` - Static HTML landing page (deprecated, replaced by Next.js app)

## Development Commands

### Install Dependencies
```bash
npm install  # Installs all workspace dependencies
```

### Development Servers
```bash
npm run dev:app      # Start Next.js dev server (http://localhost:3000)
npm run dev:backend  # Start backend locally with ts-node
```

### Building
```bash
npm run build         # Build both app and backend
npm run build:app     # Build Next.js app only
npm run build:backend # Compile TypeScript backend only
```

### Testing
```bash
npm test             # Run backend tests with Jest
npm run test:backend # Same as above, with --forceExit flag
```

Backend tests use Jest with ts-jest preset. No frontend tests are currently configured.

### Linting
```bash
npm run lint      # Lint Next.js app with next lint
npm run lint:app  # Same as above
```

## Tech Stack & Architecture

### Frontend (Next.js App)
- **Framework**: Next.js 14 with App Router
- **UI**: React 18, TypeScript, Tailwind CSS v4
- **Styling**: Tailwind CSS v4 (uses CSS-based config in `globals.css`, no `tailwind.config.js`)
- **Forms**: react-hook-form with zod validation
- **Icons**: lucide-react
- **Auth**: Supabase Auth via @supabase/auth-helpers-nextjs
- **Database**: Supabase (PostgreSQL)

### Key Frontend Patterns
- Path alias `@/*` maps to `app/src/*`
- App Router with route groups and layouts
- API routes in `app/src/app/api/*`
- Server components by default; use `'use client'` directive when needed
- Tailwind v4 uses `@import "tailwindcss"` in CSS, configured via CSS custom properties

### Backend
- TypeScript with serverless functions architecture
- Supabase client for database operations
- Node Schedule for cron jobs
- Nodemailer for email notifications
- Deployed as Vercel serverless functions

### Database & Services
- **Supabase**: Authentication, PostgreSQL database, edge functions
- **Vercel**: Deployment platform with cron job support (monthly traction report)
- **Stripe**: Payment processing (referenced but not fully integrated)
- **AI Image Generation**: Stability AI (Stable Diffusion) via `/api/generate`
- **Email**: Resend for transactional emails

## Important Files & Directories

### App Structure
```
app/src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (generate, feedback, report, survey, traction-report, track-referral)
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── designs/       # Design management
│   │   ├── orders/        # Order management
│   │   ├── production/    # Production planning
│   │   ├── referrals/     # Referral program
│   │   └── settings/      # User settings
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── forgot-password/
│   ├── pricing/           # Public pages
│   ├── support/
│   ├── terms/
│   ├── privacy/
│   ├── refund/
│   └── trial-expired/
├── components/            # Shared React components
│   ├── DailySurveyModal.tsx
│   ├── AuthButton.tsx
│   ├── DesignDetailModal.tsx
│   ├── FeedbackWidget.tsx
│   ├── NewOrderModal.tsx
│   ├── OnboardingModal.tsx
│   ├── OrderManagementModal.tsx
│   ├── SiteFooter.tsx
│   └── TrialStatusGuard.tsx
└── lib/                   # Utility functions
    ├── analytics.ts       # Analytics helpers
    ├── supabase.ts        # Supabase client setup
    └── trial.ts           # Trial management utilities
```

### Backend Structure
```
backend/src/
├── index.ts               # Entry point (re-exports handlers)
├── traction-report.ts     # Monthly traction email generation
└── traction-report.test.ts
```

### Supabase
```
supabase/
├── functions/             # Edge functions
└── migrations/            # Database schema migrations
```

## Dashboard Pages Architecture

The dashboard uses a consistent layout (`dashboard/layout.tsx`) with:
- Navigation sidebar
- Trial status guard (blocks access after trial expiration)
- Protected route middleware

Key dashboard pages:
- **Designs** (`/dashboard/designs`) - View and manage AI-generated cake designs with history
- **Orders** (`/dashboard/orders`) - Order management with "Send to Customer" and "Save as Draft" features
- **Production** (`/dashboard/production`) - Production planning with multi-day prep scheduling
- **Referrals** (`/dashboard/referrals`) - Affiliate program management
- **Settings** (`/dashboard/settings`) - User profile, notifications, account management (change password, logout, delete account)

## Authentication & Authorization

- Uses Supabase Auth via @supabase/auth-helpers-nextjs
- Protected routes wrapped with TrialStatusGuard component
- Trial system limits access after expiration
- Auth helpers from @supabase/auth-helpers-nextjs

## Deployment

Deployed to Vercel with:
- `vercel.json` configuration
- Build command: `npm run build -w app`
- Output directory: `app/.next`
- Cron job configured for monthly traction report (`/api/traction-report`)

Environment variables required (see `.env.vercel` for Vercel setup):
- Supabase credentials
- Stripe keys (for payments)
- AI image generation API keys
- Email service credentials

## Known Issues & Incomplete Features

See `TODO.md` for comprehensive list. Key items:
- See `ISSUES.md` for full audit findings and fix phases
- Design history needs to be limited to last 20 designs or 30 days
- Production "Add Manual" button exists but needs onClick handler implementation

## Code Style & Patterns

- TypeScript strict mode enabled
- Use path aliases (`@/` prefix) for imports within the app
- React Server Components by default; use Client Components only when needed
- Tailwind utility-first CSS with v4 syntax
- Forms use react-hook-form + zod for validation
- Keep components in `app/src/components/` for reuse across pages
