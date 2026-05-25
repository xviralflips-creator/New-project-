import { NextResponse } from "next/server";
import { generateProjectFromPrompt } from "@/lib/gemini/server";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  // Per-IP rate limit (replace with auth-based for production)
  const rl = rateLimit(`ai-generate:${ipFromRequest(req)}`, {
    capacity: 6,
    refillPerMinute: 6,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit reached. Please wait a moment and try again.",
      },
      { status: 429 }
    );
  }

  let body: { prompt?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = (body.prompt ?? "").trim();
  if (prompt.length < 8) {
    return NextResponse.json(
      { error: "Prompt is too short. Add a few more details about what to build." },
      { status: 400 }
    );
  }
  if (prompt.length > 4000) {
    return NextResponse.json(
      { error: "Prompt is too long. Trim it under 4,000 characters." },
      { status: 400 }
    );
  }

  const start = Date.now();
  try {
    const project = await generateProjectFromPrompt(prompt);
    return NextResponse.json({
      ok: true,
      durationMs: Date.now() - start,
      project,
    });
  } catch (e) {
    const msg = (e as Error).message ?? "Unknown error";
    console.error("[ai/generate]", msg);
    return NextResponse.json(
      { ok: false, error: msg, durationMs: Date.now() - start },
      { status: 500 }
    );
  }
}
