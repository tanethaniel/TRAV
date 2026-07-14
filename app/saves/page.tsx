// ③ Saves / Collection. Unfiled inbox + folders (many-to-many, task T15).

export default function SavesPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-[22px] font-semibold">Saves</h1>

      <div className="flex gap-2 text-[13px]">
        <span className="rounded-pill bg-accent px-3 py-1 text-white">Location</span>
        <span className="rounded-pill bg-surface-muted px-3 py-1 text-ink-soft">
          Activity
        </span>
        <span className="rounded-pill bg-surface-muted px-3 py-1 text-ink-soft">
          Platform
        </span>
      </div>

      {/* Empty state (design review Pass 2). Chips render here once ingested (T2). */}
      <section className="rounded-card bg-surface p-6 text-center shadow-card">
        <p className="font-display text-[17px] font-semibold">No saves yet</p>
        <p className="mt-1 text-[15px] text-ink-soft">
          Forward a place to Trav on WhatsApp and it shows up here in Unfiled.
        </p>
      </section>
    </div>
  );
}
