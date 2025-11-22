# Production Planning & Prep Management

## Overview

BakeBuilder's production planning system helps bakers efficiently manage multi-day cake preparation, track component tasks, and calculate batch ingredients across multiple orders.

## Core Features

### 1. Multi-Day Prep Scheduling

Automatically generates preparation schedules breaking down cake production into manageable daily tasks.

**Key Capabilities**:
- Splits complex cakes into component tasks
- Schedules tasks based on optimal timing
- Accounts for items that can't be made day-of
- Provides prep tips for each task
- Tracks completion status

**Example Schedule for 3-Tier Wedding Cake (Delivery Saturday)**:

```
Monday (5 days before):
  ✓ Bake cake layers - 2.5 hours
  ✓ Make gum paste flowers - 3 hours
  Tip: Gum paste flowers need 3-4 days to dry completely

Tuesday (4 days before):
  ✓ Prepare fondant colors (2 lbs pink, 3 lbs white) - 1 hour
  ✓ Create custom toppers - 2 hours
  Tip: Store fondant in airtight containers at room temperature

Wednesday (3 days before):
  ✓ Make buttercream (5 lbs) - 1.5 hours
  ✓ Torte and fill cake layers - 2 hours
  ✓ Crumb coat - 1 hour
  Tip: Refrigerate filled cakes overnight for easier final coating

Thursday (2 days before):
  ✓ Final buttercream coat - 1.5 hours
  ✓ Cover with fondant - 2 hours
  ✓ Add gold leaf accents - 1 hour
  Tip: Let fondant-covered cakes rest before adding decorations

Friday (1 day before):
  ✓ Attach gum paste flowers - 1 hour
  ✓ Add decorative elements - 1.5 hours
  ✓ Final touches and quality check - 1 hour
  Tip: Store in climate-controlled space, avoid refrigerator condensation

Saturday (Delivery day):
  ✓ Final inspection - 0.5 hours
  ✓ Secure for transport - 0.5 hours
  ✓ Deliver - 1 hour
```

### 2. Component Task Types

**Fondant Work**:
- Mixing and coloring fondant
- Rolling and covering cakes
- Creating fondant decorations
- Storage time needed: 0-5 days advance

**Gum Paste/Sugar Flowers**:
- Creating flowers and decorative elements
- Drying time: 3-5 days minimum
- Storage: Can be made weeks in advance

**Buttercream/Frosting**:
- Batch preparation
- Coloring
- Storage time: Up to 2 weeks refrigerated, 3 months frozen

**Ganache**:
- Preparation and cooling
- Best made: 1-2 days before use

**Fillings**:
- Fruit fillings, custards, curds
- Best made: 1-3 days before

**Baking**:
- Cake layers
- Best baked: 1-2 days before assembly
- Can freeze: Up to 1 month

**Custom Elements**:
- Rice Krispie structures
- Chocolate decorations
- Edible images
- Variable timing based on complexity

**Assembly**:
- Torting and filling
- Stacking tiers
- Final decoration
- Typically: 1-2 days before delivery

### 3. Batch Ingredient Calculator

Calculates total ingredients needed across multiple cakes for efficient batch preparation.

**Example: 3 Cakes in One Week**

**Input**:
- Cake 1: 3-tier, pink fondant, vanilla buttercream
- Cake 2: 2-tier, white fondant, chocolate buttercream
- Cake 3: 1-tier, gold accent fondant, vanilla buttercream

**Output**:

```
FONDANT TOTALS:
  Pink: 3.5 lbs
  White: 4.0 lbs
  Gold: 0.5 lbs
  TOTAL: 8.0 lbs fondant needed

BUTTERCREAM TOTALS:
  Vanilla: 6.5 lbs
  Chocolate: 2.0 lbs
  TOTAL: 8.5 lbs buttercream needed

BASE INGREDIENTS:
  Butter: 12 lbs (for buttercream)
  Powdered Sugar: 20 lbs (for buttercream)
  Eggs: 36 (for cakes)
  Flour: 15 lbs (for cakes)
  Sugar: 10 lbs (for cakes)
  
COLOR GELS NEEDED:
  - Pink (for fondant and buttercream)
  - Brown (for chocolate buttercream)
  - Gold luster dust
```

