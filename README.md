# NextGen AI Builder

> Generate, edit, preview, and deploy full-stack web projects from a single natural-language prompt — powered by Gemini.

A production-shaped SaaS platform built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, **Firebase**, **Stripe**, and the **Google Generative AI (Gemini)** SDK. Includes a Monaco-based IDE, sandboxed live preview, role-based admin console, and a polished marketing site.

---

## ✨ Highlights

- 🪄 **Prompt → project**: Gemini 2.0 Flash generates multi-file projects (HTML/CSS/JS) returned as strict JSON.
- 🧠 **AI co-pilot**: Per-file `explain` / `debug` / `refactor` / `improve UI` actions.
- 💻 **Built-in IDE**: Monaco editor, file tree, multi-tab editing, ⌘S / ⌘B / ⌘↵ shortcuts.
- 👀 **Live preview**: sandboxed iframe with desktop / tablet / mobile frames + console + error overlay.
- 💾 **Versioning**: every save snapshots files into a Firestore subcollection.
- 📦 **Export**: one-click ZIP export (zero-dependency encoder).
- 🔐 **Auth**: email + Google + GitHub via Firebase, with role-based access (`user → super_admin`).
- 💳 **Billing**: Stripe Checkout + webhook scaffolding for Free / Pro / Premium / Enterprise plans.
- 🛡 **Admin**: users, projects, billing, moderation, announcements, feature flags, platform settings.
- 🎨 **Premium UI**: glassmorphism, animated gradients, dark/light/system, fully responsive.

---

## 🧱 Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS · custom design tokens · Framer Motion |
| State | Zustand |
| Auth + DB | Firebase Auth · Firestore · Storage |
| AI | `@google/generative-ai` (Gemini 2.0 Flash) |
| Editor | `@monaco-editor/react` |
| Payments | Stripe |
| Icons | lucide-react |

---

## 🚀 Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env.local
# fill in NEXT_PUBLIC_FIREBASE_* and GEMINI_API_KEY

# 3. Run
npm run dev
# → http://localhost:3000
```

Then:

1. Sign up at `/signup` (email or Google).
2. Open `/dashboard/generate` and write a prompt like:
   > *"Build a SaaS landing page for an AI fitness coach with hero, features, pricing, testimonials, and FAQ. Dark mode, glassmorphism."*
3. Edit in the IDE (`/dashboard/projects/[id]`) and watch the preview update on save.

---

## 🔑 Environment variables

See [`.env.example`](./.env.example) for the full list.

| Var | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | ✅ | Firebase web config (safe to expose) |
| `GEMINI_API_KEY` | ✅ for AI | Server-only Gemini key |
| `STRIPE_SECRET_KEY` | optional | Enables `/dashboard/billing` checkout |
| `STRIPE_WEBHOOK_SECRET` | optional | Verifies webhook signatures |
| `STRIPE_PRICE_*` | optional | Stripe price IDs per plan |
| `NEXT_PUBLIC_APP_URL` | optional | Used for OG/canonical URLs |

> ⚠️ `GEMINI_API_KEY` and `STRIPE_SECRET_KEY` are server-only — they must never appear in code that ships to the browser. They're only read inside files marked `import "server-only"` (`src/lib/gemini/server.ts`, `src/lib/stripe.ts`) and inside API routes.

---

## 🔥 Firebase setup

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Authentication** → Email/Password, Google, GitHub.
3. Create a **Firestore** database in production mode.
4. Deploy the security rules:

   ```bash
   npx firebase login
   npx firebase use <your-project-id>
   npx firebase deploy --only firestore:rules
   ```

5. (Optional) Create the seed admin: in the Firestore console, edit your user document at `users/{uid}` and set `role: "super_admin"`.

The included [`firestore.rules`](./firestore.rules) enforces:
- users can only read/write their own profile (admins can read all),
- projects are scoped to `ownerId` + `collaborators`,
- billing/usage docs are server-write-only,
- admin-only collections (`admin_settings`, `moderation_logs`, `API_usage_logs`, `analytics`).

---

## 💳 Stripe setup

1. Create products & prices in the Stripe dashboard for **Pro**, **Premium**, **Enterprise**.
2. Copy the price IDs into `.env.local` as `STRIPE_PRICE_PRO_MONTHLY`, etc.
3. Add the webhook endpoint in Stripe → Webhooks:
   ```
   {APP_URL}/api/stripe/webhook
   ```
   Subscribe to: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`.
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

> The webhook route ([`src/app/api/stripe/webhook/route.ts`](./src/app/api/stripe/webhook/route.ts)) verifies signatures and logs events. To persist subscription state to Firestore (and update user `plan`/`role`), wire `firebase-admin` inside that handler — search for the `TODO` markers.

---

## 🐳 Docker

