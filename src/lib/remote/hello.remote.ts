import { query } from "$app/server";
import { HelloService } from "$services/hello/hello.server.ts";

const helloService = new HelloService();

export const helloQuery = query(async () => {
  return await helloService.hello();
});
