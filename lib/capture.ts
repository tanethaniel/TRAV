import { supabaseAdmin } from "./supabase/server";
import { resolverFor } from "./resolvers";
import { sendWhatsApp } from "./whatsapp";
import type { ResolvedPlace } from "./types";

// Capture orchestration (tasks T1/T2/T14). Runs from the WhatsApp webhook.
// Flow: dedupe -> map phone->user -> resolve -> chip (Unfiled) OR needs_review reply.

interface Inbound {
  messageId: string;
  from: string; // WhatsApp phone (E.164 digits)
  text: string;
}

export async function ingestInbound({ messageId, from, text }: Inbound) {
  const db = supabaseAdmin();

  // Idempotency: one row per Meta message id (T1). Ignore replays.
  const seen = await db
    .from("wa_messages")
    .insert({ message_id: messageId, from_phone: from })
    .select("message_id")
    .single();
  if (seen.error) return; // duplicate (unique violation) or transient -> stop

  // Email-first onboarding: the phone must already be paired to an account.
  const user = await db
    .from("wa_links")
    .select("user_id")
    .eq("phone", from)
    .maybeSingle();
  const userId = user.data?.user_id as string | undefined;
  if (!userId) {
    await sendWhatsApp(
      from,
      "Welcome to Trav! Sign up with your email first, then connect WhatsApp to start saving places."
    );
    return;
  }

  // If they were mid needs_review, treat this text as the correction (manual path).
  const result = await resolverFor(text).resolve(text);

  if (!result.ok) {
    await sendWhatsApp(
      from,
      "Couldn't read that one — reply with the place name + city and I'll add it."
    );
    return;
  }

  await writeChip(userId, from, text, result.place);
  await sendWhatsApp(
    from,
    `Got it ✓ ${result.place.name}. Reply with a folder name to file it, or leave it in Unfiled.`
  );
}

async function writeChip(
  userId: string,
  _phone: string,
  sourceUrl: string,
  place: ResolvedPlace
) {
  const db = supabaseAdmin();
  await db.from("chips").insert({
    user_id: userId,
    source_url: sourceUrl,
    platform: "manual", // TODO(T2): carry the classified platform through
    status: place.lat ? "resolved" : "needs_review",
    name: place.name,
    city: place.city,
    category: place.category,
    place_id: place.placeId ?? null,
    lat: place.lat ?? null,
    lng: place.lng ?? null,
    address: place.address ?? null,
    photo_url: place.photoUrl ?? null,
    rating: place.rating ?? null,
  });
  // TODO(T8): log a taste_signal (category) here.
}
