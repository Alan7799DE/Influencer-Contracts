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
