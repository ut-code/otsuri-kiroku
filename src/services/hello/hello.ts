import { randomSelect } from "@/lib/utils/array.ts";
import { latency } from "@/lib/utils/sleep.ts";

const greetingStarters: string[] = [
  "Hello",
  "Hi",
  "Hey",
  "Greetings",
  "Good day",
  "Howdy",
  "Welcome",
  "Salutations",
] as const;

const recipients: string[] = [
  "friend",
  "there",
  "beautiful",
  "champion",
  "superstar",
  "world",
  "sunshine",
  "adventurer",
  "explorer",
  "creator",
  "dreamer",
  "amazing person",
] as const;

const endings: string[] = [
  "!",
  "! 🌟",
  "! Hope you're having a great day!",
  "! Ready for something awesome?",
  "! You're doing great!",
  "! Keep being amazing!",
  "! The world is brighter with you in it!",
] as const;

export class HelloService {
  userLog: string[] = [];

  async hello(name?: string) {
    await latency(100);

    const starter = randomSelect(greetingStarters);
    const recipient = name ?? randomSelect(recipients);
    const ending = randomSelect(endings);

    this.userLog.push(recipient);
    return `${starter}, ${recipient}${ending}`;
  }
}
