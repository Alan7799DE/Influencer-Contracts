import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, FileText, Wand2, Download, Video, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter, Stat, Step, Bullet, Faq } from "@/components/marketing";
import { RelatedArticles } from "@/lib/cluster";
import { articleSchema } from "@/lib/seo";

const CANONICAL = "https://easycontracts.site/platforms/instagram-creator-contracts";
const TITLE = "Instagram Creator Contract Template · Generate in Bulk";
const DESCRIPTION =
  "Instagram creator contract template for Reels, Stories, and feed posts. Cover usage rights, content ownership, Reels repurposing, feed exclusivity, and FTC compliance — then generate personalized agreements in bulk.";

const CLAUSES = [
  { k: "Parties and Instagram handles", v: "Legal names, Instagram handles, and contact information for brand and creator." },
  { k: "Content deliverables and format", v: "Number of posts, format breakdown (Reels, Stories, feed posts), posting timeline, and any specific aesthetic or hashtag requirements." },
  { k: "Usage rights and repurposing", v: "Can the brand repost the content to their own grid, Stories, Reels, or save it to Highlights? Can it be used in ads or on other channels (Facebook, Pinterest, TikTok)?" },
  { k: "Reels monetization and rights", v: "If creating a Reel, who collects Reels Play bonuses? Does the brand retain the right to publish the Reel on their own account and earn rewards?" },
  { k: "Feed exclusivity", v: "Is this post exclusive to the creator's account, or can the brand post it simultaneously to their own feed?" },
  { k: "Hashtag and tagging strategy", v: "Which hashtags to use (branded, campaign-specific, generic)? Does the brand get tagged? Who tags whom and when?" },
  { k: "Payment and terms", v: "Flat fee, per-post rate, or Reels bonus split; payment schedule and currency." },
  { k: "Content approval and revisions", v: "Who approves drafts before publishing? How many revision rounds? Turnaround time for feedback." },
  { k: "FTC compliance and disclosure", v: "How to disclose (#ad, #partner, #sponsored); whether it goes in caption, first comment, or bio link." },
  { k: "Intellectual property and licensing", v: "Who owns the raw files? Who owns the final post? License duration for brand repurposing." },
  { k: "Exclusivity and non-compete", v: "Can the creator work with competing brands before, during, or after the campaign? Hold-out period?" },
  { k: "Take-down and removal", v: "Can the creator delete the post? Can the brand? What happens to brand-reposted versions if the original is deleted?" },
  { k: "Term and termination", v: "Campaign duration, kill fees if campaign is canceled, and post-termination obligations." },
];

const FAQS = [
  {
    q: "What's the difference between an Instagram creator contract and a general influencer contract?",
    a: "Instagram contracts address format specifics (Reels vs. feed vs. Stories), who gets Reels Play bonuses, exclusivity and tagging rules, and Instagram-specific usage rights like saving to Highlights. A generic contract will miss these nuances.",
  },
  {
    q: "If I ask a creator to make a Reel, who gets the Reels Play bonus?",
    a: "Decide this upfront and spell it out. If the creator creates and publishes it on their account, they earn the bonus by default — unless your contract says otherwise. If you want to split bonuses or claim them entirely, address it explicitly.",
  },
  {
    q: "Can I repost a creator's content to my brand account?",
    a: "Only if the contract grants that right. Default is no. If you want to repost, be specific: can you repost on your feed, in Stories, or both? For how long? If the creator deletes their original, do you take down your repost?",
  },
  {
    q: "What's the best way to disclose a sponsored post on Instagram?",
    a: "Instagram and the FTC recognize #ad, #partner, and #sponsored in the caption or first comment. Make it the creator's responsibility to place the disclosure prominently — not buried in Highlights or hashtags. Specify in the contract where it goes.",
  },
  {
    q: "Should I ask for exclusivity on Instagram posts?",
    a: "It depends on your campaign. If you're buying a one-off post and the creator can post the same content elsewhere, you don't need exclusivity. If you're paying a premium and want the post to feel authentic to their audience, you might ask for a 30-60 day exclusivity period before they create similar content for competitors.",
  },
  {
    q: "How do I handle Stories that disappear after 24 hours?",
    a: "Decide if Stories need written contracts at all — many brands treat them as smaller, tactical asks. If they're part of a larger deal, spell out the posting timeline and whether the creator can share the Story to their Highlights archive (which makes it permanent on their profile).",
  },
  {
    q: "Can I batch-generate Instagram contracts for many creators?",
    a: "Yes. Upload your .docx template with {{placeholders}}, add an Excel sheet with one creator per row, map the columns, and download a ZIP with personalized contracts for all creators at once.",
  },
];

