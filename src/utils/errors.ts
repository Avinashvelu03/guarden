// ============================================================================
// Guarden — Custom Error Classes
// ============================================================================

/**
 * Base error class for all Guarden errors.
 * Provides clean stack traces and error identification.
 */
export class GuardenError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'GuardenError';
    this.code = code;
    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a runtime assertion fails.
 */
export class AssertionError extends GuardenError {
  constructor(message: string) {
    super(message, 'ERR_ASSERTION');
    this.name = 'AssertionError';
  }
}

/**
 * Thrown when an invariant is violated.
 * Indicates a bug in the program logic.
 */
export class InvariantError extends GuardenError {
  constructor(message: string) {
    super(`Invariant violation: ${message}`, 'ERR_INVARIANT');
    this.name = 'InvariantError';
  }
}

/**
 * Thrown when type coercion fails.
 */
export class CoercionError extends GuardenError {
  public readonly originalValue: unknown;
  public readonly targetType: string;

  constructor(value: unknown, targetType: string) {
    super(
      `Cannot coerce ${typeof value} (${String(value)}) to ${targetType}`,
      'ERR_COERCION',
    );
    this.name = 'CoercionError';
    this.originalValue = value;
    this.targetType = targetType;
  }
}

/**
 * Thrown when environment variable validation fails.
 */
export class EnvValidationError extends GuardenError {
  public readonly variableName: string;
  public readonly errors: string[];

  constructor(variableName: string, errors: string[]) {
    super(
      `Environment variable "${variableName}" validation failed:\n  - ${errors.join('\n  - ')}`,
      'ERR_ENV_VALIDATION',
    );
    this.name = 'EnvValidationError';
    this.variableName = variableName;
    this.errors = errors;
  }
}

/**
 * Thrown when multiple environment variables fail validation.
 */
export class EnvConfigError extends GuardenError {
  public readonly validationErrors: EnvValidationError[];

  constructor(errors: EnvValidationError[]) {
    const summary = errors.map((e) => `  ${e.variableName}: ${e.errors.join(', ')}`).join('\n');
    super(`Environment configuration is invalid:\n${summary}`, 'ERR_ENV_CONFIG');
    this.name = 'EnvConfigError';
    this.validationErrors = errors;
  }
}

/**
 * Thrown when code reaches a state that should be unreachable.
 */
export class UnreachableError extends GuardenError {
  constructor(value: never) {
    super(
      `Unreachable code reached with value: ${JSON.stringify(value)}`,
      'ERR_UNREACHABLE',
    );
    this.name = 'UnreachableError';
  }
}
