import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Get the authenticated user from the request cookies.
 * Returns the user object or null if not authenticated.
 */
export async function getAuthUser() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/**
 * Escape HTML special characters to prevent XSS in email templates.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
