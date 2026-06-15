import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/env";

export function createAdminClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Supabase admin credentials manquantes");
  }

  return createClient(url, key);
}
