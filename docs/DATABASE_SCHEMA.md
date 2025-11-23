# Database Schema

## Overview

PostgreSQL database schema for BOT (Baked On Time).

## Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │────1:1──│    bakers    │────1:N──│pricing_rules │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │1                       │1                        │1
       │                        │                         │
       │N                       │N                        │N
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    orders    │         │portfolio_photos│       │ai_style_models│
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │
       │1                       │1
       │                        │
       │N                       │N
┌──────────────┐         ┌──────────────┐
│   payments   │         │ availability │
└──────────────┘         └──────────────┘

┌──────────────────┐
│cake_configurations│
└──────────────────┘
       │
       │1
       │
       │1
┌──────────────┐
│    quotes    │
└──────────────┘
       │
       │1
       │
       │1
┌──────────────┐
│    orders    │
└──────────────┘
```

## Tables

### users

Stores all user accounts (both customers and bakers).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'baker')),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### bakers

Baker-specific profile information.

```sql
CREATE TABLE bakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  country VARCHAR(50) DEFAULT 'USA',
  delivery_radius_miles INT DEFAULT 0,
  accepts_delivery BOOLEAN DEFAULT true,
  accepts_pickup BOOLEAN DEFAULT true,
  lead_time_days INT DEFAULT 7,
  stripe_account_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bakers_user_id ON bakers(user_id);
CREATE INDEX idx_bakers_active ON bakers(is_active);
```

### pricing_rules

Customizable pricing configuration for each baker.

```sql
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  rule_name VARCHAR(100) NOT NULL,
  rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN (
    'base_price', 'tier_price', 'serving_price', 'material_cost',
    'labor_multiplier', 'rush_fee', 'delivery_per_mile', 'custom'
  )),
  price_amount DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50),
  conditions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pricing_rules_baker_id ON pricing_rules(baker_id);
CREATE INDEX idx_pricing_rules_type ON pricing_rules(rule_type);
```

### portfolio_photos

Baker's uploaded cake photos for AI style training.

```sql
CREATE TABLE portfolio_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size_bytes INT,
  width INT,
  height INT,
  
  -- Image metadata
  title VARCHAR(255),
  description TEXT,
  tags TEXT[],
  
  -- AI analysis results
  analyzed BOOLEAN DEFAULT false,
  analysis_data JSONB,
  extracted_colors TEXT[],
  detected_styles TEXT[],
  complexity_score DECIMAL(3, 2),
  
  -- Usage tracking
  used_in_training BOOLEAN DEFAULT false,
  training_weight DECIMAL(3, 2) DEFAULT 1.0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolio_baker_id ON portfolio_photos(baker_id);
CREATE INDEX idx_portfolio_active ON portfolio_photos(is_active);
CREATE INDEX idx_portfolio_training ON portfolio_photos(used_in_training);
```

### ai_style_models

Trained AI models for each baker's personalized style.

```sql
CREATE TABLE ai_style_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID UNIQUE NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Model information
  model_name VARCHAR(255) NOT NULL,
  model_type VARCHAR(50) DEFAULT 'lora' CHECK (model_type IN ('lora', 'dreambooth', 'fine_tune')),
  base_model VARCHAR(100) DEFAULT 'stable-diffusion-xl',
  model_url TEXT,
  
  -- Training details
  training_status VARCHAR(50) DEFAULT 'pending' CHECK (training_status IN (
    'pending', 'processing', 'training', 'completed', 'failed'
  )),
  training_started_at TIMESTAMP,
  training_completed_at TIMESTAMP,
  training_steps INT,
  training_images_count INT,
  
  -- Model metadata
  version INT DEFAULT 1,
  accuracy_score DECIMAL(3, 2),
  style_signature JSONB,
  trigger_words TEXT[],
  
  -- Error handling
  error_message TEXT,
  retry_count INT DEFAULT 0,
  
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_models_baker_id ON ai_style_models(baker_id);
CREATE INDEX idx_ai_models_status ON ai_style_models(training_status);
CREATE INDEX idx_ai_models_active ON ai_style_models(is_active);
```

### subscriptions

Baker subscription plans and billing.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID UNIQUE NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Subscription details
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free_trial', 'monthly', 'yearly')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
    'trial', 'active', 'past_due', 'cancelled', 'expired'
  )),
  
  -- Trial tracking
  trial_started_at TIMESTAMP,
  trial_ends_at TIMESTAMP,
  trial_device_fingerprint VARCHAR(255),
  trial_ip_address VARCHAR(45),
  
  -- Billing
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP,
  
  -- Stripe integration
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  
  -- Pricing
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_baker_id ON subscriptions(baker_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_trial_device ON subscriptions(trial_device_fingerprint);
CREATE INDEX idx_subscriptions_trial_ip ON subscriptions(trial_ip_address);
```

