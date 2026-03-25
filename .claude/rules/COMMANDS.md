## Commands

```bash
yarn dev              # Next.js dev server
yarn build            # Production build
yarn type-check       # TypeScript strict check
yarn lint             # ESLint
yarn format           # Prettier auto-format
yarn format:check     # Prettier check (CI)
yarn test             # Vitest unit tests (80% coverage threshold)
yarn test:integration # Integration tests
yarn test:e2e         # Playwright (Chromium + WebKit)
```

Run a single test file:
```bash
yarn vitest run tests/unit/path/to/file.test.ts
```

Pre-commit checklist — run all of these before every commit:
```bash
yarn lint
yarn format
yarn test --coverage
yarn test:integration
yarn test:e2e
```
