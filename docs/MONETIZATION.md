# Monetization Strategy & Pricing Model

## Overview

The BakeBuilder platform operates on a **freemium subscription model** targeting professional bakers. New users receive an automatic 7-day free trial, after which they must subscribe to continue accessing premium features.

## Pricing Tiers

### Free Trial (7 Days)
**Price**: $0
**Duration**: 7 days from first access
**Automatic**: Granted based on device fingerprint + IP address

**Included Features**:
- ✅ Upload up to 5 portfolio photos
- ✅ Generate up to 10 AI mockups (trial limit)
- ✅ Basic cake configurator
- ✅ Manual quote creation (up to 5 quotes)
- ✅ Accept up to 2 orders
- ✅ Basic task list (no auto-scheduling)
- ✅ Email support
- ❌ No custom AI model training
- ❌ No automated pricing engine
- ❌ No calendar integration
- ❌ No customer portfolio showcase
- ❌ No multi-day prep scheduling
- ❌ No batch ingredient calculator
- ❌ No printable weekly planner

### Monthly Premium
**Price**: $49/month
**Billing**: Monthly recurring via Stripe

**Included Features**:
- ✅ Upload unlimited portfolio photos
- ✅ Custom AI model training on your cake style
- ✅ Generate unlimited AI mockups in your style
- ✅ Full cake configurator with all options
- ✅ Automated pricing engine with custom rules
- ✅ Unlimited quotes and orders
- ✅ Calendar management & availability
- ✅ **Multi-day prep scheduling with auto-task breakdown**
- ✅ **Batch ingredient calculator for multiple cakes**
- ✅ **Printable weekly planner with prep tips**
- ✅ **Component timing recommendations (fondant, flowers, etc.)**
- ✅ **Color-based ingredient batching (fondant/frosting by color)**
- ✅ Customer booking portal
- ✅ Stripe payment integration
- ✅ Email notifications
- ✅ Order management dashboard
- ✅ Analytics & insights
- ✅ Priority email support
- ✅ Public portfolio showcase

### Yearly Premium (Best Value)
**Price**: $470/year ($39.17/month - Save 20%)
**Billing**: Annual charge via Stripe

**Included Features**:
- ✅ All Monthly Premium features
- ✅ 2 months free (20% discount)
- ✅ Priority support & feature requests
- ✅ Early access to new features
- ✅ Dedicated onboarding session
- ✅ Annual business review call

## Feature Matrix

| Feature | Free Trial | Monthly | Yearly |
|---------|-----------|---------|---------|
| **Portfolio Photos** | 5 max | Unlimited | Unlimited |
| **AI Mockup Generation** | 10 total | Unlimited | Unlimited |
| **Custom AI Style Training** | ❌ | ✅ | ✅ |
| **Automated Pricing Engine** | ❌ | ✅ | ✅ |
| **Manual Quotes** | 5 max | Unlimited | Unlimited |
| **Orders Per Month** | 2 max | Unlimited | Unlimited |
| **Multi-Day Prep Scheduling** | ❌ | ✅ | ✅ |
| **Batch Ingredient Calculator** | ❌ | ✅ | ✅ |
| **Printable Weekly Planner** | ❌ | ✅ | ✅ |
| **Component Task Breakdown** | Basic list | Auto-generated | Auto-generated |
| **Prep Tips & Timing** | ❌ | ✅ | ✅ |
| **Color-Based Ingredient Batching** | ❌ | ✅ | ✅ |
| **Calendar Integration** | ❌ | ✅ | ✅ |
| **Stripe Payments** | ❌ | ✅ | ✅ |
| **Customer Portal** | ❌ | ✅ | ✅ |
| **Analytics Dashboard** | Basic | Advanced | Advanced |
| **Email Notifications** | Basic | Full | Full |
| **Support** | Email | Priority Email | Priority + Video |
| **Onboarding** | Self-service | Email guide | 1-on-1 session |
| **Branding** | "Powered by BakeBuilder" | Your branding | Your branding |

## Trial System Design

### Trial Activation
1. **Automatic Detection**: When a new visitor accesses the platform
2. **Fingerprinting**: Generate unique device fingerprint using:
   - Browser fingerprint (canvas, WebGL, fonts)
   - IP address
   - User agent
3. **Trial Check**: Query `trial_tracking` table for existing trials
4. **Grant Trial**: If no trial found, create new 7-day trial
5. **Track Usage**: Monitor feature usage during trial

### Trial Expiration
1. **7-Day Countdown**: Display days remaining in UI
2. **Email Reminders**: 
   - Day 5: "2 days left in your trial"
   - Day 6: "Last day of trial - Subscribe now"
   - Day 7: "Trial expired - Upgrade to continue"
