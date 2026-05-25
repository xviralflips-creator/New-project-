import { NextResponse } from "next/server";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(`contact:${ipFromRequest(req)}`, {
    capacity: 5,
    refillPerMinute: 2,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; topic?: string; message?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message } = body;
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: forward to your inbox via SendGrid/Resend or persist to Firestore.
  console.info("[contact]", { name, email, topic: body.topic, message: message.slice(0, 200) });
  return NextResponse.json({ ok: true });
}
