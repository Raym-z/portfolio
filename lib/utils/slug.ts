export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base: string, existing: string[]) {
  const root = slugify(base) || "project";
  let candidate = root;
  let index = 2;

  while (existing.includes(candidate)) {
    candidate = `${root}-${index}`;
    index += 1;
  }

  return candidate;
}
