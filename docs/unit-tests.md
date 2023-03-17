# Jest

We are using jest for testing functions.

# Cypress unit tests

We are using cypress for testing components.
To get 'watch' mode working while you are developing you can run `npx cypress open` and also run `npm run tailwind:watch`, which will watch for changes in the code and rebuild the css.

Do a run-through of the cypress unit tests with `npm run test-cypress-unit`. This uses the package `npm-run-all` to run the two scripts in order (tailwind:watch and cypress:unit). `run-s` runs scripts in series, `run-p` runs scripts in parallel.
