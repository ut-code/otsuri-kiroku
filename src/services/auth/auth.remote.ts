import { getSession } from "@/services/auth/auth.server.ts";
import { query } from "$app/server";

export const sessionQuery = query(async () => {
  const session = await getSession();
  return session;
});
