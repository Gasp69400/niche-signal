import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/fr";

  if (!code) {
    return NextResponse.redirect(`${origin}/fr`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/fr`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback]", error.message);
    const fallback = next.includes("reset-password") ? next : "/fr";
    return NextResponse.redirect(`${origin}${fallback}?error=auth`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
