const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9-\s]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function isValidSlug(slug: string): boolean {
  return slug.length >= 3 && slug.length <= 50 && slugRegex.test(slug);
}

export function validateSlug(slug: string): void {
  if (!isValidSlug(slug)) {
    throw new Error("Invalid slug. Use 3-50 chars: lowercase letters, numbers, hyphens");
  }
}
