export function randomSelect<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("[randomSelect] array is of length 0!");
  }
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}
