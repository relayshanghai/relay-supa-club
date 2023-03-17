# End 2 End Testings with Cypress

Make sure the app is running locally

```bash
npm run dev
```

Then in another terminal,
Open cypress dashboard

```bash
npx cypress open
```

Click "E2E Testing" > "Chrome" > "Start E2E Testing in Chrome" then click on the "happy_path" test to run it.

We currently do not use any mocking for end to end test, everything is run against the live database

## Some useful cypress features

-   Try out `cy.get()` and `cy.contains()` in the cypress dashboard to find the right selector for the element you want to interact with.
-   Helper functions are defined in `cypress/support/commands`. You can use them in your tests like `cy.loginTestUser()`.
-   Cypress overview: https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell
-   Cypress API: https://docs.cypress.io/api/api/table-of-contents.html
