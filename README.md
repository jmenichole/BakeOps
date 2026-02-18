# BakeOps

A comprehensive web-based platform for custom bakers to accept orders through AI-powered cake design and automated pricing.

## Live Demo

- **Landing Page**: [https://bakebot-sigma.vercel.app](https://bakebot-sigma.vercel.app)
- **Backend API**: [https://bakebot-3hi9d6ku4-jmenicholes-projects.vercel.app](https://bakebot-3hi9d6ku4-jmenicholes-projects.vercel.app)

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

- **Frontend**: HTML, CSS, JavaScript (static landing page)
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL
- **AI Image Generation**: Stable Diffusion API
- **Payment Processing**: Stripe
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Additional Tools**: Supabase for backend services, Nodemailer for email

## API Endpoints

### Backend API (Planned)
- `GET /api/waitlist` - Retrieve waitlist signups
- `POST /api/waitlist` - Add new waitlist signup
- `GET /api/cakes` - Retrieve available cake configurations
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Retrieve order details
- `POST /api/payments/webhook` - Handle Stripe webhooks

### Supabase Functions
- `stats` - Generate traction statistics
- `waitlist-signup` - Handle waitlist signups

## Project Structure

```
├── landing/           # Static HTML landing page
├── backend/           # Express API server
├── supabase/          # Supabase functions and migrations
└── docs/              # Architecture and API documentation
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
