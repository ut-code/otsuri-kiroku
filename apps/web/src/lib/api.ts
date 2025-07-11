import { treaty } from "@elysiajs/eden";
import type { App } from "@packages/server";

export function useAPI({ host }: { host: string }) {
  return treaty<App>(host).api;
}
