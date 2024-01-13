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
import 'cypress-iframe';

import i18n from '../../i18n';
import { mount } from 'cypress/react18';
import { enUS, LOCAL_STORAGE_LANGUAGE_KEY } from '../../src/constants';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            getByTestId(selector: string, options?: Partial<Loggable & Timeoutable & Withinable>): Chainable<any>;
            loginTestUser: typeof loginTestUser;
            loginAdmin: typeof loginAdmin;
            loginExpired: typeof loginExpired;
            loginTeammate: typeof loginTeammate;
            switchToEnglish: typeof switchToEnglish;
            mount: typeof mount;
        }
    }
}

Cypress.Commands.add('getByTestId', (selector, ...args) => {
    cy.get(`[data-testid="${selector}"]`, ...args);
});

export const deleteIndexedDbs = () => {
    new Cypress.Promise(async () => {
        if (window.indexedDB.databases) {
            const dbs = await window.indexedDB.databases();
            for (const db of dbs) {
                if (db.name) await window.indexedDB.deleteDatabase(db.name);
            }
        }
    });
};

function loginTestUser(
    role: 'company_owner' | 'company_teammate' | 'relay_employee' = 'company_owner',
    switchLangToEnglish = true,
    expired = false,
) {
    deleteIndexedDbs();
    if (switchLangToEnglish) {
        switchToEnglish();
    }
    let email = Cypress.env('TEST_USER_EMAIL_COMPANY_OWNER');
    if (!expired) {
        if (role === 'company_teammate') {
            email = Cypress.env('TEST_USER_EMAIL_COMPANY_TEAMMATE');
        } else if (role === 'relay_employee') {
            email = Cypress.env('TEST_USER_EMAIL_RELAY_EMPLOYEE');
        }
    } else {
        email = Cypress.env('TEST_USER_EMAIL_EXPIRED');
    }
    cy.log(email);
    cy.visit('/login');
    cy.contains('Welcome back!'); // wait for login page load
    cy.contains('Email');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(Cypress.env('TEST_USER_PASSWORD'));
    cy.contains('button', 'Log in').click();
    cy.contains('Successfully logged in', { timeout: 10000 }); // the toast message
    // should get redirected to boostbot page
    cy.contains('BoostBot AI Search', { timeout: 10000 }); // boostbot page load
}
Cypress.Commands.add('loginTestUser', loginTestUser);

function loginAdmin(switchLangToEnglish = true) {
    loginTestUser('relay_employee', switchLangToEnglish);
}
Cypress.Commands.add('loginAdmin', loginAdmin);

function loginExpired(switchLangToEnglish = true) {
    loginTestUser('company_owner', switchLangToEnglish, true);
}
Cypress.Commands.add('loginExpired', loginExpired);
function loginTeammate(switchLangToEnglish = true) {
    loginTestUser('company_teammate', switchLangToEnglish, true);
}
Cypress.Commands.add('loginTeammate', loginTeammate);

function switchToEnglish() {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, enUS);
    i18n.changeLanguage(enUS);
}
Cypress.Commands.add('switchToEnglish', switchToEnglish);

Cypress.Commands.add('mount', mount);

export {};
