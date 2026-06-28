# SEO Content Cluster (Article + Agencies Use-Case) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first two pieces of the SEO topic cluster — an informational guide and a commercial use-case page — to start building topical authority beyond the single influencer page, without creating thin "doorway" pages.

**Architecture:** Two new server-rendered marketing routes that reuse the established landing pattern from `src/routes/influencer-contract-templates.tsx`. To stay DRY across a growing cluster, shared presentational primitives (`MarketingHeader`, `MarketingFooter`, `Stat`, `Step`, `Bullet`, `Faq`) move into a new `src/components/marketing.tsx` and the two new pages consume them. Each page's visible FAQ and FAQPage JSON-LD render from a single `FAQS` array (lesson from the SEO audit's 3-vs-4 schema mismatch). Routes are organized under `/guides/...` (informational) and `/use-cases/...` (commercial).

**Tech Stack:** TanStack Start (file-based routing, `createFileRoute`, `head()`), React 19, `@tanstack/react-router` (`Link`), Tailwind v4, lucide-react icons, shadcn `Button`.

**Reference:** `SEO-AUDIT.md` (Content Gap Recommendations). Pattern reference: `src/routes/influencer-contract-templates.tsx`.

---

## ⚠️ Testing reality for this repo

No local toolchain (`node_modules`/`bun` not installed) and no test runner (`package.json` has no `test` script). Verification uses: static checks (`grep`), the Lovable preview build (compile/type gate), and post-deploy `curl` assertions. Do not invent test-runner commands.

## Dependency note

This plan edits `src/routes/sitemap[.]xml.ts`. If the indexable-homepage plan (`2026-06-28-homepage-indexable.md`) merges first, the sitemap `entries` array will already contain `/` at 1.0 and the influencer page at 0.9. **Task 4 adds two entries to whatever array is currently there** — read the file first and append, don't assume an exact prior state.

---

## File Structure

- **Create:** `src/components/marketing.tsx` — shared presentational primitives for all marketing/landing pages. One responsibility: reusable, content-agnostic layout pieces.
- **Create:** `src/routes/guides/generate-contracts-from-excel.tsx` — informational guide. Route: `/guides/generate-contracts-from-excel`.
- **Create:** `src/routes/use-cases/influencer-contracts-for-agencies.tsx` — commercial use-case landing. Route: `/use-cases/influencer-contracts-for-agencies`.
- **Modify:** `src/routes/sitemap[.]xml.ts` — add the two new URLs.
- **Modify:** `src/routes/influencer-contract-templates.tsx` — add one reciprocal internal link to the agencies page (cheap internal-linking win; the audit flagged internal linking as Fail).

