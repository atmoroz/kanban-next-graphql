export function toInitials(name?: string | null, email?: string | null) {
  const base = name?.trim() || email?.trim() || "";
  const words = base.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    const a = words[0]?.[0] ?? "";
    const b = words[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }

  return base.slice(0, 2).toUpperCase();
}
