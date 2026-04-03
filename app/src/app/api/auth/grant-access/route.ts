import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const plan = searchParams.get("plan");

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: any }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Non-critical: Ignore if cookie setting fails in read-only route
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `/api/auth/grant-access?plan=${plan}`);
    return NextResponse.redirect(loginUrl);
  }

  if (plan === "monthly" || plan === "lifetime") {
    const { error } = await supabase
      .from("bakers")
      .update({
        is_premium: true,
        plan_type: plan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error granting access:", error);
      return NextResponse.redirect(
        new URL("/dashboard?error=activation_failed", request.url)
      );
    }
    return NextResponse.redirect(
      new URL("/dashboard?success=plan_activated", request.url)
    );
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
