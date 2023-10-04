import { setupIntercepts } from './intercepts';

describe('Expired User Experience', () => {
    beforeEach(() => {
        setupIntercepts();
    });
    it('Can access all pages', () => {
        cy.loginExpired();
        cy.visit('/boostbot');
        cy.visit('/dashboard');
        cy.visit('/sequences');
        cy.visit('/influencer-manager');
    });
    it('r button leads to boostbot', () => {
        cy.loginExpired();
        cy.visit('/account');
        cy.contains('span', 'r').click();
        cy.url().should('include', '/boostbot');
    });
});
