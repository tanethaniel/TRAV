# DESIGN.md — Trav

Lite design system, reverse-engineered from the v1 mockups (Recents/Activity,
Collection/Saves, Trips, Discover). Source of truth for tokens so builds don't drift.
v1 target is **responsive mobile-web** (the mockups are the mobile layout).

## Voice / feel
Calm, warm, editorial. Real place photography is the hero; chrome stays quiet.
App-UI rules: dense but readable, minimal borders, one accent, cards only when the
card IS the interaction (a save, a stop, a collection).

## Color tokens
```
--bg            #F6F5F2   /* warm off-white app background */
--surface       #FFFFFF   /* cards, sheets */
--surface-muted #ECEBE7   /* inactive chips, skeletons */
--ink           #1A1A1A   /* primary text */
--ink-soft      #6B7280   /* secondary text, metadata */
--accent        #1B3FA0   /* Trav blue — icons, active pills, primary actions */
--accent-press  #163383
--gold          #F5B301   /* star ratings */
--trav-green    #1E9E5A   /* "Trav generated" source badge */
--danger        #C0392B   /* errors, needs-review */
--hairline      rgba(0,0,0,0.06)
```
Rules: one accent (Trav blue). No purple/indigo gradients. Text over photos ALWAYS
gets a bottom scrim (`linear-gradient(transparent, rgba(0,0,0,0.65))`) so captions
hit 4.5:1 contrast — never raw white text on a busy image.

## Typography
Two typefaces max. No system/Inter/Roboto as primary.
```
--font-display  "General Sans", sans-serif   /* screen titles, place names */
--font-body     "Geist", sans-serif          /* body, metadata, controls */
```
Scale: 28/22/17/15/13. Body text never below 16px. Titles use display, semibold.

## Shape & spacing
```
--radius-card   16px
--radius-pill   999px
--radius-input  12px
--space         4,8,12,16,24,32   /* 8pt-ish grid */
--shadow-card   0 1px 3px rgba(0,0,0,0.08)
```
Uniform bubbly radius on everything is banned — cards 16px, pills full, inputs 12px.

## Components (v1 vocabulary)
- **Chip** — a saved place: icon-in-blue-circle, name, `location · platform`, optional
  star rating. States: resolving (skeleton), resolved, needs_review (danger dot + "tap to fix").
- **Source badge** — platform origin (Instagram / TikTok / Google Maps / Trav-green).
- **Filter pill row** — Location / Activity / Platform; active = accent fill, inactive = muted.
- **Collection card** — cover photo + count + title (SF Roadtrip, Okinawa).
- **Itinerary stop** — timeline node + time range + address; transit legs between stops.
- **Day switcher** — segmented control for multi-day trips.
- **Bottom nav** — v1: Recents · Saves · Discover · Trips. (Calendars deferred.)

## Accessibility
Touch targets ≥44px. Contrast ≥4.5:1 on all body text (scrim over photos). Visible
labels on inputs (no placeholder-as-only-label). Keyboard/focus states on web.
