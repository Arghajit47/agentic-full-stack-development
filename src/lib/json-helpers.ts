/** Safely parse a JSON-text column to string[]. Returns [] on any failure. */
export function parseJsonArray(str: string | null | undefined): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}