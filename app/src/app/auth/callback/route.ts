import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: async () => cookieStore });
    
    // Exchange the code for a session
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // Check if a baker profile exists
      const { data: baker, error: fetchError } = await supabase
        .from('bakers')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // If profile is missing (single() returns 406 if no rows found in some versions or error pg 404/PGRST116)
      if (!baker) {
        // Create the baker profile
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day beta trial
        
        await supabase.from('bakers').insert({
          id: user.id,
          role: user.user_metadata?.role || 'baker',
          trial_ends_at: trialEndDate.toISOString(),
          is_beta_tester: true,
          onboarding_completed: false,
          referral_code_claimed: user.user_metadata?.referral_code || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Also check if they were referred and update the referrals table if it exists
        const referralCode = user.user_metadata?.referral_code;
        if (referralCode) {
            const { data: referrer } = await supabase
                .from('bakers')
                .select('id')
                .eq('referral_code', referralCode)
                .single();

            if (referrer) {
                await supabase.from('referrals').insert({
                    referrer_id: referrer.id,
                    referred_email: user.email,
                    referred_user_id: user.id,
                    referral_code: referralCode,
                    status: 'active', // Since they confirmed their email now
                });
            }
        }
      } else {
          // If profile exists, but they were referred and the record is pending, mark it active
          await supabase
            .from('referrals')
            .update({ status: 'active' })
            .eq('referred_user_id', user.id)
            .eq('status', 'pending');
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, request.url));
}
