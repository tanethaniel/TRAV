import { env } from "./env";

/**
 * Stage-1 fetch (the pluggable seam — docs/INTEGRATIONS.md §5).
 * Returns the best text we can get for a link (caption, og:description, page text)
 * for the LLM to extract a place from. Instagram/TikTok are fragile and may return
 * null -> the resolver drops the chip to needs_review.
 *
 * Swap the body for: self-hosted fetch, a scraping API (SCRAPER_API_KEY), or a
 * Gumloop flow (GUMLOOP_API_KEY). Keep the signature stable so resolvers don't change.
 */
export async function fetchLinkText(url: string): Promise<string | null> {
  // TODO(T2): real Stage-1 backend. Default: naive fetch of og: meta tags.
  if (env.scraperKey || env.gumloopKey) {
    // TODO: call the configured scraping backend here.
  }
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; TravBot/0.1)" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    const og = html.match(
      /<meta[^>]+property=["']og:(?:title|description)["'][^>]+content=["']([^"']+)["']/gi
    );
    if (!og?.length) return null;
    return og
      .map((m) => m.replace(/.*content=["']([^"']+)["'].*/i, "$1"))
      .join(" — ");
  } catch {
    return null;
  }
}
