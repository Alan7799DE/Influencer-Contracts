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