3. **Grace Period**: None - features locked immediately after expiration
4. **Conversion Prompt**: Modal overlay requiring subscription choice

### Trial Abuse Prevention
1. **Device Fingerprinting**: FingerprintJS or similar
2. **IP Tracking**: Store and check IP addresses
3. **Rate Limiting**: Limit trial creations per IP range
4. **Account Verification**: Require email verification
5. **Payment Method**: Optional "card on file" even for trial
6. **Monitoring**: Flag suspicious patterns (VPN, multiple trials)

## Subscription Lifecycle

### New User Journey

```
1. First Visit
   ↓
2. Auto-detect: No trial found
   ↓
3. Show welcome modal: "Start your 7-day free trial"
   ↓
4. Optional: Collect email (for reminders)
   ↓
5. Grant trial access
   ↓
6. Days 1-5: Full trial features + "X days remaining" badge
   ↓
7. Day 6: Prominent "Subscribe Now" prompts
   ↓
8. Day 7: Trial expires
   ↓
9. Feature lockout modal: "Subscribe to continue"
   ↓
10. User subscribes → Full access
    OR
    User ignores → Limited to view-only mode
```

### Subscription Flow

```
1. Click "Upgrade to Premium"
   ↓
2. Choose plan: Monthly ($49) or Yearly ($470)
   ↓
3. Stripe Checkout
   ↓
4. Payment confirmation
   ↓
5. Subscription activated
   ↓
6. Redirect to dashboard
   ↓
7. Welcome email with invoice
```

### Renewal & Billing

- **Auto-renewal**: All subscriptions renew automatically
- **Payment retry**: 3 attempts over 7 days if payment fails
- **Grace period**: 3 days after failed payment
- **Downgrade**: Can cancel anytime, access until period end
- **Upgrade**: Prorated when upgrading from monthly to yearly

## Feature Gating Implementation

### Backend Middleware

```typescript
// Check subscription status before granting access
async function requirePremiumFeature(req, res, next) {
  const { bakerId } = req.user;
  const feature = req.route.featureKey;
  
  const hasAccess = await checkFeatureAccess(bakerId, feature);
  
  if (!hasAccess) {
    return res.status(403).json({
      error: 'SUBSCRIPTION_REQUIRED',
      message: 'This feature requires an active subscription',
      upgradeUrl: '/pricing'
    });
  }
  
  next();
}
```

### Frontend Components

```typescript
// Feature gate wrapper component
const PremiumFeature = ({ feature, children, fallback }) => {
  const { subscription } = useSubscription();
  
  if (!subscription || !hasFeature(subscription, feature)) {
    return fallback || <UpgradePrompt feature={feature} />;
  }
  
  return children;
};
```

### Feature Keys

```typescript
const FEATURES = {
  // AI & Generation
  AI_CUSTOM_MODEL: 'ai_custom_model',
  AI_UNLIMITED_GENERATION: 'ai_unlimited_generation',
  
  // Portfolio
  UNLIMITED_PHOTOS: 'unlimited_photos',
  PORTFOLIO_SHOWCASE: 'portfolio_showcase',
  
  // Pricing & Quotes
  AUTOMATED_PRICING: 'automated_pricing',
  UNLIMITED_QUOTES: 'unlimited_quotes',
  
  // Orders & Payments
  UNLIMITED_ORDERS: 'unlimited_orders',
  STRIPE_INTEGRATION: 'stripe_integration',
  
  // Management
  CALENDAR_INTEGRATION: 'calendar_integration',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  
  // Support
  PRIORITY_SUPPORT: 'priority_support',
};
```

## Revenue Projections

### Conservative Estimates (Year 1)

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| **New Trials** | 100 | 200 | 300 | 400 |
| **Trial→Paid Conversion** | 10% | 15% | 18% | 20% |
| **Monthly Subscribers** | 8 | 22 | 44 | 68 |
| **Yearly Subscribers** | 2 | 8 | 10 | 12 |
| **MRR (Monthly)** | $392 | $1,078 | $2,156 | $3,332 |
| **ARR (from Yearly)** | $940 | $3,760 | $4,700 | $5,640 |
| **Total Revenue** | $1,332 | $4,838 | $6,856 | $8,972 |

### Assumptions
- 10-20% trial to paid conversion rate
- 80% monthly, 20% yearly split
- 5% monthly churn rate
- Average customer lifetime: 18 months

## Payment Integration

### Stripe Setup

1. **Products**:
   - Product: "BakeBuilder Premium"
   - Price 1: $49/month recurring
   - Price 2: $470/year recurring

2. **Webhooks**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

