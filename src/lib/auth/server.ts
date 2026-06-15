import { createClient } from "@/lib/supabase/server";
import { canAccessReports } from "@/lib/auth/access";
import type { Plan } from "@/types/auth";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getUserPlan(): Promise<Plan | null> {
  const user = await getAuthenticatedUser();
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

export async function userCanAnalyze(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  if (!user) return false;

  const plan = await getUserPlan();
  return canAccessReports(plan ?? "free");
}
