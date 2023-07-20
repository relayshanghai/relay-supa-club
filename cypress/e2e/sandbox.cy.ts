import { deleteDB } from "idb";
import { setupIntercepts } from "./intercepts";

describe('Sandbox test', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
    });

    it('Load index with session', () => {
        setupIntercepts();
        cy.loginTestUser();
    });

    it('Load index with session (again)', () => {
        setupIntercepts();
        cy.loginTestUser();
    });

    it('Load Campaigns page', () => {
        setupIntercepts();
        cy.loginTestUser();

        cy.contains('Campaigns').click();
        cy.wait(10000)

        cy.contains('Beauty for All Skin Tones').should('have.length', 1)
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
