// ============================================================================
// Guarden — Result & Option Tests
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  Ok, Err, ResultUtils, type Result,
  Some, None, OptionUtils, type Option,
  ResultAsync, OptionAsync,
} from '../src/result/index.js';

describe('Result', () => {
  describe('Ok', () => {
    const result = Ok(42);

    it('isOk() returns true', () => {
      expect(result.isOk()).toBe(true);
    });

    it('isErr() returns false', () => {
      expect(result.isErr()).toBe(false);
    });

    it('unwrap() returns the value', () => {
      expect(result.unwrap()).toBe(42);
    });

    it('unwrapOr() returns the value, not default', () => {
      expect(result.unwrapOr(0)).toBe(42);
    });

    it('unwrapOrElse() returns the value', () => {
      expect(result.unwrapOrElse(() => 0)).toBe(42);
    });

    it('unwrapErr() throws', () => {
      expect(() => result.unwrapErr()).toThrow();
    });

    it('map() transforms the value', () => {
      const mapped = result.map((v) => v * 2);
      expect(mapped.unwrap()).toBe(84);
    });

    it('mapErr() is a no-op', () => {
      const mapped = result.mapErr(() => 'new error');
      expect(mapped.unwrap()).toBe(42);
    });

    it('andThen() chains operations', () => {
      const chained = result.andThen((v) => Ok(v.toString()));
      expect(chained.unwrap()).toBe('42');
    });

    it('orElse() is a no-op', () => {
      const alt = result.orElse(() => Ok(0));
      expect(alt.unwrap()).toBe(42);
    });

    it('match() calls ok handler', () => {
      const out = result.match({
        ok: (v) => `value: ${v}`,
        err: (e) => `error: ${e}`,
      });
      expect(out).toBe('value: 42');
    });

    it('ok() returns the value', () => {
      expect(result.ok()).toBe(42);
    });

    it('err() returns undefined', () => {
      expect(result.err()).toBeUndefined();
    });

    it('tap() executes side effects', () => {
      let sideEffect = 0;
      result.tap((v) => { sideEffect = v; });
      expect(sideEffect).toBe(42);
    });

    it('tapErr() is a no-op', () => {
      let called = false;
      result.tapErr(() => { called = true; });
      expect(called).toBe(false);
    });

    it('toJSON() returns structured output', () => {
      expect(result.toJSON()).toEqual({ tag: 'Ok', value: 42 });
    });

    it('toString() returns readable string', () => {
      expect(result.toString()).toBe('Ok(42)');
    });
  });

  describe('Err', () => {
    const result: Result<number, string> = Err('something went wrong');

    it('isOk() returns false', () => {
      expect(result.isOk()).toBe(false);
    });

    it('isErr() returns true', () => {
      expect(result.isErr()).toBe(true);
    });

    it('unwrap() throws', () => {
      expect(() => result.unwrap()).toThrow();
    });

    it('unwrapOr() returns default', () => {
      expect(result.unwrapOr(0)).toBe(0);
    });

    it('unwrapOrElse() computes default', () => {
      expect(result.unwrapOrElse((e) => e.length)).toBe(20);
    });

    it('unwrapErr() returns the error', () => {
      expect(result.unwrapErr()).toBe('something went wrong');
    });

    it('map() is a no-op', () => {
      const mapped = result.map((v) => v * 2);
      expect(mapped.isErr()).toBe(true);
    });

    it('mapErr() transforms the error', () => {
      const mapped = result.mapErr((e) => e.toUpperCase());
      expect(mapped.unwrapErr()).toBe('SOMETHING WENT WRONG');
    });

    it('andThen() is a no-op', () => {
      const chained = result.andThen((v) => Ok(v.toString()));
      expect(chained.isErr()).toBe(true);
    });

    it('orElse() calls the recovery function', () => {
      const alt = result.orElse(() => Ok(99));
      expect(alt.unwrap()).toBe(99);
    });

    it('match() calls err handler', () => {
      const out = result.match({
        ok: (v) => `value: ${v}`,
        err: (e) => `error: ${e}`,
      });
      expect(out).toBe('error: something went wrong');
    });

    it('ok() returns undefined', () => {
      expect(result.ok()).toBeUndefined();
    });

    it('err() returns the error', () => {
      expect(result.err()).toBe('something went wrong');
    });

    it('tap() is a no-op', () => {
      let called = false;
      result.tap(() => { called = true; });
      expect(called).toBe(false);
    });

    it('tapErr() executes side effect', () => {
      let capturedError = '';
      result.tapErr((e) => { capturedError = e; });
      expect(capturedError).toBe('something went wrong');
    });

    it('toJSON() returns structured output', () => {
      expect(result.toJSON()).toEqual({ tag: 'Err', error: 'something went wrong' });
    });

    it('toString() returns readable string', () => {
      expect(result.toString()).toBe('Err("something went wrong")');
    });
  });

  describe('ResultUtils', () => {
    it('from() catches exceptions', () => {
      const ok = ResultUtils.from(() => 42);
      expect(ok.unwrap()).toBe(42);

      const err = ResultUtils.from(() => { throw new Error('boom'); });
      expect(err.isErr()).toBe(true);
      expect(err.unwrapErr().message).toBe('boom');
    });

    it('from() wraps non-Error throws', () => {
      const err = ResultUtils.from(() => { throw 'string error'; });
      expect(err.unwrapErr().message).toBe('string error');
    });

    it('fromPromise() resolves Ok', async () => {
      const result = await ResultUtils.fromPromise(Promise.resolve(42));
      expect(result.unwrap()).toBe(42);
    });

    it('fromPromise() catches rejections', async () => {
      const result = await ResultUtils.fromPromise(Promise.reject(new Error('fail')));
      expect(result.isErr()).toBe(true);
    });

    it('fromPromise() wraps non-Error rejections', async () => {
      const result = await ResultUtils.fromPromise(Promise.reject('string rejection'));
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe('string rejection');
    });

    it('all() collects results', () => {
      const results = [Ok(1), Ok(2), Ok(3)];
      const all = ResultUtils.all(results);
      expect(all.unwrap()).toEqual([1, 2, 3]);
    });

    it('all() returns first error', () => {
      const results: Result<number, string>[] = [Ok(1), Err('fail'), Ok(3)];
      const all = ResultUtils.all(results);
      expect(all.isErr()).toBe(true);
      expect(all.unwrapErr()).toBe('fail');
    });

    it('isResult() identifies Results', () => {
      expect(ResultUtils.isResult(Ok(42))).toBe(true);
      expect(ResultUtils.isResult(Err('fail'))).toBe(true);
      expect(ResultUtils.isResult(42)).toBe(false);
      expect(ResultUtils.isResult(null)).toBe(false);
    });
  });
});

