import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";
import { articleSchema } from "@/lib/seo";

const CANONICAL = "https://easycontracts.site/guides/add-placeholders-to-word-template";
const TITLE = "How to Add Placeholders to a Word Template";
const DESCRIPTION =
  "Mark up a Word (.docx) document with {{placeholders}} so the parts that change — names, fees, dates — get filled in automatically. A simple, reliable convention that scales.";

const FAQS = [
  {
    q: "What should a placeholder look like?",
    a: "Wrap the field name in double curly braces with no spaces, like {{client_name}} or {{fee}}. Use lowercase and underscores so the names stay consistent and easy to map to spreadsheet columns.",
  },
  {
    q: "Will placeholders break my formatting?",
    a: "No. A placeholder is just text — it keeps the font, size, and style of the surrounding paragraph. When it's filled in, the value inherits that same formatting.",
  },
  {
    q: "Can I reuse the same placeholder twice?",
    a: "Yes. If {{client_name}} appears five times in the document, all five are filled with the same value, so you only provide it once.",
  },
];

export const Route = createFileRoute("/guides/add-placeholders-to-word-template")({
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
        children: JSON.stringify(
          articleSchema({ headline: TITLE, description: DESCRIPTION, canonical: CANONICAL }),
        ),
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
  component: Page,
});

function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 5 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Adding placeholders to a Word template
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A placeholder is a marker you drop into a document wherever something changes from one copy
          to the next — a name, a fee, a date. Set them up once and a generator can fill them in for
          every contract you produce. Here's the convention that keeps it simple and reliable.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/auth">Try it free</Link>
          </Button>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-8 pb-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Step 1 — Spot what changes</h2>
          <p className="mt-4 text-muted-foreground">
            Open your document and read it as if you were about to send it to two different people.
            Anything you'd have to retype — the counterparty's name, the amount, the start date, the
            deliverables — is a placeholder. Everything else (your clauses, your formatting) stays put.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Step 2 — Replace it with {`{{double_braces}}`}</h2>
          <p className="mt-4 text-muted-foreground">
            Type the field name in double curly braces, no spaces, lowercase with underscores. The
            braces are what a generator looks for, and the consistent naming makes mapping to a
            spreadsheet automatic.
          </p>
          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{client_name}}`}</span>{" "}
              and{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{creator_name}}`}</span>.
            </p>
            <p className="mt-3">
              Fee:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{fee}}`}</span>{" "}
              · Posts due:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{posting_date}}`}</span>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Naming conventions that save you trouble</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Use lowercase and underscores: {`{{client_name}}`}, not {`{{Client Name}}`}.</Bullet>
            <Bullet>Be specific: {`{{posting_date}}`} beats {`{{date}}`} when there are several dates.</Bullet>
            <Bullet>Keep names consistent with your spreadsheet headers so they map themselves.</Bullet>
            <Bullet>Reuse the same placeholder anywhere the same value should appear.</Bullet>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Step 3 — Fill them automatically</h2>
          <p className="mt-4 text-muted-foreground">
            With placeholders in place, you no longer edit the document by hand. Pair the template with
            a spreadsheet — one row per contract — and{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              generate contracts from Excel
            </Link>
            , or read the bigger picture in{" "}
            <Link
              to="/guides/personalize-contracts-automatically"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              personalize a contract for each person automatically
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Upload your placeholder template</h2>
          <p className="mt-3 text-muted-foreground">
            Bring your marked-up .docx, map the placeholders to your columns, and download a ZIP of
            finished documents. Free to try, no credit card required.
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
      </article>

      <RelatedArticles currentPath="/guides/add-placeholders-to-word-template" />
      <MarketingFooter />
    </main>
  );
}
