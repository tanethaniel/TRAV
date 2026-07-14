import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { env } from "./env";
import type { ResolvedPlace, TripStop, Chip } from "./types";

// The AI key lives ONLY here (server). Two calls, per docs/INTEGRATIONS.md §3:
//   extractPlace   — caption -> place  (Haiku 4.5: high volume, cheap)
//   generateDayPlan — stops   -> prose (Sonnet 5: quality)
// Both are eval-gated (task T4). The LLM never invents coords or drive times.

const MODEL_EXTRACT = "claude-haiku-4-5-20251001";
const MODEL_NARRATIVE = "claude-sonnet-5";

function client(): Anthropic | null {
  if (!env.anthropicKey) return null;
  return new Anthropic({ apiKey: env.anthropicKey });
}

const placeSchema = z.object({
  name: z.string().min(1),
  city: z.string().nullable(),
  category: z.string().nullable(),
});

/** caption/og-text -> {name, city, category}. Null when nothing extractable. */
export async function extractPlace(
  text: string
): Promise<Pick<ResolvedPlace, "name" | "city" | "category"> | null> {
  const ai = client();
  if (!ai) return null; // no key in dev -> resolver falls to needs_review

  const msg = await ai.messages.create({
    model: MODEL_EXTRACT,
    max_tokens: 256,
    system:
      "Extract the single real-world place a social post is about. Return ONLY JSON " +
      '{"name","city","category"}. category is one of nature|landmark|shop|dining|culture. ' +
      "If no specific place, return {\"name\":\"\",\"city\":null,\"category\":null}.",
    messages: [{ role: "user", content: text.slice(0, 4000) }],
  });

  const raw = msg.content.find((c) => c.type === "text");
  if (!raw || raw.type !== "text") return null;
  try {
    const parsed = placeSchema.parse(JSON.parse(raw.text));
    return parsed.name ? parsed : null;
  } catch {
    return null;
  }
}

/** Ordered, timed stops -> a human-readable day plan. Times/coords come from Maps. */
export async function generateDayPlan(
  stops: (TripStop & { chip: Chip })[]
): Promise<string> {
  const ai = client();
  if (!ai) return "";
  const outline = stops
    .map((s) => `Day ${s.day} ${s.startTime ?? ""} ${s.chip.name ?? "stop"}`)
    .join("\n");

  const msg = await ai.messages.create({
    model: MODEL_NARRATIVE,
    max_tokens: 800,
    system:
      "Write a warm, concise day-by-day plan from this fixed itinerary. Do NOT change " +
      "the order, times, or add stops — those are already decided. One or two sentences per stop.",
    messages: [{ role: "user", content: outline }],
  });
  const raw = msg.content.find((c) => c.type === "text");
  return raw && raw.type === "text" ? raw.text : "";
}
