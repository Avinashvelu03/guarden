// ============================================================================
// Guarden — Transform Tests (Pipe, Coerce, Sanitize)
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  pipe, flow,
  toNumber, toString, toBoolean, toDate, toArray, toInteger,
  trim, trimStart, trimEnd, lowercase, uppercase, capitalize,
  titleCase, camelCase, kebabCase, snakeCase,
  stripHtml, escapeHtml, unescapeHtml, truncate, slugify,
  removeWhitespace, collapseWhitespace, padStart, padEnd,
  reverse, countOccurrences,
} from '../src/transform/index.js';

describe('Pipe', () => {
  it('passes through single value', () => {
    expect(pipe(42)).toBe(42);
  });

  it('applies single function', () => {
    expect(pipe(42, (n) => n * 2)).toBe(84);
  });

  it('chains multiple functions', () => {
    const result = pipe(
      '  Hello World  ',
      (s) => s.trim(),
      (s) => s.toLowerCase(),
      (s) => s.replace(/\s+/g, '-'),
    );
    expect(result).toBe('hello-world');
  });

  it('maintains type safety through chain', () => {
    const result = pipe(
      42,
      (n) => n.toString(),
      (s) => s.length,
      (n) => n > 0,
    );
    expect(result).toBe(true);
  });
});

describe('Flow', () => {
  it('composes a single function', () => {
    const double = flow((n: number) => n * 2);
    expect(double(21)).toBe(42);
  });

  it('composes multiple functions', () => {
    const process = flow(
      (s: string) => s.trim(),
      (s) => s.toLowerCase(),
      (s) => s.replace(/\s+/g, '-'),
    );
    expect(process('  Hello World  ')).toBe('hello-world');
  });
});

describe('Coerce', () => {
  describe('toNumber', () => {
    it('passes through numbers', () => {
      expect(toNumber(42).unwrap()).toBe(42);
      expect(toNumber(0).unwrap()).toBe(0);
      expect(toNumber(-3.14).unwrap()).toBe(-3.14);
    });

    it('converts strings', () => {
      expect(toNumber('42').unwrap()).toBe(42);
      expect(toNumber('  3.14  ').unwrap()).toBe(3.14);
      expect(toNumber('-7').unwrap()).toBe(-7);
    });

    it('converts booleans', () => {
      expect(toNumber(true).unwrap()).toBe(1);
      expect(toNumber(false).unwrap()).toBe(0);
    });

    it('converts dates', () => {
      const date = new Date('2024-01-15');
      expect(toNumber(date).isOk()).toBe(true);
    });

    it('returns Err for invalid values', () => {
      expect(toNumber('abc').isErr()).toBe(true);
      expect(toNumber('').isErr()).toBe(true);
      expect(toNumber(NaN).isErr()).toBe(true);
      expect(toNumber(null).isErr()).toBe(true);
      expect(toNumber(undefined).isErr()).toBe(true);
      expect(toNumber({}).isErr()).toBe(true);
    });

    it('returns Err for invalid date', () => {
      expect(toNumber(new Date('invalid')).isErr()).toBe(true);
    });
  });

  describe('toString', () => {
    it('passes through strings', () => {
      expect(toString('hello')).toBe('hello');
    });

    it('converts numbers', () => {
      expect(toString(42)).toBe('42');
    });

    it('converts booleans', () => {
      expect(toString(true)).toBe('true');
    });

    it('handles null/undefined', () => {
      expect(toString(null)).toBe('');
      expect(toString(undefined)).toBe('');
    });

    it('converts objects to JSON', () => {
      expect(toString({ a: 1 })).toBe('{"a":1}');
    });

    it('handles circular objects gracefully', () => {
      const obj: Record<string, unknown> = {};
      obj.self = obj;
      const result = toString(obj);
      expect(typeof result).toBe('string');
    });
  });

  describe('toBoolean', () => {
    it('passes through booleans', () => {
      expect(toBoolean(true)).toBe(true);
      expect(toBoolean(false)).toBe(false);
    });

    it('converts truthy strings', () => {
      expect(toBoolean('true')).toBe(true);
      expect(toBoolean('1')).toBe(true);
      expect(toBoolean('yes')).toBe(true);
      expect(toBoolean('on')).toBe(true);
      expect(toBoolean('y')).toBe(true);
      expect(toBoolean('TRUE')).toBe(true);
    });

    it('converts falsy strings', () => {
      expect(toBoolean('false')).toBe(false);
      expect(toBoolean('0')).toBe(false);
      expect(toBoolean('no')).toBe(false);
      expect(toBoolean('')).toBe(false);
    });

    it('converts numbers', () => {
      expect(toBoolean(1)).toBe(true);
      expect(toBoolean(0)).toBe(false);
      expect(toBoolean(-1)).toBe(true);
    });

    it('converts other types via Boolean()', () => {
      expect(toBoolean(null)).toBe(false);
      expect(toBoolean(undefined)).toBe(false);
      expect(toBoolean({})).toBe(true);
      expect(toBoolean([])).toBe(true);
    });
  });

  describe('toDate', () => {
    it('passes through valid dates', () => {
      const date = new Date();
      expect(toDate(date).unwrap()).toBe(date);
    });

    it('creates date from string', () => {
      expect(toDate('2024-01-15').isOk()).toBe(true);
    });

    it('creates date from timestamp', () => {
      expect(toDate(1705276800000).isOk()).toBe(true);
    });

    it('returns Err for invalid inputs', () => {
      expect(toDate('not-a-date').isErr()).toBe(true);
      expect(toDate(null).isErr()).toBe(true);
      expect(toDate(new Date('invalid')).isErr()).toBe(true);
    });
  });

  describe('toArray', () => {
    it('wraps non-arrays', () => {
      expect(toArray(42)).toEqual([42]);
      expect(toArray('hello')).toEqual(['hello']);
    });

    it('returns arrays as-is', () => {
      expect(toArray([1, 2])).toEqual([1, 2]);
    });

    it('returns empty array for null/undefined', () => {
      expect(toArray(null)).toEqual([]);
      expect(toArray(undefined)).toEqual([]);
    });
  });

  describe('toInteger', () => {
    it('truncates decimals', () => {
      expect(toInteger(3.7).unwrap()).toBe(3);
      expect(toInteger(-3.7).unwrap()).toBe(-3);
    });

    it('converts strings', () => {
      expect(toInteger('42.9').unwrap()).toBe(42);
    });

    it('returns Err for invalid values', () => {
      expect(toInteger('abc').isErr()).toBe(true);
    });
  });
});