### trial_tracking

Track trial usage by device/IP to prevent abuse.

```sql
CREATE TABLE trial_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_fingerprint VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Trial info
  trial_started_at TIMESTAMP NOT NULL,
  trial_expires_at TIMESTAMP NOT NULL,
  trial_used BOOLEAN DEFAULT true,
  
  -- Associated user if registered
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  baker_id UUID REFERENCES bakers(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(device_fingerprint, ip_address)
);

CREATE INDEX idx_trial_device ON trial_tracking(device_fingerprint);
CREATE INDEX idx_trial_ip ON trial_tracking(ip_address);
CREATE INDEX idx_trial_expires ON trial_tracking(trial_expires_at);
```

### subscription_features

Define features available per subscription tier.

```sql
CREATE TABLE subscription_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key VARCHAR(100) UNIQUE NOT NULL,
  feature_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Feature availability by plan
  available_in_trial BOOLEAN DEFAULT false,
  available_in_monthly BOOLEAN DEFAULT true,
  available_in_yearly BOOLEAN DEFAULT true,
  
  -- Feature limits
  limit_value INT,
  limit_period VARCHAR(20) CHECK (limit_period IN ('daily', 'weekly', 'monthly', 'total')),
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_features_key ON subscription_features(feature_key);
```

### feature_usage

Track feature usage for rate limiting and analytics.

```sql
CREATE TABLE feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  feature_key VARCHAR(100) NOT NULL,
  
  usage_count INT DEFAULT 1,
  usage_date DATE NOT NULL,
  
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(baker_id, feature_key, usage_date)
);

CREATE INDEX idx_usage_baker_feature ON feature_usage(baker_id, feature_key);
CREATE INDEX idx_usage_date ON feature_usage(usage_date);
```

### cake_configurations

Saved cake design configurations.

```sql
CREATE TABLE cake_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  
  -- Cake specifications
  tiers INT DEFAULT 1 CHECK (tiers >= 1 AND tiers <= 10),
  diameter_inches DECIMAL(4, 1),
  height_inches DECIMAL(4, 1),
  servings INT,
  
  -- Flavors and fillings
  cake_flavor VARCHAR(100),
  filling VARCHAR(100),
  icing_type VARCHAR(50) CHECK (icing_type IN (
    'buttercream', 'fondant', 'ganache', 'cream_cheese', 'whipped_cream'
  )),
  
  -- Design elements
  color_scheme VARCHAR(255),
  theme VARCHAR(100),
  decorations JSONB,
  has_gold_leaf BOOLEAN DEFAULT false,
  has_edible_image BOOLEAN DEFAULT false,
  has_macarons BOOLEAN DEFAULT false,
  has_drip BOOLEAN DEFAULT false,
  custom_text VARCHAR(255),
  
  -- Special requests
  special_requests TEXT,
  dietary_restrictions VARCHAR(255),
  
  -- AI-generated image
  ai_image_url TEXT,
  ai_prompt TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cake_configs_user_id ON cake_configurations(user_id);
CREATE INDEX idx_cake_configs_baker_id ON cake_configurations(baker_id);
```

### quotes

Generated price quotes for cake configurations.

```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID NOT NULL REFERENCES cake_configurations(id) ON DELETE CASCADE,
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Pricing breakdown
  base_price DECIMAL(10, 2) NOT NULL,
  tier_price DECIMAL(10, 2) DEFAULT 0,
  material_costs DECIMAL(10, 2) DEFAULT 0,
  labor_costs DECIMAL(10, 2) DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  rush_fee DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Totals
  subtotal DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Pricing details
  price_breakdown JSONB,
  
  -- Quote status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'expired'
  )),
  manual_override BOOLEAN DEFAULT false,
  baker_notes TEXT,
  
  valid_until TIMESTAMP,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_config_id ON quotes(configuration_id);
CREATE INDEX idx_quotes_baker_id ON quotes(baker_id);
CREATE INDEX idx_quotes_status ON quotes(status);
```

### orders

