// ============================================================================
// Guarden — Advanced Type Guards
// ============================================================================

import type { Guard } from '../utils/types.js';

// -- String guards ----------------------------------------------------------

/**
 * Check if a value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Check if a value is a string matching an email pattern.
 */
export function isEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  // RFC 5322 simplified pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Check if a value is a valid URL string.
 */
export function isURL(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a value is a valid UUID (v1-v5).
 */
export function isUUID(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

/**
 * Check if a value is a valid ISO 8601 date string.
 */
export function isISO8601(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value);
}

/**
 * Check if a value is a valid JSON string.
 */
export function isJSONString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a value is a string matching a hex color (#fff or #ffffff).
 */
export function isHexColor(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
}

// -- Number guards ----------------------------------------------------------

/**
 * Check if a value is a positive number (> 0).
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && value > 0;
}

/**
 * Check if a value is a negative number (< 0).
 */
export function isNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && value < 0;
}

/**
 * Check if a value is an integer.
 */
export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

/**
 * Check if a value is a safe integer (within Number.MAX_SAFE_INTEGER bounds).
 */
export function isSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value);
}

// -- Array guards -----------------------------------------------------------

/**
 * Check if a value is a non-empty array.
 */
export function isNonEmptyArray<T = unknown>(
  value: unknown,
): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

// -- Factory guards ---------------------------------------------------------

/**
 * Create a guard that checks if a number is within a range [min, max].
 *
 * @example
 * ```ts
 * const isPercent = isInRange(0, 100);
 * isPercent(50)   // true
 * isPercent(150)  // false
 * ```
 */
export function isInRange(min: number, max: number): Guard<number> {
  return (value: unknown): value is number =>
    typeof value === 'number' && !Number.isNaN(value) && value >= min && value <= max;
}

/**
 * Create a guard that checks if a value is one of the specified values.
 *
 * @example
 * ```ts
 * const isDirection = isOneOf(['up', 'down', 'left', 'right'] as const);
 * if (isDirection(input)) {
 *   // input is 'up' | 'down' | 'left' | 'right'
 * }
 * ```
 */
export function isOneOf<T extends readonly unknown[]>(
  values: T,
): Guard<T[number]> {
  const valueSet = new Set<unknown>(values);
  return (value: unknown): value is T[number] => valueSet.has(value);
}

/**
 * Create a guard that checks if a string matches a pattern.
 *
 * @example
 * ```ts
 * const isSlug = isMatch(/^[a-z0-9-]+$/);
 * isSlug("hello-world") // true
 * isSlug("Hello World") // false
 * ```
 */
export function isMatch(pattern: RegExp): Guard<string> {
  return (value: unknown): value is string =>
    typeof value === 'string' && pattern.test(value);
}

/**
 * Create a guard that checks if a string has a minimum length.
 */
export function isMinLength(min: number): Guard<string> {
  return (value: unknown): value is string =>
    typeof value === 'string' && value.length >= min;
}

/**
 * Create a guard that checks if a string has a maximum length.
 */
export function isMaxLength(max: number): Guard<string> {
  return (value: unknown): value is string =>
    typeof value === 'string' && value.length <= max;
}

/**
 * Check if a value is an instance of a given class.
 *
 * @example
 * ```ts
 * const isMyError = isInstanceOf(TypeError);
 * ```
 */
export function isInstanceOf<T>(
  constructor: new (...args: unknown[]) => T,
): Guard<T> {
  return (value: unknown): value is T => value instanceof constructor;
}
