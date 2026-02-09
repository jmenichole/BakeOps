import { differenceInDays, isAfter } from 'date-fns';

export interface TrialStatus {
  isActive: boolean;
  daysRemaining: number;
  isExpired: boolean;
  trialEndsAt: Date;
}

/**
 * Calculates trial status based on the end date
 */
export function getTrialStatus(trialEndsAt: string | Date | null): TrialStatus {
  if (!trialEndsAt) {
    return {
      isActive: false,
      daysRemaining: 0,
      isExpired: true,
      trialEndsAt: new Date(),
    };
  }

  const endDate = new Date(trialEndsAt);
  const now = new Date();
  
  const isExpired = isAfter(now, endDate);
  const daysRemaining = Math.max(0, differenceInDays(endDate, now));

  return {
    isActive: !isExpired,
    daysRemaining,
    isExpired,
    trialEndsAt: endDate,
  };
}
