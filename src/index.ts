// ============================================================================
// Guarden — Main Entry Point
// TypeScript-First Runtime Safety Toolkit
// ============================================================================

// Guards
export {
  isString,
  isNumber,
  isNumberIncludingNaN,
  isFiniteNumber,
  isBoolean,
  isBigInt,
  isSymbol,
  isNull,
  isUndefined,
  isNullish,
  isNonNullish,
  isFunction,
  isPrimitive,
  isArray,
  isObject,
  isPlainObject,
  isMap,
  isSet,
  isWeakMap,
  isWeakSet,
  isDate,
  isValidDate,
  isRegExp,
  isError,
  isPromise,
  isArrayBuffer,
  isTypedArray,
  isNonEmptyString,
  isEmail,
  isURL,
  isUUID,
  isISO8601,
  isJSONString,
  isHexColor,
  isPositiveNumber,
  isNegativeNumber,
  isInteger,
  isSafeInteger,
  isNonEmptyArray,
  isInRange,
  isOneOf,
  isMatch,
  isMinLength,
  isMaxLength,
  isInstanceOf,
  and,
  or,
  not,
  shape,
  tuple,
  arrayOf,
  mapOf,
  recordOf,
  refine,
  optional,
  nullable,
} from './guards/index.js';

// Assert
export {
  assert,
  assertDefined,
  assertNonNull,
  assertType,
  assertTruthy,
  invariant,
  unreachable,
} from './assert/index.js';

// Result & Option
export {
  Ok,
  Err,
  ResultUtils,
  type Result,
  Some,
  None,
  OptionUtils,
  type Option,
  ResultAsync,
  OptionAsync,
} from './result/index.js';

// Transform
export {
  pipe,
  flow,
  toNumber,
  toString,
  toBoolean,
  toDate,
  toArray,
  toInteger,
  trim,
  trimStart,
  trimEnd,
  lowercase,
  uppercase,
  capitalize,
  titleCase,
  camelCase,
  kebabCase,
  snakeCase,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  truncate,
  slugify,
  removeWhitespace,
  collapseWhitespace,
  padStart,
  padEnd,
  reverse,
  countOccurrences,
} from './transform/index.js';

// Env
export {
  createEnv,
  envString,
  envNumber,
  envBoolean,
  envEnum,
  EnvField,
} from './env/index.js';

// Errors
export {
  GuardenError,
  AssertionError,
  InvariantError,
  CoercionError,
  EnvValidationError,
  EnvConfigError,
  UnreachableError,
} from './utils/errors.js';

// Types
export type {
  Guard,
  GuardType,
  Nullish,
  NonNullish,
  Primitive,
  PlainObject,
  AnyFunction,
  Brand,
} from './utils/types.js';
