### FashionHub E2E tests

This project contains automated E2E tests written in Playwright.
The tests are designed to run against different environments (local, staging, prod) and also inside Docker.

# Application under test:
https://pocketaces2.github.io/fashionhub/

---------------------------------------------------------------------

## Setup

Install dependencies first:

```bash
npm install
npx playwright install
npm install --save-dev @types/node
```

---------------------------------------------------------------------

## Running tests locally

# Basic run:
```bash
npx playwright test
```

# Run with visible browser:
```bash
npx playwright test --headed
```

# Debug mode (step-by-step)
```bash
npx playwright test --headed
```

# Run a single test (by name)
```bash
npx playwright test -g "Validation - username field"
```

# Run a single test with UI and debugger
```bash
npx playwright test -g "Validation - username field" --headed --debug
```

---------------------------------------------------------------------
## Configuration
The test suite supports runtime configuration via environment variables.

# ENV — environment selection
```bash
npx playwright test -g "Validation - username field" --headed --debug
```
# Available environments:

* local → http://localhost:4000/fashionhub/
* staging → https://staging-env/fashionhub/
* prod → https://pocketaces2.github.io/fashionhub/

Run tests with selected environment:
Example:
```bash
ENV=prod npx playwright test
```
If ENV is not provided, it defaults to prod.

--------
# MOCK — backend mocking
```bash
MOCK=true | false
```
true → API calls are mocked (Playwright route interception)
false → real application behavior - (not select state)
Example:

```bash
MOCK=true npx playwright test
```

--------
# LOG — debug logs
```bash
LOG=true | false
```
true → enables detailed logs (actions, URLs, validations)
false → silent mode (recommended for CI)
Example:
```bash
LOG=true npx playwright test
```

---------
# Combined example:
```bash
ENV=prod MOCK=true LOG=true npx playwright test --headed
```


---------
# Run base tests
```bash
npx playwright test --headed --debug
```

---------------------------------------------------------------------

## Docker
Build image:
```bash
docker build -f docker/Dockerfile -t fashionhub-e2e .
```
Run tests:
```bash
docker run -e ENV=prod -e MOCK=false -e LOG=true fashionhub-e2e
```


---------------------------------------------------------------------
## Report

After running tests:

```bash
npx playwright show-report
```

---------------------------------------------------------------------

## Project structure

* config/         - environment configuration
* docker/         - Docker setup
* docs/           - documentation
* fixtures/       - custom fixtures (e.g. mocks)
* pages/          - Page Object Model classes
* test-data/      - test data
* tests/          - test cases (login, account)
* utils/          - helpers (logger, etc.)

---------------------------------------------------------------------
## Architecture
Page Object Model (POM) for maintainability

Centralized logging via custom logger (createLogger)

Environment-based configuration (ENV / MOCK / LOG)

Mock layer prepared for future backend integration

Ready for CI/CD usage (e.g. Docker, Jenkins)

---------------------------------------------------------------------
## Cross-browser support
Playwright supports running tests across multiple browsers (Chromium, Firefox, WebKit).

If configured in playwright.config.ts, tests can run in parallel across all supported browsers.

---------------------------------------------------------------------
## Implemented test scenarios
- valid login
- invalid login (various cases)
- form validation (empty fields, edge cases)
- navigation (navbar behavior)
- access control (protected pages)

---------------------------------------------------------------------
## Notes
The scope of this project slightly goes beyond the minimal requirements of the task.

Some parts (such as environment configuration, logging, and mock handling) were implemented with future scalability in mind. The idea was to simulate a more realistic test setup that could be extended in case of backend integration or CI/CD usage.

At the same time, the main focus was kept on readability, maintainability, and clear test structure using the Page Object Model.

The current implementation prioritizes simplicity where possible, while still showing how the project could evolve in a real-world scenario.