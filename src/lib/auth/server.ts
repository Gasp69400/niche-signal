import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canAccessReports } from "@/lib/auth/access";
import type { Plan } from "@/types/auth";

export async function getAuthenticatedUser(request?: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return null;

  if (request) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) return user;
    }
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getUserPlan(request?: NextRequest): Promise<Plan | null> {
  const user = await getAuthenticatedUser(request);
  if (!user) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  return (data?.plan as Plan) ?? null;
}

export async function userCanAnalyze(request?: NextRequest): Promise<boolean> {
  const user = await getAuthenticatedUser(request);
  if (!user) return false;

  const plan = await getUserPlan(request);
  return canAccessReports(plan ?? "free");
}
