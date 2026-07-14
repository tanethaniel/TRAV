import type { PlatformResolver } from "./index";
import type { ResolveResult } from "@/lib/types";
import { findPlaceByText } from "@/lib/maps";

// The reliable path: a Google Maps link resolves cleanly (design doc D2).
// TODO(T2): follow maps.app.goo.gl redirects to recover the place name/coords,
// then confirm via Places. For now we extract a query from the URL and geocode it.
export const mapsResolver: PlatformResolver = {
  platform: "google_maps",
  async resolve(url: string): Promise<ResolveResult> {
    const query = queryFromMapsUrl(url);
    if (!query) return { ok: false, reason: "needs_review", note: "no place in URL" };
    const place = await findPlaceByText(query);
    if (!place) return { ok: false, reason: "needs_review", note: "geocode miss" };
    return { ok: true, place };
  },
};

function queryFromMapsUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const q = u.searchParams.get("q");
    if (q) return q;
    // /maps/place/<Name>/...
    const m = u.pathname.match(/\/maps\/place\/([^/]+)/);
    if (m) return decodeURIComponent(m[1]).replace(/\+/g, " ");
    return null;
  } catch {
    return null;
  }
}
