import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook receiver. Wire your Firestore Admin SDK here to update
 * subscriptions, invoices, and user roles. Without the Admin SDK we just
 * verify signatures and log — never trust client SDK writes for billing state.
 */
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 400 }
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(e as Error).message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "invoice.paid":
    case "invoice.payment_failed":
      console.info(`[stripe] ${event.type}`, event.id);
      // TODO: with firebase-admin, update users/{uid} plan + subscription docs.
      break;
    default:
      console.info(`[stripe] unhandled ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
