import { getRequestEvent } from "$app/server";

const ORG_COOKIE = "org_id";

export function getActiveOrgIdCookie(): string | undefined {
  try {
    const event = getRequestEvent();
    return event.cookies.get(ORG_COOKIE);
  } catch {
    return undefined;
  }
}

export function setActiveOrgIdCookie(orgId: string) {
  const event = getRequestEvent();
  event.cookies.set(ORG_COOKIE, orgId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
