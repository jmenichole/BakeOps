/**
 * BOT (Baked On Time) - Analytics Stats Edge Function
 * 
 * Provides basic traction analytics for internal use.
 * Returns signup counts by role and recent activity metrics.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

/**
 * Main handler function
 */
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Method not allowed. Use GET.' 
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get total signups count
    const { count: totalSignups, error: totalError } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw new Error(`Failed to get total count: ${totalError.message}`);
    }

    // Get baker count
    const { count: bakerCount, error: bakerError } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'baker');

    if (bakerError) {
      throw new Error(`Failed to get baker count: ${bakerError.message}`);
    }

    // Get customer count
    const { count: customerCount, error: customerError } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    if (customerError) {
      throw new Error(`Failed to get customer count: ${customerError.message}`);
    }

    // Get curious count
    const { count: curiousCount, error: curiousError } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'curious');

    if (curiousError) {
      throw new Error(`Failed to get curious count: ${curiousError.message}`);
    }

    // Get signups from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: last24hSignups, error: last24hError } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo);

    if (last24hError) {
      throw new Error(`Failed to get 24h count: ${last24hError.message}`);
    }

    // Get signups from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: last7dSignups, error: last7dError } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    if (last7dError) {
      throw new Error(`Failed to get 7d count: ${last7dError.message}`);
    }

    // Get most recent signup timestamp
    const { data: recentSignup, error: recentError } = await supabase
      .from('waitlist_signups')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentError && recentError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to get recent signup: ${recentError.message}`);
    }

    // Construct response
    const stats = {
      total_signups: totalSignups || 0,
      baker_count: bakerCount || 0,
      customer_count: customerCount || 0,
      curious_count: curiousCount || 0,
      last_24h_signups: last24hSignups || 0,
      last_7d_signups: last7dSignups || 0,
      most_recent_signup: recentSignup?.created_at || null,
      breakdown_percentage: {
        bakers: totalSignups ? Math.round((bakerCount || 0) / totalSignups * 100) : 0,
        customers: totalSignups ? Math.round((customerCount || 0) / totalSignups * 100) : 0,
        curious: totalSignups ? Math.round((curiousCount || 0) / totalSignups * 100) : 0,
      },
      timestamp: new Date().toISOString(),
    };

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: stats 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
