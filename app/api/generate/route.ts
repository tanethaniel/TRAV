import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Generate a multi-day itinerary for a folder (tasks T3/T7/T17).
// Input: folderId + dates/#days + transport. Output: persisted trip with day-clustered,
// route-ordered stops (real Distance-Matrix times) + a Claude narrative.

const bodySchema = z.object({
  folderId: z.string().uuid(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  days: z.number().int().min(1).max(30).optional(),
  transport: z.enum(["drive", "walk", "transit"]),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // TODO(T17): load folder chips (RLS), build LatLng[], travelMatrix(mode),
  // clusterIntoDays(), orderStops() per day, generateDayPlan(), persist trip+stops.
  // No gap-fill in v1 (CEO decision). Real times only (D1) — never LLM-guessed.
  return NextResponse.json(
    { error: "not_implemented", detail: "generation pipeline is scaffolded (T17)" },
    { status: 501 }
  );
}
