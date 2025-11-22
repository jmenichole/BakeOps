# API Documentation

## Base URL

```
Production: https://api.bakebuilder.com
Development: http://localhost:3001
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  }
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-0123",
  "role": "customer"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt_token"
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

### Cake Configuration

#### Generate AI Image

```http
POST /api/cakes/generate-image
```

**Headers**: Authorization required

**Request Body**:
```json
{
  "description": "A three-tier pink and gold unicorn cake with edible flowers",
  "bakerId": "uuid",
  "style": "realistic"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://cdn.example.com/images/uuid.png",
    "prompt": "Enhanced prompt used for generation",
    "generationId": "uuid"
  }
}
```

#### Save Configuration

```http
POST /api/cakes/configure
```

**Headers**: Authorization required

**Request Body**:
```json
{
  "bakerId": "uuid",
  "description": "Pink unicorn cake",
  "tiers": 3,
  "diameterInches": 8,
  "heightInches": 6,
  "servings": 40,
  "cakeFlavor": "vanilla",
  "filling": "raspberry",
  "icingType": "buttercream",
  "colorScheme": "pink and gold",
  "theme": "unicorn",
  "decorations": {
    "hasGoldLeaf": true,
    "hasEdibleImage": false,
    "hasMacarons": true,
    "hasDrip": false,
    "customElements": ["edible flowers", "unicorn horn topper"]
  },
  "customText": "Happy Birthday Emma",
  "specialRequests": "Gluten-free option",
  "aiImageUrl": "https://cdn.example.com/images/uuid.png"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "configurationId": "uuid",
    "configuration": { ... }
  }
}
```

#### Get Configuration

```http
GET /api/cakes/configurations/:id
```

**Response**:
```json
{
  "success": true,
  "data": {
    "configuration": { ... }
  }
}
```

### Pricing

#### Calculate Quote

```http
POST /api/pricing/calculate
```

**Headers**: Authorization required

**Request Body**:
```json
{
  "configurationId": "uuid",
  "bakerId": "uuid",
  "deliveryType": "delivery",
  "deliveryDistance": 15,
  "fulfillmentDate": "2025-12-25T14:00:00Z",
  "isRushOrder": false
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "uuid",
      "basePrice": 50.00,
      "tierPrice": 70.00,
      "materialCosts": 75.00,
      "laborCosts": 100.00,
      "deliveryFee": 30.00,
      "rushFee": 0.00,
      "subtotal": 325.00,
      "taxAmount": 26.81,
      "totalAmount": 351.81,
      "breakdown": [
        {
          "item": "Base Cake (3 tiers)",
          "amount": 50.00
        },
        {
          "item": "Additional Tiers (2 x $35)",
          "amount": 70.00
        },
        {
          "item": "Premium Materials (Gold leaf, Macarons)",
          "amount": 75.00
        },
        {
          "item": "Labor (Complex design)",
          "amount": 100.00
        },
        {
          "item": "Delivery (15 miles x $2)",
          "amount": 30.00
        }
      ],
      "validUntil": "2025-12-01T00:00:00Z"
    }
  }
}
```

#### Get Pricing Rules

```http
GET /api/pricing/rules
```

**Headers**: Authorization required (Baker only)

**Query Parameters**:
- `bakerId`: string (required)

**Response**:
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "uuid",
        "ruleName": "Base Price",
        "ruleType": "base_price",
        "priceAmount": 50.00,
        "unit": "per_cake",
        "isActive": true
      },
      // ... more rules
    ]
  }
}
```

#### Update Pricing Rules

```http
PUT /api/pricing/rules
```

**Headers**: Authorization required (Baker only)

**Request Body**:
```json
{
  "bakerId": "uuid",
  "rules": [
    {
      "id": "uuid",
      "priceAmount": 55.00
    },
    {
      "ruleName": "New Rule",
      "ruleType": "material_cost",
      "priceAmount": 25.00,
      "unit": "per_cake"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "updated": 1,
    "created": 1,
    "rules": [ ... ]
  }
}
```

### Orders

#### Create Order

```http
POST /api/orders/create
```

**Headers**: Authorization required

**Request Body**:
```json
{
  "quoteId": "uuid",
  "fulfillmentType": "delivery",
  "fulfillmentDate": "2025-12-25T14:00:00Z",
  "deliveryAddress": "123 Main St",
  "deliveryCity": "Austin",
  "deliveryState": "TX",
  "deliveryZip": "78701",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "555-0123",
  "customerNotes": "Please ring doorbell"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-20251125-000123",
      "totalAmount": 351.81,
      "depositAmount": 175.91,
      "status": "pending",
      "fulfillmentDate": "2025-12-25T14:00:00Z"
    }
  }
}
```

#### Get Order

```http
GET /api/orders/:id
```

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-20251125-000123",
      "status": "confirmed",
      "totalAmount": 351.81,
      "configuration": { ... },
      "fulfillmentType": "delivery",
      "fulfillmentDate": "2025-12-25T14:00:00Z",
      "customer": { ... },
      "baker": { ... },
      "payments": [ ... ]
    }
  }
}
```

#### Get Baker's Orders

```http
GET /api/orders/baker/:bakerId
```

**Headers**: Authorization required (Baker only)

**Query Parameters**:
- `status`: string (optional) - Filter by status
- `startDate`: string (optional) - ISO date
- `endDate`: string (optional) - ISO date
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response**:
```json
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

