// ⑤⑥ Trips. Pick a folder, set dates + transport, generate, then view & edit
// (tasks T7/T17/T18). List ⇄ map + day switcher.

export default function TripsPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-[22px] font-semibold">Trips</h1>

      <section className="rounded-card bg-surface p-6 text-center shadow-card">
        <p className="font-display text-[17px] font-semibold">No trips yet</p>
        <p className="mt-1 text-[15px] text-ink-soft">
          Pick a folder, set your dates and how you&apos;re getting around, and Trav
          builds a day-by-day plan.
        </p>
        <button
          className="mt-4 min-h-[44px] rounded-pill bg-accent px-5 text-[15px] font-medium text-white active:bg-accent-press"
          type="button"
        >
          Generate a trip
        </button>
      </section>
    </div>
  );
}
