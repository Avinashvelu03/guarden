// ============================================================================
// Guarden — Primitive Type Guards
// ============================================================================

/**
 * Check if a value is a string.
 *
 * @example
 * ```ts
 * const val: unknown = "hello";
 * if (isString(val)) {
 *   val.toUpperCase(); // TypeScript knows val is string
 * }
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a number (excludes NaN by default).
 *
 * @example
 * ```ts
 * isNumber(42)      // true
 * isNumber(NaN)     // false
 * isNumber("42")    // false
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Check if a value is a number, including NaN.
 */
export function isNumberIncludingNaN(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Check if a value is a finite number (excludes NaN and Infinity).
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Check if a value is a boolean.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if a value is a bigint.
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

/**
 * Check if a value is a symbol.
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Check if a value is null.
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Check if a value is undefined.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Check if a value is null or undefined.
 *
 * @example
 * ```ts
 * if (!isNullish(val)) {
 *   // val is narrowed to exclude null | undefined
 * }
 * ```
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if a value is NOT null and NOT undefined.
 */
export function isNonNullish<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * Check if a value is a function.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Check if a value is a primitive type.
 */
export function isPrimitive(
  value: unknown,
): value is string | number | boolean | bigint | symbol | null | undefined {
  if (value === null || value === undefined) return true;
  const t = typeof value;
  return t === 'string' || t === 'number' || t === 'boolean' || t === 'bigint' || t === 'symbol';
}