Existing pages (`influencer-contract-templates.tsx`, `index.tsx`) keep their inline helpers for now — migrating them onto the shared module is optional follow-up, not part of this plan (don't churn working code).

---

## Task 0: Create the implementation branch

- [ ] **Step 1: Branch from up-to-date main**

```bash
cd /Users/alantoulouse/Desktop/Contratos
git checkout main
git pull origin main
git checkout -b seo/content-cluster
```

Expected: `Switched to a new branch 'seo/content-cluster'`.

---

## Task 1: Shared marketing components module

**Files:**
- Create: `src/components/marketing.tsx`

- [ ] **Step 1: Create `src/components/marketing.tsx` with this content**

```tsx
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
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
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Easy Contracts</p>
        <Link to="/auth" className="hover:text-foreground">
          Sign in
        </Link>
      </div>
    </footer>
  );
}

export function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
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

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}

export function Step({
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

export function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{q}</h3>
      <p className="mt-2 text-muted-foreground">{a}</p>
    </div>
  );
}
```

- [ ] **Step 2: Static check**

```bash
cd /Users/alantoulouse/Desktop/Contratos
grep -c "export function" src/components/marketing.tsx
```
Expected: `6` (Header, Footer, Stat, Bullet, Step, Faq).

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing.tsx
git commit -m "feat(marketing): shared landing primitives for the SEO cluster"
```

---

## Task 2: Guide — "How to generate contracts from an Excel sheet"

Route: `/guides/generate-contracts-from-excel`. Intent: informational (targets "generate contracts from Excel", "Word Excel merge contracts", "create multiple contracts from a spreadsheet").

**Files:**
- Create: `src/routes/guides/generate-contracts-from-excel.tsx`

- [ ] **Step 1: Create the file with this content (full copy is final, not a placeholder)**

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Table, Wand2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Step, Bullet, Faq } from "@/components/marketing";

const CANONICAL = "https://easycontracts.site/guides/generate-contracts-from-excel";
const TITLE = "How to Generate Contracts from an Excel Sheet (Step by Step)";
const DESCRIPTION =
  "Turn a spreadsheet into hundreds of finished contracts. A step-by-step guide to merging an Excel file with a Word template — without mail-merge headaches.";

const FAQS = [
  {
    q: "Can I use a CSV instead of Excel?",
    a: "Yes. A .csv file with the same one-row-per-contract layout works exactly like an .xlsx. Use whichever format your data already lives in.",
  },
  {
    q: "What happens to my document's formatting?",
    a: "It is preserved. Only the placeholders are replaced — your clauses, styles, tables, and letterhead stay exactly as you set them.",
  },
  {
    q: "How is each output file named?",
    a: "You pick a column to use as the file name (for example the counterparty's name), and each generated .docx is named from that row, so you get clearly labeled files instead of document1, document2.",
  },
];

export const Route = createFileRoute("/guides/generate-contracts-from-excel")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
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
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Easy Contracts" },
          publisher: { "@type": "Organization", name: "Easy Contracts" },
          mainEntityOfPage: CANONICAL,
        }),
      },
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
  component: GuidePage,
});

function GuidePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 7 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          How to generate contracts from an Excel sheet
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          If you send the same contract to many people — clients, creators, employees, vendors —
          you have probably done it the slow way: open a Word file, save a copy, find-and-replace
          the name, the amount, the dates, repeat. For five contracts it is tedious. For fifty it
          is an afternoon gone, and one mis-paste can put the wrong fee in a signed document. Here
          is a faster, safer way: keep your Word template, store the details in an Excel sheet, and
          merge the two so every contract comes out personalized and ready to send.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/auth">Try it free</Link>
          </Button>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-8 pb-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">What you'll need</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>A contract template in Microsoft Word (.docx) — your real document, clauses and all.</Bullet>
            <Bullet>A spreadsheet (.xlsx or .csv) with one row per contract and a column for each detail that changes.</Bullet>
            <Bullet>A way to merge them — we cover Word's mail merge and a purpose-built generator, and where each fits.</Bullet>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Step 1 — Turn the changing parts into placeholders</h2>
          <p className="mt-4 text-muted-foreground">
            Open your template and find every spot you would normally hand-edit: the counterparty's
            name, the fee, the dates, the deliverables. Replace each with a placeholder wrapped in
            double braces. Leave the rest of the document — your clauses, your formatting, your
            letterhead — exactly as it is. The placeholders are the only thing that changes per contract.
          </p>
          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{client_name}}`}</span>{" "}
              and{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{counterparty_name}}`}</span>.
            </p>
            <p className="mt-3">
              Total fee:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{fee}}`}</span>{" "}
              · Start date:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{start_date}}`}</span>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Step 2 — Structure your Excel sheet</h2>
          <p className="mt-4 text-muted-foreground">
            Create one column per placeholder, using the first row as headers, then add one row for
            each contract you want to generate. The header names do not have to match the placeholders
            exactly — you will map them in the next step — but keeping them close (a column called
            "Fee" for {`{{fee}}`}) makes the mapping automatic. Keep dates and money in a consistent
            format down each column so every contract reads the same way.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Step 3 — Merge the sheet into the template</h2>
          <p className="mt-4 text-muted-foreground">You have two realistic options.</p>
          <ol className="mt-6 space-y-6">
            <Step
              icon={<Table className="size-5" />}
              number={1}
              title="Word mail merge"
              body="Word can pull an Excel sheet into a template, but it is built for letters, not contracts. It outputs one long merged document with every contract stacked together, can mangle formatting on complex layouts, and getting a separate named file per row is fiddly."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={2}
              title="A bulk contract generator"
              body="A tool like Easy Contracts is built for this: upload your .docx template and your Excel file, map each placeholder to a column (it auto-matches the obvious ones), preview a real contract from the first row, and download a ZIP with one personalized, correctly named .docx per row."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Why not just use mail merge?</h2>
          <p className="mt-4 text-muted-foreground">
            Mail merge is fine for a batch of identical letters. It struggles with contracts because:
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>It produces a single merged file, not one document per person.</Bullet>
            <Bullet>It can break tables, headers, and styled clauses.</Bullet>
            <Bullet>Naming and exporting each contract separately is manual work.</Bullet>
            <Bullet>Re-running it next time means redoing the setup.</Bullet>
          </ul>
          <p className="mt-6 text-muted-foreground">
            If you only ever make a couple of documents, mail merge is enough. If you generate
            contracts in batches and need clean, individually named files, a dedicated generator
            saves the cleanup.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Fields worth turning into columns</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            <Bullet>Names of the parties</Bullet>
            <Bullet>Fee / compensation and payment terms</Bullet>
            <Bullet>Dates (start, posting, delivery, expiry)</Bullet>
            <Bullet>Deliverables or scope of work</Bullet>
            <Bullet>The file name for each output</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Generate your first batch</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your template, load your sheet, download the ZIP. Free to try, no credit card required.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link to="/auth">Start free</Link>
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

        <section className="border-t pt-8 text-muted-foreground">
          <p>
            Running campaigns with many creators? See{" "}
            <Link to="/use-cases/influencer-contracts-for-agencies" className="font-medium text-primary underline-offset-4 hover:underline">
              influencer contracts for agencies
            </Link>
            . For an influencer-specific walkthrough, see{" "}
            <Link to="/influencer-contract-templates" className="font-medium text-primary underline-offset-4 hover:underline">
              influencer contract templates
            </Link>
            .
          </p>
        </section>
      </article>

      <MarketingFooter />
    </main>
  );
}
```

