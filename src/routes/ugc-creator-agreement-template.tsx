import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, FileText, Wand2, Download, Video, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Stat, Step, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";
import { articleSchema } from "@/lib/seo";

const CANONICAL = "https://easycontracts.site/ugc-creator-agreement-template";
const TITLE = "UGC Creator Agreement Template · Generate in Bulk";
const DESCRIPTION =
  "A reusable UGC creator agreement template plus a spreadsheet of creators: generate a personalized contract for each — with usage rights, whitelisting, and content ownership built in.";

const CLAUSES = [
  { k: "The parties", v: "Legal names of the brand and the UGC creator, plus contact details." },
  { k: "Content deliverables", v: "Number of videos or photos, format, aspect ratios, and technical specs the brand needs." },
  { k: "Usage rights & licensing", v: "Where the brand may use the content — organic social, paid ads, website — and for how long." },
  { k: "Whitelisting / paid amplification", v: "Whether the brand can run the content as ads from the creator's own handle (Spark Ads, Partnership Ads)." },
  { k: "Content ownership & IP", v: "Who owns the raw files and edited content, and when the license or ownership transfers." },
  { k: "Exclusivity", v: "Whether the creator can make content for competing brands, and for how long." },
  { k: "Revisions", v: "How many rounds of edits are included and what counts as additional, billable work." },
  { k: "Payment & timeline", v: "Flat fee or per-asset rate, currency, payment schedule, and delivery dates." },
  { k: "Disclosure", v: "If the creator also posts the content, the FTC disclosure language that applies." },
  { k: "Term & termination", v: "How long the agreement runs and how either side can end it." },
];

const FAQS = [
  {
    q: "What's the difference between a UGC agreement and an influencer contract?",
    a: "A UGC creator produces content for the brand to use on the brand's own channels and ads — the emphasis is on usage rights, whitelisting, and content ownership. An influencer is usually paid to post on their own audience, so their contract emphasizes deliverables and reach. Many brands use both, with a separate template for each.",
  },
  {
    q: "Can one template cover every creator?",
    a: "Yes. Keep the legal clauses fixed in a single Word template and turn the parts that change per creator (name, fee, deliverables, usage term) into placeholders you fill from a spreadsheet.",
  },
  {
    q: "How do I generate agreements for a batch of creators at once?",
    a: "Upload your .docx template, add an Excel or CSV file with one row per creator, map the columns to your placeholders, and download a ZIP with one personalized agreement per row.",
  },
  {
    q: "What's the clause creators and brands most often get wrong?",
    a: "Usage rights. Brands frequently assume they can run UGC as paid ads indefinitely; unless the agreement grants that license explicitly — including the channels and the duration — they can't. Spell it out.",
  },
];

export const Route = createFileRoute("/ugc-creator-agreement-template")({
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
  component: UgcCreatorAgreementTemplatePage,
});

function UgcCreatorAgreementTemplatePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 7 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          One UGC agreement, personalized for every creator
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          User-generated content works because it scales — but the paperwork behind it usually
          doesn't. If you're briefing ten, fifty, or a hundred UGC creators, you shouldn't be
          rewriting the same agreement each time. Keep one solid template with your usage rights and
          licensing baked in, list the creators in a spreadsheet, and generate a personalized
          contract for each in a single batch.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/auth">Try it free</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 sm:grid-cols-3">
          <Stat icon={<Clock className="size-5" />} label="Saved per creator batch" value="Hours" />
          <Stat icon={<Users className="size-5" />} label="Agreements per upload" value="Unlimited" />
          <Stat icon={<Video className="size-5" />} label="Your usage terms, intact" value="100%" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">
            UGC agreement vs. influencer contract
          </h2>
          <p className="mt-4 text-muted-foreground">
            They look similar, but they protect different things. A UGC creator makes content for the
            brand to run on its <em>own</em> channels and ads, so the agreement lives or dies on
            usage rights, whitelisting, and who owns the footage. An influencer is usually paid to
            post to their <em>own</em> audience, so their contract leans on deliverables and reach. If
            you run both, keep a separate template for each — and see{" "}
            <Link
              to="/influencer-contract-templates"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              influencer contract templates
            </Link>{" "}
            for that side.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">What a UGC creator agreement should cover</h2>
          <p className="mt-4 text-muted-foreground">
            Settle these once in your template and every creator gets consistent, defensible terms.
          </p>
          <dl className="mt-6 space-y-5">
            {CLAUSES.map((c) => (
              <div key={c.k} className="border-l-2 border-primary/30 pl-4">
                <dt className="font-semibold">{c.k}</dt>
                <dd className="mt-1 text-muted-foreground">{c.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-muted-foreground">
            Usage rights are the clause worth getting exactly right — the depth of it is covered in{" "}
            <Link
              to="/guides/what-to-include-in-an-influencer-contract"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              what to include in a contract
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Turn the changing parts into placeholders</h2>
          <p className="mt-4 text-muted-foreground">
            Keep the legal text fixed and replace only the fields that change per creator with
            placeholders in double braces.
          </p>
          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This Content Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{brand_name}}`}</span>{" "}
              and{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{creator_name}}`}</span>.
            </p>
            <p className="mt-3">
              Deliverables:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{deliverables}}`}</span>{" "}
              · Usage term:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{usage_term}}`}</span>
            </p>
          </div>
          <p className="mt-6 text-muted-foreground">
            The full convention is in{" "}
            <Link
              to="/guides/add-placeholders-to-word-template"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              how to add placeholders to a Word template
            </Link>
            .
          </p>
        </section>

        <section id="how-it-works">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-6 space-y-6">
            <Step
              icon={<Upload className="size-5" />}
              number={1}
              title="Upload your agreement template"
              body="Bring your existing .docx with {{variable}} placeholders for the parts that change per creator."
            />
            <Step
              icon={<FileText className="size-5" />}
              number={2}
              title="Add a spreadsheet of creators"
              body="One row per creator — name, deliverables, fee, and usage term become the data that fills your template."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map columns to placeholders"
              body="Match each {{variable}} to a column and preview a real agreement before generating the batch."
            />
            <Step
              icon={<Download className="size-5" />}
              number={4}
              title="Download the ZIP"
              body="One personalized, correctly named agreement per creator — ready to send for signature."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Who generates UGC agreements in bulk</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Brands running always-on UGC programs with a rotating roster of creators.</Bullet>
            <Bullet>Agencies sourcing content for multiple clients at once.</Bullet>
            <Bullet>UGC platforms and marketplaces issuing the same terms to every creator.</Bullet>
            <Bullet>Performance teams that need paid-ads usage rights locked down before spending.</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Generate your UGC agreements</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your template once, load your creator list, and download every agreement in a ZIP.
            Free to try, no credit card required.
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
            Sending the same agreement to a whole roster? See the step-by-step for{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              generating contracts from an Excel sheet
            </Link>
            .
          </p>
        </section>
      </article>

      <RelatedArticles currentPath="/ugc-creator-agreement-template" />
      <MarketingFooter />
    </main>
  );
}