**Shopping List Generation**:
```
☐ 8 lbs fondant (white base)
☐ 12 lbs butter
☐ 20 lbs powdered sugar
☐ 3 dozen eggs
☐ 15 lbs cake flour
☐ 10 lbs granulated sugar
☐ Pink gel food coloring (2 bottles)
☐ Brown gel food coloring (1 bottle)
☐ Gold luster dust
☐ Cake boards (6", 8", 10", 12")
☐ Dowels
☐ Cake boxes
```

### 4. Weekly Planner

Consolidated view of all prep work across multiple orders for the week.

**Weekly View (Monday - Sunday)**:

```
WEEK OF: November 25-30, 2025
TOTAL ORDERS: 5 cakes
ESTIMATED PREP TIME: 42 hours

MONDAY, November 25
─────────────────────────────
Order #123 - Sarah's Birthday (Sat delivery)
  □ Bake 2-tier vanilla cake - 2h
  □ Start gum paste roses - 3h

Order #124 - Wedding Cake (Sun delivery)  
  □ Bake 3-tier layers - 3h
  □ Make sugar flowers - 4h

TOTAL: 12 hours
INGREDIENTS TODAY:
  - 18 eggs
  - 8 lbs flour
  - Gum paste: 1 lb

TUESDAY, November 26
─────────────────────────────
Order #123 - Sarah's Birthday
  □ Prepare pink fondant (2 lbs) - 0.5h
  □ Make vanilla buttercream (3 lbs) - 1h

Order #124 - Wedding Cake
  □ Prepare white fondant (5 lbs) - 1h
  □ Make custom topper - 2h

Order #125 - Anniversary (Fri delivery)
  □ Bake 1-tier chocolate cake - 1.5h

TOTAL: 6 hours
INGREDIENTS TODAY:
  - 7 lbs fondant base
  - 6 lbs butter
  - 10 lbs powdered sugar

[continues for each day...]

WEEK SUMMARY
─────────────────────────────
Total Fondant: 15 lbs
  - White: 8 lbs
  - Pink: 3 lbs
  - Blue: 2 lbs
  - Black: 1 lb
  - Gold accent: 1 lb

Total Buttercream: 18 lbs
  - Vanilla: 12 lbs
  - Chocolate: 4 lbs
  - Strawberry: 2 lbs

Peak Day: Thursday (14 hours)
Lightest Day: Sunday (2 hours)
```

### 5. Printable Planner

Professional PDF generation for physical planners.

**Features**:
- Clean, printer-friendly layout
- Checkbox format for tracking
- Day-by-day breakdown
- Ingredient lists
- Space for notes
- Weekly overview page
- Can be printed weekly or for specific date range

**Template Options**:
- Full week (Monday-Sunday)
- Work week (Monday-Friday)
- Custom date range
- Single order detail
- Ingredient list only

### 6. Smart Prep Recommendations

AI-powered suggestions based on cake complexity and baker's schedule.

**Recommendations Include**:

```
For: 3-Tier Wedding Cake with Sugar Flowers
Recommended Prep Days: 5 days

CRITICAL PATH ITEMS:
! Sugar flowers need minimum 3 days to dry
! Fondant decoration pieces need 2 days to set
! Filled cake layers should rest 24h before final coating

SUGGESTED TIMELINE:
Optimal start: 5 days before delivery
Minimum start: 3 days before delivery
Rush possible (not recommended): 2 days

TIPS:
✓ Make extra sugar flowers in case of breakage
✓ Color all fondant at once for consistency
✓ Freeze cake layers if making more than 2 days ahead
✓ Keep fondant-covered cakes at room temp (not refrigerated)
```

### 7. Template Library

Save and reuse prep schedules for common cake types.

**Example Templates**:

1. **Standard 3-Tier Wedding Cake**
   - 5-day prep schedule
   - Sugar flower timeline
   - Fondant covering steps
   - Assembly and decoration

2. **Simple Birthday Cake**
   - 2-day prep schedule
   - Buttercream focus
   - Quick decoration options

