import { Link } from "@tanstack/react-router";
import {
  FileText,
  FileSpreadsheet,
  Building2,
  ListChecks,
  Wand2,
  Layers,
  BookOpen,
  Scale,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

export type ClusterArticle = {
  to: string;
  label: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
};

// Single source of truth for the SEO topic cluster. Every internal-link
// surface (homepage cards + footer, and the "Keep reading" block on each
// article) renders from this list, so links can never drift out of sync.
export const ARTICLES: ClusterArticle[] = [
  {
    to: "/influencer-contract-templates",
    label: "Templates",
    title: "Influencer contract templates",
    blurb: "What an influencer agreement needs and how to personalize it at scale.",
    icon: FileText,
  },
  {
    to: "/use-cases/influencer-contracts-for-agencies",
    label: "Use case",
    title: "Influencer contracts for agencies",
    blurb: "Generate a personalized agreement for every creator on your roster in one batch.",
    icon: Building2,
  },
  {
    to: "/guides/generate-contracts-from-excel",
    label: "Guide",
    title: "Generate contracts from Excel",
    blurb: "Turn a spreadsheet and a Word template into hundreds of finished contracts.",
    icon: FileSpreadsheet,
  },
  {
    to: "/guides/what-to-include-in-an-influencer-contract",
    label: "Guide",
    title: "What to include in an influencer contract",
    blurb: "Every clause that matters, with a copy-ready checklist.",
    icon: ListChecks,
  },
  {
    to: "/guides/add-placeholders-to-word-template",
    label: "Guide",
    title: "Add placeholders to a Word template",
    blurb: "Mark up your .docx so the parts that change get filled in for you.",
    icon: Wand2,
  },
  {
    to: "/guides/personalize-contracts-automatically",
    label: "Guide",
    title: "Personalize a contract for each person automatically",
    blurb: "Stop editing one document at a time — personalize from a list instead.",
    icon: Layers,
  },
  {
    to: "/guides/generate-documents-in-bulk",
    label: "Guide",
    title: "Best ways to generate documents in bulk (2026)",
    blurb: "The approaches that actually scale, and how to choose between them.",
    icon: BookOpen,
  },
  {
    to: "/compare/easy-contracts-vs-docupilot-documint-portant",
    label: "Compare",
    title: "Easy Contracts vs. Docupilot, Documint & Portant",
    blurb: "How the bulk document tools differ, and which fits contracts from Excel.",
    icon: Scale,
  },
];

// "Keep reading" block rendered at the foot of every article. Shows the
// articles that follow the current one (wrapping), so each page links onward
// into the cluster and the reader always has a next step.
export function RelatedArticles({
  currentPath,
  limit = 3,
}: {
  currentPath: string;
  limit?: number;
}) {
  const idx = ARTICLES.findIndex((a) => a.to === currentPath);
  const ordered =
    idx === -1 ? ARTICLES : [...ARTICLES.slice(idx + 1), ...ARTICLES.slice(0, idx)];
  const items = ordered.filter((a) => a.to !== currentPath).slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Keep reading</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <a.icon className="size-5" />
              </span>
              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {a.label}
              </p>
              <h3 className="mt-1.5 font-semibold leading-snug">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Read more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
