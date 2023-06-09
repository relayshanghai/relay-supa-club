# Strategy

We are using Vitest for testing pure functions and next backend files.
We are using cypress for testing components.

All new features should have tests that prove the feature works, and handles edge cases. Whether this needs to be a unit/component/e2e test is up to you.

As far as existing features, we don't have enough time to add granular tests to everything, but we will try to add tests in this priority:

-   Bug fixes
    -   If we are fixing a bug, we should add a test to make sure that we've actually solved it and the bug doesn't come back.
-   Page-level components
    -   e.g. `creator-page.tsx`. We can test a lot of functionality on this parent component level that will cover most of the child components.
-   Utility functions
    -   e.g. `src/utils/utils.ts` These are functions that are used in many places, and are not specific to a component. We can test these functions in isolation. Unit tests are super valuable here as we can test all sorts of edge cases that are hard to manually test.
-   API requests - internal and external
    -   We can mock responses from third parties like iqdata, and make sure that we are parsing the data correctly. We should move to a new 'transform' design pattern where we massage all the data on the way in to the app, and use unit tests to make sure that we are doing it correctly.
    -   Next api endpoints are kind of a pain to test, but we can try to use helper functions inside the endpoints and test those. In the future we can look into using a helper library to test next api endpoints.
-   Individual components
    -   Can add these as new features come up but don't need to add them for existing features.
    -   Add these whenever we solve a bug.

# Vitest

Make sure your mock service worker is initialized. Run this to make a mockServiceWorker.js file in the root of your project:

```
npx msw init public
```

It will be ignored by git.

run Vitest tests one time through with `npm run test`

run in watch mode with `npm run test:watch`. You can also pass a test name to run a specific test, e.g. `npm run test:watch creators`

use the suffix `.test.ts` for Vitest test files

mocks return data from third parties like iqdata and are loaded from `src/mocks/server`

# Cypress unit (component) tests

To get 'watch' mode working while you are developing you can run `npx cypress open` and also run `npm run tailwind:watch`, which will watch for changes in the code and rebuild the css.

Do a run-through of the cypress unit tests with `npm run test-cypress-unit`. This uses the package `npm-run-all` to run the two scripts in order (tailwind:watch and cypress:unit). `run-s` runs scripts in series, `run-p` runs scripts in parallel.

use the suffix `.cy.tsx` for Cypress tests

api data mocks mock the data our next backend returns, and are loaded from `src/mocks/browser`

Because Cypress mounts each component individually, you might be missing some contexts you need, for example the `UserContext`. To solve this, we have a helper function called `testMount` in `src/utils/cypress-app-wrapper` that will mount the component with the contexts you need. We can keep updating this function as we need more contexts, or you can wrap the component in the contexts you need in the test file as you use it.

#### Every Cypress test should start with the following:

```tsx
/// <reference types="@testing-library/cypress" />
// @ts-check
```

`@ts-check`: This is a TypeScript directive that tells the TypeScript compiler to check the file for type errors. This is useful for catching errors in your tests before you run them.

`/// <reference types="@testing-library/cypress" />`: This is a TypeScript directive that tells the TypeScript compiler to load the types for the `@testing-library/cypress` library. This is useful for getting type hints in your tests.

## References

Vitest [docs](https://vitest.dev);
Cypress [docs](https://docs.cypress.io);
