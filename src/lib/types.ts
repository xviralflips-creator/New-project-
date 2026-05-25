// ============================================================================
// Core domain types for NextGen AI Builder
// ============================================================================

export type Role =
  | "user"
  | "pro"
  | "premium"
  | "enterprise"
  | "moderator"
  | "admin"
  | "super_admin";

export type PlanId = "free" | "pro" | "premium" | "enterprise";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: Role;
  plan: PlanId;
  createdAt: number;
  updatedAt: number;
  // usage
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  projectsCount: number;
  // billing
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "none";
  // misc
  emailVerified: boolean;
  banned?: boolean;
  bannedReason?: string;
}

export interface ProjectFile {
  path: string;          // e.g. "src/app/page.tsx"
  content: string;
  language?: string;     // monaco language id
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  prompt: string;
  framework: "next" | "react" | "static" | "node";
  visibility: "private" | "unlisted" | "public";
  collaborators: string[];
  files: ProjectFile[];
  thumbnail?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  versionCount: number;
  status: "draft" | "ready" | "deployed" | "archived";
  deployUrl?: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  label: string;
  files: ProjectFile[];
  createdAt: number;
  createdBy: string;
  prompt?: string;
}

export interface AIGenerationLog {
  id: string;
  userId: string;
  projectId?: string;
  kind:
    | "project_generate"
    | "code_edit"
    | "explain"
    | "debug"
    | "refactor"
    | "ui_improve"
    | "seo"
    | "a11y"
    | "perf";
  prompt: string;
  inputTokens?: number;
  outputTokens?: number;
  durationMs: number;
  model: string;
  ok: boolean;
  error?: string;
  createdAt: number;
}

export interface NotificationDoc {
  id: string;
  userId: string;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: number;
  kind: "info" | "success" | "warning" | "error" | "system";
}

export interface FeatureFlag {
  id: string;
  enabled: boolean;
  description?: string;
  rolloutPercent?: number;
}

export interface PlanDef {
  id: PlanId;
  name: string;
  priceMonthly: number;
  description: string;
  highlights: string[];
  features: string[];
  aiGenerationsPerMonth: number;
  storageGB: number;
  maxProjects: number;
  prioritySupport: boolean;
  popular?: boolean;
  cta: string;
}
