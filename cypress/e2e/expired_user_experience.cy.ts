import { setupIntercepts } from './intercepts';
import { deleteCache } from './helpers';

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
    it('Cannot search and shows error', async () => {
        await deleteCache('expired_user@expired.com');
        cy.loginExpired();
        cy.visit('/dashboard');
        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
            cy.getByTestId('search-spinner').should('not.exist'); // wait for spinner to appear
        });
        cy.contains('Subscription period has ended');
        cy.contains('To discover more influencers you’ll need to upgrade your plan and get more searches');
    });
    it('Cannot use boostbot and shows error', async () => {
        await deleteCache('expired_user@expired.com');
        cy.loginExpired();
        cy.visit('/boostbot');
        cy.getByTestId('boostbot-send-message').should('be.disabled');
        cy.contains(
            'Oh no, it looks like your account has expired. Please upgrade your account to continue using BoostBot',
        );
    });
    it('boostbot home button leads to boostbot', () => {
        cy.loginExpired();
        cy.visit('/account');
        cy.getByTestId('home-icon').click({ force: true });
        cy.url().should('include', '/boostbot');
    });
    it('Can see banners on boostbot and discover', async () => {
        await deleteCache('expired_user@expired.com');
        cy.loginExpired();
        cy.visit('/boostbot');
        cy.contains('Your free trial has expired');
        cy.contains('Please upgrade your account to use this feature.');
        cy.visit('/dashboard');
        cy.contains('Your free trial has expired');
        cy.contains('Please upgrade your account to use this feature.');
        cy.contains('Subscription period has ended');
        cy.contains('To discover more influencers you’ll need to upgrade your plan and get more searches');
    });
});
