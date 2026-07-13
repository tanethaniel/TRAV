# Trav — Integrations, APIs & Secrets (v1)

Maps every external service Trav v1 depends on, which API each step calls, and **where AI
keys and tokens are needed**. Ties to `docs/USER_JOURNEY.md` (steps ①–⑦) and the design doc.

Rule of thumb: **every key that can move money or read data is server-side only** (Next.js
route handlers / server actions on Vercel). The only client-exposed keys are the Supabase
anon key (RLS-enforced) and an HTTP-referrer-restricted Google Maps *browser* key for the map render.

## 1. Integration inventory

| Service | Why Trav needs it | v1 APIs used | Auth type |
|---|---|---|---|
| **Anthropic (Claude)** | The **AI**: extract a place from a caption; write the itinerary narrative | Messages API | `ANTHROPIC_API_KEY` (server) |
| **Google Maps Platform** | Resolve/geocode places, Discover recs, real drive times, map render | Places, Geocoding, Distance Matrix, Directions, Maps JS/Static | API keys (server + restricted browser) |
| **Meta WhatsApp Business Cloud API** | Capture channel: receive forwarded links + replies, send confirmations/needs_review | Cloud API (inbound webhook + outbound messages) | System-user access token + app secret |
| **Supabase** | Postgres DB, email magic-link **Auth**, storage, Row Level Security | Auth, Postgres/PostgREST, Storage | anon key (client) + service-role (server) |
| **Vercel** | Hosting, serverless functions, env-var/secret store, auto-deploy | Platform (not called at runtime) | Dashboard / project env |
| **Email delivery** (optional) | Deliverable magic-link emails | SMTP / Resend API | `RESEND_API_KEY` or SMTP creds |
| **IG/TikTok link resolution** | Fetch caption/location from a forwarded reel/post — **fragile, no official API** | page fetch / oEmbed / 3rd-party scraper | none, or `SCRAPER_API_KEY` |

## 2. Which integration each journey step hits

```
① ONBOARD          Supabase Auth (email magic-link) → WhatsApp pairing (bind phone↔account)
② SEND SAVES       WhatsApp webhook(in) → [IG/TikTok resolve] → Claude(extract) → Google Places(geocode)
                     → Supabase(write chip) → WhatsApp(out: "Got it"/needs_review)
③ FOLDERS          Supabase (folders, many-to-many, Unfiled inbox)  [+ WhatsApp filing reply]
④ DISCOVER         Google Places (city + category) → Supabase(add to folder)
⑤ GENERATE         Google Distance Matrix/Directions(real times) → Claude(narrative)
                     → Google Maps JS/Static(map) → Supabase(persist trip/day/stops)
⑥ VIEW & EDIT      Supabase(update stops) → Google Distance Matrix(re-route) → Maps(map)
⑦ SHARE            Supabase(tokenized public row) → Google Maps Static/JS(public map render)
```

## 3. Where the AI keys/tokens are needed (Anthropic)

`ANTHROPIC_API_KEY` — **server-side only**, used in exactly two places:

| Call | Step | Suggested model | Why |
|---|---|---|---|
| `extractPlace(caption)` → `{name, city, category}` | ② capture | **Claude Haiku 4.5** | High volume, cheap, fast; simple extraction |
| `generateDayPlan(stops, times)` → narrative | ⑤ generate | **Claude Sonnet 5** | Quality writing; lower volume |

Rules:
- Never ship `ANTHROPIC_API_KEY` to the browser. Both calls run in server route handlers.
- The LLM **never** invents drive times or coordinates — those come from Google Maps. Claude
  only extracts text → structured fields, and writes prose. (See design doc D1.)
- These two prompts are **eval-gated** (see task T4), not unit-tested, so prompt changes
  don't silently regress.

## 4. Secrets & environment variables

Store in Vercel project env (and a local `.env.local`, git-ignored). Never commit real values.

| Env var | Service | Scope | Used in | Notes |
|---|---|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic | server | ②, ⑤ | The AI key. Rotate on leak. |
| `GOOGLE_MAPS_SERVER_KEY` | Google Maps | server | ②④⑤⑥ | Places, Geocoding, Distance Matrix, Directions. Restrict by API + IP. |
| `GOOGLE_MAPS_BROWSER_KEY` | Google Maps | **client** | ⑤⑥⑦ (map render) | HTTP-referrer-restricted to Trav domains; Maps JS/Static only. |
| `SUPABASE_URL` | Supabase | client-safe | all | Public. |
| `SUPABASE_ANON_KEY` | Supabase | **client** | all (via RLS) | Safe to expose; RLS enforces per-user access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | server | webhook writes, admin | **Bypasses RLS** — server only, never in the browser. |
| `WHATSAPP_ACCESS_TOKEN` | Meta | server | ② outbound | System-user token; long-lived. Rotate periodically. |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta | server/config | ② | Identifies the sending number. |
| `WHATSAPP_APP_SECRET` | Meta | server | ② inbound | Verify `X-Hub-Signature-256` on every webhook. |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Meta | server | ② webhook setup | Handshake for webhook subscription. |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Meta | config | ② | WABA id. |
| `RESEND_API_KEY` (optional) | Resend/SMTP | server | ① | Custom magic-link email deliverability. |
| `SCRAPER_API_KEY` (optional) | 3rd-party fetch | server | ② | Only if using a scraping service for IG/TikTok. |
| `APP_URL` | — | config | ①⑦ | Base URL for magic-link + share links. |

## 5. The fragile integration — IG/TikTok resolution (②)

There is **no official API** to read a user's saved posts or reliably extract a place from an
arbitrary reel. v1 handles this as tiered, best-effort (design doc D2):
- **Google Maps links** resolve cleanly via redirect + Places — the reliable path.
- **Instagram / TikTok** links are attempted (page fetch / oEmbed / optional scraper service);
  on failure the chip goes to `needs_review` and the fix happens **in WhatsApp**.
- Options if best-effort proves too flaky: a managed fetch/scrape provider (adds `SCRAPER_API_KEY`
  + cost) or lean harder on the manual-reply path. Do **not** scrape logged-in save collections
  (ToS + fragility). Bulk import stays deferred.

## 6. Cost & rate-limit notes

- **Google Maps** is the main cost center. Cache geocode/Places results by `place_id`/URL so the
  same shared spot resolves once, not per user (task T5). Cap stops-per-day to bound Distance
  Matrix (O(n²)). Enable billing + budget alerts.
- **Anthropic**: extraction is high-volume → use Haiku 4.5. Narrative is low-volume → Sonnet 5.
- **WhatsApp Cloud API**: user-initiated messages keep replies inside the 24h service window
  (no paid template needed). Free tier covers early volume.
- **Supabase**: free/pro tier fine for MVP; watch Storage if caching place photos.

## 7. Security rules (non-negotiable)

- Server-only keys (`ANTHROPIC_API_KEY`, `GOOGLE_MAPS_SERVER_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  all `WHATSAPP_*`) never reach the client bundle.
- Verify the WhatsApp webhook signature (`WHATSAPP_APP_SECRET`) on every inbound call; make
  ingest idempotent per message id.
- Supabase RLS scoped to `user_id` on every table; the public share page reads only a
  tokenized, PII-free projection.
- Restrict the browser Maps key by HTTP referrer; restrict the server Maps key by API + IP.
