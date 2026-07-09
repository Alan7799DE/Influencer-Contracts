import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, FileText, Wand2, Download, Video, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Stat, Step, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";
import { articleSchema } from "@/lib/seo";

const CANONICAL = "https://easycontracts.site/platforms/tiktok-creator-contracts";
const TITLE = "TikTok Creator Contract Template · Generate in Bulk";
const DESCRIPTION =
  "A TikTok creator contract template for brands and agencies. Cover performance metrics, usage rights, TikTok duet/stitch terms, and FTC compliance — then generate personalized agreements in bulk from a spreadsheet.";

const CLAUSES = [
  { k: "Creator and brand identification", v: "Legal names, TikTok handles, and contact information for both parties." },
  { k: "Content deliverables", v: "Number of TikTok videos, performance metrics (views, engagement targets), posting timeline, and any specific hashtag or trend requirements." },
  { k: "Usage rights and repurposing", v: "Whether the brand can repost the video to their own TikTok, save to their library, or repurpose it on Instagram, YouTube, or paid ads." },
  { k: "Duet and stitch permissions", v: "Whether the creator allows the brand to duet, stitch, or react to their video — and if so, on what account (brand or influencer collab account)." },
  { k: "Payment terms", v: "Flat fee, per-video rate, or performance-based compensation; payment schedule and currency." },
  { k: "Exclusivity and hold-out periods", v: "Whether the creator can promote competing brands during the campaign or for a set cooling-off period." },
  { k: "Content approval", v: "Who approves the final video before posting, revision rounds included, and what counts as additional, billable edits." },
  { k: "FTC compliance and disclosure", v: "How the creator will disclose the partnership (e.g., #ad, #sponsored) and TikTok-specific disclosure best practices (in caption or comments)." },
  { k: "Intellectual property", v: "Who owns the raw footage, the final edited video, and any music or effects used; license duration." },
  { k: "Liability and indemnification", v: "Creator responsibility for defamation, copyright, or compliance issues; brand's liability for rejected content." },
  { k: "Term and termination", v: "Campaign duration, kill fees if either side exits early, and post-termination obligations." },
];

const FAQS = [
  {
    q: "What makes a TikTok creator contract different from an influencer contract?",
    a: "TikTok contracts are platform-specific: they cover duets and stitches (unique to TikTok), trending audio rights, TikTok's FTC disclosure rules, and repurposing rights for the TikTok algorithm. A general influencer contract might miss these nuances. Use this template if you're specifically briefing TikTok creators.",
  },
  {
    q: "Do I need separate contracts for brand account vs. creator's personal account?",
    a: "Yes, if they're different campaigns. A collab on the creator's audience-building account has different usage rights, exclusivity terms, and payment than a brand takeover of your official account. Keep separate templates.",
  },
  {
    q: "Can I reuse a creator's video on my brand's TikTok account?",
    a: "Only if the contract grants that license explicitly. By default, you can't repost without permission — spell out which accounts you can use it on (your brand TikTok, Instagram, YouTube, paid ads) and for how long.",
  },
  {
    q: "How do I handle TikTok's trending audio licensing?",
    a: "TikTok's music is licensed for creators to use freely, but if a creator uses licensed audio, you may not be able to repost their video without a separate music license. Address this in the contract: either specify royalty-free or original audio only, or budget for music licensing if reposting off-platform.",
  },
  {
    q: "What should I do about duets and stitches?",
    a: "Decide upfront: can the brand duet or stitch the creator's video? If yes, on what account? Are there brand guidelines for how the duet should be framed? Spell it out so there are no surprises after posting.",
  },
  {
    q: "How do I batch-generate TikTok contracts for multiple creators?",
    a: "Upload your .docx template with {{placeholders}}, add an Excel sheet with one creator per row, map the columns, and download a ZIP with one personalized contract per creator. Easy Contracts handles the merge — no manual rewriting.",
  },
];