3. **Sculpted/Shaped Cake**
   - 6-day prep schedule
   - Structure building timeline
   - Complex carving and covering

4. **Sheet Cake (High Volume)**
   - 1-day batch prep
   - Efficient decoration workflow

**Template Customization**:
- Adjust timing based on baker's speed
- Add/remove specific tasks
- Modify ingredient ratios
- Save variations

### 8. Progress Tracking

Real-time tracking of prep task completion.

**Dashboard View**:
```
THIS WEEK'S PROGRESS
────────────────────
Order #123 - Sarah's Birthday
  ✓ 8 of 12 tasks completed (67%)
  ⚠ 2 tasks behind schedule
  → Next: Final decoration (tomorrow)

Order #124 - Wedding Cake  
  ✓ 5 of 15 tasks completed (33%)
  ✓ On schedule
  → Next: Crumb coat (tonight)

OVERALL WEEK PROGRESS: 56% complete
TIME SPENT: 24.5 of 42 hours
```

**Task Status Indicators**:
- ✓ Completed
- → In Progress
- ☐ Pending
- ⚠ Behind Schedule
- ⏰ Due Today
- 🔴 Overdue

### 9. Ingredient Inventory Integration

Track ingredient usage and alert when running low.

**Features**:
- Deduct ingredients as tasks complete
- Alert when stock is low
- Suggest reorder quantities
- Track waste/extra portions

**Example Alert**:
```
⚠ INVENTORY ALERT
Pink gel coloring: Only 1 oz remaining
Needed this week: 3 oz for remaining tasks

Suggestion: Order 8 oz bottle
```

### 10. Mobile-Friendly Checklist

Access prep tasks on phone/tablet while working.

**Features**:
- Large tap targets for sticky hands
- Voice control option
- Quick task completion toggles
- Timer integration
- Photo upload for completed tasks

## API Endpoints

### Generate Prep Schedule

```http
POST /api/production/generate-schedule
```

**Request**:
```json
{
  "orderId": "uuid",
  "deliveryDate": "2025-12-01T14:00:00Z",
  "prepDays": 5,
  "autoSchedule": true
}
```

**Response**:
```json
{
  "scheduleId": "uuid",
  "prepStartDate": "2025-11-26",
  "totalDays": 5,
  "totalHours": 24.5,
  "tasks": [
    {
      "id": "uuid",
      "name": "Make gum paste flowers",
      "type": "flowers",
      "scheduledDate": "2025-11-26",
      "estimatedHours": 3.0,
      "dayOffset": -5,
      "prepTip": "Gum paste flowers need 3-4 days to dry completely",
      "materialsNeeded": {
        "gumPaste": "1 lb",
        "floralWire": "24 gauge",
        "colors": ["pink", "white"]
      }
    }
    // ... more tasks
  ],
  "dailyBreakdown": {
    "2025-11-26": {
      "tasks": 2,
      "hours": 5.5,
      "ingredients": {...}
    }
    // ... more days
  }
}
```

### Calculate Batch Ingredients

```http
POST /api/production/calculate-ingredients
```

**Request**:
```json
{
  "bakerId": "uuid",
  "orderIds": ["uuid1", "uuid2", "uuid3"],
  "weekStart": "2025-11-25"
}
```

**Response**:
```json
{
  "batchId": "uuid",
  "weekStart": "2025-11-25",
  "orderCount": 3,
  "totals": {
    "fondant": {
      "total": 8.0,
      "byColor": {
        "pink": 3.5,
        "white": 4.0,
        "gold": 0.5
      }
    },
    "buttercream": {
      "total": 8.5,
      "byColor": {
        "vanilla": 6.5,
        "chocolate": 2.0
      }
    }
  },
  "baseIngredients": {
    "butter_lbs": 12.0,
    "powdered_sugar_lbs": 20.0,
    "eggs": 36,
    "flour_lbs": 15.0,
    "sugar_lbs": 10.0
  },
  "shoppingList": [
    {
      "item": "Fondant (white base)",
      "quantity": 8.0,
      "unit": "lbs",
      "priority": "high"
    }
    // ... more items
  ]
}
```

