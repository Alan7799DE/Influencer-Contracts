# SEO Audit — easycontracts.site

**Type:** Full site audit · **Date:** June 27, 2026 · **Data basis:** Live crawl + web research (no Ahrefs/Semrush connected, so volume/difficulty are directional)

> This is a living document. Each finding below is meant to be picked off over time — we'll attack it incrementally.

## Executive Summary

Easy Contracts has a **surprisingly strong technical foundation for such a young, niche site** — the `/influencer-contract-templates` page is genuinely well-built: server-rendered HTML (not a blank JS shell), a clean canonical tag, valid Article + FAQPage schema, a keyword-targeted title, and ~590 words of solid, intent-matched copy. That one page is doing 95% of the SEO work and it's doing it well.

The core problem is **thinness and a strategic mismatch**: there is effectively **one indexable content page**. The homepage — which claims the valuable "bulk contract generator" keyword in its title — is a login wall with ~19 words of crawlable text, so it cannot rank. Meanwhile the keywords that are realistically winnable ("influencer contract template") are owned by domain-authority-80+ giants (PandaDoc, Juro, LawDepot, Sprout Social). The wedge nobody else occupies: **bulk + influencer-specific contract generation**.

**Top 3 priorities:** (1) Build out a small topic cluster so the site isn't a one-page site fighting authority sites alone; (2) fix the homepage's wasted ranking potential (gated content + no canonical); (3) lean hard into the low-competition "bulk / at scale / for agencies" angle where the template giants don't compete. **Overall assessment: strong technical foundation, but critically under-built on content.**

---

## Competitors Identified

