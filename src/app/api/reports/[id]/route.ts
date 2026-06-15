import { NextRequest, NextResponse } from "next/server";
import { getReportById } from "@/lib/db/reports";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const report = await getReportById(params.id);

  if (!report) {
    return NextResponse.json({ error: "Rapport introuvable" }, { status: 404 });
  }

  return NextResponse.json(report);
}
