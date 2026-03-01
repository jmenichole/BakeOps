import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const plan = searchParams.get('plan');

    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: async () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // If no session, redirect to login with the plan info so they can claim it after login
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', `/api/auth/grant-access?plan=${plan}`);
        return NextResponse.redirect(loginUrl);
    }

    const userId = session.user.id;

    if (plan === 'monthly' || plan === 'lifetime') {
        const { error } = await supabase
            .from('bakers')
            .update({
                is_premium: true,
                plan_type: plan,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            console.error('Error granting access:', error);
            return NextResponse.redirect(new URL('/dashboard?error=activation_failed', req.url));
        }

        // Success! Redirect to dashboard with a happy message
        return NextResponse.redirect(new URL('/dashboard?success=plan_activated', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard', req.url));
}
