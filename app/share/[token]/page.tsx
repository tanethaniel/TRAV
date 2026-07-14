// ⑦ Public share page (view-only, task T9). Tokenized, no PII, revocable.
// TODO: give this its own layout without the app bottom nav; render trip+map from
// a public projection. "Make your own" is the cold-start growth loop (no clone in v1).

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // TODO(T9): look up the tokenized public trip row. States: expired/revoked, empty, ok.
  const trip: { title: string } | null = null;

  if (!trip) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-display text-[17px] font-semibold">Trip not found</p>
        <p className="text-[15px] text-ink-soft">
          This link may have expired or been revoked.
        </p>
        <a
          href="/"
          className="mt-2 min-h-[44px] rounded-pill bg-accent px-5 py-3 text-[15px] font-medium text-white"
        >
          Make your own with Trav
        </a>
        <span className="sr-only">token {token}</span>
      </div>
    );
  }

  return null;
}
