export function newId(): string {
  return crypto.randomUUID();
}

export function newToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}
