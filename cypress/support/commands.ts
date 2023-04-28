/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// https://testing-library.com/docs/cypress-testing-library/intro/#examples
import '@testing-library/cypress/add-commands';

import i18n from '../../i18n';
import { mount } from 'cypress/react18';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            getByTestId: typeof getByTestId;
            loginTestUser: typeof loginTestUser;
            switchToEnglish: typeof switchToEnglish;
            mount: typeof mount;
        }
    }
}
type CypressGetOptions =
    | Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
    | undefined;

function getByTestId(selector: string, options?: CypressGetOptions) {
    return cy.get(`[data-testid="${selector}"]`, options);
}

Cypress.Commands.add('getByTestId', getByTestId);

function loginTestUser(switchLangToEnglish = true) {
    if (switchLangToEnglish) {
        switchToEnglish();
    }

    cy.visit('/login');
    cy.contains('Welcome back!'); // wait for login page load
    cy.get('input[type="email"]').type(Cypress.env('TEST_USER_EMAIL'));
    cy.get('input[type="password"]').type(Cypress.env('TEST_USER_PASSWORD'));
    cy.get('form').get('button').contains('Log in').click();
    cy.contains('Successfully logged in', { timeout: 10000 }); // the toast message
    cy.contains('Campaigns', { timeout: 10000 }); // dashboard page load
}
Cypress.Commands.add('loginTestUser', loginTestUser);

function switchToEnglish() {
    localStorage.setItem('language', 'en');
    i18n.changeLanguage('en');
}
Cypress.Commands.add('switchToEnglish', switchToEnglish);

Cypress.Commands.add('mount', mount)

export {};
