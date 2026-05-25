import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Lazy-initialized Stripe client. Throws a friendly error if the secret key
 * is not configured so the rest of the app keeps building/running.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Stripe routes will not work until configured."
    );
  }
  // Casting apiVersion as any so this builds across Stripe SDK minor bumps.
  // The Stripe Node SDK's type union for apiVersion shifts with each release;
  // omitting/casting here makes the project resilient to future bumps.
  _stripe = new Stripe(key, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2024-12-18.acacia" as any,
  });
  return _stripe;
}

export function getPriceIdForPlan(plan: string): string | null {
  switch (plan) {
    case "pro":
      return process.env.STRIPE_PRICE_PRO_MONTHLY ?? null;
    case "premium":
      return process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? null;
    case "enterprise":
      return process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? null;
    default:
      return null;
  }
}
