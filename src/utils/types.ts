// ============================================================================
// Guarden — Shared TypeScript Utility Types
// ============================================================================

/** A type guard function that narrows `unknown` to `T` */
export type Guard<T> = (value: unknown) => value is T;

/** Extract the guarded type from a Guard */
export type GuardType<G> = G extends Guard<infer T> ? T : never;

/** Make all properties required and non-nullable */
export type RequiredDeep<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

/** A value that could be null or undefined */
export type Nullish = null | undefined;

/** A value that is neither null nor undefined */
export type NonNullish<T> = Exclude<T, Nullish>;

/** Primitive JavaScript types */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** A plain object with string keys */
export type PlainObject = Record<string, unknown>;

/** Function type shorthand */
export type AnyFunction = (...args: unknown[]) => unknown;

/** A readonly tuple type */
export type ReadonlyTuple<T extends readonly unknown[]> = readonly [...T];

/** Branded type for nominal typing */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** Infer the shape from a guard record */
export type ShapeGuardType<T extends Record<string, Guard<unknown>>> = {
  [K in keyof T]: GuardType<T[K]>;
};
