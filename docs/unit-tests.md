# Jest

We are using jest for testing pure functions and next backend files.

run with `npm run test:run`

run in watch mode with `npm run test`. You cal also pass a test name to run a specific test, e.g. `npm run test creators`

use the suffix .test. for jest test files

mocks return data from third parties like iqdata and are loaded from `src/mocks/server`

# Cypress unit tests

We are using cypress for testing components.
To get 'watch' mode working while you are developing you can run `npx cypress open` and also run `npm run tailwind:watch`, which will watch for changes in the code and rebuild the css.

Do a run-through of the cypress unit tests with `npm run test-cypress-unit`. This uses the package `npm-run-all` to run the two scripts in order (tailwind:watch and cypress:unit). `run-s` runs scripts in series, `run-p` runs scripts in parallel.

use the suffix .cy. for cypress tests

api data mocks mock the data our next backend returns, and are loaded from `src/mocks/browser`

Because cypress mounts each component individually, you might be missing some contexts you need, for example the `UserContext`. To solve this, we have a helper function called `testMount` in `src/utils/cypress-app-wrapper` that will mount the component with the contexts you need. We can keep updating this function as we need more contexts, or you can wrap the component in the contexts you need in the test file as you use it.
