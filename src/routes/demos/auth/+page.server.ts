import type { PageServerLoad } from "./$types.ts";

export const load: PageServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
    session: locals.session,
  };
};
