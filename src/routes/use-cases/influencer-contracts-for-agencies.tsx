import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Users, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Stat, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";

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

      <RelatedArticles currentPath="/use-cases/influencer-contracts-for-agencies" />
      <MarketingFooter />
    </main>
  );
}
