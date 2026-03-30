// ============================================================================
// Guarden — Invariants & Unreachable
// ============================================================================

import { InvariantError, UnreachableError } from '../utils/errors.js';

/**
 * Assert an invariant condition. Throws `InvariantError` if violated.
 * Use this for conditions that indicate a bug in your code if broken.
 *
 * @example
 * ```ts
 * invariant(items.length > 0, 'items should never be empty at this point');
 * ```
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new InvariantError(message);
  }
}

/**
 * Mark code as unreachable. Useful for exhaustive switch/if checks.
 * Throws `UnreachableError` at runtime if reached.
 *
 * @example
 * ```ts
 * type Direction = 'up' | 'down';
 *
 * function move(dir: Direction) {
 *   switch (dir) {
 *     case 'up':    return goUp();
 *     case 'down':  return goDown();
 *     default:      unreachable(dir); // TypeScript error if case missing
 *   }
 * }
 * ```
 */
export function unreachable(value: never): never {
  throw new UnreachableError(value);
}
