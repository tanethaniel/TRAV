// Server-only secrets. Never import this from a client component.
// See docs/INTEGRATIONS.md §4 for the full table.

export const env = {
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
  googleMapsServerKey: process.env.GOOGLE_MAPS_SERVER_KEY ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  whatsappToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
  whatsappPhoneId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
  whatsappAppSecret: process.env.WHATSAPP_APP_SECRET ?? "",
  whatsappVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? "",
  scraperKey: process.env.SCRAPER_API_KEY ?? "",
  gumloopKey: process.env.GUMLOOP_API_KEY ?? "",
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
} as const;

export function requireEnv(key: keyof typeof env): string {
  const v = env[key];
  if (!v) throw new Error(`Missing required env: ${key}`);
  return v;
}
