# Agent Task: Implement Design History & Detail View

## Role
You are a Senior Frontend Engineer specializing in Next.js and Tailwind CSS.

## Objective
Implement a robust "Design History" feature that allows users to view their past AI-generated cake designs, see full details in a modal, convert designs into draft orders, and share designs.

## Context
The `cake_designs` table stores generated designs. The current list page exists but lacks detailed viewing capabilities. We need to add a modal component to show the full configuration (flavors, tiers, etc.) and connect it to the list view.

## Requirements

### 1. Design Detail Modal Component
Create/Update `app/src/components/DesignDetailModal.tsx`:
- **UI**: A responsive modal (dialog) that works on mobile and desktop.
- **Layout**: Split view (Image on left/top, Details on right/bottom).
- **Content**:
  - Large view of the generated cake image.
  - Title and Creation Date.
  - Full Description.
  - Grid view of configuration details (e.g., "Tiers: 3", "Flavor: Vanilla").
  - Estimated Price prominently displayed.
  - **Actions**:
    - **Create Order**: Button to convert design to a draft order.
      - *Logic*: Insert a new row into `orders` table with `status: 'draft'`, `total_price`, and `cake_details` mapped from the design.
      - *Navigation*: Redirect to `/dashboard/orders/[new_order_id]` upon success.
    - **Share**: Button to copy a public link.
      - *Logic*: Copy URL to clipboard. Show a toast notification.
    - **Save**: Button to download the image.
      - *Logic*: Trigger browser download of the `image_url`.
- **Props**: `isOpen` (boolean), `onClose` (function), `design` (object).

### 2. Update Design List Page
Modify `app/src/app/dashboard/designs/page.tsx`:
 Import the `DesignDetailModal`.
- Add state for `selectedDesign`.
- Update the "View Detail" button in the design card to set the `selectedDesign` state.
- Render the `DesignDetailModal` at the bottom of the component tree, passing the state.
- Ensure the `fetchDesigns` query selects all necessary fields (`id`, `title`, `description`, `image_url`, `configuration`, `estimated_price`, `created_at`).

### 3. Data Handling
- Define a TypeScript interface for `Design` and `Order` to ensure type safety.
- Handle loading states during "Create Order" action (show spinner).
- Handle cases where `configuration` JSONB data might be missing or empty.
- Ensure the modal closes gracefully when clicking outside or on the close button.

## Style Guidelines
- Use the existing `btn`, `btn-primary`, `card-bake` classes where applicable.
- Ensure animations (fade-in, zoom-in) are used for the modal entrance.
- Use `lucide-react` for icons.
- Maintain the "Pink & Pastry" aesthetic (colors: `primary`, `secondary`, `pink-50`).

## Deliverables
1. `app/src/components/DesignDetailModal.tsx` (with full logic)
2. Updated `app/src/app/dashboard/designs/page.tsx`

## Example Usage
```tsx
<DesignDetailModal 
  isOpen={!!selectedDesign} 
  design={selectedDesign} 
  onClose={() => setSelectedDesign(null)} 
/>
```