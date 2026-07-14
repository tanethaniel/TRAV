import type { Platform, ResolveResult } from "@/lib/types";
import { classifyUrl } from "./classify";
import { mapsResolver } from "./maps";
import { instagramResolver } from "./instagram";
import { tiktokResolver } from "./tiktok";
import { manualResolver } from "./manual";

/**
 * The PlatformResolver seam (design doc D2 / task T2).
 *
 * Stage 1 (fetch) differs per platform and is the ONLY swappable part — it may be
 * backed by self-hosted fetch, a scraping API, or a Gumloop flow (see
 * docs/INTEGRATIONS.md §5). Stage 2 (LLM extract), geocode, and persist are shared
 * and stay in Trav code. A resolver's job: URL -> ResolveResult. Everything after
 * (geocode enrichment, chip write, WhatsApp reply) is owned by the pipeline.
 */
export interface PlatformResolver {
  platform: Platform;
  resolve(url: string): Promise<ResolveResult>;
}

const RESOLVERS: Record<Platform, PlatformResolver> = {
  google_maps: mapsResolver,
  instagram: instagramResolver,
  tiktok: tiktokResolver,
  manual: manualResolver,
  trav: manualResolver,
};

/** Pick the resolver for a raw shared string (a URL, or free text -> manual). */
export function resolverFor(input: string): PlatformResolver {
  const platform = classifyUrl(input);
  return RESOLVERS[platform];
}
