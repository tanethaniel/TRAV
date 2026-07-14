// ① Onboarding / Recents. First-run routes to capture (design review Pass 1):
// email-first, then connect WhatsApp. Once active, this is the Unfiled/recent feed.

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-[28px] font-semibold text-ink">Trav</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Turn the places you save into a real trip.
        </p>
      </header>

      {/* Empty-state CTA (design review Pass 2). Real onboarding = T13. */}
      <section className="rounded-card bg-surface p-5 shadow-card">
        <h2 className="font-display text-[17px] font-semibold">Get started</h2>
        <ol className="mt-3 space-y-3 text-[15px] text-ink">
          <li className="flex gap-3">
            <Step n={1} /> Sign up with your email.
          </li>
          <li className="flex gap-3">
            <Step n={2} /> Connect WhatsApp.
          </li>
          <li className="flex gap-3">
            <Step n={3} /> Forward a place from Instagram, TikTok, or Maps — it lands in
            your saves.
          </li>
        </ol>
        <button
          className="mt-5 min-h-[44px] w-full rounded-pill bg-accent px-4 text-[15px] font-medium text-white active:bg-accent-press"
          type="button"
        >
          Sign up with email
        </button>
      </section>
    </div>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-accent text-[13px] font-semibold text-white">
      {n}
    </span>
  );
}
