// ============================================================================
// Guarden — Type Coercion Utilities
// ============================================================================

import { Ok, Err, type Result } from '../result/result.js';
import { CoercionError } from '../utils/errors.js';

/**
 * Coerce a value to a number.
 * Handles strings, booleans, and Date objects.
 *
 * @example
 * ```ts
 * toNumber("42")       // Ok(42)
 * toNumber("abc")      // Err(CoercionError)
 * toNumber(true)       // Ok(1)
 * toNumber(null)       // Err(CoercionError)
 * ```
 */
export function toNumber(value: unknown): Result<number, CoercionError> {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? Err(new CoercionError(value, 'number')) : Ok(value);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return Err(new CoercionError(value, 'number'));
    const n = Number(trimmed);
    return Number.isNaN(n) ? Err(new CoercionError(value, 'number')) : Ok(n);
  }
  if (typeof value === 'boolean') return Ok(value ? 1 : 0);
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? Err(new CoercionError(value, 'number')) : Ok(time);
  }
  return Err(new CoercionError(value, 'number'));
}

/**
 * Coerce a value to a string.
 * Handles numbers, booleans, null, undefined, and objects.
 *
 * @example
 * ```ts
 * toString(42)        // "42"
 * toString(null)      // ""
 * toString(undefined) // ""
 * toString(true)      // "true"
 * ```
 */
export function toString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/**
 * Coerce a value to a boolean.
 * Handles common truthy/falsy string representations.
 *
 * @example
 * ```ts
 * toBoolean("true")   // true
 * toBoolean("yes")    // true
 * toBoolean("1")      // true
 * toBoolean("false")  // false
 * toBoolean("no")     // false
 * toBoolean("0")      // false
 * toBoolean(1)        // true
 * toBoolean(0)        // false
 * ```
 */
export function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'on', 'y'].includes(lower);
  }
  return Boolean(value);
}

/**
 * Coerce a value to a Date.
 *
 * @example
 * ```ts
 * toDate("2024-01-15")      // Ok(Date)
 * toDate(1705276800000)     // Ok(Date)
 * toDate("not-a-date")      // Err(CoercionError)
 * ```
 */
export function toDate(value: unknown): Result<Date, CoercionError> {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? Err(new CoercionError(value, 'Date'))
      : Ok(value);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? Err(new CoercionError(value, 'Date'))
      : Ok(date);
  }
  return Err(new CoercionError(value, 'Date'));
}

/**
 * Wrap a non-array value in an array. Arrays are returned as-is.
 *
 * @example
 * ```ts
 * toArray(42)       // [42]
 * toArray([1, 2])   // [1, 2]
 * toArray(null)     // []
 * toArray(undefined)// []
 * ```
 */
export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 * Coerce a value to an integer.
 */
export function toInteger(value: unknown): Result<number, CoercionError> {
  const numResult = toNumber(value);
  if (numResult.isErr()) return numResult;
  const n = numResult.unwrap();
  return Ok(Math.trunc(n));
}
