export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function latency(base: number) {
  await sleep(base / 2 + Math.random() * base);
}