Customer orders for cakes.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  quote_id UUID NOT NULL REFERENCES quotes(id),
  configuration_id UUID NOT NULL REFERENCES cake_configurations(id),
  baker_id UUID NOT NULL REFERENCES bakers(id),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Order details
  total_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  remaining_amount DECIMAL(10, 2),
  
  -- Delivery/Pickup
  fulfillment_type VARCHAR(20) NOT NULL CHECK (fulfillment_type IN ('delivery', 'pickup')),
  fulfillment_date TIMESTAMP NOT NULL,
  delivery_address VARCHAR(255),
  delivery_city VARCHAR(100),
  delivery_state VARCHAR(50),
  delivery_zip VARCHAR(10),
  
  -- Contact info
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled'
  )),
  
  -- Notes
  customer_notes TEXT,
  baker_notes TEXT,
  
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_baker_id ON orders(baker_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_fulfillment_date ON orders(fulfillment_date);
CREATE INDEX idx_orders_order_number ON orders(order_number);
```

### payments

Payment records for orders.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  
  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('deposit', 'full', 'remaining')),
  payment_method VARCHAR(50),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'succeeded', 'failed', 'refunded'
  )),
  
  -- Metadata
  stripe_metadata JSONB,
  error_message TEXT,
  
  processed_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### availability

Baker calendar and availability.

```sql
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  max_orders INT DEFAULT 5,
  current_orders INT DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(baker_id, date)
);

CREATE INDEX idx_availability_baker_id ON availability(baker_id);
CREATE INDEX idx_availability_date ON availability(date);
CREATE INDEX idx_availability_available ON availability(is_available);
```

### prep_tasks

Individual preparation tasks for cake components.

```sql
CREATE TABLE prep_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Task details
  task_name VARCHAR(255) NOT NULL,
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN (
    'fondant', 'gum_paste', 'buttercream', 'ganache', 'filling',
    'flowers', 'toppers', 'decorations', 'baking', 'assembly', 'custom'
  )),
  description TEXT,
  
  -- Scheduling
  scheduled_date DATE NOT NULL,
  estimated_hours DECIMAL(4, 2),
  prep_day_offset INT, -- Days before delivery (e.g., -3 for 3 days before)
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'skipped'
  )),
  completed_at TIMESTAMP,
  
  -- Ingredients/Materials
  materials_needed JSONB,
  quantity DECIMAL(10, 2),
  unit VARCHAR(50),
  color VARCHAR(100),
  
  -- Notes and tips
  prep_tips TEXT,
  baker_notes TEXT,
  
  -- Order
  sort_order INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prep_tasks_order_id ON prep_tasks(order_id);
CREATE INDEX idx_prep_tasks_baker_id ON prep_tasks(baker_id);
CREATE INDEX idx_prep_tasks_date ON prep_tasks(scheduled_date);
CREATE INDEX idx_prep_tasks_status ON prep_tasks(status);
CREATE INDEX idx_prep_tasks_type ON prep_tasks(task_type);
```

### prep_schedules

Multi-day preparation schedules for orders.

```sql
CREATE TABLE prep_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Schedule metadata
  delivery_date DATE NOT NULL,
  prep_start_date DATE NOT NULL,
  total_prep_days INT NOT NULL,
  
  -- Schedule summary
  schedule_summary JSONB, -- Day-by-day breakdown
  total_estimated_hours DECIMAL(5, 2),
  
  -- Generated tips
  automated_tips TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prep_schedules_order_id ON prep_schedules(order_id);
CREATE INDEX idx_prep_schedules_baker_id ON prep_schedules(baker_id);
CREATE INDEX idx_prep_schedules_delivery ON prep_schedules(delivery_date);
CREATE INDEX idx_prep_schedules_start ON prep_schedules(prep_start_date);
```

### ingredient_batches

Batch ingredient calculations for multiple cakes.

```sql
CREATE TABLE ingredient_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Batch metadata
  batch_name VARCHAR(255),
  batch_date DATE NOT NULL,
  week_start DATE,
  
  -- Associated orders
  order_ids UUID[] NOT NULL,
  
  -- Ingredient calculations
  total_fondant_lbs DECIMAL(10, 2) DEFAULT 0,
  total_buttercream_lbs DECIMAL(10, 2) DEFAULT 0,
  total_ganache_lbs DECIMAL(10, 2) DEFAULT 0,
  
  -- Color breakdown for fondant
  fondant_by_color JSONB, -- {"pink": 2.5, "white": 5.0, "gold": 0.5}
  
  -- Color breakdown for buttercream
  buttercream_by_color JSONB,
  
  -- Other ingredients
  other_ingredients JSONB, -- {"eggs": 24, "flour_lbs": 10, etc.}
  
  -- Shopping list
  shopping_list JSONB,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ingredient_batches_baker_id ON ingredient_batches(baker_id);
