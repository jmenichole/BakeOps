# BakeBuilder - Project Summary

## Overview

BakeBuilder is a comprehensive web-based platform for custom bakers that combines AI-powered cake design, automated pricing, production planning, and seamless booking with payments.

## Key Differentiators

### 1. **AI Trained on Baker's Actual Work**
- Bakers upload 10-20 photos of their actual cakes
- System analyzes their unique style (colors, techniques, decorations)
- Creates custom LoRA model fine-tuned to baker's aesthetic
- Generated mockups match baker's real-world capabilities
- Result: Realistic renderings customers can actually order

### 2. **Production Planning Addressing Real Pain Points**
Based on actual baker feedback (from mom):
- **Multi-day prep scheduling**: Automatically breaks down cakes into component tasks
- **Component timing**: Knows gum paste flowers need 3-5 days to dry, fondant pieces need 2 days
- **Batch ingredient calculator**: Calculates total fondant/frosting by color across multiple cakes
- **Printable weekly planner**: Physical checklist with prep tips
- **3-day split prep**: Organizes work across multiple days like real bakers work

Example workflow:
- Monday: Bake layers, start gum paste flowers
- Tuesday: Prepare fondant colors (2 lbs pink, 3 lbs white), make toppers
- Wednesday: Fill cakes, crumb coat, make buttercream
- Thursday: Final coat, apply fondant
- Friday: Decorate, add flowers
- Saturday: Deliver

### 3. **Subscription Model with Free Trial**
- **7-day free trial**: Automatically granted based on device fingerprint + IP
- **Premium Monthly**: $49/month
- **Premium Yearly**: $470/year (save 20%, 2 months free)
- **Trial abuse prevention**: Device fingerprinting prevents multiple trials

## Technical Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (accessible primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Payments**: Stripe Elements
- **Features**:
  - AI image generator with baker's style
  - Interactive cake configurator
  - Production planner with calendar
  - Batch ingredient calculator
  - Weekly planner (printable PDF)
  - Baker dashboard
  - Customer booking portal

### Backend (Express.js)
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payments**: Stripe
- **AI**: Stable Diffusion (LoRA training)
- **Email**: SendGrid/AWS SES
- **Storage**: AWS S3/Cloudinary
- **Features**:
  - RESTful API
  - Security (Helmet, CORS, rate limiting)
  - Portfolio photo analysis
  - AI model training service
  - Pricing engine
  - Prep schedule generator
  - Ingredient batch calculator

### Database (PostgreSQL)
**Core Tables**:
- `users` - All user accounts
- `bakers` - Baker profiles
- `subscriptions` - Subscription management
- `trial_tracking` - Free trial tracking

**Portfolio & AI**:
- `portfolio_photos` - Baker's uploaded cakes
- `ai_style_models` - Trained LoRA models

**Orders & Payments**:
- `cake_configurations` - Cake designs
- `quotes` - Price quotes
- `orders` - Customer orders
- `payments` - Payment records
- `pricing_rules` - Custom pricing

**Production Planning**:
- `prep_tasks` - Component tasks (fondant, flowers, etc.)
- `prep_schedules` - Multi-day schedules
- `ingredient_batches` - Batch calculations
- `prep_templates` - Reusable templates
- `weekly_planners` - Generated planners

**Calendar**:
- `availability` - Baker availability

## Feature Breakdown

### Free Trial (7 Days)
- ✅ Upload 5 portfolio photos
- ✅ Generate 10 AI mockups
- ✅ Basic configurator
- ✅ Manual quotes (5 max)
- ✅ Accept 2 orders
- ✅ Basic task list
- ❌ No AI model training
- ❌ No automated pricing
- ❌ No prep scheduling
- ❌ No batch calculations

### Premium ($49/month or $470/year)
- ✅ Unlimited portfolio photos
- ✅ **Custom AI model trained on your cakes**
- ✅ Unlimited AI mockups in your style
- ✅ Full cake configurator
- ✅ Automated pricing engine
- ✅ Unlimited quotes & orders
- ✅ **Multi-day prep scheduling**
- ✅ **Batch ingredient calculator**
- ✅ **Printable weekly planner with tips**
- ✅ **Component timing (fondant, flowers, etc.)**
- ✅ **Color-based batching**
- ✅ Calendar management
- ✅ Stripe payments
- ✅ Customer portal
- ✅ Analytics dashboard
- ✅ Priority support

