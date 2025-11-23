# Architecture Plan

## System Overview

The BOT (Baked On Time) platform is a full-stack web application consisting of:

1. **Frontend Application** (Next.js)
2. **Backend API** (Express.js)
3. **Database** (PostgreSQL)
4. **External Services** (AI Image Generation, Payment Processing)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js - React Components, Tailwind CSS, TypeScript)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│              (Next.js API Routes + Express)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │  Business │  │   Auth    │  │  Payment  │
        │   Logic   │  │  Service  │  │  Service  │
        └───────────┘  └───────────┘  └───────────┘
                │             │             │
                └─────────────┼─────────────┘
                              ▼
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │    Database      │
                    └──────────────────┘

External Services:
    - Stable Diffusion API (Image Generation with LoRA/Fine-tuning)
    - Image Analysis API (Vision AI for style extraction)
    - Cloud Storage (S3/Cloudinary for baker portfolio)
    - Stripe API (Payments)
    - Email Service (Notifications)
```

## Core Components

### 1. Frontend Application (Next.js)

#### Pages
- `/` - Landing page
- `/configure` - Cake configuration wizard
- `/quote` - Quote summary and approval
- `/booking` - Booking and payment
- `/dashboard` - Baker dashboard
- `/dashboard/pricing` - Pricing configuration
- `/dashboard/orders` - Order management
- `/dashboard/calendar` - Calendar view
- `/dashboard/portfolio` - Upload and manage cake photos
- `/dashboard/production` - Production planning & prep scheduler
- `/dashboard/prep-planner` - Weekly prep planner with task breakdown
- `/dashboard/ingredients` - Batch ingredient calculator
- `/auth/login` - Authentication
- `/auth/register` - Registration

#### Key Components
- **CakeConfigurator**: Main configuration interface
- **AIImageGenerator**: Text-to-image interface with style training
- **PortfolioManager**: Upload and manage baker's cake photos
- **StyleAnalyzer**: Analyze baker's style from portfolio
- **ProductionPlanner**: Multi-day prep task scheduler
- **WeeklyPlanner**: Printable weekly planner with prep tips
- **IngredientCalculator**: Batch calculations for multiple cakes
- **PrepTaskManager**: Track component preparation (fondant, toppers, flowers)
- **PricingEngine**: Quote calculation display
- **BookingForm**: Order placement form
- **PaymentProcessor**: Stripe integration
- **BakerDashboard**: Admin interface

### 2. Backend API (Express.js)

#### API Endpoints

**Cake Configuration**
- `POST /api/cakes/generate-image` - Generate AI cake image using baker's style
- `POST /api/cakes/configure` - Save configuration
- `GET /api/cakes/configurations/:id` - Get configuration

**Baker Portfolio**
- `POST /api/portfolio/upload` - Upload baker's cake photos
- `GET /api/portfolio/:bakerId` - Get baker's portfolio
- `DELETE /api/portfolio/:photoId` - Delete portfolio photo
- `POST /api/portfolio/analyze` - Analyze photos for style extraction
- `POST /api/portfolio/train-model` - Train/fine-tune AI model on baker's style
- `GET /api/portfolio/training-status/:bakerId` - Check model training status

**Pricing**
- `POST /api/pricing/calculate` - Calculate quote
- `GET /api/pricing/rules` - Get baker's pricing rules
- `PUT /api/pricing/rules` - Update pricing rules

**Orders**
- `POST /api/orders/create` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/baker/:bakerId` - Get baker's orders
- `PUT /api/orders/:id/status` - Update order status

