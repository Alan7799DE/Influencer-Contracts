import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";

const CANONICAL = "https://easycontracts.site/guides/what-to-include-in-an-influencer-contract";
const TITLE = "What to Include in an Influencer Contract (Checklist)";
const DESCRIPTION =
  "The clauses every influencer contract needs — parties, deliverables, payment, usage rights, exclusivity, and disclosure — with a copy-ready checklist you can turn into a template.";

const CHECKLIST = [
  { k: "The parties", v: "Legal names of the brand (or agency) and the creator, plus contact details." },
  { k: "Scope of work / deliverables", v: "Exactly what the creator will produce: number of posts, stories, reels, videos, and the platforms." },
  { k: "Timeline", v: "Draft, approval, posting, and campaign-end dates — and who signs off before anything goes live." },
  { k: "Compensation", v: "Fee, currency, payment schedule, and whether product or commission is included." },
  { k: "Usage & licensing rights", v: "Where and for how long the brand can reuse the content (organic, paid/whitelisting, ads)." },
  { k: "Exclusivity", v: "Whether the creator can work with competing brands, and for how long." },
  { k: "Disclosure & compliance", v: "Required FTC / ASA disclosure language so posts are properly marked as ads." },
  { k: "Approvals & revisions", v: "How many rounds of edits are included and the turnaround for feedback." },
  { k: "Ownership & IP", v: "Who owns the raw files and the final content after the campaign." },
  { k: "Termination & kill fee", v: "How either side can exit, and what's owed if the campaign is cancelled." },
];

const FAQS = [
  {
    q: "Do I need a lawyer to write an influencer contract?",
    a: "For a standard campaign you can start from a solid template that covers the clauses below, but you should always have your template reviewed by a lawyer in your jurisdiction before using it at scale.",
  },
  {
    q: "What's the most overlooked clause?",
    a: "Usage rights. Brands often assume they can run a creator's post as a paid ad indefinitely; unless the contract grants that license explicitly, they can't. Spell out the channels and the duration.",
  },
  {
    q: "Can one template cover every creator?",
    a: "Yes — keep the clauses fixed in your Word template and turn the parts that change per creator (name, fee, deliverables, dates) into placeholders you fill from a spreadsheet.",
  },
];

export const Route = createFileRoute("/guides/what-to-include-in-an-influencer-contract")({
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
        <p className="text-sm font-medium text-primary">Guide · 8 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          What to include in an influencer contract
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A good influencer contract protects both sides and removes the back-and-forth: the creator
          knows exactly what to deliver and when they'll be paid, and the brand knows what it can do
          with the content. Below is the full list of clauses worth including, followed by a
          copy-ready checklist you can turn into a reusable template.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/auth">Build your template free</Link>
          </Button>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-8 pb-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">The clauses that matter</h2>
          <p className="mt-4 text-muted-foreground">
            Every campaign is different, but almost all influencer agreements share the same backbone.
            Work through each of these and you'll have a contract that holds up.
          </p>
          <dl className="mt-6 space-y-5">
            {CHECKLIST.map((c) => (
              <div key={c.k} className="border-l-2 border-primary/30 pl-4">
                <dt className="font-semibold">{c.k}</dt>
                <dd className="mt-1 text-muted-foreground">{c.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Copy-ready checklist</h2>
          <p className="mt-4 text-muted-foreground">
            Use this as your section list when you build the template. If a campaign doesn't need a
            clause, leave it out — but decide on purpose, don't forget it.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            {CHECKLIST.map((c) => (
              <Bullet key={c.k}>{c.k}</Bullet>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">From checklist to a reusable template</h2>
          <p className="mt-4 text-muted-foreground">
            Once you've settled the clauses, you don't want to rewrite them for every creator. Keep
            the legal text fixed in a single Word template and turn only the variable parts — the
            name, fee, deliverables, and dates — into placeholders. Then you can{" "}
            <Link
              to="/guides/personalize-contracts-automatically"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              personalize a contract for each creator automatically
            </Link>{" "}
            from a spreadsheet, instead of editing documents one by one. New to placeholders? Start
            with{" "}
            <Link
              to="/guides/add-placeholders-to-word-template"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              how to add placeholders to a Word template
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Turn your checklist into contracts</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your finished template, load your roster, and generate a personalized contract for
            every creator. Free to try, no credit card required.
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

      <RelatedArticles currentPath="/guides/what-to-include-in-an-influencer-contract" />
      <MarketingFooter />
    </main>
  );
}
