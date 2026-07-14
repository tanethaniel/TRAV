import type { PlatformResolver } from "./index";
import type { ResolveResult } from "@/lib/types";
import { fetchLinkText } from "@/lib/scrape";
import { extractPlace } from "@/lib/claude";
import { findPlaceByText } from "@/lib/maps";

// Best-effort (design doc D2): Instagram has no official API. Fetch caption/location
// (Stage 1 — pluggable: self-host / scraping API / Gumloop, see INTEGRATIONS.md §5),
// LLM-extract the place (Stage 2 — stays in Trav code), then geocode.
// On any miss -> needs_review, fixed conversationally in WhatsApp.
export const instagramResolver: PlatformResolver = {
  platform: "instagram",
  async resolve(url: string): Promise<ResolveResult> {
    const text = await fetchLinkText(url);
    if (!text) return { ok: false, reason: "needs_review", note: "fetch failed" };

    const extracted = await extractPlace(text);
    if (!extracted?.name)
      return { ok: false, reason: "needs_review", note: "no place in caption" };

    const geo = await findPlaceByText(
      [extracted.name, extracted.city].filter(Boolean).join(", ")
    );
    return { ok: true, place: { ...extracted, ...(geo ?? {}) } };
  },
};
