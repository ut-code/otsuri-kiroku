// no imports

export function sanitizeRedirect(target: string): string {
  if (!target || !target.startsWith("/")) return "/";
  if (target.startsWith("//")) return "/";
  return target;
}

export function buildSigninPath(to: string): string {
  const safe = sanitizeRedirect(to);
  return `/auth/signin?redirectTo=${encodeURIComponent(safe)}`;
}

export function signinUrl(to: string): string {
  return buildSigninPath(to);
}

export async function gotoViaSignin(to: string) {
  const url = signinUrl(to);
  if (typeof window !== "undefined" && window?.location) {
    window.location.assign(url);
    return;
  }
  throw new Error("gotoViaSignin can only run in the browser");
}
