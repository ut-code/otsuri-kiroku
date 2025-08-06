import { randomSelect } from "$lib/utils/array.ts";
import { sleep } from "$lib/utils/sleep.ts";

const names = [
  "World",
  "Homer",
  "Bart",
  "Lisa",
  "Maggie",
  "Apu",
  "Moe",
  "Barney",
  "Krusty",
  "Sideshow Bob",
  "Milhouse",
  "Ned",
  "Marge",
  "Patty",
  "Selma",
  "Grampa",
  "Kirk",
  "Luann",
];

export class HelloService {
  async hello() {
    await sleep(100);
    return `Hello, ${randomSelect(names)}!`;
  }
}
