import * as v from "valibot";

export type Env = v.InferOutput<typeof Env>;
export const Env = v.object({
  DATABASE_URL: v.string(),
  BETTER_AUTH_SECRET: v.string(),
  BETTER_AUTH_URL: v.string(),
  GOOGLE_CLIENT_ID: v.string(),
  GOOGLE_CLIENT_SECRET: v.string(),
});

export const env = v.parse(Env, process.env);
