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
    it.only('Cannot search and shows error', () => {
        cy.loginExpired();
        cy.visit('/dashboard');
        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
            cy.getByTestId('search-spinner').should('not.exist'); // wait for spinner to appear
        });
        cy.contains('Your free trial has expired. Please upgrade your account to use this feature.');
        cy.contains('Upgrade subscription');
    });
});
