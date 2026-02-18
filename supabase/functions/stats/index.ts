/**
 * Bake Ops - Analytics Stats Edge Function
 *
 * Provides basic traction analytics for internal use.
 * Returns baker counts, order stats, and recent activity metrics.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed. Use GET.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get total bakers
    const { count: totalBakers, error: bakersError } = await supabase
      .from('bakers')
      .select('*', { count: 'exact', head: true });

    if (bakersError) throw new Error(`Failed to get baker count: ${bakersError.message}`);

    // Get total orders
    const { count: totalOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (ordersError) throw new Error(`Failed to get order count: ${ordersError.message}`);

    // Get total designs
    const { count: totalDesigns, error: designsError } = await supabase
      .from('cake_designs')
      .select('*', { count: 'exact', head: true });

    if (designsError) throw new Error(`Failed to get design count: ${designsError.message}`);

    // Get orders from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: last24hOrders, error: last24hError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo);

    if (last24hError) throw new Error(`Failed to get 24h count: ${last24hError.message}`);

    // Get orders from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: last7dOrders, error: last7dError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    if (last7dError) throw new Error(`Failed to get 7d count: ${last7dError.message}`);

    // Get most recent order timestamp
    const { data: recentOrder, error: recentError } = await supabase
      .from('orders')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentError && recentError.code !== 'PGRST116') {
      throw new Error(`Failed to get recent order: ${recentError.message}`);
    }

    const stats = {
      total_bakers: totalBakers || 0,
      total_orders: totalOrders || 0,
      total_designs: totalDesigns || 0,
      last_24h_orders: last24hOrders || 0,
      last_7d_orders: last7dOrders || 0,
      most_recent_order: recentOrder?.created_at || null,
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred.',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
