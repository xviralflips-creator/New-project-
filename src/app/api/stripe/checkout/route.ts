import { NextResponse } from "next/server";
import { getStripe, getPriceIdForPlan } from "@/lib/stripe";

export async function POST(req: Request) {
  let body: { plan?: string; userId?: string; email?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { plan, userId, email } = body;
  if (!plan || !userId || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const priceId = getPriceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price configured for plan "${plan}". Set STRIPE_PRICE_${plan.toUpperCase()}_MONTHLY in your env.` },
      { status: 400 }
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      client_reference_id: userId,
      metadata: { userId, plan },
      success_url: `${origin}/dashboard/billing?status=success`,
      cancel_url: `${origin}/dashboard/billing?status=cancelled`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
