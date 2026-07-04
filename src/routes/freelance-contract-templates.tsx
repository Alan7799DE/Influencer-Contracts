import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, FileText, Wand2, Download, Briefcase, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Stat, Step, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";
import { articleSchema } from "@/lib/seo";

const CANONICAL = "https://easycontracts.site/freelance-contract-templates";
const TITLE = "Freelance Contract Template · Generate Them in Bulk";
const DESCRIPTION =
  "A reusable freelance contract template plus a spreadsheet of clients: generate a personalized agreement for every client in one batch, keeping your own clauses, rates, and scope.";

const CLAUSES = [
  { k: "The parties", v: "Legal names of the freelancer (or studio) and the client, plus contact details." },
  { k: "Scope of work", v: "Exactly what you'll deliver, in what format, and what's explicitly out of scope." },
  { k: "Timeline & milestones", v: "Start date, delivery dates, and any milestone-based checkpoints." },
  { k: "Fees & payment terms", v: "Rate, currency, deposit, invoicing schedule, and late-payment terms." },
  { k: "Revisions", v: "How many rounds are included and what counts as additional, billable work." },
  { k: "Intellectual property", v: "Who owns the work, and when ownership transfers (often on final payment)." },
  { k: "Confidentiality", v: "How each side handles the other's private information." },
  { k: "Termination & kill fee", v: "How either side can exit, notice period, and what's owed for work done." },
];

const FAQS = [
  {
    q: "Can one template cover every client?",
    a: "Yes — that's the point. Keep the clauses fixed in a single Word template and turn the parts that change per client (name, rate, scope, dates) into placeholders you fill from a spreadsheet.",
  },
  {
    q: "Do I need a lawyer to write a freelance contract?",
    a: "You can start from a solid template that covers the clauses below, but you should have it reviewed by a lawyer in your jurisdiction before relying on it — especially the IP and payment terms.",
  },
  {
    q: "How do I generate an agreement for many clients at once?",
    a: "Upload your .docx template, add an Excel or CSV file with one row per client, map the columns to your placeholders, and download a ZIP with one personalized contract per row.",
  },
  {
    q: "Will my formatting survive?",
    a: "Yes. Only the placeholders are replaced — your headings, styles, tables, and letterhead stay exactly as you set them.",
  },
];

export const Route = createFileRoute("/freelance-contract-templates")({
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
  component: FreelanceContractTemplatesPage,
});

function FreelanceContractTemplatesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 7 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          One freelance contract template, every client filled in
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Whether you're a solo freelancer sending agreements to a handful of clients or a studio
          onboarding a whole roster, you shouldn't be rewriting the same contract every time. Keep
          one solid template, list your clients in a spreadsheet, and generate a personalized
          agreement for each — with your clauses intact and only the details swapped.
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
          <Stat icon={<Clock className="size-5" />} label="Saved per onboarding batch" value="Hours" />
          <Stat icon={<Users className="size-5" />} label="Contracts per upload" value="Unlimited" />
          <Stat icon={<Briefcase className="size-5" />} label="Your terms, preserved" value="100%" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">What a freelance contract should cover</h2>
          <p className="mt-4 text-muted-foreground">
            Projects differ, but almost every freelance agreement shares the same backbone. Settle
            these once in your template and you won't have to think about them again.
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
            The clause freelancers most often get wrong is intellectual property: unless the contract
            says otherwise, spell out that ownership transfers only on final payment. When you're
            ready to build the template, our checklist for{" "}
            <Link
              to="/guides/what-to-include-in-an-influencer-contract"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              what to include in a contract
            </Link>{" "}
            translates almost line for line.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Turn the changing parts into placeholders</h2>
          <p className="mt-4 text-muted-foreground">
            Keep the legal text fixed and replace only the fields that change per client with
            placeholders in double braces.
          </p>
          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This Services Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{freelancer_name}}`}</span>{" "}
              and{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{client_name}}`}</span>.
            </p>
            <p className="mt-3">
              Fee:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{rate}}`}</span>{" "}
              · Delivery:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{delivery_date}}`}</span>
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
              title="Upload your contract template"
              body="Bring your existing .docx with {{variable}} placeholders for the parts that change per client."
            />
            <Step
              icon={<FileText className="size-5" />}
              number={2}
              title="Add a spreadsheet of clients"
              body="One row per client — name, rate, scope, and dates become the data that fills your template."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map columns to placeholders"
              body="Match each {{variable}} to a column and preview a real contract before generating the batch."
            />
            <Step
              icon={<Download className="size-5" />}
              number={4}
              title="Download the ZIP"
              body="One personalized, correctly named agreement per client — ready to send for signature."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Who generates freelance contracts in bulk</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Agencies and studios onboarding a roster of subcontractors at once.</Bullet>
            <Bullet>Marketplaces and platforms issuing the same agreement to many freelancers.</Bullet>
            <Bullet>Solo freelancers who send a fresh contract for every new client or project.</Bullet>
            <Bullet>Ops teams standardizing terms across a growing bench of contractors.</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Generate your freelance contracts</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your template once, load your client list, and download every agreement in a ZIP.
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
            Sending the same agreement to a whole list? See the step-by-step for{" "}
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

      <RelatedArticles currentPath="/freelance-contract-templates" />
      <MarketingFooter />
    </main>
  );
}
