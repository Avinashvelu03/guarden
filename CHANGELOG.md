# Changelog

All notable changes to **guarden** will be documented here.

---

## [Unreleased]

### Planned
- Additional monad combinators
- Browser bundle

---

## [1.0.3] - 2026-04-07

### Security
- **`isEmail`**: Replaced the polynomial-time regex with a linear-time structural check to eliminate a ReDoS (Regular Expression Denial of Service) vulnerability (CodeQL #2).
- **`stripHtml`**: Reimplemented tag stripping with a linear `indexOf`-based scan, resolving a ReDoS vulnerability and incomplete HTML sanitization (CodeQL #1, #3).

### Documentation
- Updated README for the security release.

---

## [1.0.0] - 2026-03-30

### Added
- 60+ type guards with auto-narrowing
- Result/Option monads
- Assertions and invariants
- Data pipelines (pipe/flow)
- String sanitization and env validation
- 313 tests, 100% coverage
- Tree-shakeable, Dual ESM/CJS
