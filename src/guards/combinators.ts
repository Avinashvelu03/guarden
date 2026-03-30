// ============================================================================
// Guarden — Guard Combinators
// ============================================================================

import type { Guard, GuardType, ShapeGuardType } from '../utils/types.js';

/**
 * Combine two guards with AND logic (intersection).
 * Value must satisfy both guards.
 *
 * @example
 * ```ts
 * const isPositiveInteger = and(isInteger, isPositiveNumber);
 * ```
 */
export function and<A, B>(
  guardA: Guard<A>,
  guardB: Guard<B>,
): Guard<A & B> {
  return (value: unknown): value is A & B => guardA(value) && guardB(value);
}

/**
 * Combine two guards with OR logic (union).
 * Value must satisfy at least one guard.
 *
 * @example
 * ```ts
 * const isStringOrNumber = or(isString, isNumber);
 * ```
 */
export function or<A, B>(
  guardA: Guard<A>,
  guardB: Guard<B>,
): Guard<A | B> {
  return (value: unknown): value is A | B => guardA(value) || guardB(value);
}

/**
 * Negate a guard.
 *
 * @example
 * ```ts
 * const isNotNull = not(isNull);
 * ```
 */
export function not<T>(guard: Guard<T>): (value: unknown) => boolean {
  return (value: unknown): boolean => !guard(value);
}

/**
 * Create a guard that validates an object shape.
 * Each property is validated by its corresponding guard.
 *
 * @example
 * ```ts
 * const isUser = shape({
 *   name: isString,
 *   age: isNumber,
 *   email: isEmail,
 * });
 *
 * if (isUser(data)) {
 *   data.name;  // string
 *   data.age;   // number
 *   data.email; // string
 * }
 * ```
 */
export function shape<T extends Record<string, Guard<unknown>>>(
  schema: T,
): Guard<ShapeGuardType<T>> {
  return (value: unknown): value is ShapeGuardType<T> => {
    if (typeof value !== 'object' || value === null) return false;
    const obj = value as Record<string, unknown>;
    for (const key in schema) {
      if (!Object.prototype.hasOwnProperty.call(schema, key)) continue;
      if (!schema[key](obj[key])) return false;
    }
    return true;
  };
}

/**
 * Create a guard that validates a tuple.
 *
 * @example
 * ```ts
 * const isCoord = tuple(isNumber, isNumber);
 * if (isCoord(data)) {
 *   const [x, y] = data; // [number, number]
 * }
 * ```
 */
export function tuple<T extends Guard<unknown>[]>(
  ...guards: T
): Guard<{ [K in keyof T]: GuardType<T[K]> }> {
  return (value: unknown): value is { [K in keyof T]: GuardType<T[K]> } => {
    if (!Array.isArray(value)) return false;
    if (value.length !== guards.length) return false;
    return guards.every((guard, i) => guard(value[i]));
  };
}

/**
 * Create a guard that validates each element of an array.
 *
 * @example
 * ```ts
 * const isStringArray = arrayOf(isString);
 * if (isStringArray(data)) {
 *   data.forEach(s => s.toUpperCase()); // string[]
 * }
 * ```
 */
export function arrayOf<T>(guard: Guard<T>): Guard<T[]> {
  return (value: unknown): value is T[] => {
    if (!Array.isArray(value)) return false;
    return value.every((item) => guard(item));
  };
}

/**
 * Create a guard that validates Map entries.
 *
 * @example
 * ```ts
 * const isStringNumberMap = mapOf(isString, isNumber);
 * ```
 */
export function mapOf<K, V>(
  keyGuard: Guard<K>,
  valueGuard: Guard<V>,
): Guard<Map<K, V>> {
  return (value: unknown): value is Map<K, V> => {
    if (!(value instanceof Map)) return false;
    for (const [k, v] of value) {
      if (!keyGuard(k) || !valueGuard(v)) return false;
    }
    return true;
  };
}

/**
 * Create a guard that validates Record (object) entries.
 *
 * @example
 * ```ts
 * const isScoreBoard = recordOf(isString, isNumber);
 * ```
 */
export function recordOf<V>(
  valueGuard: Guard<V>,
): Guard<Record<string, V>> {
  return (value: unknown): value is Record<string, V> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
    const obj = value as Record<string, unknown>;
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      if (!valueGuard(obj[key])) return false;
    }
    return true;
  };
}

/**
 * Create a guard with a custom refinement predicate.
 *
 * @example
 * ```ts
 * const isEvenNumber = refine(isNumber, (n) => n % 2 === 0);
 * ```
 */
export function refine<T>(
  guard: Guard<T>,
  predicate: (value: T) => boolean,
): Guard<T> {
  return (value: unknown): value is T => guard(value) && predicate(value);
}

/**
 * Create an optional guard — allows undefined in addition to the guarded type.
 *
 * @example
 * ```ts
 * const isOptionalString = optional(isString);
 * isOptionalString(undefined) // true
 * isOptionalString("hello")   // true
 * isOptionalString(42)        // false
 * ```
 */
export function optional<T>(guard: Guard<T>): Guard<T | undefined> {
  return (value: unknown): value is T | undefined =>
    value === undefined || guard(value);
}

/**
 * Create a nullable guard — allows null in addition to the guarded type.
 */
export function nullable<T>(guard: Guard<T>): Guard<T | null> {
  return (value: unknown): value is T | null =>
    value === null || guard(value);
}
