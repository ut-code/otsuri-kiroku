import { createAuthClient } from "better-auth/svelte";

// Use same-origin defaults; avoid hardcoded localhost which breaks preview/prod
export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({});
