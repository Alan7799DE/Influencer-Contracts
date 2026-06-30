import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Table, Wand2, FolderArchive } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Step, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";

const CANONICAL = "https://easycontracts.site/guides/personalize-contracts-automatically";
const TITLE = "How to Personalize a Contract for Each Person Automatically";
const DESCRIPTION =
  "Stop editing one document at a time. Keep a single template, list everyone in a spreadsheet, and generate a personalized contract for each person automatically — in one batch.";

const FAQS = [
  {
    q: "What do I need to personalize contracts automatically?",
    a: "Two things: a Word (.docx) template with placeholders for the parts that change, and a spreadsheet (Excel or CSV) with one row per person and a column for each placeholder.",
  },
  {
    q: "Do all the contracts have to be identical?",
    a: "The clauses stay the same; the details differ per row. Each person gets the same agreement with their own name, fee, dates, and deliverables filled in.",
  },
  {
    q: "How do I get separate files instead of one big document?",
    a: "A dedicated generator outputs one personalized .docx per row and names each file from a column you choose, so you get a clean, labeled file per person — not a single merged document.",
  },
];

export const Route = createFileRoute("/guides/personalize-contracts-automatically")({
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
  component: Page,
});

function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 6 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Personalize a contract for each person automatically
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          When you send the same agreement to ten, fifty, or two hundred people, editing a Word file
          one at a time doesn't scale — and every manual copy is a chance to paste the wrong name or
          fee into a signed document. The fix is to separate the document that stays the same from the
          data that changes, and let a tool combine them. Here's how.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/auth">Try it free</Link>
          </Button>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-8 pb-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">The idea: template + data, kept apart</h2>
          <p className="mt-4 text-muted-foreground">
            One Word template holds your fixed text with placeholders for the variable parts. One
            spreadsheet holds the variable parts — a row per person, a column per placeholder. Combine
            them and you get a personalized document for everyone on the list, without touching the
            template again.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">How it works, step by step</h2>
          <ol className="mt-6 space-y-6">
            <Step
              icon={<FileText className="size-5" />}
              number={1}
              title="Prepare the template"
              body="Add {{placeholders}} to your .docx wherever a value changes per person — name, fee, dates, deliverables."
            />
            <Step
              icon={<Table className="size-5" />}
              number={2}
              title="List everyone in a spreadsheet"
              body="One row per person; one column per placeholder. The header names line up with your placeholders."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map and preview"
              body="Match each placeholder to a column and preview a real document from the first row before generating."
            />
            <Step
              icon={<FolderArchive className="size-5" />}
              number={4}
              title="Generate the batch"
              body="Download one personalized, correctly named .docx per row, bundled in a single ZIP."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Why this beats editing by hand</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Minutes for a whole batch instead of an afternoon of copy-paste.</Bullet>
            <Bullet>One clean file per person, named automatically — not a single merged document.</Bullet>
            <Bullet>No typos slipping into signed contracts.</Bullet>
            <Bullet>Reuse the template next time — just swap in a new spreadsheet.</Bullet>
          </ul>
          <p className="mt-6 text-muted-foreground">
            For the hands-on version with a spreadsheet, see{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              how to generate contracts from Excel
            </Link>
            . If you haven't set up the template yet, start with{" "}
            <Link
              to="/guides/add-placeholders-to-word-template"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              adding placeholders to a Word template
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Personalize your first batch</h2>
          <p className="mt-3 text-muted-foreground">
            Upload a template, load your list, and download a personalized contract for everyone. Free
            to try, no credit card required.
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

      <RelatedArticles currentPath="/guides/personalize-contracts-automatically" />
      <MarketingFooter />
    </main>
  );
}
