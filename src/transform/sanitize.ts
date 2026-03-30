// ============================================================================
// Guarden — String Sanitization Utilities
// ============================================================================

/**
 * Trim whitespace from both ends.
 */
export function trim(value: string): string {
  return value.trim();
}

/**
 * Trim whitespace from the start.
 */
export function trimStart(value: string): string {
  return value.trimStart();
}

/**
 * Trim whitespace from the end.
 */
export function trimEnd(value: string): string {
  return value.trimEnd();
}

/**
 * Convert to lowercase.
 */
export function lowercase(value: string): string {
  return value.toLowerCase();
}

/**
 * Convert to uppercase.
 */
export function uppercase(value: string): string {
  return value.toUpperCase();
}

/**
 * Capitalize the first letter.
 */
export function capitalize(value: string): string {
  if (value.length === 0) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Capitalize the first letter of each word.
 */
export function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Convert to camelCase.
 */
export function camelCase(value: string): string {
  return value
    .replace(/[-_\s]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * Convert to kebab-case.
 */
export function kebabCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert to snake_case.
 */
export function snakeCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Strip HTML tags from a string.
 *
 * @example
 * ```ts
 * stripHtml("<p>Hello <b>world</b></p>") // "Hello world"
 * ```
 */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML special characters to prevent XSS.
 *
 * @example
 * ```ts
 * escapeHtml('<script>alert("xss")</script>')
 * // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(value: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
  };
  return value.replace(/[&<>"'`]/g, (char) => escapeMap[char]);
}

/**
 * Unescape HTML entities.
 */
export function unescapeHtml(value: string): string {
  const unescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`',
  };
  return value.replace(/&(?:amp|lt|gt|quot|#x27|#x60);/g, (entity) => unescapeMap[entity]);
}

/**
 * Truncate a string to a maximum length.
 *
 * @example
 * ```ts
 * truncate("Hello, World!", 8)        // "Hello..."
 * truncate("Hello, World!", 8, "…")   // "Hello, …"
 * ```
 */
export function truncate(value: string, maxLength: number, suffix = '...'): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert a string to a URL-friendly slug.
 *
 * @example
 * ```ts
 * slugify("Hello, World! 🌍")  // "hello-world"
 * slugify("  Foo   BAR  baz ") // "foo-bar-baz"
 * ```
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')     // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')        // Remove non-alphanumeric
    .replace(/[\s-]+/g, '-')             // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '');            // Trim leading/trailing hyphens
}

/**
 * Remove all whitespace from a string.
 */
export function removeWhitespace(value: string): string {
  return value.replace(/\s/g, '');
}

/**
 * Collapse multiple spaces into a single space.
 */
export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Pad a string to a minimum length (left-pads by default).
 */
export function padStart(value: string, length: number, fillChar = ' '): string {
  return value.padStart(length, fillChar);
}

/**
 * Pad a string to a minimum length (right-pads).
 */
export function padEnd(value: string, length: number, fillChar = ' '): string {
  return value.padEnd(length, fillChar);
}

/**
 * Reverse a string (Unicode-aware).
 */
export function reverse(value: string): string {
  return [...value].reverse().join('');
}

/**
 * Count occurrences of a substring.
 */
export function countOccurrences(value: string, search: string): number {
  if (search.length === 0) return 0;
  let count = 0;
  let pos = 0;
  while ((pos = value.indexOf(search, pos)) !== -1) {
    count++;
    pos += search.length;
  }
  return count;
}
