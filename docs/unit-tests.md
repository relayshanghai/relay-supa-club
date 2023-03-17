# Strategy

We are using jest for testing pure functions and next backend files.
We are using cypress for testing components.

As far as existing features, we don't have enough time to add granular tests to everything, but we will try to add tests in this priority:

-   Bug fixes
    -   If we are fixing a bug, we should add a test to make sure that we've actually solved it and the bug doesn't come back.
-   Page-level components
    -   e.g. `creator-page.tsx`. We can test a lot of funcitonality on this parent component level that will cover most of the child components.
-   Utility functions
    -   e.g. `src/utils/utils.ts` These are functions that are used in many places, and are not specific to a component. We can test these functions in isolation. Unit tests are super valuable here as we can test all sorts of edge cases that are hard to manually test.
-   API requests - internal and external
    -   we can mock responses from third parties like iqdata, and make sure that we are parsing the data correctly. We should move to a new 'transform' design pattern where we massage all the data on the way in to the app, and use unit tests to make sure that we are doing it correctly.
    -   Next api endpoints are kind of a pain to test, but we can try to use helper functions inside the endpoints and test those. In the future we can look into using a helper library to test next api endpoints.
-   Individual components
    -   Can add these as new features come up but don't need to add them for existing features.
    -   add these whenever we solve a bug

# Jest

run with `npm run test:run`

run in watch mode with `npm run test`. You cal also pass a test name to run a specific test, e.g. `npm run test creators`

use the suffix .test. for jest test files

mocks return data from third parties like iqdata and are loaded from `src/mocks/server`

# Cypress unit tests

To get 'watch' mode working while you are developing you can run `npx cypress open` and also run `npm run tailwind:watch`, which will watch for changes in the code and rebuild the css.

Do a run-through of the cypress unit tests with `npm run test-cypress-unit`. This uses the package `npm-run-all` to run the two scripts in order (tailwind:watch and cypress:unit). `run-s` runs scripts in series, `run-p` runs scripts in parallel.

use the suffix .cy. for cypress tests

api data mocks mock the data our next backend returns, and are loaded from `src/mocks/browser`

Because cypress mounts each component individually, you might be missing some contexts you need, for example the `UserContext`. To solve this, we have a helper function called `testMount` in `src/utils/cypress-app-wrapper` that will mount the component with the contexts you need. We can keep updating this function as we need more contexts, or you can wrap the component in the contexts you need in the test file as you use it.
