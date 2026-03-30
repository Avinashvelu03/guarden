// ============================================================================
// Guarden — Environment Variable Validation
// ============================================================================

import { EnvValidationError, EnvConfigError } from '../utils/errors.js';

// -- Types -------------------------------------------------------------------

type EnvValue = string | number | boolean;

interface EnvFieldConfig<T extends EnvValue> {
  type: 'string' | 'number' | 'boolean' | 'enum';
  required: boolean;
  defaultValue?: T;
  validators: Array<(value: T) => string | null>;
  transformer: (raw: string) => T;
  enumValues?: readonly string[];
}

type InferEnvType<T> = T extends EnvField<infer U> ? U : never;

type EnvSchema = Record<string, EnvField<EnvValue>>;

type InferEnv<T extends EnvSchema> = {
  [K in keyof T]: InferEnvType<T[K]>;
};

// -- Field Builder -----------------------------------------------------------

/**
 * A builder for defining environment variable validation rules.
 */
export class EnvField<T extends EnvValue> {
  /** @internal */
  _config: EnvFieldConfig<T>;

  constructor(config: EnvFieldConfig<T>) {
    this._config = config;
  }

  /** Mark the field as required (default). */
  required(): EnvField<T> {
    return new EnvField({ ...this._config, required: true });
  }

  /** Mark the field as optional with a default value. */
  default(value: T): EnvField<T> {
    return new EnvField({ ...this._config, required: false, defaultValue: value });
  }

  /** Add a custom validation rule. */
  validate(fn: (value: T) => string | null): EnvField<T> {
    return new EnvField({
      ...this._config,
      validators: [...this._config.validators, fn],
    });
  }
}

// -- Field Constructors ------------------------------------------------------

/**
 * Define a string environment variable.
 *
 * @example
 * ```ts
 * const env = createEnv({
 *   DATABASE_URL: envString().url().required(),
 * });
 * ```
 */
export function envString(): StringEnvField {
  return new StringEnvField({
    type: 'string',
    required: true,
    validators: [],
    transformer: (raw: string) => raw,
  });
}

class StringEnvField extends EnvField<string> {
  /** Validate that the string is a valid URL. */
  url(): StringEnvField {
    return new StringEnvField({
      ...this._config,
      validators: [
        ...this._config.validators,
        (value: string) => {
          try {
            new URL(value);
            return null;
          } catch {
            return `must be a valid URL`;
          }
        },
      ],
    });
  }

  /** Validate minimum length. */
  minLength(min: number): StringEnvField {
    return new StringEnvField({
      ...this._config,
      validators: [
        ...this._config.validators,
        (value: string) =>
          value.length >= min ? null : `must be at least ${min} characters`,
      ],
    });
  }

  /** Validate that the string matches a pattern. */
  matches(pattern: RegExp): StringEnvField {
    return new StringEnvField({
      ...this._config,
      validators: [
        ...this._config.validators,
        (value: string) =>
          pattern.test(value) ? null : `must match pattern ${pattern.toString()}`,
      ],
    });
  }

  /** Set a default value. */
  override default(value: string): StringEnvField {
    return new StringEnvField({
      ...this._config,
      required: false,
      defaultValue: value,
    });
  }

  /** Mark as required. */
  override required(): StringEnvField {
    return new StringEnvField({ ...this._config, required: true });
  }
}

/**
 * Define a numeric environment variable.
 * Automatically coerces the string value to a number.
 *
 * @example
 * ```ts
 * const env = createEnv({
 *   PORT: envNumber().port().default(3000),
 * });
 * ```
 */
export function envNumber(): NumberEnvField {
  return new NumberEnvField({
    type: 'number',
    required: true,
    validators: [],
    transformer: (raw: string) => {
      const n = Number(raw);
      if (Number.isNaN(n)) throw new Error(`Cannot parse "${raw}" as number`);
      return n;
    },
  });
}

class NumberEnvField extends EnvField<number> {
  /** Validate that the number is a valid port (1-65535). */
  port(): NumberEnvField {
    return new NumberEnvField({
      ...this._config,
      validators: [
        ...this._config.validators,
        (value: number) =>
          Number.isInteger(value) && value >= 1 && value <= 65535
            ? null
            : `must be a valid port (1-65535)`,
      ],
    });
  }

  /** Validate minimum value. */
  min(min: number): NumberEnvField {
    return new NumberEnvField({
      ...this._config,
      validators: [
        ...this._config.validators,
        (value: number) => (value >= min ? null : `must be at least ${min}`),
      ],
    });
  }