- [ ] **Step 2: Static check**

```bash
cd /Users/alantoulouse/Desktop/Contratos
grep -c 'createFileRoute("/guides/generate-contracts-from-excel")\|const FAQS = \[\|FAQPage' src/routes/guides/generate-contracts-from-excel.tsx
```
Expected: `3` (route id, single FAQS array, FAQPage schema).

- [ ] **Step 3: Commit**

```bash
git add src/routes/guides/generate-contracts-from-excel.tsx
git commit -m "feat(seo): add /guides/generate-contracts-from-excel guide"
```

---

## Task 3: Use-case — "Influencer contracts for agencies"

Route: `/use-cases/influencer-contracts-for-agencies`. Intent: commercial (targets "influencer contract template for agencies", "agency influencer contract management").

**Files:**
- Create: `src/routes/use-cases/influencer-contracts-for-agencies.tsx`

- [ ] **Step 1: Create the file with this content (full copy is final, not a placeholder)**

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Users, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Stat, Bullet, Faq } from "@/components/marketing";

const CANONICAL = "https://easycontracts.site/use-cases/influencer-contracts-for-agencies";
const TITLE = "Influencer Contracts for Agencies · Generate Them in Bulk";
const DESCRIPTION =
  "Agencies running multi-creator campaigns: stop hand-editing contracts. Generate a personalized influencer agreement for every creator on your roster in one batch.";

