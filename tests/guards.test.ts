// ============================================================================
// Guarden — Guards Tests (Primitives, Structures, Advanced, Combinators)
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  // Primitives
  isString, isNumber, isNumberIncludingNaN, isFiniteNumber,
  isBoolean, isBigInt, isSymbol, isNull, isUndefined,
  isNullish, isNonNullish, isFunction, isPrimitive,
  // Structures
  isArray, isObject, isPlainObject, isMap, isSet,
  isWeakMap, isWeakSet, isDate, isValidDate, isRegExp,
  isError, isPromise, isArrayBuffer, isTypedArray,
  // Advanced
  isNonEmptyString, isEmail, isURL, isUUID, isISO8601,
  isJSONString, isHexColor, isPositiveNumber, isNegativeNumber,
  isInteger, isSafeInteger, isNonEmptyArray,
  isInRange, isOneOf, isMatch, isMinLength, isMaxLength,
  isInstanceOf,
  // Combinators
  and, or, not, shape, tuple, arrayOf, mapOf, recordOf,
  refine, optional, nullable,
} from '../src/guards/index.js';

// ============================================================================
// PRIMITIVES
// ============================================================================

describe('Primitive Guards', () => {
  describe('isString', () => {
    it('returns true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString(`template`)).toBe(true);
    });
    it('returns false for non-strings', () => {
      expect(isString(42)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('returns true for valid numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(42)).toBe(true);
      expect(isNumber(-3.14)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
    });
    it('returns false for NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });
    it('returns false for non-numbers', () => {
      expect(isNumber('42')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(true)).toBe(false);
    });
  });

  describe('isNumberIncludingNaN', () => {
    it('returns true for NaN', () => {
      expect(isNumberIncludingNaN(NaN)).toBe(true);
    });
    it('returns true for regular numbers', () => {
      expect(isNumberIncludingNaN(42)).toBe(true);
    });
    it('returns false for non-numbers', () => {
      expect(isNumberIncludingNaN('42')).toBe(false);
    });
  });

  describe('isFiniteNumber', () => {
    it('returns true for finite numbers', () => {
      expect(isFiniteNumber(0)).toBe(true);
      expect(isFiniteNumber(42)).toBe(true);
      expect(isFiniteNumber(-3.14)).toBe(true);
    });
    it('returns false for Infinity and NaN', () => {
      expect(isFiniteNumber(Infinity)).toBe(false);
      expect(isFiniteNumber(-Infinity)).toBe(false);
      expect(isFiniteNumber(NaN)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('returns true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });
    it('returns false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });
  });

  describe('isBigInt', () => {
    it('returns true for bigints', () => {
      expect(isBigInt(BigInt(42))).toBe(true);
      expect(isBigInt(0n)).toBe(true);
    });
    it('returns false for numbers', () => {
      expect(isBigInt(42)).toBe(false);
    });
  });

  describe('isSymbol', () => {
    it('returns true for symbols', () => {
      expect(isSymbol(Symbol('test'))).toBe(true);
      expect(isSymbol(Symbol.iterator)).toBe(true);
    });
    it('returns false for non-symbols', () => {
      expect(isSymbol('symbol')).toBe(false);
    });
  });

  describe('isNull', () => {
    it('returns true for null', () => {
      expect(isNull(null)).toBe(true);
    });
    it('returns false for undefined and others', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('returns true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });
    it('returns false for null and others', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
    });
  });

  describe('isNullish', () => {
    it('returns true for null and undefined', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });
    it('returns false for falsy non-nullish values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
    });
  });

  describe('isNonNullish', () => {
    it('returns false for null and undefined', () => {
      expect(isNonNullish(null)).toBe(false);
      expect(isNonNullish(undefined)).toBe(false);
    });
    it('returns true for everything else', () => {
      expect(isNonNullish(0)).toBe(true);
      expect(isNonNullish('')).toBe(true);
      expect(isNonNullish(false)).toBe(true);
      expect(isNonNullish({})).toBe(true);
    });
  });

  describe('isFunction', () => {
    it('returns true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction(Math.max)).toBe(true);
      expect(isFunction(class Foo {})).toBe(true);
    });
    it('returns false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('returns true for all primitive types', () => {
      expect(isPrimitive('hello')).toBe(true);
      expect(isPrimitive(42)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(BigInt(1))).toBe(true);
      expect(isPrimitive(Symbol('x'))).toBe(true);
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
    });
    it('returns false for objects and arrays', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(new Date())).toBe(false);
    });
  });
});

// ============================================================================
// STRUCTURES
// ============================================================================

describe('Structure Guards', () => {
  describe('isArray', () => {
    it('returns true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array(5))).toBe(true);
    });
    it('returns false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('not an array')).toBe(false);
      expect(isArray(new Set())).toBe(false);
    });
  });

  describe('isObject', () => {
    it('returns true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Date())).toBe(true);
    });
    it('returns false for null, arrays, primitives', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject('string')).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('returns true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });
    it('returns false for class instances and arrays', () => {
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(null)).toBe(false);
    });
  });

  describe('isMap', () => {
    it('returns true for Maps', () => {
      expect(isMap(new Map())).toBe(true);
    });
    it('returns false for non-Maps', () => {
      expect(isMap({})).toBe(false);
      expect(isMap(new Set())).toBe(false);
    });
  });

  describe('isSet', () => {
    it('returns true for Sets', () => {
      expect(isSet(new Set())).toBe(true);
    });
    it('returns false for non-Sets', () => {
      expect(isSet([])).toBe(false);
      expect(isSet(new Map())).toBe(false);
    });
  });

  describe('isWeakMap', () => {
    it('returns true for WeakMaps', () => {
      expect(isWeakMap(new WeakMap())).toBe(true);
    });
    it('returns false for Maps', () => {
      expect(isWeakMap(new Map())).toBe(false);
    });
  });

  describe('isWeakSet', () => {
    it('returns true for WeakSets', () => {
      expect(isWeakSet(new WeakSet())).toBe(true);
    });
    it('returns false for Sets', () => {
      expect(isWeakSet(new Set())).toBe(false);
    });
  });

  describe('isDate', () => {
    it('returns true for Date objects', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('invalid'))).toBe(true); // still a Date instance
    });
    it('returns false for non-Dates', () => {
      expect(isDate('2024-01-01')).toBe(false);
      expect(isDate(Date.now())).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('returns true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2024-01-15'))).toBe(true);
    });
    it('returns false for invalid dates', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });
    it('returns false for non-dates', () => {
      expect(isValidDate('2024-01-01')).toBe(false);
    });
  });

  describe('isRegExp', () => {
    it('returns true for RegExps', () => {
      expect(isRegExp(/test/)).toBe(true);
      expect(isRegExp(new RegExp('test'))).toBe(true);
    });
    it('returns false for strings', () => {
      expect(isRegExp('/test/')).toBe(false);
    });
  });

  describe('isError', () => {
    it('returns true for Error objects', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new TypeError())).toBe(true);
      expect(isError(new RangeError())).toBe(true);
    });
    it('returns false for non-errors', () => {
      expect(isError({ message: 'error' })).toBe(false);
      expect(isError('error')).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('returns true for Promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
    });
    it('returns true for thenables', () => {
      expect(isPromise({ then: () => {} })).toBe(true);
    });
    it('returns false for non-promises', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise(null)).toBe(false);
    });
  });

  describe('isArrayBuffer', () => {
    it('returns true for ArrayBuffers', () => {
      expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true);
    });
    it('returns false for typed arrays', () => {
      expect(isArrayBuffer(new Uint8Array(8))).toBe(false);
    });
  });

  describe('isTypedArray', () => {
    it('returns true for typed arrays', () => {
      expect(isTypedArray(new Uint8Array(8))).toBe(true);
      expect(isTypedArray(new Float32Array(4))).toBe(true);
      expect(isTypedArray(new Int16Array(2))).toBe(true);
    });
    it('returns false for DataView and regular arrays', () => {
      expect(isTypedArray(new DataView(new ArrayBuffer(8)))).toBe(false);
      expect(isTypedArray([])).toBe(false);
    });
  });
});

