// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Added to ignore the error that occurs when the rudderstack client-side SDK is not loaded, we are not testing the rudderstack client-side SDK in the e2e tests
Cypress.on('uncaught:exception', (err) => {
    if (
        err.message.includes(
            "Cannot read properties of undefined (reading 'identify')" ||
                "Cannot read properties of undefined (reading 'page')" ||
                "Cannot read properties of undefined (reading 'track')",
        )
    ) {
        // eslint-disable-next-line no-console
        console.warn('Ignoring error:', err.message);
        return false;
    }
    return true;
});
