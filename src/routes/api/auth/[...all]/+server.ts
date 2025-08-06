import { auth } from "@/services/auth/auth.server.ts";
import type { RequestHandler } from "./$types.ts";

export const fallback: RequestHandler = async (event) => {
  return await auth.handler(event.request);
};