  /** Validate maximum value. */
  max(max: number): NumberEnvField {
    return new NumberEnvField({
      ...this._config,
      validators: [
        ...this._config.validators,
        (value: number) => (value <= max ? null : `must be at most ${max}`),
      ],
    });
  }

  /** Set a default value. */
  override default(value: number): NumberEnvField {
    return new NumberEnvField({
      ...this._config,
      required: false,
      defaultValue: value,
    });
  }

  /** Mark as required. */
  override required(): NumberEnvField {
    return new NumberEnvField({ ...this._config, required: true });
  }
}

/**
 * Define a boolean environment variable.
 * Recognizes: "true", "1", "yes", "on" as true.
 *
 * @example
 * ```ts
 * const env = createEnv({
 *   DEBUG: envBoolean().default(false),
 * });
 * ```
 */
export function envBoolean(): BooleanEnvField {
  return new BooleanEnvField({
    type: 'boolean',
    required: true,
    validators: [],
    transformer: (raw: string) => {
      const lower = raw.trim().toLowerCase();
      return ['true', '1', 'yes', 'on'].includes(lower);
    },
  });
}

class BooleanEnvField extends EnvField<boolean> {
  /** Set a default value. */
  override default(value: boolean): BooleanEnvField {
    return new BooleanEnvField({
      ...this._config,
      required: false,
      defaultValue: value,
    });
  }

  /** Mark as required. */
  override required(): BooleanEnvField {
    return new BooleanEnvField({ ...this._config, required: true });
  }
}

/**
 * Define an enum environment variable.
 * Value must be one of the specified options.
 *
 * @example
 * ```ts
 * const env = createEnv({
 *   NODE_ENV: envEnum(['development', 'production', 'test'] as const),
 * });
 * // env.NODE_ENV is 'development' | 'production' | 'test'
 * ```
 */
export function envEnum<T extends readonly string[]>(
  values: T,
): EnvField<T[number]> {
  return new EnvField<T[number]>({
    type: 'enum',
    required: true,
    validators: [
      (value: string) =>
        (values as readonly string[]).includes(value)
          ? null
          : `must be one of: ${values.join(', ')}`,
    ],
    transformer: (raw: string) => raw as T[number],
    enumValues: values,
  });
}

// -- createEnv ---------------------------------------------------------------

/**
 * Validate and type-safe environment variables.
 * Throws `EnvConfigError` at startup if validation fails.
 *
 * @example
 * ```ts
 * import { createEnv, envString, envNumber, envBoolean, envEnum } from 'guarden/env';
 *
 * export const env = createEnv({
 *   DATABASE_URL: envString().url().required(),
 *   PORT: envNumber().port().default(3000),
 *   DEBUG: envBoolean().default(false),
 *   NODE_ENV: envEnum(['development', 'production', 'test']),
 * });
 *
 * // Fully typed!
 * env.DATABASE_URL // string
 * env.PORT         // number
 * env.DEBUG        // boolean
 * env.NODE_ENV     // 'development' | 'production' | 'test'
 * ```
 */
export function createEnv<T extends EnvSchema>(
  schema: T,
  source?: Record<string, string | undefined>,
): InferEnv<T> {
  const envSource = source ?? (typeof process !== 'undefined' ? process.env : {});
  const result: Record<string, EnvValue> = {};
  const errors: EnvValidationError[] = [];

  for (const [key, field] of Object.entries(schema)) {
    const raw = envSource[key];
    const config = field._config;

    // Check if required
    if (raw === undefined || raw === '') {
      if (config.required) {
        errors.push(new EnvValidationError(key, ['is required but not set']));
        continue;
      }
      if (config.defaultValue !== undefined) {
        result[key] = config.defaultValue;
        continue;
      }
    }

    // Transform
    let value: EnvValue;
    try {
      value = config.transformer(raw ?? '');
    } catch (e) {
      errors.push(
        new EnvValidationError(key, [
          `transformation failed: ${e instanceof Error ? e.message : String(e)}`,
        ]),
      );
      continue;
    }

    // Validate
    const fieldErrors: string[] = [];
    for (const validator of config.validators) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = validator(value as any);
      if (error) fieldErrors.push(error);
    }

    if (fieldErrors.length > 0) {
      errors.push(new EnvValidationError(key, fieldErrors));
      continue;
    }

    result[key] = value;
  }

  if (errors.length > 0) {
    throw new EnvConfigError(errors);
  }

  return result as InferEnv<T>;
}
