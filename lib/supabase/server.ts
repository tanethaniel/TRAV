import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Request-scoped client (RLS enforced as the signed-in user). Use in Server
// Components / route handlers that act on behalf of the user.
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (
        toSet: { name: string; value: string; options: CookieOptions }[]
      ) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component render — safe to ignore.
        }
      },
    },
  });
}

// Service-role client — BYPASSES RLS. Server only, only for trusted flows like the
// WhatsApp webhook writing a chip for a phone-matched user. Never expose to client.
export function supabaseAdmin() {
  return createClient(env.supabaseUrl, env.supabaseServiceRole, {
    auth: { persistSession: false },
  });
}