const FAQS = [
  {
    q: "Can I manage contracts for multiple clients?",
    a: "Yes. Keep a separate template per client where the clauses differ, or one master template with a client_name variable, and a separate spreadsheet per campaign.",
  },
  {
    q: "Do I keep my agency's own clauses?",
    a: "Always. Your template is your legal text — Easy Contracts only personalizes the placeholders and never alters clauses. Have your template reviewed by a lawyer in your jurisdiction.",
  },
  {
    q: "Can my team reuse a template across campaigns?",
    a: "That is the point. Upload a template once and reuse it for every campaign; just swap in a new roster spreadsheet each time.",
  },
];

export const Route = createFileRoute("/use-cases/influencer-contracts-for-agencies")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
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
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Easy Contracts" },
          publisher: { "@type": "Organization", name: "Easy Contracts" },
          mainEntityOfPage: CANONICAL,
        }),
      },
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
  component: AgenciesPage,
});

function AgenciesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Use case · Agencies</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Influencer contracts for agencies
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Agencies do not sign one creator — they run campaigns with dozens, across several clients,
          every month. Each creator needs the same agreement with different names, fees,
          deliverables, and dates. Doing that by hand in Word does not scale: it is hours per
          campaign and one wrong paste away from sending a creator the wrong rate. Here is how
          agencies generate every influencer contract for a campaign in a single batch — keeping
          their own clauses and each client's terms intact.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/auth">Start free</Link>
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 sm:grid-cols-3">
          <Stat icon={<Users className="size-5" />} value="50+" label="Creators per batch" />
          <Stat icon={<Clock className="size-5" />} value="Minutes" label="Not an afternoon" />
          <Stat icon={<ShieldCheck className="size-5" />} value="100%" label="Your clauses, untouched" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Why agency contract work doesn't scale by hand</h2>
          <p className="mt-4 text-muted-foreground">A typical agency juggles:</p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Multiple clients, each with their own brand terms and clauses.</Bullet>
            <Bullet>Rosters of 10, 50, or 100+ creators per campaign.</Bullet>
            <Bullet>Constant changes — rates negotiated per creator, dates shifting, deliverables varying.</Bullet>
            <Bullet>Version control headaches when a clause updates and old copies float around.</Bullet>
          </ul>
          <p className="mt-6 text-muted-foreground">
            Every one of those is multiplied by the number of creators. Manual duplication is where
            the hours and the errors come from.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">How bulk generation works for an agency</h2>
          <p className="mt-4 text-muted-foreground">
            Keep one master influencer agreement as your template, with placeholders for everything
            that changes — {`{{creator_name}}`}, {`{{fee}}`}, {`{{deliverables}}`},
            {" "}{`{{posting_window}}`}, {`{{client_name}}`}. Maintain a spreadsheet per campaign with
            one row per creator. Upload both, map the columns once, and download a ZIP with a
            personalized, correctly named contract for every creator on the roster. Next campaign,
            reuse the same template and just swap the sheet.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Keep each client's terms straight</h2>
          <p className="mt-4 text-muted-foreground">
            Agencies live or die on not mixing up clients. Because the legal text lives in your
            template and the variables live in your sheet, you can:
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Keep a separate template per client when clauses genuinely differ.</Bullet>
            <Bullet>Use a {`{{client_name}}`} column so each contract references the right brand.</Bullet>
            <Bullet>Name output files by client and creator so nothing gets crossed.</Bullet>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">What belongs in an agency influencer contract</h2>
          <p className="mt-4 text-muted-foreground">
            The clauses that change most per creator — and that you will want as placeholders:
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            <Bullet>Parties (agency/brand and creator)</Bullet>
            <Bullet>Deliverables (posts, stories, reels, usage)</Bullet>
            <Bullet>Posting dates and exclusivity window</Bullet>
            <Bullet>Compensation, payment terms, and kill fee</Bullet>
            <Bullet>Usage and whitelisting rights</Bullet>
            <Bullet>FTC / ASA disclosure language</Bullet>
          </ul>
          <p className="mt-6 text-muted-foreground">
            For a full breakdown of what to include, see our{" "}
            <Link to="/influencer-contract-templates" className="font-medium text-primary underline-offset-4 hover:underline">
              influencer contract templates
            </Link>{" "}
            guide.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Why agencies switch from manual Word</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Hours back per campaign — generate a 50-creator batch in minutes, not an afternoon.</Bullet>
            <Bullet>Fewer errors — no copy-paste typos reaching signed documents.</Bullet>
            <Bullet>Consistency — every creator gets the current clause set, not last month's copy.</Bullet>
            <Bullet>Your template, untouched — the tool fills placeholders, it never rewrites your legal text.</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Run your next campaign in a batch</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your agreement, load your roster, download every contract. Free to try, no credit
            card required.
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

        <section className="border-t pt-8 text-muted-foreground">
          <p>
            New to this workflow? Start with{" "}
            <Link to="/guides/generate-contracts-from-excel" className="font-medium text-primary underline-offset-4 hover:underline">
              how to generate contracts from an Excel sheet
            </Link>
            .
          </p>
        </section>
      </article>

      <MarketingFooter />
    </main>
  );
}
```

- [ ] **Step 2: Static check**

```bash
cd /Users/alantoulouse/Desktop/Contratos
grep -c 'createFileRoute("/use-cases/influencer-contracts-for-agencies")\|const FAQS = \[\|FAQPage' src/routes/use-cases/influencer-contracts-for-agencies.tsx
```
Expected: `3`.

- [ ] **Step 3: Commit**

```bash
git add src/routes/use-cases/influencer-contracts-for-agencies.tsx
git commit -m "feat(seo): add /use-cases/influencer-contracts-for-agencies"
```

---

## Task 4: Sitemap + reciprocal internal link

**Files:**
- Modify: `src/routes/sitemap[.]xml.ts`
- Modify: `src/routes/influencer-contract-templates.tsx`

- [ ] **Step 1: Read the current sitemap `entries` array**

```bash
cd /Users/alantoulouse/Desktop/Contratos
sed -n '1,40p' "src/routes/sitemap[.]xml.ts"
```
Note the exact current contents of the `entries: SitemapEntry[] = [ ... ]` array (it may or may not already include `/`, depending on whether the homepage plan merged).

- [ ] **Step 2: Add the two new entries to that array**

Append these two lines inside the `entries` array (keep whatever entries are already there):
```ts
          { path: "/use-cases/influencer-contracts-for-agencies", changefreq: "monthly", priority: "0.8", lastmod: LAST_MODIFIED },
          { path: "/guides/generate-contracts-from-excel", changefreq: "monthly", priority: "0.7", lastmod: LAST_MODIFIED },
