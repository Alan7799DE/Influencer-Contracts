import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";
import { articleSchema } from "@/lib/seo";

const CANONICAL = "https://easycontracts.site/guides/generate-documents-in-bulk";
const TITLE = "Best Ways to Generate Documents in Bulk (2026)";
const DESCRIPTION =
  "Generating many documents from one template? Compare the realistic approaches — manual copies, scripting, and a dedicated generator — and pick the one that fits how often you do it.";

const APPROACHES = [
  {
    name: "Manual copies",
    good: "Fine for two or three one-off documents.",
    bad: "Doesn't scale: every copy is hand-edited, slow, and one wrong paste reaches a signed document.",
  },
  {
    name: "Scripting it yourself",
    good: "Flexible and free if you already write code.",
    bad: "Setup and maintenance cost; overkill unless you're technical and do it constantly.",
  },
  {
    name: "A dedicated document generator",
    good: "Built for the job: template + spreadsheet in, one named file per row out, formatting preserved.",
    bad: "Another tool to adopt — but no code, and it pays off the moment you generate more than a handful.",
  },
];

const FAQS = [
  {
    q: "What's the fastest way to make many documents from one template?",
    a: "Keep the document as a template with placeholders, put the variable data in a spreadsheet, and use a generator that outputs one personalized file per row. It's faster than manual copies and needs no code.",
  },
  {
    q: "What file types can I generate in bulk?",
    a: "With Easy Contracts you bring a Word (.docx) template and an Excel/CSV data file, and download finished .docx files in a ZIP — contracts, agreements, offer letters, NDAs, and similar documents.",
  },
  {
    q: "How many documents can I generate at once?",
    a: "As many as you have rows in your spreadsheet — generate hundreds of personalized documents in a single batch.",
  },
];

export const Route = createFileRoute("/guides/generate-documents-in-bulk")({
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
        <p className="text-sm font-medium text-primary">Guide · 7 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          The best ways to generate documents in bulk
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          If you produce the same document for many people — contracts, agreements, offer letters,
          NDAs — there are a few realistic ways to do it. They differ mostly in how much time they
          cost up front versus how well they scale. Here's an honest look at each, and how to choose.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/auth">Try the easy way free</Link>
          </Button>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-8 pb-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">The three approaches</h2>
          <div className="mt-6 space-y-6">
            {APPROACHES.map((a) => (
              <div key={a.name} className="rounded-xl border p-6">
                <h3 className="text-lg font-semibold">{a.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Works when:</span> {a.good}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Watch out:</span> {a.bad}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">How to choose</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Doing it once or twice ever? Manual copies are fine.</Bullet>
            <Bullet>Technical and doing it constantly with custom logic? A script can pay off.</Bullet>
            <Bullet>Doing it regularly without wanting to write code? A dedicated generator wins.</Bullet>
          </ul>
          <p className="mt-6 text-muted-foreground">
            For most teams, the third option is the sweet spot: you keep your own template, your
            formatting is preserved, and you get one clean file per person. That's exactly how Easy
            Contracts works — see{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              generate contracts from Excel
            </Link>{" "}
            for the step-by-step, or compare the tools in{" "}
            <Link
              to="/compare/easy-contracts-vs-docupilot-documint-portant"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Easy Contracts vs. Docupilot, Documint &amp; Portant
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Generate your first batch</h2>
          <p className="mt-3 text-muted-foreground">
            Upload a template and a spreadsheet, and download every document in a ZIP. Free to try, no
            credit card required.
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

      <RelatedArticles currentPath="/guides/generate-documents-in-bulk" />
      <MarketingFooter />
    </main>
  );
}
