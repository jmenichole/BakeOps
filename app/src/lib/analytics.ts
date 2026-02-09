import { createBrowserClient } from './supabase';

export async function trackEvent(eventType: string, metadata: any = {}) {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from('analytics_events').insert({
    user_id: user.id,
    event_type: eventType,
    page_path: window.location.pathname,
    metadata
  });

  if (error) console.error('Error tracking event:', error);
}