```bash
docker build -t nextgen-ai-builder .
docker run -p 3000:3000 --env-file .env.local nextgen-ai-builder
```

---

## ☁️ Deploy to Vercel

```bash
vercel link
vercel env pull .env.local      # or set vars in the Vercel dashboard
vercel --prod
```

The repo works on Vercel out of the box. For Firebase-only hosting, switch to static export and serve via Firebase Hosting (see `firebase.json`).

---

## 🗂 Project structure

```
src/
├── app/
│   ├── (marketing)/        # public pages: /, pricing, features, docs, …
│   ├── (auth)/             # /login, /signup, /reset
│   ├── dashboard/          # authenticated user app
│   │   ├── generate/       # AI generator
│   │   ├── projects/[id]/  # IDE workspace
│   │   ├── templates/
│   │   ├── billing/
│   │   ├── settings/
│   │   └── notifications/
│   ├── admin/              # role-gated admin console
│   ├── api/
│   │   ├── ai/{generate,assist}/
│   │   ├── stripe/{checkout,webhook}/
│   │   └── contact/
│   ├── layout.tsx          # root layout (theme + auth providers)
│   ├── globals.css         # tokens + .glass/.card/.btn-* component classes
│   └── sitemap.ts / robots.ts
├── components/
│   ├── marketing/          # hero, features, pricing, footer, …
│   ├── auth/               # require-auth, social buttons
│   ├── app/                # sidebar, topbar, project-card
│   ├── ide/                # ide-shell, file-tree, editor-pane, preview-pane, ai-assist-menu
│   ├── providers/          # auth + theme providers
│   └── ui/                 # button, input, logo, skeleton, theme-toggle, empty
└── lib/
    ├── firebase/           # client, auth, projects
    ├── gemini/             # server (imports "server-only"), prompts
    ├── stripe.ts           # server-only Stripe client
    ├── plans.ts            # plan definitions
    ├── store.ts            # zustand stores (auth, IDE, theme)
    ├── preview.ts          # iframe srcDoc builder
    ├── zip.ts              # dep-free ZIP encoder
    ├── rate-limit.ts       # per-process token bucket
    ├── types.ts            # domain types
    └── utils.ts            # cn(), formatBytes, formatRelative, …
```

---

## 🗄 Firestore collections

| Collection | Purpose |
|---|---|
| `users/{uid}` | Profile, role, plan, usage counters |
| `projects/{projectId}` | AI-generated projects |
| `projects/{projectId}/versions/{vid}` | Save snapshots |
| `ai_generations/{id}` | Per-user generation logs |
| `subscriptions/{id}` | Stripe-mirrored subscription state (server writes) |
| `invoices/{id}` | Stripe-mirrored invoices (server writes) |
| `coupons/{id}` | Promo codes (admin-managed) |
| `templates/{id}` | Public templates |
| `notifications/{id}` | Per-user inbox |
| `support_tickets/{id}` | Help center submissions |
| `feature_flags/{id}` | Runtime experiments |
| `admin_settings/{key}` | Platform config (e.g. `platform`, `latest_announcement`) |
| `moderation_logs/{id}` | Flag/abuse audit trail |
| `API_usage_logs/{id}` | Rate-limit + abuse forensics |
| `analytics/{id}` | Aggregated metrics (admin-only) |

---

## 🤖 How AI generation works

`POST /api/ai/generate` → [`generateProjectFromPrompt`](./src/lib/gemini/server.ts):

1. Sends a strict-JSON system prompt to Gemini 2.0 Flash with `responseMimeType: "application/json"`.
2. Gemini returns a JSON object: `{ name, description, tags, files: [{ path, language, content }] }`.
3. The route validates, sanitizes, and returns it.
4. The client persists it via `createProject()` and routes to `/dashboard/projects/[id]`.

The IDE concatenates HTML / CSS / JS into a single `<iframe srcDoc>` via [`buildPreviewSrcDoc`](./src/lib/preview.ts), with a console-bridge that postMessages logs and runtime errors back to the editor.

---

## 🛣 Roadmap (clearly-marked stubs)

These were scoped down for a single-shot delivery. Each lives behind a clean interface so you can extend without rewriting:

- [ ] Stripe webhook → Firestore via `firebase-admin` (`/api/stripe/webhook/route.ts`)
- [ ] Real-time collaboration (Firestore presence + cursors)
- [ ] GitHub export (push to repo)
- [ ] Vercel/Firebase one-click deploy
- [ ] Lighthouse-backed performance/SEO scoring panel
- [ ] Cloud Function fan-out for announcement → per-user notifications
- [ ] Full template marketplace with publishing flow
- [ ] Streaming AI assist responses (currently single-shot)

---

## 📝 License

MIT — do anything, just attribute.
