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

## Some useful cypress features

-   Try out `cy.get()` and `cy.contains()` in the cypress dashboard to find the right selector for the element you want to interact with.
