# Indexable Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/` from a redirect-only route into a public, server-rendered marketing landing (hybrid "bulk contract generator" angle) that ranks, while still redirecting logged-in users to `/templates`.

**Architecture:** Approach A from the spec — the route renders the landing on the server (good for crawlers and logged-out visitors); a client-side `useEffect` calls `supabase.auth.getSession()` and redirects logged-in users to `/templates`. The FAQ visible content and the FAQPage JSON-LD are generated from a single `FAQS` array so they can never drift (lesson from the SEO audit's 3-vs-4 schema mismatch). The sitemap re-adds `/` as real indexable content.

**Tech Stack:** TanStack Start (file-based routing, `createFileRoute`, `head()`), React 19, `@tanstack/react-router` (`Link`, `useNavigate`), Supabase JS client, Tailwind v4, lucide-react icons, shadcn `Button`.

**Reference:** `docs/superpowers/specs/2026-06-28-homepage-indexable-design.md`. The existing `src/routes/influencer-contract-templates.tsx` is the canonical pattern for an SSR landing in this repo — match its structure and design tokens.

---

## ⚠️ Testing reality for this repo

This repo has **no local toolchain** (`node_modules`/`bun` not installed) and **no test runner** (`package.json` has no `test` script). Do NOT invent pytest/vitest commands — there is nothing to run them. Verification in this plan uses:

1. **Static checks** — `grep`/file reads to confirm the change is present and well-formed.
2. **Lovable preview build** — the real compile/type gate (Lovable rebuilds on push to the PR branch / on merge). Watch for build errors there.
3. **Post-deploy `curl`** — assert the server-rendered HTML of `/` contains the expected H1, canonical, and JSON-LD.
4. **Manual auth check** — logged-in `/` → `/templates`; logged-out `/` → landing.

---

## File Structure

- **Modify (full rewrite):** `src/routes/index.tsx` — was a redirect-only route; becomes the SSR landing + client-side logged-in redirect. Single responsibility: render the public homepage and bounce authenticated users to the app.
- **Modify:** `src/routes/sitemap[.]xml.ts` — re-add `/` (priority 1.0) and drop `/influencer-contract-templates` to 0.9.
- No new files. Sub-components (`Stat`, `Step`, `Bullet`, `Faq`) live inline in `index.tsx`, matching the self-contained pattern of `influencer-contract-templates.tsx`.

---

## Task 0: Create the implementation branch

- [ ] **Step 1: Branch from up-to-date main**

```bash
cd /Users/alantoulouse/Desktop/Contratos
git checkout main
git pull origin main
git checkout -b seo/indexable-homepage
```

Expected: `Switched to a new branch 'seo/indexable-homepage'`.

---

## Task 1: Rewrite `/` into the SSR landing + client redirect

**Files:**
- Modify (full rewrite): `src/routes/index.tsx`

- [ ] **Step 1: Replace the entire contents of `src/routes/index.tsx` with this**

```tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  FileText,
  Upload,
  Wand2,
  Download,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const CANONICAL = "https://easycontracts.site/";
const TITLE = "Bulk Contract Generator · Word + Excel to ZIP | Easy Contracts";
const DESCRIPTION =
  "Generate hundreds of personalized contracts in bulk. Upload one Word template and an Excel file, map the columns, and download a ZIP with every contract ready. Free to try.";

// Single source of truth: both the visible FAQ and the FAQPage JSON-LD render
// from this array, so the schema can never drift from the on-page content.
const FAQS = [
  {
    q: "What file formats do I need?",
    a: "A Microsoft Word (.docx) template with {{variable}} placeholders, plus an Excel (.xlsx) or CSV file with one row per contract. You download the results as .docx files in a ZIP.",
  },
  {
    q: "How many contracts can I generate at once?",
    a: "As many as you have rows in your Excel file. Upload once and generate hundreds of personalized contracts in a single batch.",
  },
  {
    q: "Do I need to change my existing contract template?",
    a: "No. Keep your existing Word document and clauses — just replace the parts that change per contract (names, fees, dates) with {{placeholders}}. Easy Contracts never alters your legal text.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();

  // Logged-in users who land on "/" are bounced to the app. Runs client-side
  // only (the session lives in localStorage), so SSR always serves the landing.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) {
        navigate({ to: "/templates" });
      }
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <FileText className="size-5 text-primary" />
            Easy Contracts
          </Link>
          <Button asChild size="sm">
            <Link to="/auth">Start free</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Generate hundreds of contracts in bulk — from a Word template and an Excel file
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Stop duplicating documents and find-replacing names. Upload your template once,
          load a spreadsheet with your data, and download a ZIP with every personalized
          contract ready to send.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/auth">Start free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 sm:grid-cols-3">
          <Stat icon={<Clock className="size-5" />} value="10+" label="Hours saved per batch" />
          <Stat icon={<Users className="size-5" />} value="Unlimited" label="Contracts per upload" />
          <Stat icon={<ShieldCheck className="size-5" />} value="100%" label="Your template, untouched" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section id="how-it-works">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-6 space-y-6">
            <Step
              icon={<Upload className="size-5" />}
              number={1}
              title="Upload your Word template"
              body="Bring your existing .docx. Add {{variable}} placeholders anywhere you'd normally hand-edit."
            />
            <Step
              icon={<FileText className="size-5" />}
              number={2}
              title="Upload your Excel sheet"
              body="One row per contract. Columns become the data that fills your template."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map columns to variables"
              body="Match each {{variable}} to a column. Preview exactly what each contract will look like."
            />
            <Step
              icon={<Download className="size-5" />}
              number={4}
              title="Download the ZIP"
              body="Every contract personalized, named, and ready to send for signature."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Who it's for</h2>
          <p className="mt-4 text-muted-foreground">
            Anyone who sends the same contract to many people with small changes each time:
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Marketing agencies running campaigns at scale",
              "Freelancers and studios onboarding clients",
              "HR teams issuing offer letters and agreements",
              "Operations teams handling vendor or NDA batches",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted-foreground">
            A common use case is{" "}
            <Link
              to="/influencer-contract-templates"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              influencer contract templates
            </Link>{" "}
            — generating personalized agreements for a whole roster of creators at once.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">
            Why bulk generation beats doing it by hand
          </h2>
          <p className="mt-4 text-muted-foreground">
            Manually duplicating a Word file for every contract is slow and error-prone — one
            wrong paste and someone gets the wrong rate or name in a signed document. Mail merge
            helps with simple letters, but it struggles with real contract formatting and gives
            you a single merged file instead of one clean document per person.
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>One personalized .docx per row — not a single merged blob.</Bullet>
            <Bullet>Your clauses and formatting stay exactly as you wrote them.</Bullet>
            <Bullet>No copy-paste typos reaching signed documents.</Bullet>
            <Bullet>Hours per batch back for actual work.</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Stop copy-pasting. Start generating.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Upload your template once and generate every contract, for every batch. Free to try,
            no credit card required.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link to="/auth">Create your free account</Link>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-6">
            {FAQS.map((f) => (
              <Faq key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>
      </article>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Easy Contracts</p>
          <Link to="/auth" className="hover:text-foreground">
            Sign in
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}

function Step({
  icon,
  number,
  title,
  body,
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Step {number}</p>
        <h3 className="mt-0.5 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{q}</h3>
      <p className="mt-2 text-muted-foreground">{a}</p>
    </div>
  );
}
```

- [ ] **Step 2: Static check — no leftover redirect logic, key elements present**

Run:
```bash
cd /Users/alantoulouse/Desktop/Contratos
grep -n "ssr: false\|beforeLoad\|redirect" src/routes/index.tsx || echo "OK: no redirect-only logic left"
grep -c "createFileRoute(\"/\")\|FAQPage\|canonical\|getSession\|influencer-contract-templates" src/routes/index.tsx
```
Expected: first command prints `OK: no redirect-only logic left`; second prints `5` (one match per pattern).

- [ ] **Step 3: Static check — FAQ schema/visible parity is structural**

Confirm by reading the file that both the visible FAQ (`FAQS.map((f) => <Faq ...>)`) and the JSON-LD (`mainEntity: FAQS.map(...)`) iterate the same `FAQS` array. There must be exactly one `const FAQS = [` declaration.

Run:
```bash
grep -c "const FAQS = \[" src/routes/index.tsx
```
Expected: `1`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(seo): turn homepage into indexable SSR landing

Replace the redirect-only / route with a server-rendered marketing
landing (hybrid bulk-contract-generator angle). Logged-in users are
redirected to /templates client-side. FAQ visible content and FAQPage
JSON-LD render from a single FAQS array. Adds internal link to the
influencer-contract-templates page.

Ref: docs/superpowers/specs/2026-06-28-homepage-indexable-design.md"
```

---

## Task 2: Re-add `/` to the sitemap and reprioritize

**Files:**
- Modify: `src/routes/sitemap[.]xml.ts`

- [ ] **Step 1: Replace the comment + `entries` block**

Find this block (added in PR #12):
```ts
        // /auth is an indexable utility page with thin content; it is kept out of
        // the sitemap and marked noindex so it doesn't dilute crawl budget.
        const entries: SitemapEntry[] = [
          { path: "/influencer-contract-templates", changefreq: "monthly", priority: "1.0", lastmod: LAST_MODIFIED },
        ];
```

Replace it with:
```ts
        // "/" is now the public, server-rendered marketing homepage (was a
        // redirect-only route until the indexable-homepage change), so it is the
        // top-priority indexable URL. /auth stays out of the sitemap and is
        // marked noindex (thin utility page).
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: LAST_MODIFIED },
          { path: "/influencer-contract-templates", changefreq: "monthly", priority: "0.9", lastmod: LAST_MODIFIED },
        ];