CREATE INDEX idx_ingredient_batches_date ON ingredient_batches(batch_date);
CREATE INDEX idx_ingredient_batches_week ON ingredient_batches(week_start);
```

### prep_templates

Reusable preparation task templates for common cake types.

```sql
CREATE TABLE prep_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Template details
  template_name VARCHAR(255) NOT NULL,
  description TEXT,
  cake_type VARCHAR(100), -- e.g., "3-tier wedding", "birthday cake"
  
  -- Template tasks (array of task definitions)
  tasks JSONB NOT NULL, -- [{"name": "Make fondant", "type": "fondant", "dayOffset": -3, ...}]
  
  -- Default settings
  default_prep_days INT DEFAULT 3,
  estimated_total_hours DECIMAL(5, 2),
  
  -- Ingredient estimates
  ingredient_estimates JSONB,
  
  -- Usage
  is_default BOOLEAN DEFAULT false,
  times_used INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prep_templates_baker_id ON prep_templates(baker_id);
CREATE INDEX idx_prep_templates_type ON prep_templates(cake_type);
```

### weekly_planners

Generated weekly planners for printing.

```sql
CREATE TABLE weekly_planners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Week information
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  week_number INT,
  year INT,
  
  -- Planner data
  daily_tasks JSONB NOT NULL, -- Day-by-day task breakdown
  order_count INT DEFAULT 0,
  total_prep_hours DECIMAL(5, 2),
  
  -- Ingredient summary
  weekly_ingredients JSONB,
  
  -- PDF generation
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP,
  
  -- Settings used for generation
  planner_settings JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(baker_id, week_start)
);

CREATE INDEX idx_weekly_planners_baker_id ON weekly_planners(baker_id);
CREATE INDEX idx_weekly_planners_week ON weekly_planners(week_start);
CREATE INDEX idx_weekly_planners_year ON weekly_planners(year, week_number);
```

## Indexes Strategy

- **Primary Keys**: All tables use UUID for better distribution
- **Foreign Keys**: Indexed for join performance
- **Status Fields**: Indexed for filtering queries
- **Date Fields**: Indexed for range queries
- **Unique Constraints**: Email, order numbers, Stripe IDs

## Data Types

- **UUIDs**: Used for all primary keys to avoid sequential ID exposure
- **DECIMAL**: For all monetary values (precision: 10,2)
- **JSONB**: For flexible schema fields (decorations, metadata)
- **TIMESTAMP**: For all date/time fields with timezone support
- **VARCHAR**: With appropriate length limits for text fields
- **CHECK**: Constraints for enum-like values

## Triggers

### Update Timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bakers_updated_at BEFORE UPDATE ON bakers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cake_configurations_updated_at BEFORE UPDATE ON cake_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Generate Order Numbers

```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

## Sample Data

### Insert Sample Baker

```sql
-- Create baker user
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, email_verified)
VALUES ('baker@example.com', '$2b$10$...', 'Jane', 'Doe', '555-0123', 'baker', true)
RETURNING id;

-- Create baker profile
INSERT INTO bakers (user_id, business_name, description, city, state, delivery_radius_miles)
VALUES (
  '...', 
  'Sweet Dreams Bakery',
  'Custom cakes for all occasions',
  'Austin',
  'TX',
  25
);
```

### Insert Sample Pricing Rules

```sql
INSERT INTO pricing_rules (baker_id, rule_name, rule_type, price_amount, unit)
VALUES
  ('...', 'Base Price', 'base_price', 50.00, 'per_cake'),
  ('...', 'Additional Tier', 'tier_price', 35.00, 'per_tier'),
  ('...', 'Serving Price', 'serving_price', 3.50, 'per_serving'),
  ('...', 'Fondant Premium', 'material_cost', 25.00, 'per_cake'),
  ('...', 'Gold Leaf', 'material_cost', 50.00, 'per_cake'),
  ('...', 'Rush Order (< 3 days)', 'rush_fee', 75.00, 'per_order'),
  ('...', 'Delivery Fee', 'delivery_per_mile', 2.00, 'per_mile');
```

## Migration Strategy

1. Create tables in dependency order (users → bakers → configurations, etc.)
2. Add foreign key constraints
3. Create indexes
4. Create triggers and functions
5. Insert seed/sample data
6. Verify constraints and relationships

## Backup & Recovery

- **Daily Backups**: Automated daily snapshots
- **Point-in-Time Recovery**: Transaction log retention
- **Replication**: Read replicas for scalability
- **Disaster Recovery**: Cross-region backup storage
