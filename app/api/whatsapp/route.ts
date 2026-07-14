import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { env } from "@/lib/env";
import { ingestInbound } from "@/lib/capture";

// Meta WhatsApp Cloud API webhook (task T1). GET = subscription handshake,
// POST = inbound messages (forwarded links + needs_review replies).

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  if (
    p.get("hub.mode") === "subscribe" &&
    p.get("hub.verify_token") === env.whatsappVerifyToken
  ) {
    return new NextResponse(p.get("hub.challenge") ?? "", { status: 200 });
  }
  return new NextResponse("forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("bad signature", { status: 401 });
  }

  const body = JSON.parse(raw);
  // Meta delivers batched entries; each message id makes ingest idempotent (T1).
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const msg of change.value?.messages ?? []) {
        const from: string = msg.from;
        const text: string | undefined = msg.text?.body;
        if (from && text) {
          await ingestInbound({ messageId: msg.id, from, text });
        }
      }
    }
  }
  // Always 200 fast so Meta doesn't retry-storm; work is done/queued above.
  return NextResponse.json({ ok: true });
}

function verifySignature(raw: string, header: string | null): boolean {
  if (!env.whatsappAppSecret) return true; // dev: no secret set -> allow
  if (!header) return false;
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", env.whatsappAppSecret).update(raw).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
  } catch {
    return false;
  }
}
