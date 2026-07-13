# Trav — Canonical User Journey (v1)

Persona: a **Perpetual Saver**, first-run → habit. `[v1]` ships now · `[VISION]` roadmap ·
`✦` = a taste-signal is captured (passive in v1, personalizes in VISION).

Spine: **① onboard → ② send saves → ③ create folder saves → ④ discover spots →
⑤ plan/generate → ⑥ view & edit → ⑦ share.**

## Locked mechanics (v1)
| # | Step | Decision |
|---|------|----------|
| ① | Onboard | **Email-first** (magic-link) — signup before capture works — then **WhatsApp pairing** (code binds phone ↔ account). No taste quiz. No-WhatsApp fallback: paste-a-link on web. |
| ② | Send saves | Forward **new** links only via WhatsApp (bulk import of old saves deferred). `needs_review` failures fixed **conversationally in WhatsApp**. Can **file from WhatsApp** (reply a folder name). |
| ③ | Folders | **Many-to-many** (a chip can be in multiple folders). New saves land in an **Unfiled inbox**; a chip in 0 folders stays in Unfiled (never lost). File from WhatsApp or web. |
| ④ | Discover | Recommendations from **Google Places** (city + activity category). Taste-ranking = VISION. |
| ⑤ | Generate | User sets **start/end dates (or # days) + transport** first; real per-transport drive times; stops cluster into days. **No gap-fill** in v1 (only saved/added spots). |
| ⑥ | View & edit | Reorder / add / remove / move-to-day / change-time / swap; **every edit re-runs routing**; time change cascades to later stops. |
| ⑦ | Share | **View-only** tokenized public URL (no PII), revocable. **No clone** in v1 — CTA is "make your own" cold start. |

## Flow

```
① ONBOARD
   land (from a shared trip link or direct)
     → sign up with EMAIL (magic-link)                    ← required before capture
     → "Connect WhatsApp to save places" → opens Trav chat w/ prefilled code
     → bind phone ↔ account → empty app (Unfiled inbox empty-state)
   edge: no WhatsApp → fallback = paste-a-link on web
   [VISION] + taste quiz ✦

② SEND SAVES  (WhatsApp, ongoing)                         ⚑ magic moment
   IG / TikTok / Maps → Share → Trav
     → webhook (idempotent per message id) → classify URL
     → resolve → extract (Claude) → geocode (Places)
       ├ RESOLVED     → chip → Unfiled;  WA: "Got it ✓ La Taqueria, SF" [thumb]
       │                 + "reply a folder name to file, or leave in Unfiled"
       ├ RESOLVING    → chip skeleton (web)
       └ NEEDS_REVIEW → WA: "Couldn't read this — reply with the place + city"
                          → user replies → re-resolve → (2nd fail) park manual chip
     ✦ category signal logged

③ CREATE FOLDER SAVES  (web · Saves, or file from WhatsApp)
   Unfiled inbox → "New folder" (e.g. SF Roadtrip) → add chips (many-to-many)
     → filter Location / Activity / Platform to triage
   invariant: chip in 0 folders → stays in Unfiled
   [VISION] auto-file by taste ✦

④ DISCOVER SPOTS  (web · Discover)
   type city → Range / Activity / Collection filters
     → Google Places (city + category) → spot cards → [+] add to a folder (or Unfiled) ✦
   edge: unknown city / 0 results → "try another city"
   [VISION] recs ranked by taste graph

⑤ PLAN / GENERATE  (web · Trips)                          ⚑ second wow
   pick folder → "Generate"
     → TRIP SETUP: start–end dates (or # days) + transport (drive / walk / transit)
     → Distance Matrix (real times, per transport) → cluster stops into days
     → per-day order (nearest-neighbor + open/close hours) → Claude narrative
     → itinerary: list ⇄ map + day switcher
   states: PLANNING… / "add stops first" (empty) / "maps hiccup, retry" (error)
   v1: NO gap-fill (only her spots)

⑥ VIEW & EDIT  (web · Trips: list ⇄ map, day tabs)
   edits: reorder | add (from folder / Discover) | remove | move-to-another-day |
          change time | swap spot
     → each edit re-runs routing (times stay real); time change cascades downstream ✦keep/remove
   [VISION] natural-language edits ("make Day 2 chill")

⑦ SHARE  (public link)                                    ← growth loop
   Share → tokenized view-only URL → logged-out viewer sees plan + map (no PII)
     → CTA "make your own" → back to ①  (cold start; no clone in v1)
     → owner can revoke (link dies)
   [VISION] collaborate / clone-to-my-Trav
```

## Open (non-blocking)
- A single listicle link that names several places → reply-to-pick vs one chip? (default: reply-to-pick)

See `DESIGN.md` for the visual system and `docs/INTEGRATIONS.md` for the APIs and keys
behind each step.
