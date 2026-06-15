import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { getReportsByUser } from "@/lib/db/reports";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  const favoritesOnly =
    request.nextUrl.searchParams.get("favorites") === "true";

  const reports = await getReportsByUser(user.id, { search, favoritesOnly });

  return NextResponse.json(reports);
}