| Tier | Examples | They rank for | Threat level |
|------|----------|---------------|--------------|
| **Template/authority sites** | [PandaDoc](https://www.pandadoc.com/influencer-agreement-template/), [Juro](https://juro.com/contract-templates/influencer-agreement), [LawDepot](https://www.lawdepot.com/us/business/influencer-contract/), [Sprout Social](https://sproutsocial.com/insights/influencer-contract-template/), [Collabstr](https://collabstr.com/blog/influencer-agreement-template) | "influencer contract template", "free influencer agreement" | High — own the head term, DA 70–90 |
| **Bulk doc-generation tools** | [Docupilot](https://www.docupilot.com/blog/bulk-document-generation), [EDocGen](https://www.edocgen.com/blogs/export-excel-to-word), [Apsona](https://www.apsona.com/document-and-email-merge/) | "bulk document generation", "Word + Excel merge tool" | Medium — functional rivals, but not influencer-focused |
| **Influencer platforms w/ contract features** | CreatorIQ, [Meltwater](https://www.meltwater.com/en/resources/social-influencer-contract-template-free-download), Outlaw | bundled into broader IMP suites | Low — different buyer, enterprise |

**Unclaimed wedge:** *bulk* generation that's *influencer-specific*. The template sites give one document; the doc-gen tools aren't tuned for influencer workflows or SEO-targeted to that audience. That gap is the entire content strategy.

---

## Keyword Opportunity Table

Sorted by opportunity score (relevance × winnability). Difficulty reflects who currently ranks.

| Keyword | Est. Difficulty | Opportunity | Current Ranking | Intent | Recommended Content Type |
|---------|----------------|-------------|-----------------|--------|--------------------------|
| bulk influencer contract generator | Easy | **High** | Likely top 20 (LP) | Transactional | Homepage / product page (current LP) |
| generate influencer contracts at scale | Easy | **High** | Possibly ranking | Transactional | Landing page (current LP) |
| influencer contract template for agencies | Easy | **High** | None | Commercial | New landing page |
| generate contracts from Excel | Easy | **High** | None | Commercial | New "how-to / tool" page |
| Word template merge with Excel data | Moderate | **High** | None | Informational | Guide/tutorial |
| automate influencer agreements | Easy | **High** | None | Commercial | Use-case page |
| bulk contract generation software | Moderate | Medium | None | Commercial | Comparison/product page |
| how to send contracts to multiple influencers | Easy | Medium | Partial (FAQ) | Informational | Blog/guide |
| influencer agreement generator | Moderate | Medium | None | Transactional | Product page |
| mail merge for contracts | Moderate | Medium | None | Informational | Guide ("better than mail merge") |
| influencer contract template free | Hard | Medium | None | Transactional | Free template + tool CTA |
| what to include in an influencer contract | Moderate | Medium | Partial (LP section) | Informational | Dedicated blog post |
| UGC creator contract template | Easy | Medium | None | Commercial | New landing page |
| brand ambassador contract generator | Easy | Medium | None | Commercial | New landing page |
| influencer contract template Word | Moderate | Medium | None | Transactional | Template download page |
| docx template variables generator | Easy | Low | None | Informational | Technical how-to |
| influencer marketing contract clauses | Moderate | Low | Partial | Informational | Blog post |
| TikTok / Instagram influencer contract | Moderate | Low | None | Commercial | Platform-specific pages |

**Strategic read:** ignore the head term "influencer contract template" as a primary target (DA giants own it) — instead dominate the **long-tail "bulk / at scale / for agencies / from Excel"** modifiers where competition is thin and intent is closer to purchase.

---

## On-Page Issues Table

| Page | Issue | Severity | Recommended Fix |
|------|-------|----------|-----------------|
| Homepage (`/`) | Content is login-gated — only ~19 crawlable words; claims "bulk contract generator" in title but can't rank for it | **Critical** | Add a public, indexable marketing section above/around the login (hero copy, how-it-works, value props), or make the marketing landing page the homepage |
| Homepage (`/`) | No `<link rel="canonical">` tag | **High** | Add self-referencing canonical to every route |
| Homepage (`/`) | No structured data (Organization/SoftwareApplication schema) | Medium | Add Organization + SoftwareApplication/Product schema |
| Landing page | FAQ schema lists **3** questions but page displays **4** ("Do you store my influencer data?" is on-page but missing from JSON-LD) | **High** | Add the 4th Q&A to the FAQPage schema — a rich-result eligible question is being left on the table |
| Landing page | **Zero internal links** except `/` and `/auth` — no related content, no topic cluster | **High** | Add contextual links once supporting pages exist (see Content Gaps) |
| Landing page | **No images** — no diagrams, no product screenshots | Medium | Add an annotated screenshot/diagram of the upload→ZIP flow (with descriptive alt text); improves engagement + image search |
| All pages | `og:image` points to a `lovable.app` preview on an R2 dev domain (`...lovable.app-1781054936777.png`) | Medium | Replace with a branded, self-hosted OG image on the own domain — current one looks unbranded/temporary in social shares |
| Sitemap | No `<lastmod>` dates | Low | Add `lastmod` so crawlers detect freshness |
| All pages | `lang="en"` only — if targeting Spanish-speaking markets, no localization | Low | Add Spanish landing pages + `hreflang` if expanding |

---

## Content Gap Recommendations

One-page site competing against content libraries. Each gap below is a page competitors have and Easy Contracts doesn't.

1. **"Influencer contract template for agencies"** — *Why:* agencies manage many creators = the exact bulk use case, low competition, high intent. *Format:* landing page. *Priority:* High. *Effort:* Moderate (half day).
2. **"How to generate contracts from an Excel sheet" (guide)** — *Why:* captures the functional searcher comparing against mail merge/Docupilot; positions Easy Contracts as the easy answer. *Format:* tutorial/guide with screenshots. *Priority:* High. *Effort:* Moderate.
3. **"What to include in an influencer contract" (standalone post)** — *Why:* there's already a section on this; a full post targets an informational head term and feeds links to the tool. *Format:* blog post + downloadable checklist. *Priority:* High. *Effort:* Moderate.
4. **Free influencer contract template (gated download → tool upsell)** — *Why:* the giants win on "free template"; offering a genuine free .docx template (the input the tool needs) is a perfect funnel entry. *Format:* template page. *Priority:* Medium. *Effort:* Substantial.
5. **Platform-specific pages** (TikTok / Instagram / UGC / brand ambassador contracts) — *Why:* cheap long-tail capture, each links back to the tool. *Format:* templated landing pages. *Priority:* Medium. *Effort:* Substantial (multi-day, but repeatable).
6. **Pillar page: "Managing influencer contracts at scale"** — *Why:* anchors a topic cluster and signals topical authority that a single page can't. *Format:* pillar linking to all of the above. *Priority:* Medium. *Effort:* Substantial.

**Funnel coverage today:** decision-stage content exists (the LP), but almost nothing for **awareness** (informational "how to / what is") or **comparison** (vs. mail merge / vs. Docupilot) — that's where the cluster above fills in.

---

## Technical SEO Checklist

| Check | Status | Details |
|-------|--------|---------|
| HTTPS | ✅ Pass | Valid TLS, HSTS enabled (`max-age=31536000; includeSubDomains`) |
| robots.txt | ✅ Pass | Present, `Allow: /`, references sitemap correctly |
| XML sitemap | ⚠️ Warning | Present and valid, but no `<lastmod>` dates; only 3 URLs |
| Canonical tags | ⚠️ Warning | LP ✅; **homepage missing canonical** |
| Structured data | ⚠️ Warning | LP has Article + FAQPage ✅ (but FAQ schema incomplete — 3 of 4 Qs); homepage has none |
| Mobile-friendly | ✅ Pass | Proper viewport meta, responsive Tailwind layout |
| Rendering / crawlability | ✅ Pass | Server-rendered HTML (TanStack Start) — content visible without JS execution |
| Page speed / CDN | ✅ Pass | Cloudflare CDN, HTTP/2, preconnect to fonts, modulepreload — fast delivery |
| Indexable content depth | ❌ Fail | Effectively 1 content page; homepage is login-gated/thin |
| Open Graph / Twitter | ⚠️ Warning | Tags present ✅ but OG image is an unbranded lovable.app/R2 preview URL |
| Internal linking | ❌ Fail | No content-to-content links; no topic cluster |
| Indexation | ⚠️ Warning | `/auth` is in sitemap (priority 0.5) but is a utility page — consider `noindex` to avoid diluting crawl |

---

## Competitor Comparison Summary

Benchmarked against a representative authority competitor (**PandaDoc** — template/DA play) and a representative functional competitor (**Docupilot** — bulk doc-gen).

| Dimension | Easy Contracts | PandaDoc | Docupilot | Winner |
|-----------|----------------|----------|-----------|--------|
| Indexable content pages | ~1 | Hundreds | Dozens+ | Competitors |
| Content depth (target page) | ~590 words, focused | Long + tool | Long guides | Tie (theirs is tight & on-intent) |
| Schema markup | Article + FAQ (minor gap) | Full suite | Article/HowTo | Competitors (slightly) |
| Publishing frequency | None yet | High | Regular | Competitors |
| Backlink signals | New domain, minimal | Very strong (DA ~90) | Strong | Competitors |
| Technical foundation | **Excellent (SSR, fast, clean)** | Good | Good | **Easy Contracts** |
| Niche focus (bulk + influencer) | **Exact fit** | Generic | Generic | **Easy Contracts** |
| SERP feature readiness (FAQ rich result) | Close (fix schema) | Yes | Partial | Competitors (for now) |

**Takeaway:** loses on authority and volume (expected for a new site) but **wins decisively on technical quality and niche fit**. Don't out-content the giants on their terms — out-specialize them.

---

## Prioritized Action Plan

### Quick Wins (do this week)

| Action | Impact | Effort | Dependencies |
|--------|--------|--------|--------------|
| Add the 4th FAQ ("Do you store my data?") to the FAQPage JSON-LD on the landing page | Medium (rich-result eligibility) | 15 min | None |
| Add self-referencing `canonical` tag to the homepage (and all routes) | Medium | 15 min | None |
| Replace the `og:image` with a branded, self-hosted image | Medium (social CTR/trust) | 30 min | Design asset |
| Add `noindex` to `/auth` (and remove or downgrade it in the sitemap) | Low | 15 min | None |
| Add `<lastmod>` dates to sitemap entries | Low | 15 min | None |
| Add Organization + SoftwareApplication schema to the homepage | Medium | 30–45 min | None |
| Add a product screenshot/diagram (with alt text) to the landing page | Medium (engagement + image search) | 1 hr | One screenshot |

### Strategic Investments (plan for this quarter)

| Action | Impact | Effort | Dependencies |
|--------|--------|--------|--------------|
| Make homepage marketing content publicly indexable (un-gate the value prop / how-it-works) | **High** — unlocks "bulk contract generator" ranking | Moderate (dev) | Layout change |
| Build the topic cluster: agencies page + "generate from Excel" guide + "what to include" post + pillar | **High** — topical authority, escapes one-page trap | Substantial (multi-week) | Content production |
| Launch a genuinely free influencer contract template (download → tool funnel) | High — competes on "free template" + feeds the tool its required input | Substantial | Legal-reviewed template |
| Add comparison content ("vs. mail merge", "vs. manual Word") | Medium — captures evaluators with high intent | Moderate | Cluster live |
| Build platform-specific long-tail pages (TikTok/Instagram/UGC) | Medium — cheap, repeatable long-tail capture | Substantial but templatable | Cluster structure |
| Begin light link-building (creator-marketing roundups, tool directories, HypeAuditor-style lists) | Medium-High long term — weakest signal is authority | Ongoing | Shippable product |

> ⚠️ **Lovable note:** this site is Lovable-managed. The fixes above (schema, canonical, OG image, sitemap, new pages) should be made through Lovable's editing flow / the app source — not by hand-editing generated build output — to avoid them being overwritten on the next deploy.

---

## Sources

- [HypeAuditor – tools to create influencer contracts](https://hypeauditor.com/blog/tools-to-create-influencer-contract/)
- [PandaDoc – influencer agreement template](https://www.pandadoc.com/influencer-agreement-template/)
- [Juro – influencer agreement](https://juro.com/contract-templates/influencer-agreement)
- [LawDepot – influencer contract](https://www.lawdepot.com/us/business/influencer-contract/)
- [Sprout Social – influencer contract template](https://sproutsocial.com/insights/influencer-contract-template/)
- [Docupilot – bulk document generation](https://www.docupilot.com/blog/bulk-document-generation)
- [EDocGen – Excel to Word](https://www.edocgen.com/blogs/export-excel-to-word)
- [Meltwater – social influencer contract template](https://www.meltwater.com/en/resources/social-influencer-contract-template-free-download)
- [Collabstr – influencer agreement template](https://collabstr.com/blog/influencer-agreement-template)
