// ============================================================================
// Guarden — Result<T, E> Monadic Error Handling
// ============================================================================

/**
 * Represents the result of an operation that can succeed (`Ok`) or fail (`Err`).
 * Inspired by Rust's Result type — makes errors explicit in the type system.
 *
 * @example
 * ```ts
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) return Err('Division by zero');
 *   return Ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 * result.match({
 *   ok: (value) => console.log(`Result: ${value}`),
 *   err: (error) => console.error(`Error: ${error}`),
 * });
 * ```
 */
export type Result<T, E> = OkResult<T, E> | ErrResult<T, E>;

// -- Internal implementations ------------------------------------------------

class OkResult<T, E> {
  readonly _tag = 'Ok' as const;
  constructor(public readonly value: T) {}

  isOk(): this is OkResult<T, E> {
    return true;
  }

  isErr(): this is ErrResult<T, E> {
    return false;
  }

  /** Transform the success value. */
  map<U>(fn: (value: T) => U): Result<U, E> {
    return new OkResult(fn(this.value));
  }

  /** Transform the error value (no-op for Ok). */
  mapErr<F>(_fn: (error: E) => F): Result<T, F> {
    return new OkResult(this.value);
  }

  /** Chain operations that return a Result (flatMap). */
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  /** Return this Result if Ok, otherwise return the other. */
  orElse<F>(_fn: (error: E) => Result<T, F>): Result<T, F> {
    return new OkResult(this.value);
  }

  /** Get the value, or throw if Err. */
  unwrap(): T {
    return this.value;
  }

  /** Get the value, or return a default. */
  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  /** Get the value, or compute a default from the error. */
  unwrapOrElse(_fn: (error: E) => T): T {
    return this.value;
  }

  /** Get the error, or throw if Ok. */
  unwrapErr(): E {
    throw new Error(`Called unwrapErr on Ok value: ${JSON.stringify(this.value)}`);
  }

  /** Pattern match on the Result. */
  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U {
    return handlers.ok(this.value);
  }

  /** Convert to an Option, discarding the error. */
  ok(): T | undefined {
    return this.value;
  }

  /** Convert to an Option of the error (returns undefined for Ok). */
  err(): E | undefined {
    return undefined;
  }

  /** Apply a function to the value if Ok, used for side effects. */
  tap(fn: (value: T) => void): Result<T, E> {
    fn(this.value);
    return this;
  }

  /** Apply a function to the error if Err (no-op for Ok). */
  tapErr(_fn: (error: E) => void): Result<T, E> {
    return this;
  }

  /** Convert to a JSON-friendly representation. */
  toJSON(): { tag: 'Ok'; value: T } {
    return { tag: 'Ok', value: this.value };
  }

  toString(): string {
    return `Ok(${JSON.stringify(this.value)})`;
  }
}

class ErrResult<T, E> {
  readonly _tag = 'Err' as const;
  constructor(public readonly error: E) {}

  isOk(): this is OkResult<T, E> {
    return false;
  }

  isErr(): this is ErrResult<T, E> {
    return true;
  }

  map<U>(_fn: (value: T) => U): Result<U, E> {
    return new ErrResult(_fn as never);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return new ErrResult(fn(this.error));
  }

  andThen<U>(_fn: (value: T) => Result<U, E>): Result<U, E> {
    return new ErrResult(this.error);
  }

  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
    return fn(this.error);
  }

  unwrap(): T {
    throw new Error(`Called unwrap on Err value: ${JSON.stringify(this.error)}`);
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: (error: E) => T): T {
    return fn(this.error);
  }

  unwrapErr(): E {
    return this.error;
  }

  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U {
    return handlers.err(this.error);
  }

  ok(): T | undefined {
    return undefined;
  }

  err(): E | undefined {
    return this.error;
  }

  tap(_fn: (value: T) => void): Result<T, E> {
    return this;
  }

  tapErr(fn: (error: E) => void): Result<T, E> {
    fn(this.error);
    return this;
  }

  toJSON(): { tag: 'Err'; error: E } {
    return { tag: 'Err', error: this.error };
  }

  toString(): string {
    return `Err(${JSON.stringify(this.error)})`;
  }
}

// -- Public constructors -----------------------------------------------------

/**
 * Create a successful Result.
 */
export function Ok<T>(value: T): Result<T, never> {
  return new OkResult(value);
}

/**
 * Create a failed Result.
 */
export function Err<E>(error: E): Result<never, E> {
  return new ErrResult(error);
}

// -- Static utilities --------------------------------------------------------

/**
 * Result namespace with static utility methods.
 */
export const ResultUtils = {
  /**
   * Wrap a function that may throw into a Result.
   *
   * @example
   * ```ts
   * const result = Result.from(() => JSON.parse(input));
   * ```
   */
  from<T>(fn: () => T): Result<T, Error> {
    try {
      return Ok(fn());
    } catch (e) {
      return Err(e instanceof Error ? e : new Error(String(e)));
    }
  },

  /**
   * Wrap a Promise into a ResultAsync.
   */
  async fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>> {
    try {
      const value = await promise;
      return Ok(value);
    } catch (e) {
      return Err(e instanceof Error ? e : new Error(String(e)));
    }
  },

  /**
   * Collect an array of Results into a Result of an array.
   * Returns the first Err encountered, or Ok with all values.
   */
  all<T, E>(results: Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];
    for (const result of results) {
      if (result.isErr()) return Err(result.unwrapErr());
      values.push(result.unwrap());
    }
    return Ok(values);
  },

  /**
   * Check if a value is a Result.
   */
  isResult<T, E>(value: unknown): value is Result<T, E> {
    return value instanceof OkResult || value instanceof ErrResult;
  },
};
