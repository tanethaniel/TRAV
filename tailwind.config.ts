import type { Config } from "tailwindcss";

// Tokens mirror /DESIGN.md — keep the two in sync.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F6F5F2",
        surface: "#FFFFFF",
        "surface-muted": "#ECEBE7",
        ink: "#1A1A1A",
        "ink-soft": "#6B7280",
        accent: "#1B3FA0",
        "accent-press": "#163383",
        gold: "#F5B301",
        "trav-green": "#1E9E5A",
        danger: "#C0392B",
        hairline: "rgba(0,0,0,0.06)",
      },
      fontFamily: {
        display: ["var(--font-display)", "General Sans", "sans-serif"],
        body: ["var(--font-body)", "Geist", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
        input: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
