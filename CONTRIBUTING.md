# Contributing to Guarden

Thank you for your interest in contributing to Guarden! This document provides guidelines and instructions for contributing.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Avinashvelu03/guarden.git
cd guarden

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck

# Build
npm run build
```

## Code Standards

- **TypeScript**: All code must be written in TypeScript with strict mode
- **Testing**: All new features must include tests (target 95%+ coverage)
- **Linting**: Code must pass ESLint checks (`npm run lint`)
- **Formatting**: Use Prettier for consistent formatting (`npm run format`)

## Pull Request Process

1. Fork the repository and create a feature branch
2. Write your changes with tests
3. Ensure all tests pass: `npm test`
4. Ensure TypeScript compiles: `npm run typecheck`
5. Update documentation if needed
6. Submit a PR with a clear description of changes

## Adding a New Guard

1. Add the guard function in the appropriate file under `src/guards/`
2. Export it from `src/guards/index.ts`
3. Re-export from `src/index.ts`
4. Add comprehensive tests in `tests/guards.test.ts`

## Reporting Issues

- Use GitHub Issues to report bugs
- Include a minimal reproduction example
- Include your Node.js and TypeScript versions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