## User Flows

### Customer Flow
1. Visit baker's booking page
2. Describe desired cake
3. AI generates mockup in baker's style
4. Customize (size, flavor, decorations)
5. See instant quote
6. Select delivery/pickup date
7. Pay deposit or full amount
8. Receive confirmation

### Baker Flow
1. Sign up → 7-day free trial starts
2. Upload 10+ photos of actual cakes
3. System trains custom AI model (15-30 min)
4. Configure pricing rules
5. Set calendar availability
6. Share booking link
7. Receive orders automatically
8. View weekly production planner
9. Check prep tasks daily
10. Complete and deliver cakes

### Production Planning Flow
1. Orders confirmed for the week
2. System generates prep schedules:
   - Breaks down each cake into tasks
   - Schedules based on component timing
   - Spreads work across multiple days
3. Baker views weekly planner:
   - See all tasks for each day
   - Batch ingredient totals
   - Prep tips for each task
4. Print physical planner
5. Check off tasks as completed
6. Track progress in real-time

## Revenue Model

### Pricing Strategy
- **Target Market**: Professional home bakers and small bakeries
- **Price Point**: $49/month (competitive vs Square $50, GlossGenius $24)
- **Value Prop**: AI mockups alone worth $200/month + complete business system
- **Annual Discount**: 20% (industry standard)

### Projected Revenue (Year 1)
| Quarter | Trials | Conversion | Monthly Subs | Yearly Subs | MRR | ARR (Yearly) | Total |
|---------|--------|------------|--------------|-------------|-----|--------------|-------|
| Q1 | 100 | 10% | 8 | 2 | $392 | $940 | $1,332 |
| Q2 | 200 | 15% | 22 | 8 | $1,078 | $3,760 | $4,838 |
| Q3 | 300 | 18% | 44 | 10 | $2,156 | $4,700 | $6,856 |
| Q4 | 400 | 20% | 68 | 12 | $3,332 | $5,640 | $8,972 |

**Assumptions**:
- 10-20% trial → paid conversion
- 80% monthly, 20% yearly
- 5% monthly churn
- Average LTV: 18 months

## Competitive Advantage

### vs. Square Appointments ($50/month)
- ❌ No AI mockup generation
- ❌ No production planning
- ✅ Has booking
- **Our advantage**: AI + production planning

### vs. GlossGenius ($24/month)
- ❌ No customization
- ❌ No production tools
- ✅ Booking + payments
- **Our advantage**: Baker-specific features

### vs. Acuity Scheduling ($16/month)
- ❌ Calendar only
- ❌ No AI or planning
- **Our advantage**: Complete solution

### Our Position
- **Most comprehensive**: Only platform with AI + planning + booking
- **Baker-focused**: Built for custom cake business
- **Time-saving**: 3-5 hours/week saved on planning alone
- **Quality improvement**: Proper timing = better cakes

## Development Roadmap

### Phase 1 - MVP (Months 1-3) ✅
- [x] Documentation complete
- [x] Frontend scaffolding
- [x] Backend scaffolding
- [x] Database schema designed
- [ ] Core authentication
- [ ] Basic AI integration
- [ ] Simple configurator
- [ ] Manual pricing
- [ ] Stripe subscriptions

### Phase 2 - AI & Planning (Months 4-6)
- [ ] Portfolio upload & analysis
- [ ] LoRA model training
- [ ] Custom style generation
- [ ] Prep task automation
- [ ] Batch calculator
- [ ] Weekly planner PDF

### Phase 3 - Polish & Launch (Months 7-9)
- [ ] Customer portal
- [ ] Baker dashboard complete
- [ ] Email notifications
- [ ] Analytics
- [ ] Mobile responsive
- [ ] Beta testing
- [ ] Marketing site

### Phase 4 - Growth (Months 10-12)
- [ ] Baker gallery system with pinned photos
- [ ] Customer inspiration browsing and requests
- [ ] Social feed (posts, likes, comments, following)
- [ ] Community forum (Q&A, voting, categories)
- [ ] Direct messaging between bakers
- [ ] Baker-customer matching algorithm
- [ ] Mobile app
- [ ] API for integrations

**Community Features Benefits**:
- Creates daily engagement (vs monthly for bookings only)
- Builds baker-to-baker connections
- Drives word-of-mouth growth
- Inspiration browsing converts to bookings
- Additional premium subscription value

