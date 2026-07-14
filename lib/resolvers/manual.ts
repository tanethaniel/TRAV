import type { PlatformResolver } from "./index";
import type { ResolveResult } from "@/lib/types";
import { findPlaceByText } from "@/lib/maps";

// Plain-text share (or the WhatsApp needs_review reply "La Taqueria San Francisco").
// Try to geocode it directly; if it misses, back to needs_review.
export const manualResolver: PlatformResolver = {
  platform: "manual",
  async resolve(input: string): Promise<ResolveResult> {
    const query = input.trim();
    if (query.length < 3) return { ok: false, reason: "needs_review" };
    const place = await findPlaceByText(query);
    if (!place) return { ok: false, reason: "needs_review", note: "geocode miss" };
    return { ok: true, place };
  },
};
