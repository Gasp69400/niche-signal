import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { setReportFavorite } from "@/lib/db/reports";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const { favorite } = await request.json();

  if (typeof favorite !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const isFavorite = await setReportFavorite(params.id, user.id, favorite);
    return NextResponse.json({ isFavorite });
  } catch (error) {
    console.error("Favorite toggle failed:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le favori" },
      { status: 500 }
    );
  }
}
