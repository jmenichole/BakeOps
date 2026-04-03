import { createSupabaseServerClient } from './supabase-server';

/**
 * Server-side event tracking for API routes and Server Components.
 */
export async function trackServerEvent(eventType: string, metadata: Record<string, unknown> = {}) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: eventType,
      metadata: {
        ...metadata,
        _server_side: true,
        _timestamp: new Date().toISOString(),
      }
    });

    if (error) console.error('Error tracking server event:', error);
  } catch (err) {
    console.error('Analytics system error:', err);
  }
}