```

- [ ] **Step 3: Add a reciprocal internal link on the influencer page**

In `src/routes/influencer-contract-templates.tsx`, find the closing of the FAQ section's `</section>` just before the `<footer`. Immediately before `<footer className="border-t">`, insert this section (closes the internal-linking loop: influencer → agencies):

```tsx
        <section className="border-t pt-8 text-muted-foreground">
          <p>
            Running campaigns at scale? See{" "}
            <Link to="/use-cases/influencer-contracts-for-agencies" className="font-medium text-primary underline-offset-4 hover:underline">
              influencer contracts for agencies
            </Link>
            .
          </p>
        </section>
```

Note: `Link` is already imported in that file — no import change needed.

- [ ] **Step 4: Static check**

```bash
cd /Users/alantoulouse/Desktop/Contratos
grep -c 'use-cases/influencer-contracts-for-agencies\|guides/generate-contracts-from-excel' "src/routes/sitemap[.]xml.ts"
grep -c 'use-cases/influencer-contracts-for-agencies' src/routes/influencer-contract-templates.tsx
```
Expected: first `2` (both new URLs in sitemap), second `1` (reciprocal link added).

- [ ] **Step 5: Commit**

```bash
git add "src/routes/sitemap[.]xml.ts" src/routes/influencer-contract-templates.tsx
git commit -m "feat(seo): add cluster pages to sitemap + reciprocal internal link"
```

---

## Task 5: Push, open PR, verify on the Lovable preview

- [ ] **Step 1: Push**

```bash
git push -u origin seo/content-cluster
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --repo Alan7799DE/Influencer-Contracts --base main --head seo/content-cluster \
  --title "feat(seo): content cluster — Excel guide + agencies use-case" \
  --body "Implements docs/superpowers/plans/2026-06-28-seo-content-cluster.md. Adds two server-rendered marketing pages (/guides/generate-contracts-from-excel and /use-cases/influencer-contracts-for-agencies) built on a new shared src/components/marketing.tsx module, wires them into the sitemap, and adds reciprocal internal links. Each page's FAQ schema renders 1:1 from its visible FAQ."