// ============================================================================
// ADVANCED
// ============================================================================

describe('Advanced Guards', () => {
  describe('isNonEmptyString', () => {
    it('returns true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString(' ')).toBe(true); // whitespace is non-empty
    });
    it('returns false for empty strings and non-strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
    });
  });

  describe('isEmail', () => {
    it('returns true for valid emails', () => {
      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('test.user@domain.co.uk')).toBe(true);
    });
    it('returns false for invalid emails', () => {
      expect(isEmail('not-an-email')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('user@')).toBe(false);
      expect(isEmail(42)).toBe(false);
    });
  });

  describe('isURL', () => {
    it('returns true for valid URLs', () => {
      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://localhost:3000')).toBe(true);
      expect(isURL('ftp://files.example.com')).toBe(true);
    });
    it('returns false for invalid URLs', () => {
      expect(isURL('not a url')).toBe(false);
      expect(isURL('example.com')).toBe(false);
      expect(isURL(42)).toBe(false);
    });
  });

  describe('isUUID', () => {
    it('returns true for valid UUIDs', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });
    it('returns false for invalid UUIDs', () => {
      expect(isUUID('not-a-uuid')).toBe(false);
      expect(isUUID('550e8400-e29b-61d4-a716-446655440000')).toBe(false); // invalid version 6
      expect(isUUID(42)).toBe(false);
    });
  });

  describe('isISO8601', () => {
    it('returns true for ISO 8601 dates', () => {
      expect(isISO8601('2024-01-15')).toBe(true);
      expect(isISO8601('2024-01-15T10:30:00Z')).toBe(true);
    });
    it('returns false for invalid dates', () => {
      expect(isISO8601('not-a-date')).toBe(false);
      expect(isISO8601('01/15/2024')).toBe(false);
      expect(isISO8601(42)).toBe(false);
    });
  });

  describe('isJSONString', () => {
    it('returns true for valid JSON', () => {
      expect(isJSONString('{"a":1}')).toBe(true);
      expect(isJSONString('"hello"')).toBe(true);
      expect(isJSONString('[1,2,3]')).toBe(true);
      expect(isJSONString('null')).toBe(true);
    });
    it('returns false for invalid JSON', () => {
      expect(isJSONString('{')).toBe(false);
      expect(isJSONString('hello')).toBe(false);
      expect(isJSONString(42)).toBe(false);
    });
  });

  describe('isHexColor', () => {
    it('returns true for hex colors', () => {
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('#ffffff')).toBe(true);
      expect(isHexColor('#FF6600')).toBe(true);
      expect(isHexColor('#ff660088')).toBe(true); // 8-char with alpha
    });
    it('returns false for non-hex colors', () => {
      expect(isHexColor('red')).toBe(false);
      expect(isHexColor('#fg')).toBe(false);
      expect(isHexColor(42)).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('returns true for positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(0.1)).toBe(true);
    });
    it('returns false for zero, negative, and NaN', () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(NaN)).toBe(false);
    });
  });

  describe('isNegativeNumber', () => {
    it('returns true for negative numbers', () => {
      expect(isNegativeNumber(-1)).toBe(true);
      expect(isNegativeNumber(-0.1)).toBe(true);
    });
    it('returns false for zero and positive', () => {
      expect(isNegativeNumber(0)).toBe(false);
      expect(isNegativeNumber(1)).toBe(false);
      expect(isNegativeNumber(NaN)).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('returns true for integers', () => {
      expect(isInteger(0)).toBe(true);
      expect(isInteger(42)).toBe(true);
      expect(isInteger(-7)).toBe(true);
    });
    it('returns false for floats and non-numbers', () => {
      expect(isInteger(3.14)).toBe(false);
      expect(isInteger('42')).toBe(false);
    });
  });

  describe('isSafeInteger', () => {
    it('returns true for safe integers', () => {
      expect(isSafeInteger(42)).toBe(true);
      expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    });
    it('returns false for unsafe integers', () => {
      expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
      expect(isSafeInteger(3.14)).toBe(false);
    });
  });

  describe('isNonEmptyArray', () => {
    it('returns true for non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true);
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
    });
    it('returns false for empty arrays and non-arrays', () => {
      expect(isNonEmptyArray([])).toBe(false);
      expect(isNonEmptyArray('not array')).toBe(false);
    });
  });

  describe('isInRange', () => {
    const isPercent = isInRange(0, 100);
    it('returns true for values in range', () => {
      expect(isPercent(0)).toBe(true);
      expect(isPercent(50)).toBe(true);
      expect(isPercent(100)).toBe(true);
    });
    it('returns false for values out of range', () => {
      expect(isPercent(-1)).toBe(false);
      expect(isPercent(101)).toBe(false);
      expect(isPercent(NaN)).toBe(false);
      expect(isPercent('50')).toBe(false);
    });
  });

  describe('isOneOf', () => {
    const isDirection = isOneOf(['up', 'down', 'left', 'right'] as const);
    it('returns true for matching values', () => {
      expect(isDirection('up')).toBe(true);
      expect(isDirection('down')).toBe(true);
    });
    it('returns false for non-matching values', () => {
      expect(isDirection('diagonal')).toBe(false);
      expect(isDirection(42)).toBe(false);
    });
  });

  describe('isMatch', () => {
    const isSlug = isMatch(/^[a-z0-9-]+$/);
    it('returns true for matching strings', () => {
      expect(isSlug('hello-world')).toBe(true);
      expect(isSlug('test-123')).toBe(true);
    });
    it('returns false for non-matching strings', () => {
      expect(isSlug('Hello World')).toBe(false);
      expect(isSlug(42)).toBe(false);
    });
  });

  describe('isMinLength / isMaxLength', () => {
    it('validates minimum length', () => {
      const atLeast3 = isMinLength(3);
      expect(atLeast3('abc')).toBe(true);
      expect(atLeast3('ab')).toBe(false);
      expect(atLeast3(42)).toBe(false);
    });
    it('validates maximum length', () => {
      const atMost5 = isMaxLength(5);
      expect(atMost5('hello')).toBe(true);
      expect(atMost5('hello!')).toBe(false);
      expect(atMost5(42)).toBe(false);
    });
  });

  describe('isInstanceOf', () => {
    it('creates instance guard', () => {
      const isTypeError = isInstanceOf(TypeError);
      expect(isTypeError(new TypeError())).toBe(true);
      expect(isTypeError(new Error())).toBe(false);
      expect(isTypeError('error')).toBe(false);
    });
  });
});

