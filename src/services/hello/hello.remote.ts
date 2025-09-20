import * as v from "valibot";
import { HelloService } from "@/services/hello/hello.ts";
import { command, query } from "$app/server";
import { unique } from "$lib/utils/array.ts";
import { latency } from "$lib/utils/sleep.ts";

const helloService = new HelloService();

export const metUsersQuery = query(async () => {
  await latency(100);

  return unique(helloService.userLog);
});

export const greetCommand = command(
  v.object({
    name: v.optional(v.string()),
  }),
  async ({ name }) => {
    const hello = await helloService.hello(name);
    return hello;
  },
);
