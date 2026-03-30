// ============================================================================
// Guarden — Env Tests
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  createEnv,
  envString,
  envNumber,
  envBoolean,
  envEnum,
} from '../src/env/index.js';
import { EnvConfigError } from '../src/utils/errors.js';

describe('Environment Variable Validation', () => {
  describe('envString', () => {
    it('validates required strings', () => {
      const env = createEnv(
        { NAME: envString() },
        { NAME: 'hello' },
      );
      expect(env.NAME).toBe('hello');
    });

    it('throws for missing required strings', () => {
      expect(() =>
        createEnv({ NAME: envString() }, {}),
      ).toThrow(EnvConfigError);
    });

    it('uses default value', () => {
      const env = createEnv(
        { NAME: envString().default('fallback') },
        {},
      );
      expect(env.NAME).toBe('fallback');
    });

    it('validates URL format', () => {
      const env = createEnv(
        { URL: envString().url() },
        { URL: 'https://example.com' },
      );
      expect(env.URL).toBe('https://example.com');
    });

    it('rejects invalid URLs', () => {
      expect(() =>
        createEnv(
          { URL: envString().url() },
          { URL: 'not-a-url' },
        ),
      ).toThrow(EnvConfigError);
    });

    it('validates minimum length', () => {
      expect(() =>
        createEnv(
          { NAME: envString().minLength(5) },
          { NAME: 'hi' },
        ),
      ).toThrow(EnvConfigError);
    });

    it('validates pattern matching', () => {
      const env = createEnv(
        { KEY: envString().matches(/^[A-Z]+$/) },
        { KEY: 'ABC' },
      );
      expect(env.KEY).toBe('ABC');

      expect(() =>
        createEnv(
          { KEY: envString().matches(/^[A-Z]+$/) },
          { KEY: 'abc' },
        ),
      ).toThrow(EnvConfigError);
    });
  });

  describe('envNumber', () => {
    it('parses numbers', () => {
      const env = createEnv(
        { PORT: envNumber() },
        { PORT: '3000' },
      );
      expect(env.PORT).toBe(3000);
    });

    it('uses default value', () => {
      const env = createEnv(
        { PORT: envNumber().default(8080) },
        {},
      );
      expect(env.PORT).toBe(8080);
    });

    it('validates port range', () => {
      const env = createEnv(
        { PORT: envNumber().port() },
        { PORT: '3000' },
      );
      expect(env.PORT).toBe(3000);
    });

    it('rejects invalid port', () => {
      expect(() =>
        createEnv(
          { PORT: envNumber().port() },
          { PORT: '99999' },
        ),
      ).toThrow(EnvConfigError);
    });

    it('validates min/max', () => {
      const env = createEnv(
        { COUNT: envNumber().min(1).max(100) },
        { COUNT: '50' },
      );
      expect(env.COUNT).toBe(50);

      expect(() =>
        createEnv(
          { COUNT: envNumber().min(1).max(100) },
          { COUNT: '0' },
        ),
      ).toThrow(EnvConfigError);

      expect(() =>
        createEnv(
          { COUNT: envNumber().min(1).max(100) },
          { COUNT: '101' },
        ),
      ).toThrow(EnvConfigError);
    });

    it('rejects non-numeric strings', () => {
      expect(() =>
        createEnv(
          { NUM: envNumber() },
          { NUM: 'abc' },
        ),
      ).toThrow(EnvConfigError);
    });
  });

  describe('envBoolean', () => {
    it('parses boolean values', () => {
      expect(
        createEnv({ DBG: envBoolean() }, { DBG: 'true' }).DBG,
      ).toBe(true);
      expect(
        createEnv({ DBG: envBoolean() }, { DBG: '1' }).DBG,
      ).toBe(true);
      expect(
        createEnv({ DBG: envBoolean() }, { DBG: 'yes' }).DBG,
      ).toBe(true);
      expect(
        createEnv({ DBG: envBoolean() }, { DBG: 'false' }).DBG,
      ).toBe(false);
    });

    it('uses default value', () => {
      expect(
        createEnv({ DBG: envBoolean().default(false) }, {}).DBG,
      ).toBe(false);
    });
  });

  describe('envEnum', () => {
    it('validates enum values', () => {
      const env = createEnv(
        { NODE_ENV: envEnum(['development', 'production', 'test'] as const) },
        { NODE_ENV: 'production' },
      );
      expect(env.NODE_ENV).toBe('production');
    });

    it('rejects invalid enum values', () => {
      expect(() =>
        createEnv(
          { NODE_ENV: envEnum(['development', 'production', 'test'] as const) },
          { NODE_ENV: 'staging' },
        ),
      ).toThrow(EnvConfigError);
    });
  });

  describe('complex schemas', () => {
    it('validates full configuration', () => {
      const env = createEnv(
        {
          DATABASE_URL: envString().url(),
          PORT: envNumber().port().default(3000),
          DEBUG: envBoolean().default(false),
          NODE_ENV: envEnum(['development', 'production', 'test'] as const),
        },
        {
          DATABASE_URL: 'https://db.example.com',
          NODE_ENV: 'production',
        },
      );

      expect(env.DATABASE_URL).toBe('https://db.example.com');
      expect(env.PORT).toBe(3000);
      expect(env.DEBUG).toBe(false);
      expect(env.NODE_ENV).toBe('production');
    });

    it('collects all errors', () => {
      try {
        createEnv(
          {
            DATABASE_URL: envString().url(),
            PORT: envNumber().port(),
            NODE_ENV: envEnum(['development', 'production'] as const),
          },
          {},
        );
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(EnvConfigError);
        const err = e as EnvConfigError;
        expect(err.validationErrors.length).toBe(3);
      }
    });
  });

  describe('custom validation', () => {
    it('supports custom validators', () => {
      const env = createEnv(
        {
          SECRET: envString().validate((v) =>
            v.length >= 16 ? null : 'must be at least 16 characters',
          ),
        },
        { SECRET: 'abcdefghijklmnop' },
      );
      expect(env.SECRET).toBe('abcdefghijklmnop');
    });

    it('rejects on custom validation failure', () => {
      expect(() =>
        createEnv(
          {
            SECRET: envString().validate((v) =>
              v.length >= 16 ? null : 'must be at least 16 characters',
            ),
          },
          { SECRET: 'short' },
        ),
      ).toThrow(EnvConfigError);
    });
  });

  describe('empty string handling', () => {
    it('treats empty string as missing for required fields', () => {
      expect(() =>
        createEnv(
          { NAME: envString() },
          { NAME: '' },
        ),
      ).toThrow(EnvConfigError);
    });
  });
});
