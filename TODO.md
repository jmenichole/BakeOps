# Code Quality Improvements - Beta Testing Modals

## Phase 1: Create Shared Infrastructure

### Hooks
- [ ] Create `app/src/hooks/useModal.ts` - Common modal behavior hook
- [ ] Create `app/src/hooks/useLocalStorage.ts` - LocalStorage hook
- [ ] Create `app/src/hooks/useToast.ts` - Toast notification hook

### Components
- [ ] Create `app/src/components/ui/Modal.tsx` - Base Modal component
- [ ] Create `app/src/components/ui/Toast.tsx` - Toast notification component

## Phase 2: Refactor Components

### DailySurveyModal
- [ ] Break down into smaller step components
- [ ] Extract form state management
- [ ] Add error boundaries

### DesignDetailModal
- [ ] Refactor to use new useModal hook
- [ ] Pass supabase as prop

### FeedbackWidget
- [ ] Fix to use real API call
- [ ] Import Sparkles from lucide-react

### OnboardingModal
- [ ] Use useLocalStorage hook
- [ ] Extract step components

### OrderManagementModal
- [ ] Replace alert() with toast
- [ ] Add form validation

### TrialStatusGuard
- [ ] Add error handling
- [ ] Add memoization

## Phase 3: Constants and Types
- [ ] Create `app/src/constants/index.ts` - Shared constants
- [ ] Create `app/src/types/index.ts` - Shared types
