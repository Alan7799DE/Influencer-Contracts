import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  FileText,
  FileSpreadsheet,
  Upload,
  Wand2,
  Download,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Check,
  FolderArchive,
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
    <main className="landing min-h-screen">
      {/* ───────────────────────── Nav ───────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <FileText className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Easy Contracts</span>
          </Link>
          <nav className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              How it works
            </a>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link to="/auth">Start free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <p className="eyebrow reveal inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-muted-foreground">
              <span className="mono">.docx</span>
              <span aria-hidden>+</span>
              <span className="mono">.xlsx</span>
              <ArrowRight className="size-3" aria-hidden />
              <span className="mono">.zip</span>
            </p>
            <h1
              className="reveal mt-6 text-5xl leading-[1.02] sm:text-6xl"
              style={{ animationDelay: "0.06s" }}
            >
              Hundreds of contracts,
              <br />
              <span className="italic text-primary">generated</span> from one template.
            </h1>
            <p
              className="reveal mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "0.12s" }}
            >
              Stop duplicating Word files and find-replacing names. Upload your template once, load a
              spreadsheet with your data, and download a ZIP with every personalized contract — ready
              to send.
            </p>
            <div
              className="reveal mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.18s" }}
            >
              <Button asChild size="lg" className="rounded-full px-7 text-base">
                <Link to="/auth">
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full px-6 text-base hover:bg-secondary"
              >
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
            <ul
              className="reveal mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
              style={{ animationDelay: "0.24s" }}
            >
              {["Free to try", "No credit card", "Keeps your formatting"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-primary" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Transformation visual: template + data → generate → ZIP of docs */}
          <div className="reveal" style={{ animationDelay: "0.16s" }}>
            <TransformVisual />
          </div>
        </div>
      </section>

      {/* ───────────────────────── Stat band ───────────────────────── */}
      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Stat value="10+ hrs" label="Saved per batch" icon={<Clock className="size-4" />} />
          <Stat value="Unlimited" label="Contracts per upload" icon={<Users className="size-4" />} />
          <Stat value="100%" label="Your template, untouched" icon={<ShieldCheck className="size-4" />} />
        </div>
      </section>

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
        <SectionHeading eyebrow="The workflow" title="Four steps, one ZIP" />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Upload className="size-5" />,
              title: "Upload your template",
              body: "Bring your existing .docx. Add {{variable}} placeholders wherever you'd normally hand-edit.",
            },
            {
              icon: <FileSpreadsheet className="size-5" />,
              title: "Load your Excel sheet",
              body: "One row per contract. Each column becomes data that fills your template.",
            },
            {
              icon: <Wand2 className="size-5" />,
              title: "Map & preview",
              body: "Match each placeholder to a column and preview a real contract before you generate.",
            },
            {
              icon: <Download className="size-5" />,
              title: "Download the ZIP",
              body: "Every contract personalized, named, and ready to send for signature.",
            },
          ].map((s, i) => (
            <Step key={s.title} number={i + 1} {...s} />
          ))}
        </div>
      </section>

      {/* ───────────────────────── Who it's for ───────────────────────── */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading eyebrow="Who it's for" title="Anyone sending the same contract, many times" align="left" />
              <p className="mt-6 max-w-md text-muted-foreground">
                A common use case is{" "}
                <Link
                  to="/influencer-contract-templates"
                  className="font-medium text-primary underline decoration-accent decoration-2 underline-offset-4 hover:decoration-primary"
                >
                  influencer contract templates
                </Link>{" "}
                — generating personalized agreements for a whole roster of creators at once.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Marketing agencies running campaigns at scale",
                "Freelancers and studios onboarding clients",
                "HR teams issuing offer letters and agreements",
                "Operations teams handling vendor or NDA batches",
              ].map((item) => (
                <li
                  key={item}
                  className="lift flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Why bulk beats by hand (ink panel) ───────────────────────── */}
      <section className="px-6 py-24">
        <div className="ink-panel mx-auto max-w-6xl overflow-hidden rounded-3xl px-8 py-16 sm:px-14">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-primary">By hand vs. in bulk</p>
              <h2 className="mt-4 text-4xl leading-tight sm:text-[2.75rem]">
                One wrong paste shouldn't reach a signed contract.
              </h2>
              <p className="mt-6 text-[1.05rem] leading-relaxed text-muted-foreground">
                Manually duplicating a Word file for every contract is slow and error-prone. Mail
                merge helps with simple letters, but it mangles real contract formatting and hands
                you a single merged blob instead of one clean document per person.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "One personalized .docx per row — not a single merged blob.",
                "Your clauses and formatting stay exactly as you wrote them.",
                "No copy-paste typos reaching signed documents.",
                "Hours per batch back for actual work.",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center">
          <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />
          <h2 className="mx-auto max-w-2xl text-4xl leading-tight sm:text-5xl">
            Stop copy-pasting. <span className="italic text-primary">Start generating.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Upload your template once and generate every contract, for every batch. Free to try, no
            credit card required.
          </p>
          <div className="mt-9">
            <Button asChild size="lg" className="rounded-full px-8 text-base">
              <Link to="/auth">
                Create your free account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FAQ ───────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <dl className="mt-12 divide-y divide-border">
            {FAQS.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-lg font-semibold">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <FileText className="size-3.5" />
            </span>
            <span className="font-display font-semibold text-foreground">Easy Contracts</span>
            <span className="ml-2">© {new Date().getFullYear()}</span>
          </div>
          <Link to="/auth" className="font-medium transition-colors hover:text-foreground">
            Sign in
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* ───────────────────────── Pieces ───────────────────────── */

function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-4xl sm:text-[2.75rem]">{title}</h2>
    </div>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 px-2 py-8 sm:justify-center">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/40 text-accent-foreground">
        {icon}
      </span>
      <div>
        <p className="font-display text-2xl font-semibold leading-none">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  body,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative bg-card p-7 transition-colors hover:bg-secondary/50">
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="font-display text-5xl font-semibold text-border transition-colors group-hover:text-accent">
          {number}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function TransformVisual() {
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Template document */}
      <div className="doc float p-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <FileText className="size-4 text-primary" />
          <span className="mono text-xs text-muted-foreground">agreement-template.docx</span>
        </div>
        <div className="space-y-2.5 pt-4 text-sm leading-relaxed">
          <p>
            This Agreement is made between <span className="tok">{`{{client}}`}</span> and{" "}
            <span className="tok">{`{{creator}}`}</span>.
          </p>
          <div className="h-2 w-full rounded bg-muted" />
          <div className="h-2 w-4/5 rounded bg-muted" />
          <p className="pt-1">
            Fee <span className="tok">{`{{fee}}`}</span> · due{" "}
            <span className="tok">{`{{date}}`}</span>
          </p>
        </div>
      </div>

      {/* Spreadsheet feeding in */}
      <div className="doc mx-auto mt-4 flex items-center gap-3 p-3.5">
        <FileSpreadsheet className="size-4 shrink-0 text-primary" />
        <span className="mono text-xs text-muted-foreground">roster.xlsx</span>
        <div className="ml-auto flex gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-accent" />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">42 rows</span>
        </div>
      </div>

      {/* Generate connector */}
      <div className="my-4 flex items-center justify-center gap-2 text-muted-foreground">
        <span className="h-px w-10 step-rule" aria-hidden />
        <span className="eyebrow flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-foreground">
          <Wand2 className="size-3 text-primary" /> generate
        </span>
        <span className="h-px w-10 step-rule" aria-hidden />
      </div>

      {/* Output: fanned stack of generated docs + ZIP badge */}
      <div className="relative h-36">
        <div className="doc absolute inset-x-8 top-4 h-28 rotate-[-6deg]" aria-hidden />
        <div className="doc absolute inset-x-4 top-2 h-28 rotate-[3deg]" aria-hidden />
        <div className="doc lift absolute inset-x-0 top-0 flex h-28 flex-col justify-between p-4">
          <div className="flex items-center gap-2">
            <FolderArchive className="size-4 text-primary" />
            <span className="mono text-xs text-muted-foreground">contracts.zip</span>
            <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              42 files
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <FileText className="size-3 text-muted-foreground" />
              <span className="mono text-muted-foreground">ada-lovelace.docx</span>
              <Check className="ml-auto size-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <FileText className="size-3 text-muted-foreground" />
              <span className="mono text-muted-foreground">grace-hopper.docx</span>
              <Check className="ml-auto size-3.5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
