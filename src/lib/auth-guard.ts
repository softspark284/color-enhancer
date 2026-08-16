import { redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side session gate for signed-in dashboards.
 * Used from `beforeLoad` on routes declared with `ssr: false`.
 */
export async function requireSession(href: string) {
  if (typeof window === "undefined") return;
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw redirect({ to: "/login", search: { next: href }, replace: true });
  }
}