```

- [ ] **Step 3: Confirm the Lovable preview builds clean**

Watch the Lovable preview for build/TypeScript errors. The most likely failure is the new nested route folders (`guides/`, `use-cases/`) not being picked up by the route generator — if so, confirm the generated `src/routeTree.gen.ts` includes the new routes (the TanStack router plugin regenerates it on build). Fix and re-push if needed; do not proceed until it builds.

- [ ] **Step 4: Post-deploy `curl` assertions** (replace `<URL>` with the preview or, after merge, `https://easycontracts.site`)

```bash
curl -sL --max-time 20 "<URL>/guides/generate-contracts-from-excel" | grep -o '<title>[^<]*</title>'
curl -sL --max-time 20 "<URL>/guides/generate-contracts-from-excel" | grep -o '"@type":"FAQPage"'
curl -sL --max-time 20 "<URL>/use-cases/influencer-contracts-for-agencies" | grep -o '<title>[^<]*</title>'
curl -sL --max-time 20 "<URL>/use-cases/influencer-contracts-for-agencies" | grep -o 'Influencer contracts for agencies'
curl -sL --max-time 20 "<URL>/sitemap.xml" | grep -o '<loc>https://easycontracts.site/use-cases/influencer-contracts-for-agencies</loc>'
curl -sL --max-time 20 "<URL>/sitemap.xml" | grep -o '<loc>https://easycontracts.site/guides/generate-contracts-from-excel</loc>'
```
Expected: every command returns a match (proves both pages are server-rendered with title + FAQ schema + H1 and both are in the sitemap).

---

## Self-Review

**Spec / scope coverage:**
- Article "generate from Excel" with full copy → Task 2 ✔
- Use-case "influencer contracts for agencies" with full copy → Task 3 ✔
- `/guides` + `/use-cases` route structure → Tasks 2 & 3 file paths ✔
- DRY shared primitives → Task 1 (`marketing.tsx`) ✔
- FAQ schema 1:1 with visible FAQ (audit lesson) → each page renders both from a single `FAQS` array ✔
- Internal linking (audit Fail) → guide ↔ agencies ↔ influencer reciprocal links (Tasks 2, 3, 4) ✔
- Sitemap entries for both new URLs → Task 4 ✔
- Anti-doorway: each page is differentiated, substantive prose (~700-900 words), not a spun template ✔
- Verification without a test runner → Task 5 ✔

**Placeholder scan:** No TBD/TODO. All page copy is final. `<URL>` in Task 5 is an intentional fill-in (preview URL unknown until build), with explicit instructions.

**Type consistency:** Shared components signatures — `Stat({icon,value,label})`, `Step({icon,number,title,body})`, `Bullet({children})`, `Faq({q,a})`, `MarketingHeader()`, `MarketingFooter()` — match every call site in Tasks 2 and 3. Both pages import only the primitives they use (guide: Step/Bullet/Faq + Header/Footer; agencies: Stat/Bullet/Faq + Header/Footer). `FAQS` items are `{q,a}` everywhere.

**Cross-plan consistency:** Task 4 reads the sitemap before editing so it composes with the homepage plan's sitemap changes regardless of merge order.
