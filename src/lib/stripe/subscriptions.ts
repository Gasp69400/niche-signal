import type Stripe from "stripe";
import {
  findUserIdByStripeCustomerId,
  findUserIdByStripeSubscriptionId,
  setUserPlan,
  updateProfileStripeData,
} from "@/lib/db/profiles";
import { isActiveSubscriptionStatus } from "@/lib/stripe/server";

function resolveUserId(
  metadata: Stripe.Metadata | null | undefined,
  fallback?: string | null
) {
  return metadata?.userId || fallback || null;
}

export async function activateProFromCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = resolveUserId(session.metadata, session.client_reference_id);
  if (!userId) {
    throw new Error("checkout.session.completed sans userId");
  }

  await setUserPlan(userId, "pro", {
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
    stripeSubscriptionId:
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id ?? null,
    stripeSubscriptionStatus: "active",
  });
}

export async function syncSubscriptionStatus(subscription: Stripe.Subscription) {
  const userId =
    resolveUserId(subscription.metadata) ||
    (typeof subscription.customer === "string"
      ? await findUserIdByStripeCustomerId(subscription.customer)
      : subscription.customer
        ? await findUserIdByStripeCustomerId(subscription.customer.id)
        : null) ||
    (await findUserIdByStripeSubscriptionId(subscription.id));

  if (!userId) {
    console.warn("[stripe] subscription sans userId:", subscription.id);
    return;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  await setUserPlan(userId, isActiveSubscriptionStatus(subscription.status) ? "pro" : "free", {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripeSubscriptionStatus: subscription.status,
  });
}

export async function attachCustomerToUser(userId: string, customerId: string) {
  await updateProfileStripeData(userId, {
    stripeCustomerId: customerId,
  });
}
