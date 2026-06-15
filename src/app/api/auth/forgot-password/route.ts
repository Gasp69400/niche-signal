import { NextRequest, NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const locale = body.locale === "en" ? "en" : "fr";

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Authentification non configurée" },
      { status: 500 }
    );
  }

  const redirectTo = `${getSiteUrl()}/${locale}/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("[forgot-password]", error.message, { redirectTo });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
