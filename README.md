<div align="center">

# 🛡️ Guarden

### TypeScript-First Runtime Safety Toolkit

[![npm version](https://img.shields.io/npm/v/guarden.svg?style=flat-square&color=cb3837)](https://www.npmjs.com/package/guarden)
[![bundle size](https://img.shields.io/bundlephobia/minzip/guarden?style=flat-square&color=6ead0a)](https://bundlephobia.com/package/guarden)
[![license](https://img.shields.io/npm/l/guarden.svg?style=flat-square&color=blue)](https://github.com/Avinashvelu03/guarden/blob/main/LICENSE)
[![tests](https://img.shields.io/badge/tests-313%20passed-brightgreen?style=flat-square)](https://github.com/Avinashvelu03/guarden/actions)
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square)](https://github.com/Avinashvelu03/guarden)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![zero deps](https://img.shields.io/badge/dependencies-0-success?style=flat-square)](https://www.npmjs.com/package/guarden)

**Guard your runtime. Harden your types.**

Blazing-fast, tree-shakeable utilities for bridging TypeScript's compile-time safety with real-world runtime guarantees. Type guards, assertions, Result/Option monads, data pipelines, and environment validation — all in one lightweight, zero-dependency package.

[Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Why Guarden?](#-why-guarden) · [Contributing](CONTRIBUTING.md)

</div>

---

## ✨ Highlights

- 🔒 **60+ type guards** with automatic TypeScript narrowing
- ⚡ **Zero dependencies** — nothing to audit, nothing to break
- 🌳 **Tree-shakeable** — import only what you use
- 📦 **Dual ESM/CJS** — works everywhere
- 🧪 **313 tests** with **100% coverage** (statements, branches, functions, lines)
- 🎯 **TypeScript-first** — written in TypeScript, for TypeScript
- 🏗️ **5 modules** — Guards, Assert, Result/Option, Transform, Env

## 📦 Getting Started

### Installation

```bash
npm install guarden
```

```bash
yarn add guarden
```

```bash
pnpm add guarden
```

### Quick Example

```typescript
import {
  isString, isNumber, shape,    // Guards
  assert, invariant,             // Assertions
  Ok, Err, type Result,          // Result monad
  pipe, slugify, escapeHtml,     // Transform
  createEnv, envString, envNumber // Env validation
} from 'guarden';

// 🛡️ Type Guards — automatic narrowing
const input: unknown = getApiResponse();
if (isString(input)) {
  input.toUpperCase(); // ✅ TypeScript knows it's a string
}

// 🏗️ Object Shape Validation
const isUser = shape({
  name: isString,
  age: isNumber,
});

if (isUser(data)) {
  console.log(data.name); // ✅ Fully typed
}

// ⚡ Result Monad — no more try/catch
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err('Division by zero');
  return Ok(a / b);
}

divide(10, 2).match({
  ok: (value) => console.log(`Result: ${value}`),
  err: (error) => console.error(`Error: ${error}`),
});

// 🔄 Data Pipelines
const slug = pipe(
  '  Hello, World! 🌍  ',
  (s) => s.trim(),
  slugify,
);
// → "hello-world"
```

## 🔌 Modular Imports

Import the entire library or just the modules you need:

```typescript
// Full import
import { isString, Ok, pipe } from 'guarden';

// Module-specific imports (optimal tree-shaking)
import { isString, shape, arrayOf } from 'guarden/guards';
import { assert, invariant } from 'guarden/assert';
import { Ok, Err, Some, None } from 'guarden/result';
import { pipe, slugify, escapeHtml } from 'guarden/transform';
import { createEnv, envString } from 'guarden/env';
```

## 📖 API Reference

### 🛡️ Guards

Type guards that automatically narrow TypeScript types:

#### Primitives
```typescript
isString(value)          // value is string
isNumber(value)          // value is number (excludes NaN)
isBoolean(value)         // value is boolean
isBigInt(value)          // value is bigint
isSymbol(value)          // value is symbol
isNull(value)            // value is null
isUndefined(value)       // value is undefined
isNullish(value)         // value is null | undefined
isNonNullish(value)      // value is NonNullable<T>
isFunction(value)        // value is Function
isPrimitive(value)       // value is string | number | boolean | ...
isFiniteNumber(value)    // value is number (excludes NaN & Infinity)
```

#### Structures
```typescript
isArray(value)           // value is unknown[]
isObject(value)          // value is Record<string, unknown>
isPlainObject(value)     // value is plain {} (not class instance)
isMap(value)             // value is Map
isSet(value)             // value is Set
isDate(value)            // value is Date
isValidDate(value)       // value is Date (valid, not NaN)
isRegExp(value)          // value is RegExp
isError(value)           // value is Error
isPromise(value)         // value is Promise (or thenable)
isTypedArray(value)      // value is Uint8Array, Float32Array, etc.
```

#### Advanced
```typescript
isNonEmptyString(value)  // non-empty string
isEmail(value)           // valid email format
isURL(value)             // valid URL
isUUID(value)            // valid UUID v1-v5
isISO8601(value)         // valid ISO 8601 date string
isJSONString(value)      // valid JSON string
isHexColor(value)        // valid hex color (#fff, #ffffff)
isPositiveNumber(value)  // number > 0
isNegativeNumber(value)  // number < 0
isInteger(value)         // integer number
isSafeInteger(value)     // safe integer
isNonEmptyArray(value)   // array with 1+ elements
```

#### Factory Guards
```typescript
isInRange(0, 100)(value)              // number in range [0, 100]
isOneOf(['a', 'b', 'c'] as const)    // value is 'a' | 'b' | 'c'
isMatch(/^[a-z]+$/)(value)           // string matches regex
isMinLength(3)(value)                 // string.length >= 3
isMaxLength(100)(value)               // string.length <= 100
isInstanceOf(TypeError)(value)        // value instanceof TypeError
```

#### Combinators
```typescript
// Compose guards for complex validation
const isPositiveInt = and(isInteger, isPositiveNumber);
const isStringOrNum = or(isString, isNumber);
const isNotNull = not(isNull);

// Object shape validation
const isUser = shape({
  name: isString,
  age: isNumber,
  email: isEmail,
});

// Collection guards
const isStringArray = arrayOf(isString);
const isCoord = tuple(isNumber, isNumber);
const isScoreMap = mapOf(isString, isNumber);
const isConfig = recordOf(isString);

// Refinement
const isEven = refine(isNumber, n => n % 2 === 0);

// Optional/Nullable
const isOptName = optional(isString);  // string | undefined
const isNullName = nullable(isString); // string | null
```

---

### ✅ Assert

Runtime assertions with TypeScript type narrowing:

```typescript
// Basic assertion
assert(condition, 'Something went wrong');

// Narrowing assertions
assertDefined(value);       // narrows away undefined
assertNonNull(value);       // narrows away null | undefined
assertType(value, isString); // narrows to string
assertTruthy(value);        // narrows away falsy values

// Invariant (for bug detection)
invariant(items.length > 0, 'items should never be empty here');

// Exhaustive checking
type Dir = 'up' | 'down';
function move(dir: Dir) {
  switch (dir) {
    case 'up': return goUp();
    case 'down': return goDown();
    default: unreachable(dir); // compile error if case missing!
  }
}
```

---

### 🎯 Result & Option

Rust-inspired monadic error handling:

```typescript
// Result<T, E> — explicit success/failure
const result = Ok(42);
result.map(v => v * 2);           // Ok(84)
result.andThen(v => Ok(v + 1));   // Ok(43)
result.unwrapOr(0);               // 42
result.match({
  ok: v => `Got ${v}`,
  err: e => `Failed: ${e}`,
});

// Catch exceptions safely
const parsed = ResultUtils.from(() => JSON.parse(input));

// Async support
const data = await ResultAsync.from(fetch('/api'))
  .map(res => res.json())
  .unwrapOr(defaultData);

// Option<T> — explicit null handling
const user = OptionUtils.from(getUserById(id));
const name = user.map(u => u.name).unwrapOr('Anonymous');

// Collect multiple Results
const all = ResultUtils.all([Ok(1), Ok(2), Ok(3)]); // Ok([1, 2, 3])
```

---

### 🔄 Transform

Type-safe data pipelines and string utilities:

```typescript
// Pipe — chain transformations
const result = pipe(
  '  Hello World  ',
  trim,
  lowercase,
  slugify,
); // → "hello-world"

// Flow — create reusable pipelines
const processTitle = flow(trim, capitalize, (s) => truncate(s, 50));
processTitle('  hello world  '); // → "Hello world"

// Type coercion (returns Result!)
toNumber('42');          // Ok(42)
toNumber('abc');         // Err(CoercionError)
toBoolean('yes');        // true
toDate('2024-01-15');    // Ok(Date)
toArray(42);             // [42]
toArray([1, 2]);         // [1, 2]
toArray(null);           // []

// String sanitization
camelCase('hello world');         // "helloWorld"
kebabCase('helloWorld');          // "hello-world"
snakeCase('helloWorld');          // "hello_world"
slugify('Hello, World! 🌍');     // "hello-world"
escapeHtml('<script>alert(1)');   // "&lt;script&gt;alert(1)"
truncate('Long text...', 10);    // "Long te..."
stripHtml('<p>Hello</p>');       // "Hello"
collapseWhitespace('a  b   c');  // "a b c"
reverse('hello');                 // "olleh"
countOccurrences('aaa', 'a');    // 3 (non-overlapping: 3)
```

---

### 🌍 Env

Validated, type-safe environment variables:

```typescript
import { createEnv, envString, envNumber, envBoolean, envEnum } from 'guarden/env';

export const env = createEnv({
  DATABASE_URL: envString().url().required(),
  PORT: envNumber().port().default(3000),
  DEBUG: envBoolean().default(false),
  NODE_ENV: envEnum(['development', 'production', 'test'] as const),
  API_KEY: envString().minLength(16),
  ALLOWED_ORIGINS: envString().matches(/^https?:\/\//),
});

// Fully typed! 🎉
env.DATABASE_URL  // string
env.PORT          // number
env.DEBUG         // boolean
env.NODE_ENV      // 'development' | 'production' | 'test'

// Throws descriptive errors at startup if invalid:
// EnvConfigError: Environment configuration is invalid:
//   DATABASE_URL: is required but not set
//   PORT: must be a valid port (1-65535)
```

---

## 🤔 Why Guarden?

| Feature | Guarden | Zod | neverthrow | ts-pattern |
|---|---|---|---|---|
| Type Guards | ✅ 60+ | ❌ | ❌ | ❌ |
| Assertions | ✅ | ❌ | ❌ | ❌ |
| Result/Option | ✅ | ❌ | ✅ | ❌ |
| Data Transform | ✅ | ✅ (parse) | ❌ | ❌ |
| Env Validation | ✅ | 🔶 (manual) | ❌ | ❌ |
| Zero Dependencies | ✅ | ✅ | ✅ | ✅ |
| Tree-Shakeable | ✅ | 🔶 | ✅ | ✅ |
| Bundle Size | ~3KB | ~14KB | ~5KB | ~3KB |

**Guarden** is the only library that provides a **complete runtime safety toolkit** in one package. Instead of installing 4+ separate libraries, get everything you need from one dependency.

## 🔧 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0 (recommended 5.5+)

## 📄 License

[MIT](LICENSE) © [Avinashvelu03](https://github.com/Avinashvelu03)

---

<div align="center">

**If Guarden helps your project, consider giving it a ⭐ on [GitHub](https://github.com/Avinashvelu03/guarden)!**

</div>