describe('Sanitize', () => {
  describe('trim/trimStart/trimEnd', () => {
    it('trims whitespace', () => {
      expect(trim('  hello  ')).toBe('hello');
      expect(trimStart('  hello  ')).toBe('hello  ');
      expect(trimEnd('  hello  ')).toBe('  hello');
    });
  });

  describe('case conversions', () => {
    it('lowercase/uppercase', () => {
      expect(lowercase('HELLO')).toBe('hello');
      expect(uppercase('hello')).toBe('HELLO');
    });

    it('capitalize', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('')).toBe('');
    });

    it('titleCase', () => {
      expect(titleCase('hello world foo')).toBe('Hello World Foo');
    });

    it('camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('foo-bar-baz')).toBe('fooBarBaz');
      expect(camelCase('foo_bar')).toBe('fooBar');
      expect(camelCase('FooBar')).toBe('fooBar');
      expect(camelCase('trailing-')).toBe('trailing');
    });

    it('kebabCase', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('foo bar')).toBe('foo-bar');
      expect(kebabCase('foo_bar')).toBe('foo-bar');
    });

    it('snakeCase', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('foo bar')).toBe('foo_bar');
      expect(snakeCase('foo-bar')).toBe('foo_bar');
    });
  });

  describe('HTML operations', () => {
    it('stripHtml removes tags', () => {
      expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
      expect(stripHtml('no tags')).toBe('no tags');
    });

    it('escapeHtml escapes special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
      expect(escapeHtml('a & b')).toBe('a &amp; b');
      expect(escapeHtml("it's")).toBe("it&#x27;s");
      expect(escapeHtml('code: `hello`')).toBe('code: &#x60;hello&#x60;');
    });

    it('unescapeHtml unescapes entities', () => {
      expect(unescapeHtml('&lt;div&gt;')).toBe('<div>');
      expect(unescapeHtml('a &amp; b')).toBe('a & b');
      expect(unescapeHtml('&#x60;code&#x60;')).toBe('`code`');
      expect(unescapeHtml('&#x27;quoted&#x27;')).toBe("'quoted'");
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello, World!', 8)).toBe('Hello...');
    });

    it('does not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('uses custom suffix', () => {
      expect(truncate('Hello, World!', 8, '…')).toBe('Hello, …');
    });
  });

  describe('slugify', () => {
    it('creates URL-friendly slugs', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('  Foo   BAR  baz ')).toBe('foo-bar-baz');
      expect(slugify('Ça fait très chaud')).toBe('ca-fait-tres-chaud');
    });
  });

  describe('whitespace utilities', () => {
    it('removeWhitespace', () => {
      expect(removeWhitespace('h e l l o')).toBe('hello');
    });

    it('collapseWhitespace', () => {
      expect(collapseWhitespace('  hello   world  ')).toBe('hello world');
    });
  });

  describe('padding', () => {
    it('padStart', () => {
      expect(padStart('42', 5, '0')).toBe('00042');
    });

    it('padEnd', () => {
      expect(padEnd('42', 5, '0')).toBe('42000');
    });
  });

  describe('reverse', () => {
    it('reverses strings', () => {
      expect(reverse('hello')).toBe('olleh');
    });

    it('handles unicode', () => {
      expect(reverse('ab')).toBe('ba');
    });
  });

  describe('countOccurrences', () => {
    it('counts substring occurrences', () => {
      expect(countOccurrences('hello hello hello', 'hello')).toBe(3);
      expect(countOccurrences('aaa', 'aa')).toBe(1); // non-overlapping
      expect(countOccurrences('hello', 'xyz')).toBe(0);
    });

    it('returns 0 for empty search', () => {
      expect(countOccurrences('hello', '')).toBe(0);
    });
  });
});
