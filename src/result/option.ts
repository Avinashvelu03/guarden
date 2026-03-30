// ============================================================================
// Guarden — Option<T> Monadic Null Handling
// ============================================================================

/**
 * Represents a value that may or may not exist.
 * Eliminates null/undefined bugs by making optionality explicit.
 *
 * @example
 * ```ts
 * const user = Option.from(getUserById(id));
 * const name = user.map(u => u.name).unwrapOr('Anonymous');
 * ```
 */
export type Option<T> = SomeOption<T> | NoneOption<T>;

class SomeOption<T> {
  readonly _tag = 'Some' as const;
  constructor(public readonly value: T) {}

  isSome(): this is SomeOption<T> {
    return true;
  }

  isNone(): this is NoneOption<T> {
    return false;
  }

  /** Transform the contained value. */
  map<U>(fn: (value: T) => U): Option<U> {
    return new SomeOption(fn(this.value));
  }

  /** Chain operations that return an Option (flatMap). */
  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  /** Return this Option if Some, otherwise return the other. */
  orElse(_fn: () => Option<T>): Option<T> {
    return this;
  }

  /** Get the value, or throw if None. */
  unwrap(): T {
    return this.value;
  }

  /** Get the value, or return a default. */
  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  /** Get the value, or compute a default. */
  unwrapOrElse(_fn: () => T): T {
    return this.value;
  }

  /** Pattern match on the Option. */
  match<U>(handlers: { some: (value: T) => U; none: () => U }): U {
    return handlers.some(this.value);
  }

  /** Filter: return None if the predicate fails. */
  filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this.value) ? this : new NoneOption<T>();
  }

  /** Apply a side-effect function if Some. */
  tap(fn: (value: T) => void): Option<T> {
    fn(this.value);
    return this;
  }

  /** Zip with another Option. */
  zip<U>(other: Option<U>): Option<[T, U]> {
    if (other.isSome()) {
      return new SomeOption([this.value, other.value] as [T, U]);
    }
    return new NoneOption();
  }

  toJSON(): { tag: 'Some'; value: T } {
    return { tag: 'Some', value: this.value };
  }

  toString(): string {
    return `Some(${JSON.stringify(this.value)})`;
  }
}

class NoneOption<T> {
  readonly _tag = 'None' as const;

  isSome(): this is SomeOption<T> {
    return false;
  }

  isNone(): this is NoneOption<T> {
    return true;
  }

  map<U>(_fn: (value: T) => U): Option<U> {
    return new NoneOption();
  }

  andThen<U>(_fn: (value: T) => Option<U>): Option<U> {
    return new NoneOption();
  }

  orElse(fn: () => Option<T>): Option<T> {
    return fn();
  }

  unwrap(): T {
    throw new Error('Called unwrap on None');
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: () => T): T {
    return fn();
  }

  match<U>(handlers: { some: (value: T) => U; none: () => U }): U {
    return handlers.none();
  }

  filter(_predicate: (value: T) => boolean): Option<T> {
    return this;
  }

  tap(_fn: (value: T) => void): Option<T> {
    return this;
  }

  zip<U>(_other: Option<U>): Option<[T, U]> {
    return new NoneOption();
  }

  toJSON(): { tag: 'None' } {
    return { tag: 'None' };
  }

  toString(): string {
    return 'None';
  }
}

// -- Public constructors -----------------------------------------------------

/**
 * Create an Option containing a value.
 */
export function Some<T>(value: T): Option<T> {
  return new SomeOption(value);
}

/**
 * Create an empty Option.
 */
export function None<T = never>(): Option<T> {
  return new NoneOption<T>();
}

// -- Static utilities --------------------------------------------------------

export const OptionUtils = {
  /**
   * Create an Option from a nullable value.
   * null | undefined → None, everything else → Some.
   *
   * @example
   * ```ts
   * Option.from(null)      // None
   * Option.from(undefined) // None
   * Option.from(42)        // Some(42)
   * Option.from('')        // Some('')  (empty string is still Some)
   * ```
   */
  from<T>(value: T | null | undefined): Option<T> {
    return value === null || value === undefined
      ? new NoneOption<T>()
      : new SomeOption(value);
  },

  /**
   * Create an Option from a predicate check.
   */
  fromPredicate<T>(value: T, predicate: (v: T) => boolean): Option<T> {
    return predicate(value) ? new SomeOption(value) : new NoneOption<T>();
  },

  /**
   * Check if a value is an Option.
   */
  isOption<T>(value: unknown): value is Option<T> {
    return value instanceof SomeOption || value instanceof NoneOption;
  },

  /**
   * Collect an array of Options into an Option of array.
   * Returns None if any Option is None.
   */
  all<T>(options: Option<T>[]): Option<T[]> {
    const values: T[] = [];
    for (const opt of options) {
      if (opt.isNone()) return new NoneOption<T[]>();
      values.push(opt.unwrap());
    }
    return new SomeOption(values);
  },
};
