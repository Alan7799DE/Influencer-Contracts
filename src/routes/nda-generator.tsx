import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, FileText, Wand2, Download, ShieldCheck, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Stat, Step, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";
import { articleSchema } from "@/lib/seo";

const CANONICAL = "https://easycontracts.site/nda-generator";
const TITLE = "Bulk NDA Generator · Create NDAs from a Spreadsheet";
const DESCRIPTION =
  "Need dozens of NDAs at once? Upload one Word NDA template, add a spreadsheet of signers, and generate a personalized non-disclosure agreement for each — downloaded as a ZIP.";

const FAQS = [
  {
    q: "Can I generate different NDAs for different signers?",
    a: "Yes. Keep one NDA template with placeholders for the parts that change — signer name, company, effective date, term — and one row per signer in your spreadsheet. Each row produces its own personalized NDA.",
  },
  {
    q: "Do I keep my own NDA wording?",
    a: "Completely. Easy Contracts only fills the placeholders; your clauses, definitions of confidential information, and governing law stay exactly as your lawyer wrote them.",
  },
  {
    q: "What if some signers are companies and others are individuals?",
    a: "Add a column for the signer type (or for the entity name) and reference it in your template. Because every field is just a placeholder mapped to a column, mixed batches work the same as uniform ones.",
  },
  {
    q: "Are the generated NDAs legally binding?",
    a: "The legal content is yours — Easy Contracts does not alter it. As with any contract, have your template reviewed by a lawyer in your jurisdiction before using it at scale.",
  },
];

export const Route = createFileRoute("/nda-generator")({
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
  component: NdaGeneratorPage,
});

function NdaGeneratorPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 6 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Generate a batch of NDAs from one template
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Onboarding a cohort of contractors, opening a data room for investors, or collecting
          signatures before a hiring round? You often need the same non-disclosure agreement for
          dozens of people at once. Instead of duplicating a Word file and swapping names by hand,
          keep one NDA template, list the signers in a spreadsheet, and generate every personalized
          NDA in a single batch.
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
          <Stat icon={<Clock className="size-5" />} label="Minutes, not an afternoon" value="1 batch" />
          <Stat icon={<Users className="size-5" />} label="NDAs per upload" value="Unlimited" />
          <Stat icon={<ShieldCheck className="size-5" />} label="Your clauses, untouched" value="100%" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">When you need NDAs in bulk</h2>
          <p className="mt-4 text-muted-foreground">
            A single NDA is easy. The pain starts when the same agreement has to go out to many
            people with only a few details changing each time:
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Onboarding a batch of contractors, freelancers, or seasonal staff.</Bullet>
            <Bullet>Opening a due-diligence data room to a list of investors or buyers.</Bullet>
            <Bullet>Vendors and suppliers who each need to sign before work begins.</Bullet>
            <Bullet>Event participants, beta testers, or advisors under confidentiality.</Bullet>
          </ul>
          <p className="mt-6 text-muted-foreground">
            In every case the NDA body is identical — only the signer's name, company, date, and
            term change. That is exactly the kind of job a template-plus-spreadsheet approach handles
            without copy-paste errors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Turn your NDA into a template</h2>
          <p className="mt-4 text-muted-foreground">
            Take your existing NDA and replace the fields you edit each time with placeholders in
            double braces. Leave the confidentiality clauses and definitions exactly as they are.
          </p>
          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This Non-Disclosure Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{company_name}}`}</span>{" "}
              and{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{signer_name}}`}</span>.
            </p>
            <p className="mt-3">
              Effective date:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{effective_date}}`}</span>{" "}
              · Term:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{term}}`}</span>
            </p>
          </div>
          <p className="mt-6 text-muted-foreground">
            New to placeholders? The full convention is in{" "}
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
              title="Upload your NDA template"
              body="Bring your existing .docx. Add {{variable}} placeholders anywhere a detail changes per signer."
            />
            <Step
              icon={<FileText className="size-5" />}
              number={2}
              title="Add a spreadsheet of signers"
              body="One row per person or company. Columns hold the name, entity, effective date, and term."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map columns to placeholders"
              body="Match each {{variable}} to a column and preview a real NDA from the first row before you generate."
            />
            <Step
              icon={<Download className="size-5" />}
              number={4}
              title="Download the ZIP"
              body="One personalized, correctly named NDA per row — ready to send for signature."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Fields worth turning into columns</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            <Bullet>Signer name and, if a company, the entity name</Bullet>
            <Bullet>Disclosing party / receiving party</Bullet>
            <Bullet>Effective date</Bullet>
            <Bullet>Term or expiry of the confidentiality obligation</Bullet>
            <Bullet>Governing law / jurisdiction</Bullet>
            <Bullet>The file name for each output</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Generate your NDAs</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your template, load your list of signers, and download every NDA in a ZIP. Free to
            try, no credit card required.
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
            NDAs are just one document type. See the same workflow applied to{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              generating contracts from Excel
            </Link>
            , or compare the tools in{" "}
            <Link
              to="/compare/easy-contracts-vs-docupilot-documint-portant"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Easy Contracts vs. Docupilot, Documint &amp; Portant
            </Link>
            .
          </p>
        </section>
      </article>

      <RelatedArticles currentPath="/nda-generator" />
      <MarketingFooter />
    </main>
  );
}
