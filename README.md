# BOT (Baked On Time)

A comprehensive web-based platform for custom bakers to accept orders through AI-powered cake design and automated pricing.

## Features

- **AI-Powered Cake Design**: Convert text descriptions into realistic cake mockups
- **Custom AI Training**: Train on baker's actual cake photos for personalized style
- **Interactive Configuration**: Customizable cake options (size, flavor, icing, decorations)
- **Dynamic Pricing Engine**: Automated quotes based on baker-defined rules
- **Production Planning**: Multi-day prep scheduling with component timing and batch calculations
- **Instant Booking & Payment**: Integrated payment processing with Stripe
- **Baker Dashboard**: Manage pricing, orders, calendar, and production
- **Community Features** (Phase 4): Baker gallery, social feed, forum, inspiration requests, matching

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, React, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **AI Image Generation**: Stable Diffusion API
- **Payment Processing**: Stripe
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # Express API server
├── database/          # Database schemas and migrations
├── docs/              # Architecture and API documentation
└── shared/            # Shared types and utilities
```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed installation and deployment instructions.

## Documentation

- [Architecture Plan](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [API Documentation](./docs/API.md)
- [Component Diagram](./docs/COMPONENTS.md)
- [Production Planning](./docs/PRODUCTION_PLANNING.md)
- [Monetization Strategy](./docs/MONETIZATION.md)
- [Community Features](./docs/COMMUNITY_FEATURES.md) - Gallery, Feed, Forum (Phase 4)

## License

MIT
