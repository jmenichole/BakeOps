import { createClient } from '@supabase/supabase-js';
import { VercelRequest, VercelResponse } from '@vercel/node';

interface WaitlistSignupRequest {
  email: string;
  role: string;
  source?: string;
}

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
 * Handles waitlist signup requests
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Parse request body
    const { email, role = 'curious', source = 'landing-page' }: WaitlistSignupRequest = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Email is required.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.'
      });
    }

    // Validate role
    if (!isValidRole(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be "baker", "customer", or "curious".'
      });
    }

    // Validate environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

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
        return res.status(409).json({
          success: false,
          error: 'This email is already on the waitlist.'
        });
      }

      // Other database errors
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save signup. Please try again.'
      });
    }

    // Success response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    return res.status(200).json({
      success: true,
      message: 'Successfully added to waitlist!',
      data: {
        id: data.id,
        email: data.email,
        role: data.role,
      }
    });

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    });
  }
}
