import "../chunks/event-state.js";
import "@sveltejs/kit";
import { q } from "../chunks/query.js";
import "../chunks/false.js";
import "../chunks/paths.js";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
class HelloService {
  async hello() {
    await sleep(1e3);
    return "Hello, world!";
  }
}
const helloService = new HelloService();
const helloQuery = q(async () => {
  return await helloService.hello();
});
for (const [name, fn] of Object.entries({ helloQuery })) {
  fn.__.id = "6ds1t6/" + name;
  fn.__.name = name;
}
export {
  helloQuery
};