describe('Option', () => {
  describe('Some', () => {
    const opt = Some(42);

    it('isSome() returns true', () => {
      expect(opt.isSome()).toBe(true);
    });

    it('isNone() returns false', () => {
      expect(opt.isNone()).toBe(false);
    });

    it('unwrap() returns the value', () => {
      expect(opt.unwrap()).toBe(42);
    });

    it('unwrapOr() returns the value', () => {
      expect(opt.unwrapOr(0)).toBe(42);
    });

    it('unwrapOrElse() returns the value', () => {
      expect(opt.unwrapOrElse(() => 0)).toBe(42);
    });

    it('map() transforms the value', () => {
      expect(opt.map((v) => v * 2).unwrap()).toBe(84);
    });

    it('andThen() chains operations', () => {
      expect(opt.andThen((v) => Some(v.toString())).unwrap()).toBe('42');
    });

    it('orElse() is a no-op', () => {
      expect(opt.orElse(() => Some(0)).unwrap()).toBe(42);
    });

    it('match() calls some handler', () => {
      expect(opt.match({ some: (v) => v, none: () => 0 })).toBe(42);
    });

    it('filter() keeps matching values', () => {
      expect(opt.filter((v) => v > 0).isSome()).toBe(true);
      expect(opt.filter((v) => v < 0).isNone()).toBe(true);
    });

    it('tap() executes side effects', () => {
      let sideEffect = 0;
      opt.tap((v) => { sideEffect = v; });
      expect(sideEffect).toBe(42);
    });

    it('zip() combines with another Some', () => {
      const zipped = opt.zip(Some('hello'));
      expect(zipped.unwrap()).toEqual([42, 'hello']);
    });

    it('zip() returns None when other is None', () => {
      const zipped = opt.zip(None());
      expect(zipped.isNone()).toBe(true);
    });

    it('toJSON() returns structured output', () => {
      expect(opt.toJSON()).toEqual({ tag: 'Some', value: 42 });
    });

    it('toString() returns readable string', () => {
      expect(opt.toString()).toBe('Some(42)');
    });
  });

  describe('None', () => {
    const opt: Option<number> = None();

    it('isSome() returns false', () => {
      expect(opt.isSome()).toBe(false);
    });

    it('isNone() returns true', () => {
      expect(opt.isNone()).toBe(true);
    });

    it('unwrap() throws', () => {
      expect(() => opt.unwrap()).toThrow('Called unwrap on None');
    });

    it('unwrapOr() returns default', () => {
      expect(opt.unwrapOr(0)).toBe(0);
    });

    it('unwrapOrElse() computes default', () => {
      expect(opt.unwrapOrElse(() => 99)).toBe(99);
    });

    it('map() is a no-op', () => {
      expect(opt.map((v) => v * 2).isNone()).toBe(true);
    });

    it('andThen() is a no-op', () => {
      expect(opt.andThen((v) => Some(v.toString())).isNone()).toBe(true);
    });

    it('orElse() returns the alternative', () => {
      expect(opt.orElse(() => Some(99)).unwrap()).toBe(99);
    });

    it('match() calls none handler', () => {
      expect(opt.match({ some: (v) => v, none: () => 0 })).toBe(0);
    });

    it('filter() returns None', () => {
      expect(opt.filter(() => true).isNone()).toBe(true);
    });

    it('tap() is a no-op', () => {
      let called = false;
      opt.tap(() => { called = true; });
      expect(called).toBe(false);
    });

    it('zip() returns None', () => {
      expect(opt.zip(Some(42)).isNone()).toBe(true);
    });

    it('toJSON() returns structured output', () => {
      expect(opt.toJSON()).toEqual({ tag: 'None' });
    });

    it('toString() returns "None"', () => {
      expect(opt.toString()).toBe('None');
    });
  });

  describe('OptionUtils', () => {
    it('from() creates Some from values', () => {
      expect(OptionUtils.from(42).unwrap()).toBe(42);
      expect(OptionUtils.from('').unwrap()).toBe('');
      expect(OptionUtils.from(0).unwrap()).toBe(0);
      expect(OptionUtils.from(false).unwrap()).toBe(false);
    });

    it('from() creates None from null/undefined', () => {
      expect(OptionUtils.from(null).isNone()).toBe(true);
      expect(OptionUtils.from(undefined).isNone()).toBe(true);
    });

    it('fromPredicate() creates based on predicate', () => {
      expect(OptionUtils.fromPredicate(42, (v) => v > 0).isSome()).toBe(true);
      expect(OptionUtils.fromPredicate(-1, (v) => v > 0).isNone()).toBe(true);
    });

    it('isOption() identifies Options', () => {
      expect(OptionUtils.isOption(Some(42))).toBe(true);
      expect(OptionUtils.isOption(None())).toBe(true);
      expect(OptionUtils.isOption(42)).toBe(false);
    });

    it('all() collects options', () => {
      expect(OptionUtils.all([Some(1), Some(2), Some(3)]).unwrap()).toEqual([1, 2, 3]);
    });

    it('all() returns None if any is None', () => {
      expect(OptionUtils.all([Some(1), None(), Some(3)]).isNone()).toBe(true);
    });
  });
});

