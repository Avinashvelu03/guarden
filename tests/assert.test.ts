// ============================================================================
// Guarden — Assert Tests
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  assert,
  assertDefined,
  assertNonNull,
  assertType,
  assertTruthy,
  invariant,
  unreachable,
} from '../src/assert/index.js';
import { isString, isNumber } from '../src/guards/index.js';
import { AssertionError, InvariantError, UnreachableError } from '../src/utils/errors.js';

describe('Assertions', () => {
  describe('assert', () => {
    it('does not throw when condition is true', () => {
      expect(() => assert(true)).not.toThrow();
      expect(() => assert(1)).not.toThrow();
      expect(() => assert('hello')).not.toThrow();
    });

    it('throws AssertionError when condition is false', () => {
      expect(() => assert(false)).toThrow(AssertionError);
      expect(() => assert(false, 'Custom message')).toThrow('Custom message');
    });

    it('throws with default message when none provided', () => {
      expect(() => assert(false)).toThrow('Assertion failed');
    });

    it('throws for falsy values', () => {
      expect(() => assert(0)).toThrow(AssertionError);
      expect(() => assert('')).toThrow(AssertionError);
      expect(() => assert(null)).toThrow(AssertionError);
      expect(() => assert(undefined)).toThrow(AssertionError);
    });
  });

  describe('assertDefined', () => {
    it('does not throw for defined values', () => {
      expect(() => assertDefined(42)).not.toThrow();
      expect(() => assertDefined(null)).not.toThrow(); // null is defined
      expect(() => assertDefined('')).not.toThrow();
      expect(() => assertDefined(0)).not.toThrow();
      expect(() => assertDefined(false)).not.toThrow();
    });

    it('throws for undefined', () => {
      expect(() => assertDefined(undefined)).toThrow(AssertionError);
      expect(() => assertDefined(undefined, 'Value required')).toThrow('Value required');
    });
  });

  describe('assertNonNull', () => {
    it('does not throw for non-null/undefined values', () => {
      expect(() => assertNonNull(42)).not.toThrow();
      expect(() => assertNonNull('')).not.toThrow();
      expect(() => assertNonNull(0)).not.toThrow();
      expect(() => assertNonNull(false)).not.toThrow();
    });

    it('throws for null', () => {
      expect(() => assertNonNull(null)).toThrow(AssertionError);
      expect(() => assertNonNull(null)).toThrow('null');
    });

    it('throws for undefined', () => {
      expect(() => assertNonNull(undefined)).toThrow(AssertionError);
      expect(() => assertNonNull(undefined)).toThrow('undefined');
    });

    it('uses custom message', () => {
      expect(() => assertNonNull(null, 'Must exist')).toThrow('Must exist');
    });
  });

  describe('assertType', () => {
    it('does not throw when guard passes', () => {
      expect(() => assertType('hello', isString)).not.toThrow();
      expect(() => assertType(42, isNumber)).not.toThrow();
    });

    it('throws when guard fails', () => {
      expect(() => assertType(42, isString)).toThrow(AssertionError);
      expect(() => assertType('hello', isNumber)).toThrow(AssertionError);
    });

    it('uses custom message', () => {
      expect(() => assertType(42, isString, 'Expected string')).toThrow('Expected string');
    });
  });

  describe('assertTruthy', () => {
    it('does not throw for truthy values', () => {
      expect(() => assertTruthy(42)).not.toThrow();
      expect(() => assertTruthy('hello')).not.toThrow();
      expect(() => assertTruthy(true)).not.toThrow();
      expect(() => assertTruthy({})).not.toThrow();
      expect(() => assertTruthy([])).not.toThrow();
    });

    it('throws for falsy values', () => {
      expect(() => assertTruthy(0)).toThrow(AssertionError);
      expect(() => assertTruthy('')).toThrow(AssertionError);
      expect(() => assertTruthy(false)).toThrow(AssertionError);
      expect(() => assertTruthy(null)).toThrow(AssertionError);
      expect(() => assertTruthy(undefined)).toThrow(AssertionError);
    });
  });
});

describe('Invariant', () => {
  it('does not throw when condition is true', () => {
    expect(() => invariant(true, 'Should not fail')).not.toThrow();
  });

  it('throws InvariantError when condition is false', () => {
    expect(() => invariant(false, 'Array is empty')).toThrow(InvariantError);
    expect(() => invariant(false, 'Array is empty')).toThrow('Invariant violation: Array is empty');
  });
});

describe('Unreachable', () => {
  it('throws UnreachableError', () => {
    expect(() => unreachable('bad' as never)).toThrow(UnreachableError);
    expect(() => unreachable('bad' as never)).toThrow('Unreachable');
  });
});
