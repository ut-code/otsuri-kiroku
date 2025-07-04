import { t } from "elysia";

// sample
export const User = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
});
