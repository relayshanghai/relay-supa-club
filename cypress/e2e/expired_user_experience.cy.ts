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
});
