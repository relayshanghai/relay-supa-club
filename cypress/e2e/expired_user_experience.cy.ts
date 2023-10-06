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
    it('Cannot search and shows error', () => {
        cy.loginExpired();
        cy.visit('/dashboard');
        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
            cy.getByTestId('search-spinner').should('not.exist'); // wait for spinner to appear
        });
        cy.contains('Your free trial has expired. Please upgrade your account to use this feature.');
        cy.contains('Upgrade subscription');
    });
    it.only('Cannot use boostbot and shows error', () => {
        cy.loginExpired();
        cy.visit('/boostbot');
        cy.getByTestId('boostbot-send-message').should('be.disabled');
        cy.contains(
            'Oh no, it looks like your account has expired. Please upgrade your account to continue using BoostBot',
        );
    });
    it('r button leads to boostbot', () => {
        cy.loginExpired();
        cy.visit('/account');
        cy.contains('span', 'r').click();
        cy.url().should('include', '/boostbot');
    });
    it('Can see banners on boostbot and discover', () => {
        cy.loginExpired();
        cy.visit('/boostbot');
        cy.contains('Your free trial has expired');
        cy.contains('Please upgrade your account to use this feature.');
        cy.visit('/dashboard');
        cy.contains('Your free trial has expired');
        cy.contains('Please upgrade your account to use this feature.');
    });
});