// ============================================================================
// COMBINATORS
// ============================================================================

describe('Guard Combinators', () => {
  describe('and', () => {
    it('combines guards with AND logic', () => {
      const isPositiveInteger = and(isInteger, isPositiveNumber);
      expect(isPositiveInteger(5)).toBe(true);
      expect(isPositiveInteger(-5)).toBe(false);
      expect(isPositiveInteger(3.14)).toBe(false);
    });
  });

  describe('or', () => {
    it('combines guards with OR logic', () => {
      const isStringOrNumber = or(isString, isNumber);
      expect(isStringOrNumber('hello')).toBe(true);
      expect(isStringOrNumber(42)).toBe(true);
      expect(isStringOrNumber(true)).toBe(false);
    });
  });

  describe('not', () => {
    it('negates a guard', () => {
      const isNotNull = not(isNull);
      expect(isNotNull(42)).toBe(true);
      expect(isNotNull('hello')).toBe(true);
      expect(isNotNull(null)).toBe(false);
    });
  });

  describe('shape', () => {
    const isUser = shape({
      name: isString,
      age: isNumber,
    });

    it('validates object shapes', () => {
      expect(isUser({ name: 'Alice', age: 30 })).toBe(true);
      expect(isUser({ name: 'Alice', age: 30, extra: true })).toBe(true);
    });

    it('rejects invalid shapes', () => {
      expect(isUser({ name: 'Alice' })).toBe(false);
      expect(isUser({ name: 'Alice', age: '30' })).toBe(false);
      expect(isUser(null)).toBe(false);
      expect(isUser('not an object')).toBe(false);
    });

    it('handles inherited prototype properties', () => {
      const schema = Object.create({ inherited: isString });
      schema.own = isNumber;
      const guard = shape(schema);
      // Only own properties tested, inherited skipped
      expect(guard({ own: 42 })).toBe(true);
    });
  });

  describe('tuple', () => {
    const isCoord = tuple(isNumber, isNumber);
    it('validates tuples', () => {
      expect(isCoord([1, 2])).toBe(true);
    });
    it('rejects wrong length or types', () => {
      expect(isCoord([1])).toBe(false);
      expect(isCoord([1, 2, 3])).toBe(false);
      expect(isCoord([1, '2'])).toBe(false);
      expect(isCoord('not array')).toBe(false);
    });
  });

  describe('arrayOf', () => {
    const isStringArray = arrayOf(isString);
    it('validates typed arrays', () => {
      expect(isStringArray([])).toBe(true);
      expect(isStringArray(['a', 'b'])).toBe(true);
    });
    it('rejects mixed arrays', () => {
      expect(isStringArray([1, 'a'])).toBe(false);
      expect(isStringArray('not array')).toBe(false);
    });
  });

  describe('mapOf', () => {
    const isStringNumberMap = mapOf(isString, isNumber);
    it('validates Map entries', () => {
      expect(isStringNumberMap(new Map([['a', 1], ['b', 2]]))).toBe(true);
      expect(isStringNumberMap(new Map())).toBe(true);
    });
    it('rejects invalid Maps', () => {
      expect(isStringNumberMap(new Map([[1, 1]]))).toBe(false);
      expect(isStringNumberMap({})).toBe(false);
    });
  });

  describe('recordOf', () => {
    const isNumberRecord = recordOf(isNumber);
    it('validates record values', () => {
      expect(isNumberRecord({ a: 1, b: 2 })).toBe(true);
      expect(isNumberRecord({})).toBe(true);
    });
    it('rejects non-matching records', () => {
      expect(isNumberRecord({ a: 'string' })).toBe(false);
      expect(isNumberRecord([])).toBe(false);
      expect(isNumberRecord(null)).toBe(false);
    });
    it('handles inherited prototype properties', () => {
      const obj = Object.create({ inherited: 'not a number' });
      obj.own = 42;
      const guard = recordOf(isNumber);
      // Only own properties tested, inherited skipped
      expect(guard(obj)).toBe(true);
    });
  });

  describe('refine', () => {
    const isEven = refine(isNumber, (n) => n % 2 === 0);
    it('applies refinement predicate', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(3)).toBe(false);
    });
    it('still checks the base guard', () => {
      expect(isEven('2')).toBe(false);
    });
  });

  describe('optional', () => {
    const isOptionalString = optional(isString);
    it('accepts undefined', () => {
      expect(isOptionalString(undefined)).toBe(true);
    });
    it('accepts the guarded type', () => {
      expect(isOptionalString('hello')).toBe(true);
    });
    it('rejects other types', () => {
      expect(isOptionalString(42)).toBe(false);
      expect(isOptionalString(null)).toBe(false);
    });
  });

  describe('nullable', () => {
    const isNullableString = nullable(isString);
    it('accepts null', () => {
      expect(isNullableString(null)).toBe(true);
    });
    it('accepts the guarded type', () => {
      expect(isNullableString('hello')).toBe(true);
    });
    it('rejects other types', () => {
      expect(isNullableString(42)).toBe(false);
      expect(isNullableString(undefined)).toBe(false);
    });
  });
});
