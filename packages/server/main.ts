import { sleep } from "bun";
import { Elysia, status, t } from "elysia";

export const app = new Elysia({ prefix: "/api" }).get(
  "/:name?",
  async ({ params: { name } }) => {
    await sleep(300);

    if (Math.random() < 0.3) return status(500, "Oopsies on the server");
    return `Hello ${name ?? "Elysia"} 🦊`;
  },
  {
    params: t.Object({
      name: t.Optional(t.String()),
    }),
  },
);
export type App = typeof app;
