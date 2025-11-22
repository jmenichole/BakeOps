# BakeBuilder Frontend

Next.js frontend application for BakeBuilder platform.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI
- Zustand (State Management)
- React Hook Form
- Stripe Elements

## Project Structure

```
app/               # Next.js app router pages
src/
  components/      # Reusable components
  lib/            # Utilities and helpers
  hooks/          # Custom React hooks
  types/          # TypeScript type definitions
  contexts/       # React contexts
  utils/          # Utility functions
public/           # Static assets
```
