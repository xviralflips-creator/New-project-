import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Stripe routes will not work until configured."
    );
  }
  _stripe = new Stripe(key, { apiVersion: "2024-10-28.acacia" });
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
