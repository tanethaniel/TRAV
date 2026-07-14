import Link from "next/link";

// v1 nav — Calendars deferred (design review). Recents == the capture/Unfiled feed.
const TABS = [
  { href: "/", label: "Recents" },
  { href: "/saves", label: "Saves" },
  { href: "/discover", label: "Discover" },
  { href: "/trips", label: "Trips" },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-md justify-around border-t border-hairline bg-surface/95 px-2 py-3 backdrop-blur">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="min-h-[44px] min-w-[44px] px-3 text-center text-[13px] font-medium text-ink-soft"
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