export const Route = createFileRoute("/platforms/instagram-creator-contracts")({
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
  component: InstagramCreatorContractsPage,
});

function InstagramCreatorContractsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Guide · 8 min read</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Instagram creator contracts that cover Reels, feed posts, and usage rights
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Instagram is layers: Reels, feed posts, Stories, Highlights, Guides — and every format has different rights and monetization. A standard influencer contract won't clarify who owns Reels bonuses, whether you can repost to your own feed, or what happens if the creator deletes. Keep an Instagram-specific template that addresses format, exclusivity, repurposing rights, and FTC compliance. Then generate personalized agreements for every creator partnership in a batch.
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
          <Stat icon={<Video className="size-5" />} label="Instagram-specific terms" value="Reels included" />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Why Instagram contracts need to be specific</h2>
          <p className="mt-4 text-muted-foreground">
            Instagram's monetization landscape is complex: Reels Play bonuses go to whoever publishes the Reel on their account; Highlights persist indefinitely even though Stories disappear; feed posts have different usage rights than Reels; Reels can be saved and reposted by anyone. A generic influencer contract will leave gaps — you'll end up negotiating terms mid-campaign or discovering you didn't secure the rights you thought you had. An Instagram-native contract spells out the mechanics upfront.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Core clauses for Instagram creator contracts</h2>
          <p className="mt-4 text-muted-foreground">
            Lock these into your template and every creator gets clear, platform-appropriate terms.
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
            The clause that trips up most brands: repurposing rights. You can't assume you can save a Reel to your own Highlights or repost it to your feed without explicit permission — default is that the creator retains full control. Be specific about what rights you need.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Use a template with placeholders</h2>
          <p className="mt-4 text-muted-foreground">
            Keep your standard terms fixed and turn creator-specific details into {`{{variables}}`} you'll fill from a spreadsheet.
          </p>
          <div className="mt-6 rounded-lg border bg-muted/50 p-5 font-mono text-sm">
            <p>This Instagram Creator Agreement is entered into between</p>
            <p className="mt-1">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{brand_name}}`}</span>{" "}
              and creator{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{instagram_handle}}`}</span>.
            </p>
            <p className="mt-3">
              Deliverables: {" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{reels_count}}`}</span>
              {" "}Reels, {" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{feed_posts_count}}`}</span>
              {" "}feed posts · Fee:{" "}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{`{{fee_amount}}`}</span>
            </p>
          </div>
          <p className="mt-6 text-muted-foreground">
            Full placeholder guide:{" "}
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
              title="Upload your Instagram contract template"
              body="Your .docx with {{placeholders}} for creator name, Instagram handle, post count, fee, exclusivity terms, and usage rights."
            />
            <Step
              icon={<FileText className="size-5" />}
              number={2}
              title="Add your creator roster"
              body="One row per creator in Excel or CSV — names, handles, deliverables (Reels, feed posts, Stories), fees, and campaign dates."
            />
            <Step
              icon={<Wand2 className="size-5" />}
              number={3}
              title="Map columns to placeholders"
              body="Match each {{variable}} to your spreadsheet and preview a complete, personalized contract before batch generation."
            />
            <Step
              icon={<Download className="size-5" />}
              number={4}
              title="Download all contracts"
              body="One fully personalized agreement per creator — ready to send, sign, and execute — no manual editing."
            />
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Who uses Instagram creator contracts</h2>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <Bullet>Performance brands running always-on influencer campaigns with rotating creators.</Bullet>
            <Bullet>Agencies managing multiple Instagram influencers across clients.</Bullet>
            <Bullet>Performance teams that need usage rights and Reels monetization terms locked in before budgeting paid amplification.</Bullet>
            <Bullet>Creator networks and talent agencies representing Instagram creators at scale.</Bullet>
          </ul>
        </section>

        <section className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Generate your Instagram contracts</h2>
          <p className="mt-3 text-muted-foreground">
            Upload your template once, load your creator list, map the columns, and download personalized contracts for your entire roster. Free to try, no credit card.
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
            Want a general template that works across platforms? See{" "}
            <Link
              to="/influencer-contract-templates"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              influencer contract templates
            </Link>
            . Or dive into{" "}
            <Link
              to="/guides/generate-contracts-from-excel"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              how to generate contracts from Excel
            </Link>
            {" "}for a step-by-step walkthrough.
          </p>
        </section>
      </article>

      <RelatedArticles currentPath="/platforms/instagram-creator-contracts" />
      <MarketingFooter />
    </main>
  );
}