## Technical Challenges & Solutions

### Challenge 1: Realistic AI Generation
**Problem**: Generic AI creates unrealistic cakes bakers can't actually make

**Solution**: 
- Train custom LoRA on baker's portfolio
- Extract style patterns (colors, techniques)
- Generate mockups matching baker's capabilities
- Result: Realistic, bookable designs

### Challenge 2: Complex Production Planning
**Problem**: Each cake component has different timing requirements

**Solution**:
- Database of task types with timing rules
- Algorithm calculates optimal schedule
- Considers dependencies (must bake before frost)
- Spreads work across multiple days
- Provides prep tips per task

### Challenge 3: Trial Abuse Prevention
**Problem**: Users creating multiple trials

**Solution**:
- Device fingerprinting (FingerprintJS)
- IP address tracking
- Combined uniqueness check
- Rate limiting per IP range
- Email verification required

### Challenge 4: Ingredient Calculations
**Problem**: Calculating totals across multiple cakes with different colors

**Solution**:
- Each cake stores ingredient requirements
- Batch calculator aggregates by color
- Fondant: {"pink": 3.5lbs, "white": 4lbs}
- Buttercream: {"vanilla": 6.5lbs, "chocolate": 2lbs}
- Shopping list auto-generated

## Success Metrics

### Acquisition
- Trial signups per week
- Source attribution
- Landing page conversion rate

### Activation
- % uploading photos (target: 70%)
- % training AI model (target: 50%)
- % creating first quote (target: 60%)

### Retention
- Trial → Paid conversion (target: 15%)
- Monthly churn (target: <5%)
- Customer lifetime (target: 18 months)

### Revenue
- MRR growth rate (target: 20%/month)
- ARPU (target: $49)
- LTV:CAC ratio (target: >3:1)

### Engagement
- Orders per baker (target: 8/month)
- Weekly planner usage (target: 80%)
- AI generations per baker (target: 20/month)

## Next Steps

1. **Database Setup**
   - Create migration files for all tables
   - Set up development database
   - Create seed data

2. **Authentication System**
   - User registration/login
   - JWT implementation
   - Password hashing
   - Email verification

3. **AI Integration**
   - Stability AI / Replicate setup
   - Image upload handling
   - Style analysis service
   - LoRA training pipeline

4. **Core Features**
   - Cake configurator UI
   - Pricing calculator
   - Production planner
   - Weekly calendar view

5. **Payment Integration**
   - Stripe Connect setup
   - Subscription management
   - Webhook handling
   - Trial tracking

## Deployment Plan

### Development
- Frontend: Localhost:3000
- Backend: Localhost:3001
- Database: Local PostgreSQL

### Staging
- Frontend: Vercel preview
- Backend: Railway staging
- Database: Supabase staging

### Production
- Frontend: Vercel (auto-deploy from main)
- Backend: Railway / Vercel Functions
- Database: Vercel Postgres / Supabase
- CDN: Cloudflare
- Storage: AWS S3 / Cloudinary
- Monitoring: Sentry + Vercel Analytics

## Support & Documentation

- **User Guide**: Step-by-step tutorials
- **API Docs**: Complete endpoint reference
- **Video Tutorials**: Feature walkthroughs
- **FAQ**: Common questions
- **Support**: Email + in-app chat

## Team Roles (Future)

- **Founder/CEO**: Vision, strategy, fundraising
- **CTO**: Technical architecture, team lead
- **Frontend Dev**: React/Next.js features
- **Backend Dev**: API, integrations, AI
- **Designer**: UI/UX, branding, marketing
- **Customer Success**: Onboarding, support

## Funding Needs (If Applicable)

### Bootstrapped Path
- Initial: Personal investment
- Revenue: Subscription MRR
- Growth: Reinvest profits

### Funded Path
- Seed Round: $500K
  - $200K: Development team (6 months)
  - $150K: Marketing & customer acquisition
  - $100K: Infrastructure & tools
  - $50K: Legal & operations

## Long-term Vision

**Year 1**: Single-baker SaaS platform
**Year 2**: Add community features (gallery, feed, forum) for engagement
**Year 3**: Multi-baker marketplace with matching algorithm
**Year 5**: Industry-standard platform with thriving baker community

**Mission**: Empower bakers to grow profitable businesses by eliminating admin work, showcasing their artistry through AI, and connecting them with customers and fellow bakers.
