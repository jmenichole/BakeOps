/**
 * BOT (Baked On Time) - Waitlist Signup Edge Function
 * 
 * Handles waitlist signup submissions from the landing page.
 * Validates input, prevents duplicates, and stores data in Supabase.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates role value
 */
function isValidRole(role: string): boolean {
  return ['baker', 'customer', 'curious'].includes(role);
}

/**
 * Main handler function
 */
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Method not allowed. Use POST.' 
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { email, role = 'curious', source = 'landing-page' } = requestData;

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email is required.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate role
    if (!isValidRole(role)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid role. Must be "baker", "customer", or "curious".' 
        }),
        { 
          status: 400, 
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

    // Insert signup into database
    const { data, error } = await supabase
      .from('waitlist_signups')
      .insert([
        {
          email: trimmedEmail,
          role: role,
          source: source,
        }
      ])
      .select()
      .single();

    // Handle database errors
    if (error) {
      // Check if error is due to duplicate email (unique constraint violation)
      if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'This email is already on the waitlist.' 
          }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Other database errors
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save signup. Please try again.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully added to waitlist!',
        data: {
          id: data.id,
          email: data.email,
          role: data.role,
        }
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
        error: 'An unexpected error occurred. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
