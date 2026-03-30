// ============================================================================
// Guarden — Runtime Assertions
// ============================================================================

import { AssertionError } from '../utils/errors.js';
import type { Guard } from '../utils/types.js';

/**
 * Assert that a condition is true. Throws `AssertionError` if false.
 * Narrows the condition to `true` in the subsequent code.
 *
 * @example
 * ```ts
 * assert(user !== null, 'User must exist');
 * user.name; // OK — TypeScript knows user is not null
 * ```
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message ?? 'Assertion failed');
  }
}

/**
 * Assert that a value is defined (not undefined).
 * Narrows away `undefined`.
 *
 * @example
 * ```ts
 * const val: string | undefined = getConfig('key');
 * assertDefined(val, 'Config key is required');
 * val.toUpperCase(); // OK
 * ```
 */
export function assertDefined<T>(
  value: T,
  message?: string,
): asserts value is Exclude<T, undefined> {
  if (value === undefined) {
    throw new AssertionError(message ?? 'Expected value to be defined, but got undefined');
  }
}

/**
 * Assert that a value is not null and not undefined.
 * Narrows away `null | undefined`.
 *
 * @example
 * ```ts
 * assertNonNull(result);
 * result.doSomething(); // OK
 * ```
 */
export function assertNonNull<T>(
  value: T,
  message?: string,
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new AssertionError(
      message ?? `Expected non-null value, but got ${value === null ? 'null' : 'undefined'}`,
    );
  }
}

/**
 * Assert that a value passes a type guard.
 * Narrows to the guarded type.
 *
 * @example
 * ```ts
 * assertType(input, isString, 'Expected string input');
 * input.toUpperCase(); // OK — narrowed to string
 * ```
 */
export function assertType<T>(
  value: unknown,
  guard: Guard<T>,
  message?: string,
): asserts value is T {
  if (!guard(value)) {
    throw new AssertionError(
      message ?? `Type assertion failed: value ${JSON.stringify(value)} did not pass guard`,
    );
  }
}

/**
 * Assert that a value is truthy.
 * Narrows away falsy values (false, 0, '', null, undefined, NaN).
 */
export function assertTruthy<T>(
  value: T,
  message?: string,
): asserts value is NonNullable<T> {
  if (!value) {
    throw new AssertionError(
      message ?? `Expected truthy value, but got ${JSON.stringify(value)}`,
    );
  }
}
