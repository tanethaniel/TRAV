// ④ Discover. Google Places by city + activity category (task T16).

export default function DiscoverPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[15px] text-ink-soft">Where would you like to discover?</p>
        <input
          aria-label="City"
          placeholder="Enter city"
          className="mt-2 min-h-[44px] w-full rounded-input bg-surface px-4 text-[17px] shadow-card outline-none"
        />
      </div>

      <div className="flex gap-2 text-[13px]">
        <span className="rounded-pill bg-surface-muted px-3 py-1 text-ink-soft">
          Range
        </span>
        <span className="rounded-pill bg-accent px-3 py-1 text-white">Activity</span>
        <span className="rounded-pill bg-accent px-3 py-1 text-white">Collection</span>
      </div>

      <section className="rounded-card bg-surface p-6 text-center shadow-card">
        <p className="text-[15px] text-ink-soft">
          Search a city to see spots you can add to a folder.
        </p>
      </section>
    </div>
  );
}