### Generate Weekly Planner

```http
POST /api/production/weekly-planner
```

**Request**:
```json
{
  "bakerId": "uuid",
  "weekStart": "2025-11-25",
  "format": "pdf",
  "options": {
    "includeIngredients": true,
    "includeTips": true,
    "showTimeEstimates": true
  }
}
```

**Response**:
```json
{
  "plannerId": "uuid",
  "pdfUrl": "https://cdn.example.com/planners/uuid.pdf",
  "weekStart": "2025-11-25",
  "weekEnd": "2025-12-01",
  "summary": {
    "totalOrders": 5,
    "totalHours": 42.0,
    "totalTasks": 47,
    "peakDay": "Thursday",
    "peakHours": 14.0
  }
}
```

## User Interface Components

### Weekly Calendar View

```
┌─────────────────────────────────────────────────────────────┐
│  Week of Nov 25 - Dec 1, 2025          [Print] [Export PDF] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  MON 11/25  │  TUE 11/26  │  WED 11/27  │  THU 11/28       │
│  12 hrs     │  6 hrs      │  8 hrs      │  14 hrs          │
│  ────────   │  ────────   │  ────────   │  ────────        │
│  □ Bake     │  □ Fondant  │  □ Fill     │  □ Decorate      │
│  □ Flowers  │  □ Topper   │  □ Crumb    │  □ Flowers       │
│             │             │  □ Ganache  │  □ Assembly      │
│                                                               │
│  INGREDIENTS THIS WEEK:                                       │
│  Fondant: 15 lbs (White: 8, Pink: 3, Blue: 2, Black: 1)     │
│  Buttercream: 18 lbs (Vanilla: 12, Chocolate: 4, Berry: 2)  │
└─────────────────────────────────────────────────────────────┘
```

### Task Detail Card

```
┌─────────────────────────────────────────┐
│ Make Gum Paste Flowers                   │
│ Order: #123 - Sarah's Birthday           │
├─────────────────────────────────────────┤
│ 📅 Monday, Nov 25                        │
│ ⏱ 3.0 hours estimated                   │
│                                          │
│ Materials:                               │
│ • 1 lb gum paste                        │
│ • 24-gauge floral wire                  │
│ • Pink & white coloring                 │
│                                          │
│ 💡 Prep Tip:                            │
│ Gum paste flowers need 3-4 days to dry  │
│ completely. Make extras in case of      │
│ breakage during assembly.               │
│                                          │
│ [Mark Complete] [Add Notes]             │
└─────────────────────────────────────────┘
```

### Batch Calculator Interface

```
┌─────────────────────────────────────────────────┐
│ Batch Ingredient Calculator                      │
├─────────────────────────────────────────────────┤
│ Week of: [Nov 25, 2025 ▼]                      │
│                                                  │
│ Selected Orders: (3)                             │
│ ☑ #123 - Sarah's Birthday (Sat)                │
│ ☑ #124 - Wedding Cake (Sun)                    │
│ ☑ #125 - Anniversary (Fri)                     │
│                                                  │
│         [Calculate Batch]                        │
├─────────────────────────────────────────────────┤
│ RESULTS:                                         │
│                                                  │
│ Fondant by Color:                                │
│ ▓▓▓▓▓▓▓▓ Pink: 3.5 lbs                         │
│ ▓▓▓▓▓▓▓▓▓▓ White: 4.0 lbs                      │
│ ▓▓ Gold: 0.5 lbs                                │
│                                                  │
│ [Export Shopping List] [Print]                   │
└─────────────────────────────────────────────────┘
```

## Premium Feature Gate

The production planning features are part of the Premium tier:

**Free Trial**: Limited to 2 orders, basic task list
**Premium**: Unlimited orders, full planning suite

## Benefits

✅ **Time Savings**: 3-5 hours per week on planning
✅ **Reduced Stress**: Know exactly what to do each day
✅ **Better Quality**: Proper timing for each component
✅ **Less Waste**: Accurate ingredient calculations
✅ **Professionalism**: Organized, reliable production
✅ **Scalability**: Handle multiple orders efficiently
