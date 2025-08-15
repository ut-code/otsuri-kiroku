// このファイルは @better-auth/cli で使われるので、特別に @/ を使わない

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "../../lib/env.server.ts";
import { prisma } from "../prisma/prisma.server.ts";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [sveltekitCookies(getRequestEvent)],
  advanced: {
    cookiePrefix: "x-Aida-",
  },
});

export async function getSession() {
  return await auth.api.getSession({
    headers: getRequestEvent().request.headers,
  });
}