describe('ResultAsync', () => {
  it('from() resolves to Ok', async () => {
    const result = await ResultAsync.from(Promise.resolve(42)).toPromise();
    expect(result.unwrap()).toBe(42);
  });

  it('from() resolves to Err on rejection', async () => {
    const result = await ResultAsync.from(Promise.reject(new Error('fail'))).toPromise();
    expect(result.isErr()).toBe(true);
  });

  it('map() transforms async result', async () => {
    const value = await ResultAsync.ok(21).map((v) => v * 2).unwrap();
    expect(value).toBe(42);
  });

  it('mapErr() transforms async error', async () => {
    const result = await ResultAsync.err('fail').mapErr((e) => e.toUpperCase()).toPromise();
    expect(result.unwrapErr()).toBe('FAIL');
  });

  it('andThen() chains async operations', async () => {
    const value = await ResultAsync.ok(10)
      .andThen((v) => ResultAsync.ok(v * 2))
      .unwrap();
    expect(value).toBe(20);
  });

  it('andThen() short-circuits on error', async () => {
    const result = await ResultAsync.err<string>('fail')
      .andThen((v: number) => ResultAsync.ok(v * 2))
      .toPromise();
    expect(result.isErr()).toBe(true);
  });

  it('unwrapOr() returns default on error', async () => {
    const value = await ResultAsync.err('fail').unwrapOr(42);
    expect(value).toBe(42);
  });

  it('match() pattern matches', async () => {
    const value = await ResultAsync.ok(42).match({
      ok: (v) => `value: ${v}`,
      err: (e) => `error: ${e}`,
    });
    expect(value).toBe('value: 42');
  });

  it('fromResult() wraps a sync result', async () => {
    const result = await ResultAsync.fromResult(Ok(42)).toPromise();
    expect(result.unwrap()).toBe(42);
  });
});

describe('OptionAsync', () => {
  it('from() creates Some from value', async () => {
    const opt = await OptionAsync.from(Promise.resolve(42)).toPromise();
    expect(opt.unwrap()).toBe(42);
  });

  it('from() creates None from null', async () => {
    const opt = await OptionAsync.from(Promise.resolve(null)).toPromise();
    expect(opt.isNone()).toBe(true);
  });

  it('map() transforms value', async () => {
    const value = await OptionAsync.some(21).map((v) => v * 2).unwrap();
    expect(value).toBe(42);
  });

  it('andThen() chains async options', async () => {
    const value = await OptionAsync.some(10)
      .andThen((v) => OptionAsync.some(v * 3))
      .unwrap();
    expect(value).toBe(30);
  });

  it('andThen() short-circuits on None', async () => {
    const opt = await OptionAsync.none()
      .andThen((v: number) => OptionAsync.some(v * 2))
      .toPromise();
    expect(opt.isNone()).toBe(true);
  });

  it('unwrapOr() returns default on None', async () => {
    const value = await OptionAsync.none<number>().unwrapOr(42);
    expect(value).toBe(42);
  });

  it('match() pattern matches', async () => {
    const value = await OptionAsync.some(42).match({
      some: (v) => `value: ${v}`,
      none: () => 'empty',
    });
    expect(value).toBe('value: 42');
  });
});
