import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";

const CANONICAL =
  "https://easycontracts.site/compare/easy-contracts-vs-docupilot-documint-portant";
const TITLE = "Easy Contracts vs. Docupilot, Documint & Portant";
const DESCRIPTION =
  "Comparing bulk document generators? See how Easy Contracts, Docupilot, Documint, and Portant differ — and which is the simplest way to turn a Word template and an Excel file into contracts.";

const FAQS = [
  {
    q: "What do these tools have in common?",
    a: "All of them generate documents from a template plus data instead of editing files by hand. They differ in their inputs, their setup effort, and what they're optimized for.",
  },
  {
    q: "Which is best for contracts from a Word template and Excel?",
    a: "Easy Contracts is purpose-built for exactly that: upload a .docx template with placeholders and an Excel/CSV file, map the columns, and download one named .docx per row in a ZIP — no integrations or setup required.",
  },
  {
    q: "Do I have to change my document to switch tools?",
    a: "With Easy Contracts you keep your existing Word document and clauses; you only add placeholders for the parts that change. Your formatting and legal text stay exactly as they are.",
  },
];

export const Route = createFileRoute("/compare/easy-contracts-vs-docupilot-documint-portant")({
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
        <p className="text-sm font-medium text-primary">Comparison · 6 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Easy Contracts vs. Docupilot, Documint &amp; Portant
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          All four tools exist to do the same thing in spirit — produce many documents from a
          template and data instead of editing files one by one. Where they differ is the input they
          expect, how much setup they need, and what they're tuned for. Here's a fair look to help you
          pick, with a focus on generating contracts from a Word template and a spreadsheet.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/auth">Try Easy Contracts free</Link>
          </Button>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-8 pb-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">The short version</h2>
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border p-6">
              <h3 className="text-lg font-semibold">Easy Contracts</h3>
              <p className="mt-2 text-muted-foreground">
                Purpose-built for bulk contracts from a Word template plus an Excel/CSV file. No
                integrations, no automation setup — upload, map columns, download a ZIP with one named
                .docx per row. Best when your data already lives in a spreadsheet and you want finished
                Word documents fast.
              </p>
            </div>
            <div className="rounded-xl border p-6">
              <h3 className="text-lg font-semibold">Docupilot</h3>
              <p className="mt-2 text-muted-foreground">
                A document-automation platform aimed at connecting your apps — it leans on integrations
                and workflows to generate documents from data in other systems. Powerful if you want
                automation pipelines; more to set up if you just have a spreadsheet.
              </p>
            </div>
            <div className="rounded-xl border p-6">
              <h3 className="text-lg font-semibold">Documint</h3>
              <p className="mt-2 text-muted-foreground">
                Focused on templated, often API- and integration-driven document generation. A good
                fit for developers and teams wiring generation into an existing product or workflow.
              </p>
            </div>
            <div className="rounded-xl border p-6">
              <h3 className="text-lg font-semibold">Portant</h3>
              <p className="mt-2 text-muted-foreground">
                Built around the Google Workspace world — Google Docs and Sheets. Convenient if your
                templates and data already live in Google; less natural if your contract is a Word
                .docx.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Features and pricing for each tool change over time — check each vendor's site for the
            current details before deciding.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">How to choose</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Your data is in Excel/CSV and your template is a Word .docx → Easy Contracts.</Bullet>
            <Bullet>You want documents generated automatically from other apps → an automation platform like Docupilot.</Bullet>
            <Bullet>You're a developer wiring generation into a product → an API-first tool like Documint.</Bullet>
            <Bullet>You live entirely in Google Docs and Sheets → Portant.</Bullet>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Where Easy Contracts is the simplest path</h2>
          <p className="mt-4 text-muted-foreground">
            If you don't want to build workflows or write code and your contract is already a Word
            document, Easy Contracts is the shortest route from a spreadsheet to finished, individually
            named contracts. See exactly how in{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              generate contracts from Excel
            </Link>
            , or weigh the broader options in{" "}
            <Link
              to="/guides/generate-documents-in-bulk"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              best ways to generate documents in bulk
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">See it on your own template</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your Word template and an Excel file and generate a batch in minutes. Free to try,
            no credit card required.
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

      <RelatedArticles currentPath="/compare/easy-contracts-vs-docupilot-documint-portant" />
      <MarketingFooter />
    </main>
  );
}
