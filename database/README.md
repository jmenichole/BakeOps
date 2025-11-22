# BakeBuilder Database

Database migrations and seed data for BakeBuilder.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure database connection in `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bakemeacake
```

3. Run migrations:
```bash
npm run migrate
```

4. (Optional) Seed database with sample data:
```bash
npm run seed
```

## Migrations

Create a new migration:
```bash
npm run migrate:create -- migration-name
```

Roll back last migration:
```bash
npm run migrate:down
```

## Database Schema

See `/docs/DATABASE_SCHEMA.md` for complete schema documentation.

## Tables

- users - User accounts
- bakers - Baker profiles
- portfolio_photos - Baker's cake photos
- ai_style_models - Trained AI models
- subscriptions - Subscription management
- trial_tracking - Trial usage tracking
- pricing_rules - Pricing configuration
- cake_configurations - Cake designs
- quotes - Price quotes
- orders - Customer orders
- payments - Payment records
- availability - Baker calendar
- prep_tasks - Component preparation tasks
- prep_schedules - Multi-day prep schedules
- ingredient_batches - Batch calculations
- prep_templates - Reusable prep templates
- weekly_planners - Generated planners
