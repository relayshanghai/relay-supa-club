import { setupIntercepts } from './intercepts';

describe('checks restricted to guide page', () => {
    it('check if guide page opens', async () => {
        setupIntercepts();
        cy.loginTestUser();
        cy.contains('Guide').click();
        cy.url().should('include', '/guide');
    });
});

export {};
