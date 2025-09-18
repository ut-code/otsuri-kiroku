import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { sanitizeRedirect } from "$services/auth/proxy.ts";

export const load: PageServerLoad = async ({ url, locals }) => {
  const raw = url.searchParams.get("redirectTo") ?? "/";
  const redirectTo = sanitizeRedirect(raw);

  if (locals.user) {
    throw redirect(303, redirectTo);
  }

  return { redirectTo };
};
