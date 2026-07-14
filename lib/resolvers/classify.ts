import type { Platform } from "@/lib/types";

/** Classify a shared string into a platform. Plain text -> manual. */
export function classifyUrl(input: string): Platform {
  const s = input.trim().toLowerCase();
  if (!/^https?:\/\//.test(s)) return "manual";
  if (/(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/kgs)/.test(s))
    return "google_maps";
  if (/instagram\.com|instagr\.am/.test(s)) return "instagram";
  if (/tiktok\.com|vm\.tiktok\.com/.test(s)) return "tiktok";
  return "manual";
}
