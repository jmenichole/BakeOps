# BakeBuilder Backend API

Express.js backend API for BakeBuilder platform.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Set up database (PostgreSQL):
```bash
# See database/ folder for migrations
```

4. Run development server:
```bash
npm run dev
```

5. API will be available at [http://localhost:3001](http://localhost:3001)

## Tech Stack

- Node.js & Express
- TypeScript
- PostgreSQL
- Stripe (Payments)
- JWT (Authentication)
- Winston (Logging)

## Project Structure

```
src/
  routes/         # API route definitions
  controllers/    # Request handlers
  services/       # Business logic
  middleware/     # Custom middleware
  models/         # Database models
  utils/          # Utility functions
  config/         # Configuration files
```

## API Endpoints

See `/docs/API.md` for complete API documentation.

## Testing

```bash
npm test
```
