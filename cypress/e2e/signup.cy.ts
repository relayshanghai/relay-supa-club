import { randomString } from './helpers';
import { setupIntercepts, signupIntercept } from './intercepts';

describe('Signup and start trial', () => {
    beforeEach(() => {
        setupIntercepts();
        signupIntercept();
    });
    it('Landing page loads, has both languages, and links to signup', () => {
        cy.visit('/');
        cy.contains('BoostBot雷宝可以帮助');
        cy.getByTestId('language-toggle').click();
        cy.contains('BoostBot雷宝可以帮助').should('not.exist');
        cy.contains('BoostBot can help.');
        cy.contains('Already signed up? Log in');
        cy.contains('button', 'Start Your Free Trial').click();
        cy.url().should('include', '/signup');
    });
    it('Can signup without input payment wall', () => {
        cy.visit('/signup');
        cy.switchToEnglish();
        // step one
        cy.contains('Verify your number to get started');
        cy.contains('label', 'First Name').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Jane').clear().type('Joe');
        });
        cy.contains('label', 'Last Name').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Doe').clear().type('Smith');
        });
        cy.contains('label', 'Phone Number').within(() => {
            cy.get('input').should('have.attr', 'placeholder', '+1 (000) 000-0000').clear().type('1234567890');
        });
        cy.contains('button', 'Next').click();
        // step two
        const randomEmail = `test${randomString()}@example.com`;

        cy.contains('Add an email and password to your account');
        cy.contains('label', 'Email').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'you@site.com').clear().type(randomEmail);
        });
        cy.contains('label', 'Password').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Enter your password').clear().type('test1234');
            cy.contains('Must be at least 10 characters long');
            cy.get('input').clear().type('test12345678!');
        });
        cy.contains('label', 'Confirm Password').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Confirm your password').clear().type('test12345678!');
        });
        cy.contains('button', 'Next').click();
        // step three
        cy.contains('Tell us about your Company');

        // start check if 'company already exists' check works
        cy.contains('label', 'Company').within(() => {
            cy.get('input')
                .should('have.attr', 'placeholder', 'Enter your company name')
                .clear()
                .type(`Expired Company`);
        });
        cy.contains('Company already exists');
        cy.get('input[type="checkbox"]').check({ force: true });
        cy.contains('button', 'Start Your Free Trial').should('be.disabled');
        // end check

        cy.contains('label', 'Company').within(() => {
            cy.get('input')
                .should('have.attr', 'placeholder', 'Enter your company name')
                .clear()
                .type(`Test Company ${randomString()}`);
        });
        cy.contains('button', 'Start Your Free Trial').should('be.not.disabled');

        cy.get('input[type="checkbox"]').uncheck({ force: true });
        cy.contains('button', 'Start Your Free Trial').should('be.disabled');

        cy.contains('label', 'Website').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'www.site.com').clear().type('https://test.com');
        });
        cy.contains('Terms and Conditions').click();
        cy.contains('BOOSTBOT TERMS AND CONDITIONS');
        cy.get('[data-test="close-button"]').click();

        cy.get('input[type="checkbox"]').check({ force: true });
        //last step - free trial page
        cy.contains('Start your free trial');

        signupIntercept();

        // redirects to boostbot page on success
        cy.url().should('include', '/boostbot', { timeout: 30000 });
    });
});
