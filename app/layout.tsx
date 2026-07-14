import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Trav",
  description: "Turn the places you save into a real trip.",
};

// v1 is responsive mobile-web: the mockups are the mobile layout, desktop is a
// centered mobile-width column (DESIGN.md / design review DR2).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg">
          <main className="flex-1 px-4 pb-24 pt-6">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
