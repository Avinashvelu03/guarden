# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-30

### Added

#### Guards Module
- Primitive type guards: `isString`, `isNumber`, `isBoolean`, `isBigInt`, `isSymbol`, `isNull`, `isUndefined`, `isNullish`, `isNonNullish`, `isFunction`, `isPrimitive`
- Number variants: `isNumberIncludingNaN`, `isFiniteNumber`
- Structure guards: `isArray`, `isObject`, `isPlainObject`, `isMap`, `isSet`, `isWeakMap`, `isWeakSet`, `isDate`, `isValidDate`, `isRegExp`, `isError`, `isPromise`, `isArrayBuffer`, `isTypedArray`
- Advanced guards: `isNonEmptyString`, `isEmail`, `isURL`, `isUUID`, `isISO8601`, `isJSONString`, `isHexColor`, `isPositiveNumber`, `isNegativeNumber`, `isInteger`, `isSafeInteger`, `isNonEmptyArray`
- Factory guards: `isInRange`, `isOneOf`, `isMatch`, `isMinLength`, `isMaxLength`, `isInstanceOf`
- Combinators: `and`, `or`, `not`, `shape`, `tuple`, `arrayOf`, `mapOf`, `recordOf`, `refine`, `optional`, `nullable`

#### Assert Module
- Runtime assertions: `assert`, `assertDefined`, `assertNonNull`, `assertType`, `assertTruthy`
- Invariant checking: `invariant`, `unreachable`

#### Result/Option Module
- `Result<T, E>` type with `Ok` and `Err` constructors
- Full functional API: `map`, `mapErr`, `andThen`, `orElse`, `unwrap`, `unwrapOr`, `unwrapOrElse`, `match`, `tap`, `tapErr`
- `Option<T>` type with `Some` and `None` constructors
- Full functional API: `map`, `andThen`, `unwrap`, `unwrapOr`, `match`, `filter`, `zip`
- `ResultUtils`: `from`, `fromPromise`, `all`, `isResult`
- `OptionUtils`: `from`, `fromPredicate`, `all`, `isOption`
- Async variants: `ResultAsync`, `OptionAsync`

#### Transform Module
- `pipe()` with 9 function overloads for full type inference
- `flow()` for function composition
- Type coercion: `toNumber`, `toString`, `toBoolean`, `toDate`, `toArray`, `toInteger`
- String sanitization: `trim`, `trimStart`, `trimEnd`, `lowercase`, `uppercase`, `capitalize`, `titleCase`, `camelCase`, `kebabCase`, `snakeCase`
- HTML utilities: `stripHtml`, `escapeHtml`, `unescapeHtml`
- Text utilities: `truncate`, `slugify`, `removeWhitespace`, `collapseWhitespace`, `padStart`, `padEnd`, `reverse`, `countOccurrences`

#### Env Module
- `createEnv()` for validated, type-safe environment variables
- Field builders: `envString()`, `envNumber()`, `envBoolean()`, `envEnum()`
- String validators: `.url()`, `.minLength()`, `.matches()`
- Number validators: `.port()`, `.min()`, `.max()`
- Custom validation: `.validate()`
- Defaults: `.default()`

#### Infrastructure
- Zero dependencies
- Dual ESM/CJS builds
- Full TypeScript type declarations
- 298 unit tests with 100% pass rate
- GitHub Actions CI/CD pipelines
- MIT License
