# Component Diagram

## Frontend Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   └── Footer
│
├── Pages
│   ├── HomePage
│   │   ├── Hero
│   │   ├── Features
│   │   ├── HowItWorks
│   │   └── CTASection
│   │
│   ├── ConfigurePage
│   │   ├── DescriptionInput
│   │   ├── AIImageGenerator
│   │   │   ├── ImagePreview
│   │   │   └── RegenerateButton
│   │   ├── CakeConfigurator
│   │   │   ├── SizeSelector
│   │   │   ├── FlavorSelector
│   │   │   ├── FillingSelector
│   │   │   ├── IcingTypeSelector
│   │   │   ├── DesignOptions
│   │   │   │   ├── ColorPicker
│   │   │   │   ├── ThemeSelector
│   │   │   │   └── DecorationCheckboxes
│   │   │   └── SpecialRequests
│   │   └── NavigationButtons
│   │
│   ├── QuotePage
│   │   ├── ConfigurationSummary
│   │   ├── PriceBreakdown
│   │   │   ├── LineItem
│   │   │   └── TotalAmount
│   │   └── ApprovalButtons
│   │
│   ├── BookingPage
│   │   ├── DeliveryOptions
│   │   │   ├── DeliveryTypeSelector
│   │   │   ├── DateTimePicker
│   │   │   └── AddressForm
│   │   ├── ContactForm
│   │   └── PaymentSection
│   │       ├── PaymentMethodSelector
│   │       ├── StripePaymentForm
│   │       └── SubmitButton
│   │
│   ├── DashboardPage (Baker)
│   │   ├── DashboardSidebar
│   │   │   ├── NavLink (Overview)
│   │   │   ├── NavLink (Orders)
│   │   │   ├── NavLink (Pricing)
│   │   │   ├── NavLink (Calendar)
│   │   │   └── NavLink (Settings)
│   │   ├── OverviewTab
│   │   │   ├── StatCard (Total Orders)
│   │   │   ├── StatCard (Revenue)
│   │   │   ├── StatCard (Pending)
│   │   │   └── RecentOrders
│   │   ├── OrdersTab
│   │   │   ├── OrderFilters
│   │   │   ├── OrdersTable
│   │   │   │   ├── OrderRow
│   │   │   │   └── OrderActions
│   │   │   └── Pagination
│   │   ├── PricingTab
│   │   │   ├── PricingRuleForm
│   │   │   ├── PricingRulesList
│   │   │   └── PricingPreview
│   │   ├── CalendarTab
│   │   │   ├── CalendarView
│   │   │   ├── AvailabilityEditor
│   │   │   └── OrderMarkers
│   │   └── SettingsTab
│   │       ├── ProfileForm
│   │       ├── BusinessSettings
│   │       └── StripeConnect
│   │
│   └── AuthPages
│       ├── LoginPage
│       │   └── LoginForm
│       └── RegisterPage
│           └── RegisterForm
│
└── Shared Components
    ├── Button
    ├── Input
    ├── Select
    ├── Checkbox
    ├── Radio
    ├── DatePicker
    ├── Modal
    ├── Toast
    ├── Spinner
    ├── Card
    ├── Badge
    ├── Alert
    └── Tooltip
```

## Component Details

### Core Feature Components

#### 1. AIImageGenerator

**Purpose**: Generate AI cake images from text descriptions

**Props**:
- `description`: string
- `onImageGenerated`: (imageUrl: string) => void
- `bakerId`: string

**State**:
- `loading`: boolean
- `imageUrl`: string | null
- `error`: string | null
- `iterations`: number

**Features**:
- Text-to-image generation
- Regeneration capability
- Loading states
- Error handling
- Image preview

```typescript
interface AIImageGeneratorProps {
  description: string;
  onImageGenerated: (imageUrl: string) => void;
  bakerId: string;
}

