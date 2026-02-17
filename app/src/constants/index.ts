/**
 * Shared constants for the BakeBot application
 */

// LocalStorage keys
export const STORAGE_KEYS = {
  ONBOARDING_SEEN: 'bakebot_onboarding_seen',
  SURVEY_DISMISSED: 'survey_dismissed',
  THEME: 'bakebot_theme',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  SURVEY: '/api/survey',
  FEEDBACK: '/api/feedback',
} as const;

// Timing constants (in milliseconds)
export const TIMING = {
  SURVEY_DELAY: 5000, // 5 seconds
  TOAST_DURATION: 5000,
  TOAST_DURATION_SHORT: 3000,
  TOAST_DURATION_LONG: 8000,
} as const;

// Order statuses
export const ORDER_STATUSES = [
  'pending',
  'confirmed', 
  'paid',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
] as const;

// Feature flags
export const FEATURES = {
  ENABLE_BETA_FEEDBACK: true,
  ENABLE_DAILY_SURVEY: true,
  ENABLE_ONBOARDING: true,
} as const;
