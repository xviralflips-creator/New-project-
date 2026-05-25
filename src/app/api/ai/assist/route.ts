import { NextResponse } from "next/server";
import { assistOnCode, type AssistKind } from "@/lib/gemini/server";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const rl = rateLimit(`ai-assist:${ipFromRequest(req)}`, {
    capacity: 20,
    refillPerMinute: 20,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit reached." },
      { status: 429 }
    );
  }

  let body: { kind?: AssistKind; code?: string; extra?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const valid: AssistKind[] = ["explain", "debug", "refactor", "ui_improve"];
  if (!body.kind || !valid.includes(body.kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }
  if (!body.code || body.code.length < 1 || body.code.length > 50_000) {
    return NextResponse.json(
      { error: "Code must be between 1 and 50,000 characters." },
      { status: 400 }
    );
  }

  try {
    const text = await assistOnCode(body.kind, body.code, body.extra);
    return NextResponse.json({ ok: true, text });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
