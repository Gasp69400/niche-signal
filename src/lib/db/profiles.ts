import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/types/auth";

interface StripeProfileFields {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeSubscriptionStatus?: string | null;
}

export async function getProfileStripeFields(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("email, plan, stripe_customer_id, stripe_subscription_id, stripe_subscription_status")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    email: data.email as string,
    plan: data.plan as Plan,
    stripeCustomerId: (data.stripe_customer_id as string | null) ?? null,
    stripeSubscriptionId: (data.stripe_subscription_id as string | null) ?? null,
    stripeSubscriptionStatus:
      (data.stripe_subscription_status as string | null) ?? null,
  };
}

export async function updateProfileStripeData(
  userId: string,
  fields: StripeProfileFields & { plan?: Plan }
) {
  const supabase = createAdminClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (fields.plan) payload.plan = fields.plan;
  if (fields.stripeCustomerId !== undefined) {
    payload.stripe_customer_id = fields.stripeCustomerId;
  }
  if (fields.stripeSubscriptionId !== undefined) {
    payload.stripe_subscription_id = fields.stripeSubscriptionId;
  }
  if (fields.stripeSubscriptionStatus !== undefined) {
    payload.stripe_subscription_status = fields.stripeSubscriptionStatus;
  }

  const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function setUserPlan(
  userId: string,
  plan: Plan,
  stripe?: StripeProfileFields
) {
  await updateProfileStripeData(userId, { plan, ...stripe });
}

export async function findUserIdByStripeCustomerId(customerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.id as string;
}

export async function findUserIdByStripeSubscriptionId(subscriptionId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.id as string;
}
