import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Upload, Wand2, Download, CheckCircle2, Clock, Users, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const CANONICAL = "https://easycontracts.site/influencer-contract-templates";
const TITLE = "Influencer Contract Template · Generate Hundreds in Minutes";
const DESCRIPTION =
  "Free guide to influencer marketing contract templates. Stop copy-pasting Word docs — upload one template and an Excel sheet to generate every personalized contract at once.";

export const Route = createFileRoute("/influencer-contract-templates")({
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
          mainEntity: [
            {
              "@type": "Question",
              name: "What is an influencer contract template?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "An influencer contract template is a reusable Word document with placeholders (like {{name}}, {{fee}}, {{deliverables}}) that you fill in for each creator. Easy Contracts lets you upload your template once and merge it with an Excel sheet to produce one personalized contract per row.",
              },
            },
            {
              "@type": "Question",
              name: "How do I send contracts to many influencers at once?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Upload a .docx template with variables, upload an Excel file with one influencer per row, map columns to variables, and download a ZIP with every personalized contract ready to send.",
              },
            },
            {
              "@type": "Question",
              name: "Is the generated contract legally binding?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The legal content comes from your own template. Easy Contracts only personalizes the placeholders — it does not alter clauses. Always have your template reviewed by a lawyer in your jurisdiction.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: InfluencerContractTemplatesPage,
});

function InfluencerContractTemplatesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <FileText className="size-5 text-primary" />
            Easy Contracts
          </Link>
          <Button asChild size="sm">
            <Link to="/auth">Start free</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 6 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Influencer Contract Templates: Generate Hundreds in Minutes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          If you're still duplicating a Word doc for every creator and find-replacing names,
          you're losing hours per campaign. Here's a faster way to manage influencer
          agreements at scale — without giving up your template, your clauses, or your brand.
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
          <Stat icon={<Clock className="size-5" />} label="Hours saved per campaign" value="10+" />
          <Stat icon={<Users className="size-5" />} label="Contracts per upload" value="Unlimited" />
          <Stat icon={<ShieldCheck className="size-5" />} label="Your template, untouched" value="100%" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">
            The problem with manual influencer contract templates
          </h2>
          <p className="mt-4 text-muted-foreground">
            Most teams start with a single Word file: "Influencer Agreement —
            TEMPLATE.docx". For one or two creators it works. By the time you're
            running a 50-influencer campaign, you've spent a full afternoon
            duplicating files, swapping names, fees, posting dates, and deliverables.
            One typo and a creator gets the wrong rate.
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Copy-paste errors that end up in signed PDFs.</Bullet>
            <Bullet>Version drift — clause updates that never reach old templates.</Bullet>
            <Bullet>No central record of which creator got which terms.</Bullet>
            <Bullet>Hours that should go to negotiation, not data entry.</Bullet>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">
            What an automated influencer contract template looks like
          </h2>
          <p className="mt-4 text-muted-foreground">
            The shift is small: keep your existing Word template, but replace the
            fields you change each time with placeholders.
          </p>

          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This Influencer Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{brand_name}}`}</span>{" "}
              and{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{influencer_name}}`}</span>
              .
            </p>
            <p className="mt-3">
              Total compensation:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{fee}}`}</span>{" "}
              · Posting date:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{post_date}}`}</span>
            </p>
          </div>

          <p className="mt-6 text-muted-foreground">
            Then you maintain a single Excel sheet with one row per influencer — name,
            handle, fee, deliverables, posting date. Easy Contracts merges the two and
            produces one personalized <code className="rounded bg-muted px-1.5 py-0.5">.docx</code> per row,
            zipped and ready to send.
          </p>
        </section>

        <section id="how-it-works">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-6 space-y-6">
            <Step
              icon={<Upload className="size-5" />}
              number={1}
              title="Upload your Word template"
              body="Bring your existing .docx. Add {{variable}} placeholders anywhere you'd normally hand-edit."
            />
            <Step
              icon={<FileText className="size-5" />}
              number={2}
              title="Upload your Excel sheet"
              body="One row per influencer. Columns become the data that fills your template."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map columns to variables"
              body="Match each {{variable}} to a column. Easy Contracts shows you exactly what each contract will look like."
            />
            <Step
              icon={<Download className="size-5" />}
              number={4}
              title="Download the ZIP"
              body="Every contract personalized, named, and ready to send for signature."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">
            What to include in your influencer contract template
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you write your template from scratch or adapt one, these are the
            clauses that change most often per creator — and the ones that benefit
            most from being placeholders.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Parties (brand and influencer)",
              "Deliverables (posts, stories, reels)",
              "Posting dates and exclusivity window",
              "Compensation and payment terms",
              "Usage rights and reposting",
              "FTC / ASA disclosure language",
              "Cancellation and kill fee",
              "Governing law",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Stop copy-pasting. Start generating.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Upload your template once. Generate every contract for every campaign,
            forever. Free to try, no credit card required.
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
            <Faq q="What is an influencer contract template?">
              A reusable Word document with placeholders (like{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">{`{{name}}`}</code>,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">{`{{fee}}`}</code>) that
              get filled in for each creator. Easy Contracts merges your template with
              an Excel sheet to produce one personalized contract per row.
            </Faq>
            <Faq q="How do I send contracts to many influencers at once?">
              Upload your .docx template, upload an Excel file with one influencer per
              row, map the columns to your variables, and download a ZIP with every
              personalized contract ready to send.
            </Faq>
            <Faq q="Is the generated contract legally binding?">
              The legal content comes from your own template — Easy Contracts only
              personalizes the placeholders. It does not alter your clauses. Always
              have your template reviewed by a lawyer in your jurisdiction.
            </Faq>
            <Faq q="Do you store my influencer data?">
              Your template and data are tied to your account so you can re-run a
              campaign later. You can delete them at any time.
            </Faq>
          </div>
        </section>
      </article>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Easy Contracts</p>
          <Link to="/auth" className="hover:text-foreground">
            Sign in
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}

function Step({
  icon,
  number,
  title,
  body,
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Step {number}</p>
        <h3 className="mt-0.5 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{q}</h3>
      <p className="mt-2 text-muted-foreground">{children}</p>
    </div>
  );
}
