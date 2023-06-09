import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';

describe('Caches SWR requests', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
    });
    it('caches reports from `use-report`', () => {
        setupIntercepts(); // some will be overriden
        cy.visit('/');
        cy.loginTestUser();
        cy.contains('Guide').click();
        cy.url().should('include', '/guide');
    });
});

export { };