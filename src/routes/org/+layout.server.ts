import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    const returnTo = `${url.pathname}${url.search}`;
    throw redirect(
      303,
      `/auth/signin?redirectTo=${encodeURIComponent(returnTo)}`,
    );
  }
  return {};
};
