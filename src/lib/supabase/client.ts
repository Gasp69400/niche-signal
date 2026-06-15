import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (browserClient) {
    return browserClient;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    return null;
  }

  browserClient = createBrowserClient(url, key, {
    auth: {
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
  return browserClient;
}
