import { createAuthClient } from "better-auth/svelte";

export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: "http://localhost:3000",
  });