```

- [ ] **Step 2: Static check**

Run:
```bash
cd /Users/alantoulouse/Desktop/Contratos
grep -n 'path: "/"' "src/routes/sitemap[.]xml.ts"
grep -n 'influencer-contract-templates", changefreq: "monthly", priority: "0.9"' "src/routes/sitemap[.]xml.ts"
```
Expected: first matches the new `/` line; second confirms the influencer page is now `0.9`.

- [ ] **Step 3: Commit**

```bash
git add "src/routes/sitemap[.]xml.ts"
git commit -m "feat(seo): add / to sitemap as primary indexable URL

The homepage is now real server-rendered content, so re-add it at
priority 1.0 (reverts the redirect-only removal from PR #12) and drop
the influencer page to 0.9."
```

---

## Task 3: Push, open PR, and verify on the Lovable preview

**Files:** none (verification only).

- [ ] **Step 1: Push the branch**

```bash
git push -u origin seo/indexable-homepage
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --repo Alan7799DE/Influencer-Contracts --base main --head seo/indexable-homepage \
  --title "feat(seo): indexable homepage" \
  --body "Implements docs/superpowers/specs/2026-06-28-homepage-indexable-design.md. Turns / into a server-rendered landing (hybrid bulk angle), redirects logged-in users to /templates client-side, adds internal link to the influencer page, and re-adds / to the sitemap at priority 1.0."
```

- [ ] **Step 3: Wait for the Lovable preview build and check it compiles**

Lovable rebuilds on the branch/PR. Confirm there are no build/TypeScript errors in the Lovable preview. If the build fails, read the error, fix in `src/routes/index.tsx`, commit, and push again. Do not proceed until the preview builds clean.

- [ ] **Step 4: Post-deploy `curl` assertions on the preview/prod URL**

Once deployed (replace `<URL>` with the preview or, after merge, `https://easycontracts.site`):
```bash
curl -sL --max-time 20 "<URL>/" | grep -o '<title>[^<]*</title>'
curl -sL --max-time 20 "<URL>/" | grep -o 'rel="canonical" href="https://easycontracts.site/"'
curl -sL --max-time 20 "<URL>/" | grep -o '"@type":"FAQPage"'
curl -sL --max-time 20 "<URL>/" | grep -o 'Generate hundreds of contracts in bulk'
curl -sL --max-time 20 "<URL>/sitemap.xml" | grep -o '<loc>https://easycontracts.site/</loc>'
```
Expected: every command returns a match (proves the homepage is server-rendered with the title, canonical, FAQ schema, H1, and that `/` is in the sitemap).

- [ ] **Step 5: Manual auth check**

- Logged **out**, visit `/` → see the landing; "Start free" / "Create your free account" go to `/auth`; "influencer contract templates" link goes to `/influencer-contract-templates`.
- Logged **in**, visit `/` → redirected to `/templates` (brief landing flash is expected per Approach A).

---

## Self-Review

**Spec coverage:**
- Route rewrite (SSR + client redirect) → Task 1 ✔
- Hybrid content, ~700-900 words, all sections (hero, stats, how-it-works, use cases + influencer internal link, benefits, FAQ, CTA) → Task 1 ✔
- FAQ distinct from influencer page + FAQPage schema 1:1 with visible content → Task 1 (`FAQS` single source) ✔
- Canonical + og:url + website og:type → Task 1 `head()` ✔
- Logged-in redirect to /templates client-side → Task 1 `useEffect` ✔
- Sitemap: re-add `/` at 1.0, influencer to 0.9, /auth still out → Task 2 ✔
- Minimal client JS (no docx/xlsx imports) → Task 1 imports only router/supabase/icons/Button ✔
- TanStack `<Link>` for internal nav → Task 1 (all internal links use `<Link>`; only the `#how-it-works` anchor uses `<a>`, which is correct for same-page anchors) ✔
- Org/SoftwareApplication NOT duplicated (already site-wide in root) → Task 1 only adds FAQPage ✔
- Verification via preview + curl (no test runner) → Task 3 ✔

**Placeholder scan:** No TBD/TODO. All code blocks are complete. `<URL>` in Task 3 Step 4 is an intentional fill-in (preview URL isn't known until the build runs), with explicit instructions — not a code placeholder.

**Type consistency:** `FAQS` items use `{ q, a }` everywhere (visible `Faq` component props are `q`/`a`; schema maps `f.q`/`f.a`). `Stat` uses `value`/`label`; `Step` uses `icon`/`number`/`title`/`body`; `Faq` uses `q`/`a`. All consistent between definition and usage.
