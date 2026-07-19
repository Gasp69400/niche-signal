import { NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function GET() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Variables Supabase manquantes dans .env.local",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: anonKey },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Supabase a répondu ${response.status}`,
          url,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Impossible de joindre Supabase. Vérifiez NEXT_PUBLIC_SUPABASE_URL (Project Settings → API).",
        url,
      },
      { status: 502 }
    );
  }
}
