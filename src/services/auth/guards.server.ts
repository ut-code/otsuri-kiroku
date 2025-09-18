import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { buildSigninPath } from "$services/auth/proxy.ts";

export function requireUser(): NonNullable<App.Locals["user"]> {
  const event = getRequestEvent();
  const user = event.locals.user;
  if (user) return user as NonNullable<App.Locals["user"]>;
  const returnTo = `${event.url.pathname}${event.url.search}`;
  throw redirect(303, buildSigninPath(returnTo));
}

export type AuthContext = {
  session: NonNullable<App.Locals["session"]>;
  user: NonNullable<App.Locals["user"]>;
};

export async function requireSession(): Promise<AuthContext> {
  const event = getRequestEvent();
  const session = event.locals.session;
  const user = event.locals.user;
  if (session && user) return { session, user } as AuthContext;
  const returnTo = `${event.url.pathname}${event.url.search}`;
  throw redirect(303, buildSigninPath(returnTo));
}
