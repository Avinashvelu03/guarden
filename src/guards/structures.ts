// ============================================================================
// Guarden — Structure Type Guards
// ============================================================================

/**
 * Check if a value is an array.
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if a value is an object (excludes null and arrays).
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a plain object (created by `{}` or `Object.create(null)`).
 * Excludes class instances, arrays, and other special objects.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value) as unknown;
  return proto === Object.prototype || proto === null;
}

/**
 * Check if a value is a Map.
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

/**
 * Check if a value is a Set.
 */
export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

/**
 * Check if a value is a WeakMap.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
  return value instanceof WeakMap;
}

/**
 * Check if a value is a WeakSet.
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
  return value instanceof WeakSet;
}

/**
 * Check if a value is a Date instance.
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * Check if a value is a valid Date (not Invalid Date).
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Check if a value is a RegExp.
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Check if a value is an Error instance.
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if a value is a Promise.
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value instanceof Promise ||
    (typeof value === 'object' &&
      value !== null &&
      'then' in value &&
      typeof (value as Record<string, unknown>)['then'] === 'function')
  );
}

/**
 * Check if a value is an ArrayBuffer.
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}

/**
 * Check if a value is a typed array (Uint8Array, Float32Array, etc.).
 */
export function isTypedArray(
  value: unknown,
): value is
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}
