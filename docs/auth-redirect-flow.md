# Auth Redirect Flow

This app follows a consistent, same-origin redirect flow for user authentication across pages, components, and OAuth.

## Goals

- Preserve the user’s intended destination via a `redirectTo` param.
- Redirect unauthenticated users to the sign-in page using a 303 status code.
- After successful auth, return the user to `redirectTo` (or `/`).
- Prevent open-redirects by sanitizing `redirectTo` to same-origin paths only.

## Route Summary

- `/auth/signin` — sign-in UI. Accepts `redirectTo`; sanitizes it and, if already authenticated, 303s to it immediately.

## Key Pieces

- Page guard example: `src/routes/org/+layout.server.ts`
  - If `locals.user` is missing, compute `returnTo = url.pathname + url.search` and `throw redirect(303, "/auth/signin?redirectTo=...")`.

- Sign-in page: `src/routes/auth/signin/+page.server.ts` and `+page.svelte`
  - Load sanitizes `redirectTo`.
  - If a session already exists, server-side 303 to `redirectTo` (no flash).
  - Email/password flows navigate to `redirectTo` after success.
  - OAuth flows use `signIn.social({ provider, callbackURL: redirectTo })` so the provider returns to the intended target.

- Header button: `src/services/auth/components/AuthButton.svelte`
  - "Sign in" link includes `?redirectTo=<current path>`.
  - Google sign-in sets `callbackURL` to the current path as well.

- Service-layer guards: `src/services/org/guards.server.ts`
  - These throw errors (Unauthorized/Forbidden) for server/domain logic.
  - Page/route code is responsible for translating unauthenticated states into redirects for UX.

## Status Codes

- Use `303 See Other` for navigation redirects in SvelteKit for a better SPA UX.

## Security

- Always sanitize `redirectTo` to same-origin relative paths (e.g., reject `http://...` or `//...`).
- Do not echo back arbitrary URLs in redirects.

## Usage Examples

- Link that requires auth (client):
  - `<a href="{signinUrl('/org/acme/settings')}">Edit settings</a>`
  - Or programmatic: `await gotoViaSignin(currentPath)`
- Guarded layout (server):
  - When `!locals.user`, compute `returnTo = url.pathname + url.search` and `redirect(303, '/auth/signin?redirectTo=' + encodeURIComponent(returnTo))`.
- OAuth button (client):
  - `await signIn.social({ provider: 'google', callbackURL: redirectTo })`

### Helpers

- `sanitizeRedirect(to: string)` — same-origin relative path guard.
  - Location: `src/services/auth/proxy.ts`
- `buildSigninPath(to: string)` — `/auth/signin?redirectTo=<to>` with sanitization.
  - Location: `src/services/auth/proxy.ts`
- `signinUrl(to: string)` — resolved URL for anchors.
  - Location: `src/services/auth/proxy.ts`
- `gotoViaSignin(to: string)` — programmatic navigation; browser-only fallback.
  - Location: `src/services/auth/proxy.ts`

## Migration Notes

- The former proxy route has been removed. Use `/auth/signin?redirectTo=...` directly via the helpers above.

## TL;DR Pattern

- Guard pages with `locals.user`, redirect unauthenticated users to `/auth/signin?redirectTo=<path+query>`.
- On sign-in, always navigate/return to the sanitized `redirectTo`.