3. **Customer Portal**:
   - Enable Stripe Customer Portal for self-service
   - Allow: Update payment method, cancel subscription, view invoices

### Payment Flow

```typescript
// Create subscription
POST /api/subscriptions/create
{
  "planType": "monthly" | "yearly",
  "paymentMethodId": "pm_xxx"
}

// Response
{
  "subscriptionId": "sub_xxx",
  "status": "active",
  "currentPeriodEnd": "2025-12-22T00:00:00Z"
}
```

## Analytics & Metrics

### Key Metrics to Track

1. **Acquisition**:
   - Trial sign-ups per day/week/month
   - Traffic sources
   - Landing page conversion rate

2. **Activation**:
   - % of trials that upload photos
   - % of trials that generate AI mockups
   - % of trials that create first quote

3. **Retention**:
   - Trial to paid conversion rate
   - Monthly churn rate
   - Customer lifetime value (LTV)

4. **Revenue**:
   - Monthly Recurring Revenue (MRR)
   - Annual Recurring Revenue (ARR)
   - Average Revenue Per User (ARPU)

5. **Engagement**:
   - Feature adoption rates
   - Daily/Weekly/Monthly Active Users
   - Orders per baker per month

### Dashboard Metrics

```sql
-- Trial conversion rate
SELECT 
  COUNT(CASE WHEN status = 'trial' THEN 1 END) as trials,
  COUNT(CASE WHEN status IN ('active', 'past_due') THEN 1 END) as paid,
  ROUND(COUNT(CASE WHEN status IN ('active', 'past_due') THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(*), 0) * 100, 2) as conversion_rate
FROM subscriptions;

-- MRR calculation
SELECT 
  SUM(CASE 
    WHEN plan_type = 'monthly' THEN amount
    WHEN plan_type = 'yearly' THEN amount / 12
  END) as mrr
FROM subscriptions
WHERE status = 'active';
```

## Competitive Pricing Analysis

### Market Comparison

| Platform | Monthly | Yearly | Features |
|----------|---------|--------|----------|
| **Square Appointments** | $50 | $540 | Booking only, no AI |
| **GlossGenius** | $24 | $240 | Booking + payments, no customization |
| **Acuity Scheduling** | $16 | $180 | Calendar only |
| **Our Platform** | $49 | $470 | AI + Booking + Pricing + Payments |

**Value Proposition**: We offer AI-powered mockup generation (worth $200/month alone) plus complete booking system.

## Upgrade Incentives

### Limited-Time Offers

1. **Launch Promotion** (First 100 bakers):
   - 50% off first 3 months
   - Extended 14-day trial
   - Free onboarding session

2. **Annual Discount**:
   - 20% discount on yearly plans
   - 2 months free messaging

3. **Referral Program**:
   - Refer a baker → Both get 1 month free
   - Unlimited referrals

### Conversion Triggers

1. **Usage Limits**: "You've used 9/10 AI generations. Upgrade for unlimited!"
2. **Feature Locks**: "Automated pricing requires Premium"
3. **Social Proof**: "Join 500+ bakers already using Premium"
4. **Urgency**: "Trial ends in 24 hours - Upgrade now!"
5. **Value**: "Save 3+ hours per week with automation"

## Customer Success

### Onboarding Checklist

For new Premium subscribers:

- [ ] Welcome email with quick start guide
- [ ] Video tutorial: Upload portfolio photos
- [ ] Video tutorial: Train your AI model
- [ ] Video tutorial: Configure pricing rules
- [ ] Video tutorial: Create first mockup
- [ ] Check-in email (Day 7): "How's it going?"
- [ ] Feature highlight (Day 14): "Did you know..."
- [ ] Success story (Day 30): "See what others are doing"

### Retention Strategies

1. **Regular engagement**: Weekly tips & tricks emails
2. **Feature updates**: Announce new features to increase value
3. **Success stories**: Share customer wins
4. **Community**: Facebook group for bakers
5. **Support**: Quick response times
6. **Surveys**: Quarterly feedback collection

## Future Monetization Opportunities

1. **Enterprise Tier** ($199/month):
   - Multi-location support
   - Team accounts
   - White-label option
   - API access

2. **Transaction Fees**:
   - Small % of each booking (alternative model)
   - 2-3% per transaction

3. **Marketplace**:
   - Commission on baker marketplace
   - Featured listings

4. **Add-ons**:
   - Premium AI models ($19/month)
   - SMS notifications ($9/month)
   - Advanced analytics ($14/month)

5. **Services**:
   - Professional photography for portfolio ($299 one-time)
   - Marketing consultation ($149/session)
   - Website integration ($499 setup)