export const Route = createFileRoute("/platforms/tiktok-creator-contracts")({
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
  component: TikTokCreatorContractsPage,
});

function TikTokCreatorContractsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 8 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          TikTok creator contracts that actually cover the platform
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          TikTok moves fast — trends, sounds, and creator partnerships change weekly. Your contract needs to keep up. A standard influencer contract will miss TikTok-specific terms like duets, stitch permissions, trending audio licensing, and FTC disclosure on captions. Keep a TikTok-focused template that covers the platform's actual mechanics, then generate personalized agreements for every creator in your campaign.
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
          <Stat icon={<Clock className="size-5" />} label="Time per creator contract" value="Minutes" />
          <Stat icon={<Users className="size-5" />} label="Creators per batch" value="Unlimited" />
          <Stat icon={<Video className="size-5" />} label="Platform-specific terms" value="TikTok built-in" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Why TikTok contracts are different</h2>
          <p className="mt-4 text-muted-foreground">
            TikTok's legal and technical landscape is unlike other platforms. Duets and stitches are native features — should the brand be able to use them? Trending audio is licensed differently than YouTube or Instagram — do you budget for music licensing if you want to repost off-platform? The FTC's disclosure rules have a TikTok-specific format. A cookie-cutter influencer contract will leave money on the table and create confusion. A TikTok-native contract clarifies expectations upfront.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Essential clauses for TikTok creator contracts</h2>
          <p className="mt-4 text-muted-foreground">
            Lock these in your template and every creator gets consistent, legally sound terms tailored to TikTok's ecosystem.
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
            The most common mistake: underestimating usage rights. Brands assume they can repost the video anywhere after publishing, but unless the contract explicitly grants that license, they can't. Be specific about which accounts and platforms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Set up your template with placeholders</h2>
          <p className="mt-4 text-muted-foreground">
            Keep your legal boilerplate fixed and turn the creator-specific details into {{variables}} you fill from a spreadsheet.
          </p>
          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This TikTok Creator Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{brand_name}}`}</span>{" "}
              and creator{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{tiktok_handle}}`}</span>.
            </p>
            <p className="mt-3">
              Deliverables: {" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{video_count}}`}</span>
              {" "}videos · Fee:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{fee_amount}}`}</span>
            </p>
          </div>
          <p className="mt-6 text-muted-foreground">
            Learn the full placeholder syntax in{" "}
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
              title="Upload your TikTok contract template"
              body="Your .docx with {{variable}} placeholders for creator name, TikTok handle, fee, video count, and usage terms."
            />
            <Step
              icon={<FileText className="size-5" />}
              number={2}
              title="Add your creator roster"
              body="One row per creator in Excel or CSV — names, handles, fees, deliverables, and any campaign-specific terms."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map columns to placeholders"
              body="Match each {{variable}} to your spreadsheet columns and preview a personalized contract before generating the batch."
            />
            <Step
              icon={<Download className="size-5" />}
              number={4}
              title="Download and send"
              body="One fully personalized contract per creator, ready to email or e-sign — no manual editing needed."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Who uses TikTok creator contracts</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Brands running always-on TikTok campaigns with rotating creators.</Bullet>
            <Bullet>Agencies managing multiple creator partnerships across clients.</Bullet>
            <Bullet>Performance marketing teams that need usage rights locked down before spending on paid amplification.</Bullet>
            <Bullet>Creator networks and talent agencies representing multiple TikTok creators.</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Generate your TikTok contracts</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your TikTok template once, load your creator roster, map the columns, and download every contract in a ZIP. Free to try.
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
            Running campaigns across multiple platforms? See{" "}
            <Link
              to="/influencer-contract-templates"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              influencer contract templates
            </Link>
            {" "}for a general template, or{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              how to generate contracts from Excel
            </Link>
            {" "}for step-by-step instructions.
          </p>
        </section>
      </article>

      <RelatedArticles currentPath="/platforms/tiktok-creator-contracts" />
      <MarketingFooter />
    </main>
  );
}
