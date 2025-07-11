import { t } from "elysia";

// sample
export type User = typeof User.static;
export const User = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
});
