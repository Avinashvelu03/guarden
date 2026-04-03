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

Blazing-fast, tree-shakeable utilities for bridging TypeScript’s compile-time safety with real-world runtime guarantees. Type guards, assertions, Result/Option monads, data pipelines, and environment validation — all in one lightweight, zero-dependency package.

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
yarn add guarden
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
const isUser = shape({ name: isString, age: isNumber });
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
const slug = pipe('  Hello, World! 🌍  ', (s) => s.trim(), slugify);
// → "hello-world"
```

## 🔌 Modular Imports

```typescript
import { isString, shape, arrayOf } from 'guarden/guards';
import { assert, invariant } from 'guarden/assert';
import { Ok, Err, Some, None } from 'guarden/result';
import { pipe, slugify, escapeHtml } from 'guarden/transform';
import { createEnv, envString } from 'guarden/env';
```

## 📖 API Reference

### 🛡️ Guards

```typescript
// Primitives
isString(v) | isNumber(v) | isBoolean(v) | isNull(v) | isUndefined(v)
isNullish(v) | isNonNullish(v) | isFunction(v) | isPrimitive(v)

// Structures
isArray(v) | isObject(v) | isPlainObject(v) | isDate(v) | isValidDate(v)
isMap(v) | isSet(v) | isRegExp(v) | isError(v) | isPromise(v)

// Advanced
isEmail(v) | isURL(v) | isUUID(v) | isISO8601(v) | isHexColor(v)
isPositiveNumber(v) | isInteger(v) | isNonEmptyArray(v)

// Factories
isInRange(0, 100)(v) | isOneOf(['a','b'] as const)(v)
isMinLength(3)(v) | isInstanceOf(TypeError)(v)

// Combinators
const guard = and(isInteger, isPositiveNumber);
const isUser = shape({ name: isString, age: isNumber });
const isStringArray = arrayOf(isString);
```

### ✅ Assert

```typescript
assert(condition, 'msg');
assertDefined(value);       // narrows away undefined
assertNonNull(value);       // narrows away null | undefined
assertType(value, isString);
invariant(items.length > 0, 'bug!');
unreachable(dir);           // exhaustive switch checking
```

### 🎯 Result & Option

```typescript
const result = Ok(42);
result.map(v => v * 2);
result.unwrapOr(0);
result.match({ ok: v => v, err: e => e });

const parsed = ResultUtils.from(() => JSON.parse(input));
const data = await ResultAsync.from(fetch('/api')).map(r => r.json()).unwrapOr(null);

const all = ResultUtils.all([Ok(1), Ok(2)]); // Ok([1, 2])
```

### 🔄 Transform

```typescript
pipe('  Hello World  ', trim, lowercase, slugify); // "hello-world"
const processTitle = flow(trim, capitalize, (s) => truncate(s, 50));

toNumber('42')           // Ok(42)
escapeHtml('<script>')   // "&lt;script&gt;"
camelCase('hello world') // "helloWorld"
slugify('Hello! 🌍')    // "hello"
```

### 🌍 Env

```typescript
export const env = createEnv({
  DATABASE_URL: envString().url().required(),
  PORT: envNumber().port().default(3000),
  DEBUG: envBoolean().default(false),
  NODE_ENV: envEnum(['development', 'production', 'test'] as const),
});

env.DATABASE_URL  // string
env.PORT          // number
env.DEBUG         // boolean
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
| Bundle Size | ~3KB | ~14KB | ~5KB | ~3KB |

## 🔧 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0

## 📄 License

[MIT](LICENSE) © [Avinashvelu03](https://github.com/Avinashvelu03)

---

## Guard the Dev — Support Guarden

<div align="center">

```
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓  ▄▄▄     ▄▄▄  ▄▄▄ ▄   ▄ ▄▄▄▄▄  ▄▄▄▄  ▄▄▄  ▓
  ▓ █████   █████ █████████ ███████ ██████ ███ ▓
  ▓ ███     ███ ███ ███ ███ ███    ███ ███ ▓
  ▓ █████   █████ █████████ ███ ███    ██████ ███ ▓
  ▓ ███     ███ ███ ███ ███ ███    ███    ███ ▓
  ▓ ███████ ███ ███ ███ ███ ███████ ███    ███ ▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

> *Guarden guards your runtime for free.*
> *A star, a sponsor, or a share keeps it alive and growing.*

[![Ko-fi](https://img.shields.io/badge/☕_Ko--fi-Guard_the_Dev-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/avinashvelu)
[![GitHub Sponsors](https://img.shields.io/badge/🛡️_GitHub-Sponsor_Guarden-EA4AAA?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/Avinashvelu03)

**Free ways to support:**
- ⭐ [Star on GitHub](https://github.com/Avinashvelu03/guarden)
- 🐛 [File issues or feature requests](https://github.com/Avinashvelu03/guarden/issues)
- 🗣️ Recommend Guarden to TypeScript devs who care about runtime safety

*Built with ❤️ by [Avinash Velu](https://github.com/Avinashvelu03)*

</div>
