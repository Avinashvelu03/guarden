// ============================================================================
// Guarden — Async Result & Option
// ============================================================================

import { Ok, Err, type Result, ResultUtils } from './result.js';
import { Some, None, type Option } from './option.js';

/**
 * A Result wrapped in a Promise, with chainable async operations.
 *
 * @example
 * ```ts
 * const result = ResultAsync.from(fetch('/api/user'))
 *   .map(res => res.json())
 *   .mapErr(err => new ApiError(err.message));
 * ```
 */
export class ResultAsync<T, E> {
  constructor(private readonly promise: Promise<Result<T, E>>) {}

  /**
   * Create from a Promise that may reject.
   */
  static from<T>(promise: Promise<T>): ResultAsync<T, Error> {
    return new ResultAsync(ResultUtils.fromPromise(promise));
  }

  /**
   * Create from a Result.
   */
  static fromResult<T, E>(result: Result<T, E>): ResultAsync<T, E> {
    return new ResultAsync(Promise.resolve(result));
  }

  /**
   * Create an Ok ResultAsync.
   */
  static ok<T>(value: T): ResultAsync<T, never> {
    return new ResultAsync(Promise.resolve(Ok(value)));
  }

  /**
   * Create an Err ResultAsync.
   */
  static err<E>(error: E): ResultAsync<never, E> {
    return new ResultAsync(Promise.resolve(Err(error)));
  }

  /** Transform the success value. */
  map<U>(fn: (value: T) => U): ResultAsync<U, E> {
    return new ResultAsync(this.promise.then((r) => r.map(fn)));
  }

  /** Transform the error value. */
  mapErr<F>(fn: (error: E) => F): ResultAsync<T, F> {
    return new ResultAsync(this.promise.then((r) => r.mapErr(fn)));
  }

  /** Chain async operations. */
  andThen<U>(fn: (value: T) => ResultAsync<U, E>): ResultAsync<U, E> {
    return new ResultAsync(
      this.promise.then((r) => {
        if (r.isErr()) return Err(r.unwrapErr()) as Result<U, E>;
        return fn(r.unwrap()).toPromise();
      }),
    );
  }

  /** Extract the underlying Promise<Result>. */
  toPromise(): Promise<Result<T, E>> {
    return this.promise;
  }

  /** Unwrap or throw. */
  async unwrap(): Promise<T> {
    const result = await this.promise;
    return result.unwrap();
  }

  /** Unwrap or return default. */
  async unwrapOr(defaultValue: T): Promise<T> {
    const result = await this.promise;
    return result.unwrapOr(defaultValue);
  }

  /** Pattern match on the resolved Result. */
  async match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): Promise<U> {
    const result = await this.promise;
    return result.match(handlers);
  }
}

/**
 * An Option wrapped in a Promise.
 */
export class OptionAsync<T> {
  constructor(private readonly promise: Promise<Option<T>>) {}

  /**
   * Create from a Promise that resolves to a nullable value.
   */
  static from<T>(promise: Promise<T | null | undefined>): OptionAsync<T> {
    return new OptionAsync(
      promise.then((v) =>
        v === null || v === undefined ? None<T>() : Some(v),
      ),
    );
  }

  static some<T>(value: T): OptionAsync<T> {
    return new OptionAsync(Promise.resolve(Some(value)));
  }

  static none<T = never>(): OptionAsync<T> {
    return new OptionAsync(Promise.resolve(None<T>()));
  }

  map<U>(fn: (value: T) => U): OptionAsync<U> {
    return new OptionAsync(this.promise.then((o) => o.map(fn)));
  }

  andThen<U>(fn: (value: T) => OptionAsync<U>): OptionAsync<U> {
    return new OptionAsync(
      this.promise.then((o) => {
        if (o.isNone()) return None<U>();
        return fn(o.unwrap()).toPromise();
      }),
    );
  }

  toPromise(): Promise<Option<T>> {
    return this.promise;
  }

  async unwrap(): Promise<T> {
    const option = await this.promise;
    return option.unwrap();
  }

  async unwrapOr(defaultValue: T): Promise<T> {
    const option = await this.promise;
    return option.unwrapOr(defaultValue);
  }

  async match<U>(handlers: { some: (value: T) => U; none: () => U }): Promise<U> {
    const option = await this.promise;
    return option.match(handlers);
  }
}