**Payments**
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/:id` - Get payment status

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Bakers**
- `GET /api/bakers/:id` - Get baker profile
- `PUT /api/bakers/:id` - Update baker profile
- `GET /api/bakers/:id/availability` - Get calendar availability

**Production Planning**
- `GET /api/production/planner/:bakerId` - Get weekly production planner
- `POST /api/production/calculate-ingredients` - Calculate batch ingredients for multiple cakes
- `GET /api/production/prep-schedule/:orderId` - Generate prep schedule for order
- `POST /api/production/prep-tasks` - Create prep task breakdown
- `GET /api/production/prep-tasks/:bakerId` - Get all prep tasks
- `PUT /api/production/prep-tasks/:taskId` - Update task status
- `GET /api/production/weekly-plan/:bakerId/:week` - Get weekly planner with all orders
- `POST /api/production/print-planner` - Generate printable weekly planner PDF

### 3. Database Layer

#### Main Tables
- `users` - User accounts (customers and bakers)
- `bakers` - Baker-specific profiles
- `portfolio_photos` - Baker's uploaded cake photos
- `ai_style_models` - Trained AI models for each baker
- `pricing_rules` - Customizable pricing configuration
- `cake_configurations` - Saved cake designs
- `quotes` - Generated quotes
- `orders` - Placed orders
- `payments` - Payment records
- `availability` - Baker calendar
- `prep_tasks` - Component preparation tasks (fondant, toppers, flowers)
- `prep_schedules` - Multi-day prep schedules for orders
- `ingredient_batches` - Batch ingredient calculations
- `prep_templates` - Reusable prep task templates

**Community & Social** (Phase 4 - see COMMUNITY_FEATURES.md):
- `gallery_photos` - Public baker gallery with pinned photos
- `inspiration_requests` - Customer inspiration requests from gallery
- `feed_posts` - Social feed posts by bakers
- `post_likes`, `post_comments`, `saved_posts` - Feed engagement
- `follows` - Following system between bakers
- `forum_categories`, `forum_threads`, `forum_replies` - Community forum
- `reply_votes` - Forum voting system
- `direct_messages` - Baker-to-baker messaging

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema.

### 4. External Services

#### AI Image Generation
- Provider: Stable Diffusion API (Replicate, Stability AI, or RunPod)
- Integration: REST API
- Features:
  - Text-to-image generation with custom LoRA models
  - Fine-tuning on baker's portfolio photos
  - Image-to-image refinement
  - Style transfer from reference images
  - Multi-image training for personalized style
  - ControlNet for structure guidance

**Style Training Workflow**:
1. Baker uploads 10-20 photos of their actual cakes
2. System analyzes photos to extract visual style patterns
3. Creates a custom LoRA (Low-Rank Adaptation) model
4. Fine-tunes base model with baker's aesthetic
5. Generates images that match baker's actual style

**Image Analysis**:
- Provider: OpenAI Vision API / Google Cloud Vision
- Extracts: color palettes, decoration styles, texture patterns
- Tags: techniques, themes, complexity levels

#### Payment Processing
- Provider: Stripe
- Features:
  - Payment intents
  - Deposit and full payment options
  - Refunds
  - Payment history

#### Email Service
- Provider: SendGrid / AWS SES
- Features:
  - Order confirmations
  - Payment receipts
  - Booking reminders

## Data Flow

### Cake Configuration Flow

1. Customer enters cake description
2. Frontend sends request to `/api/cakes/generate-image` with baker ID
3. Backend checks if baker has trained custom model
4. If custom model exists, uses baker's style for generation
5. AI generates image matching baker's actual style, returns URL
6. Customer edits configuration (size, flavor, etc.)
7. Configuration saved to database with AI image
8. Pricing engine calculates quote
9. Quote presented to customer

### Baker Portfolio Training Flow

1. Baker uploads 10-20 high-quality photos of their cakes
2. Photos stored in cloud storage (S3/Cloudinary)
3. System analyzes photos for style characteristics:
   - Color schemes and palettes
   - Decoration patterns and techniques
   - Texture and finish preferences
   - Typical design elements
4. Creates dataset for LoRA training
5. Initiates fine-tuning job (15-30 minutes)
6. Trained model stored and linked to baker profile
7. All future generations use baker's personalized model
8. Baker can retrain anytime with updated portfolio

### Booking Flow

1. Customer approves quote
2. Customer selects delivery/pickup date
3. Frontend creates order via `/api/orders/create`
4. Backend creates Stripe payment intent
5. Customer completes payment
6. Payment confirmed via webhook
7. Order status updated
8. Confirmation email sent

## Security Considerations

- **Authentication**: JWT-based authentication with NextAuth.js
- **Authorization**: Role-based access control (customer/baker)
- **Data Validation**: Input sanitization on all endpoints
- **Payment Security**: PCI compliance via Stripe
- **Data Encryption**: SSL/TLS for all communications
- **Environment Variables**: Secure storage of API keys

## Scalability

- **Horizontal Scaling**: Stateless API design
- **Caching**: Redis for session and frequently accessed data
- **CDN**: Static assets served via Vercel Edge Network
- **Database**: Connection pooling, read replicas
- **Image Storage**: Cloud storage (AWS S3 / Cloudinary)

## Monitoring & Logging

- **Application Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry
- **Logging**: Structured logging with Winston
- **Performance**: Core Web Vitals tracking

## Development Workflow

1. **Local Development**: Docker Compose for local services
2. **Version Control**: Git with feature branches
3. **CI/CD**: GitHub Actions for testing and deployment
4. **Testing**: Jest (unit), Cypress (E2E)
5. **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Deployment Strategy

- **Frontend**: Vercel (automatic deployments)
- **Backend**: Vercel Serverless Functions or Railway
- **Database**: Vercel Postgres or Supabase
- **Environment**: Development, Staging, Production

## Future Enhancements

### Phase 1-3 (Implemented in roadmap)
1. **Multi-baker marketplace**: Connect customers with multiple bakers
2. **3D cake preview**: Interactive 3D model generation
3. **Recipe management**: Baker recipe library
4. **Reviews & ratings**: Customer feedback system
5. **Mobile app**: Native iOS/Android applications
6. **Inventory management**: Ingredient tracking

### Phase 4 - Community & Social Features (See COMMUNITY_FEATURES.md)
7. **Baker Gallery System**: 
   - Public gallery for each baker with unlimited photos (Premium)
   - Pin up to 5 signature cakes to profile
   - Customer inspiration browsing with filters
   - Inspiration request system (customer finds cake → requests quote)
   
8. **Social Feed**:
   - Share completed cakes, tutorials, questions
   - Like, comment, save posts
   - Follow other bakers
   - Hashtags and discovery algorithm
   - Premium: Post unlimited, Free: View only

9. **Community Forum**:
   - Categories: Techniques, Business, Troubleshooting, Show & Tell
   - Q&A format with upvoting
   - Mark solutions
   - Search and threading
   - Premium: Post/reply, Free: View only

10. **Direct Messaging**:
    - Baker-to-baker communication
    - Share photos and tips
    - Group messages
    - Premium feature

11. **Matching Service** (Future):
    - Algorithm matches customers with bakers
    - Based on: location, style, availability, budget, ratings
    - Customer sees top matches with galleries
    - Send requests to multiple bakers
    - Compare quotes and book

**Community Benefits**:
- Increases platform stickiness (daily engagement)
- Reduces churn through baker connections
- Drives word-of-mouth growth
- Creates additional premium subscription value
- Inspiration browsing converts to bookings
