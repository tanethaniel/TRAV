import type { PlatformResolver } from "./index";
import type { ResolveResult } from "@/lib/types";
import { fetchLinkText } from "@/lib/scrape";
import { extractPlace } from "@/lib/claude";
import { findPlaceByText } from "@/lib/maps";

// Same best-effort shape as Instagram (design doc D2). Stage-1 fetch is pluggable.
export const tiktokResolver: PlatformResolver = {
  platform: "tiktok",
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