const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  description,
  onImageGenerated,
  bakerId
}) => {
  // Implementation
};
```

#### 2. CakeConfigurator

**Purpose**: Interactive form for customizing cake specifications

**Props**:
- `initialConfig`: CakeConfiguration | null
- `onConfigChange`: (config: CakeConfiguration) => void
- `bakerId`: string

**State**:
- `config`: CakeConfiguration
- `validationErrors`: ValidationError[]

**Features**:
- Real-time validation
- Dynamic pricing preview
- Auto-save functionality
- Mobile-responsive layout

```typescript
interface CakeConfiguration {
  tiers: number;
  diameter: number;
  height: number;
  servings: number;
  flavor: string;
  filling: string;
  icingType: 'buttercream' | 'fondant' | 'ganache' | 'cream_cheese' | 'whipped_cream';
  colorScheme: string;
  theme: string;
  decorations: string[];
  specialRequests: string;
}
```

#### 3. PricingEngine

**Purpose**: Calculate and display automated quotes

**Props**:
- `configuration`: CakeConfiguration
- `bakerId`: string
- `pricingRules`: PricingRule[]

**State**:
- `quote`: Quote | null
- `breakdown`: PriceBreakdown
- `loading`: boolean

**Features**:
- Real-time calculation
- Itemized breakdown
- Tax calculation
- Manual override support

```typescript
interface Quote {
  basePrice: number;
  tierPrice: number;
  materialCosts: number;
  laborCosts: number;
  deliveryFee: number;
  rushFee: number;
  subtotal: number;
  tax: number;
  total: number;
  breakdown: PriceBreakdown;
}
```

#### 4. PaymentProcessor

**Purpose**: Handle Stripe payment integration

**Props**:
- `orderId`: string
- `amount`: number
- `onPaymentSuccess`: () => void
- `onPaymentError`: (error: string) => void

**State**:
- `processing`: boolean
- `error`: string | null
- `paymentIntent`: PaymentIntent | null

**Features**:
- Stripe Elements integration
- Payment intent creation
- Card validation
- 3D Secure support
- Payment confirmation

```typescript
interface PaymentProcessorProps {
  orderId: string;
  amount: number;
  depositOnly?: boolean;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}
```

#### 5. BakerDashboard

**Purpose**: Central admin interface for bakers

**Props**:
- `bakerId`: string

**State**:
- `activeTab`: 'overview' | 'orders' | 'pricing' | 'calendar' | 'settings'
- `orders`: Order[]
- `stats`: DashboardStats

**Features**:
- Order management
- Pricing configuration
- Calendar management
- Business settings
- Analytics

```typescript
interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  upcomingOrders: number;
  averageOrderValue: number;
}
```

## State Management

### Context Providers

```typescript
// AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ConfigurationContext
const ConfigurationContext = createContext<ConfigurationContextType | null>(null);

interface ConfigurationContextType {
  configuration: CakeConfiguration | null;
  updateConfiguration: (config: Partial<CakeConfiguration>) => void;
  saveConfiguration: () => Promise<void>;
  clearConfiguration: () => void;
}

// CartContext (for multi-order support)
const CartContext = createContext<CartContextType | null>(null);

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
}
```

## Data Flow

### Configuration Flow

```
1. User enters description
   ↓
2. AIImageGenerator generates image
   ↓
3. Image displayed in CakeConfigurator
   ↓
4. User adjusts configuration options
   ↓
5. ConfigurationContext updates state
   ↓
6. PricingEngine recalculates quote
   ↓
7. Quote displayed in QuotePage
   ↓
8. User approves quote
   ↓
9. BookingPage collects delivery/payment info
   ↓
10. PaymentProcessor handles payment
    ↓
11. Order confirmed and saved
```

### Baker Dashboard Flow

```
1. Baker logs in
   ↓
2. AuthContext validates credentials
   ↓
3. Dashboard loads baker data
   ↓
4. Stats and orders fetched from API
   ↓
5. Baker views/edits orders
   ↓
6. Changes synced to backend
   ↓
7. Real-time updates reflected
```

## Styling & Theming

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef1f7',
          100: '#fee5f0',
          // ...
          900: '#831843',
        },
        secondary: {
          // ...
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      }
    }
  }
};
```

### Component Library

Using custom components based on:
- **Radix UI**: Accessible primitives
- **Headless UI**: Unstyled components
- **Tailwind CSS**: Utility-first styling

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

```typescript
// CakeConfigurator.test.tsx
describe('CakeConfigurator', () => {
  it('renders configuration options', () => {
    render(<CakeConfigurator bakerId="123" onConfigChange={jest.fn()} />);
    expect(screen.getByLabelText('Number of Tiers')).toBeInTheDocument();
  });

  it('updates configuration on user input', () => {
    const handleChange = jest.fn();
    render(<CakeConfigurator bakerId="123" onConfigChange={handleChange} />);
    
    fireEvent.change(screen.getByLabelText('Number of Tiers'), {
      target: { value: '3' }
    });
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ tiers: 3 })
    );
  });
});
```

### Integration Tests (Cypress)

```typescript
// configure-cake.spec.ts
describe('Cake Configuration Flow', () => {
  it('completes full configuration process', () => {
    cy.visit('/configure');
    cy.get('[data-cy=description-input]').type('Pink unicorn cake');
    cy.get('[data-cy=generate-button]').click();
    cy.get('[data-cy=cake-image]').should('be.visible');
    cy.get('[data-cy=tier-selector]').select('3');
    cy.get('[data-cy=flavor-selector]').select('vanilla');
    cy.get('[data-cy=next-button]').click();
    cy.url().should('include', '/quote');
  });
});
```

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for routes
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Image Optimization**: Next.js Image component
5. **API Caching**: SWR for data fetching
6. **Debouncing**: Input handlers debounced
7. **Virtual Scrolling**: For large lists

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliance
- **Error Messages**: Clear, actionable error text
