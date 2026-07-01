import faviconAsset from "@/assets/favicon.png.asset.json";

export const SITE_URL = "https://easycontracts.site";

/** Absolute URL of the brand logo, used as publisher/author logo in structured data. */
export const LOGO_URL = `${SITE_URL}${faviconAsset.url}`;

/**
 * Shared Organization node reused as both `author` and `publisher` in Article
 * schema. Includes `logo` as an ImageObject, which Google requires for an
 * Article's publisher to be eligible for rich results.
 */
const ORGANIZATION = {
  "@type": "Organization",
  name: "Easy Contracts",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
  },
} as const;

/** Fallback publish date for cluster articles that don't pass an explicit one. */
const DEFAULT_PUBLISHED = "2026-06-28";

/**
 * Build a valid schema.org Article node for a content page. Adds the fields
 * Google looks for (author + publisher with logo, datePublished/dateModified,
 * and a WebPage-typed mainEntityOfPage) so the markup validates cleanly.
 */
export function articleSchema(opts: {
  headline: string;
  description: string;
  canonical: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const published = opts.datePublished ?? DEFAULT_PUBLISHED;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    datePublished: published,
    dateModified: opts.dateModified ?? published,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.canonical },
  };
}
