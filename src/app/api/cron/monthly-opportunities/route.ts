import { NextRequest, NextResponse } from "next/server";
import { regenerateCurrentEdition } from "@/lib/opportunities/edition-service";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

function resolveLocale(request: NextRequest): Locale {
  const param = request.nextUrl.searchParams.get("locale");
  if (param && isValidLocale(param)) {
    return param;
  }
  return defaultLocale;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const force = request.nextUrl.searchParams.get("force") === "true";
  const locale = resolveLocale(request);

  try {
    const edition = await regenerateCurrentEdition(locale, force);
    return NextResponse.json({ success: true, edition });
  } catch (error) {
    console.error("[cron/monthly-opportunities]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Génération des opportunités du mois impossible";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
