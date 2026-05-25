import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildProjectPrompt,
  CODE_DEBUG_SYSTEM,
  CODE_EXPLAIN_SYSTEM,
  CODE_REFACTOR_SYSTEM,
  PROJECT_GENERATION_SYSTEM_PROMPT,
  UI_IMPROVE_SYSTEM,
} from "./prompts";
import type { ProjectFile } from "../types";

const MODEL = "gemini-2.0-flash";

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured. Add it to .env.local.");
  }
  return new GoogleGenerativeAI(key);
}

/**
 * Strip code fences / leading prose and return the largest JSON object.
 * Gemini occasionally wraps output in ```json … ``` despite instructions.
 */
function extractJson(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }
  // Find the outermost {...}
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    s = s.slice(first, last + 1);
  }
  return s;
}

export interface GeneratedProject {
  name: string;
  description: string;
  tags: string[];
  files: ProjectFile[];
}

export async function generateProjectFromPrompt(
  userPrompt: string
): Promise<GeneratedProject> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: PROJECT_GENERATION_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(buildProjectPrompt(userPrompt));
  const text = result.response.text();
  const json = extractJson(text);

  let parsed: GeneratedProject;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error(
      `Gemini returned invalid JSON. First 200 chars: ${text.slice(0, 200)}`
    );
  }

  if (!parsed.files || !Array.isArray(parsed.files) || parsed.files.length === 0) {
    throw new Error("Generated project has no files.");
  }
  if (!parsed.files.some((f) => f.path === "index.html")) {
    throw new Error("Generated project is missing index.html.");
  }
  // sanitize
  parsed.files = parsed.files
    .filter((f) => f && typeof f.path === "string" && typeof f.content === "string")
    .map((f) => ({
      path: f.path.replace(/^\/+/, ""),
      content: f.content,
      language: f.language || guessLang(f.path),
    }));
  parsed.tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [];
  parsed.name = parsed.name || "Untitled project";
  parsed.description = parsed.description || "";
  return parsed;
}

function guessLang(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return (
    {
      html: "html",
      htm: "html",
      css: "css",
      js: "javascript",
      mjs: "javascript",
      ts: "typescript",
      tsx: "typescript",
      jsx: "javascript",
      json: "json",
      md: "markdown",
      svg: "xml",
    } as Record<string, string>
  )[ext] ?? "plaintext";
}

export type AssistKind = "explain" | "debug" | "refactor" | "ui_improve";

export async function assistOnCode(
  kind: AssistKind,
  code: string,
  extra?: string
): Promise<string> {
  const sys = {
    explain: CODE_EXPLAIN_SYSTEM,
    debug: CODE_DEBUG_SYSTEM,
    refactor: CODE_REFACTOR_SYSTEM,
    ui_improve: UI_IMPROVE_SYSTEM,
  }[kind];

  const client = getClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: sys,
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  });
  const prompt = extra ? `${extra}\n\n---\n${code}` : code;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