#### Update Order Status

```http
PUT /api/orders/:id/status
```

**Headers**: Authorization required (Baker only)

**Request Body**:
```json
{
  "status": "in_progress",
  "bakerNotes": "Started working on the design"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "order": { ... }
  }
}
```

### Payments

#### Create Payment Intent

```http
POST /api/payments/create-intent
```

**Headers**: Authorization required

**Request Body**:
```json
{
  "orderId": "uuid",
  "amount": 175.91,
  "paymentType": "deposit"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx",
    "amount": 175.91
  }
}
```

#### Confirm Payment

```http
POST /api/payments/confirm
```

**Headers**: Authorization required

**Request Body**:
```json
{
  "paymentIntentId": "pi_xxx",
  "orderId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "uuid",
      "status": "succeeded",
      "amount": 175.91,
      "processedAt": "2025-11-22T18:00:00Z"
    },
    "order": {
      "status": "confirmed"
    }
  }
}
```

#### Stripe Webhook

```http
POST /api/payments/webhook
```

**Headers**:
- `stripe-signature`: Webhook signature

**Request Body**: Stripe event payload

**Response**:
```json
{
  "success": true
}
```

### Bakers

#### Get Baker Profile

```http
GET /api/bakers/:id
```

**Response**:
```json
{
  "success": true,
  "data": {
    "baker": {
      "id": "uuid",
      "businessName": "Sweet Dreams Bakery",
      "description": "Custom cakes for all occasions",
      "city": "Austin",
      "state": "TX",
      "deliveryRadiusMiles": 25,
      "acceptsDelivery": true,
      "acceptsPickup": true,
      "leadTimeDays": 7,
      "isActive": true
    }
  }
}
```

#### Update Baker Profile

```http
PUT /api/bakers/:id
```

**Headers**: Authorization required (Baker only)

**Request Body**:
```json
{
  "businessName": "Sweet Dreams Bakery",
  "description": "Award-winning custom cakes",
  "deliveryRadiusMiles": 30,
  "leadTimeDays": 5
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "baker": { ... }
  }
}
```

#### Get Baker Availability

```http
GET /api/bakers/:id/availability
```

**Query Parameters**:
- `startDate`: string (ISO date, required)
- `endDate`: string (ISO date, required)

**Response**:
```json
{
  "success": true,
  "data": {
    "availability": [
      {
        "date": "2025-12-25",
        "isAvailable": false,
        "maxOrders": 5,
        "currentOrders": 5,
        "reason": "Fully booked"
      },
      {
        "date": "2025-12-26",
        "isAvailable": true,
        "maxOrders": 5,
        "currentOrders": 2
      }
    ]
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Invalid email or password |
| `AUTH_TOKEN_EXPIRED` | JWT token has expired |
| `AUTH_UNAUTHORIZED` | User not authorized for this action |
| `VALIDATION_ERROR` | Request validation failed |
| `NOT_FOUND` | Resource not found |
| `BAKER_NOT_FOUND` | Baker profile not found |
| `ORDER_NOT_FOUND` | Order not found |
| `PAYMENT_FAILED` | Payment processing failed |
| `QUOTE_EXPIRED` | Quote has expired |
| `DATE_UNAVAILABLE` | Selected date is not available |
| `EXTERNAL_SERVICE_ERROR` | Error from external service (AI, Stripe) |
| `SERVER_ERROR` | Internal server error |

## Rate Limiting

- **Anonymous requests**: 100 requests per 15 minutes
- **Authenticated requests**: 1000 requests per 15 minutes
- **AI image generation**: 10 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1635724800
```

## Pagination

For endpoints that return lists, use these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Webhooks

### Stripe Payment Events

Configure webhook URL in Stripe Dashboard:
```
https://api.bakemeacake.com/api/payments/webhook
```

Events handled:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## Testing

### Development API Key

For testing in development:
```
Authorization: Bearer dev_test_token_12345
```

### Test Cards (Stripe)

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.bakemeacake.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set auth token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Generate AI image
const generateImage = async (description: string, bakerId: string) => {
  const response = await api.post('/api/cakes/generate-image', {
    description,
    bakerId
  });
  return response.data.data;
};

// Create order
const createOrder = async (orderData: OrderData) => {
  const response = await api.post('/api/orders/create', orderData);
  return response.data.data;
};
```

### cURL

```bash
# Login
curl -X POST https://api.bakemeacake.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Generate image
curl -X POST https://api.bakemeacake.com/api/cakes/generate-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"description":"Pink unicorn cake","bakerId":"uuid"}'
```

## Versioning

API version is specified in the URL path:
```
/api/v1/...
```

Current version: v1

Breaking changes will result in a new version. Previous versions will be supported for 6 months after deprecation notice.
