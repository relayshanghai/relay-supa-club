import { signupIntercept } from './intercepts';

export const randomString = (length = 8) =>
    Math.random()
        .toString(36)
        .substring(2, length + 2);

describe('Signup and start trial', () => {
    beforeEach(() => {
        signupIntercept();
    });

    it('Can signup without input payment wall', () => {
        cy.visit('/signup');
        cy.switchToEnglish();
        //first step
        cy.contains('Verify your number to get started');
        cy.contains('label', 'First Name').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Jane').type('Joe');
        });
        cy.contains('label', 'Last Name').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Doe').type('Smith');
        });
        cy.contains('label', 'Phone Number').within(() => {
            cy.get('input').should('have.attr', 'placeholder', '+1 (000) 000-0000').type('1234567890');
        });
        cy.contains('button', 'Next').click();
        //second step
        const randomEmail = `test${randomString()}@example.com`;

        cy.contains('Add an email and password to your account');
        cy.contains('label', 'Email').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'you@site.com').type(randomEmail);
        });
        cy.contains('label', 'Password').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Enter your password').type('test1234');
            cy.contains('Must be at least 10 characters long');
            cy.get('input').clear().type('test12345678!');
        });
        cy.contains('label', 'Confirm Password').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Confirm your password').type('test12345678!');
        });
        cy.contains('button', 'Next').click();
        //step three
        cy.contains('What category of product do you sell?');
        cy.get('input').click();
        cy.contains('AR/VR/XR').click();
        cy.contains('button', 'Next').click();
        //step four
        cy.contains('Tell us about your Company');
        cy.contains('label', 'Company').within(() => {
            cy.get('input')
                .should('have.attr', 'placeholder', 'Enter your company name')
                .type(`Test Company ${randomString()}`);
        });
        cy.contains('label', 'Website').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'www.site.com').type('https://test.com');
        });

        cy.contains('Size');
        cy.contains('11-50').click();
        cy.contains('button', 'Next').click();
        //step five - free trial page
        cy.contains('Start your free trial');
        cy.contains('label', 'I agree with the Terms and Conditions');
        //open and close terms and conditions modal
        cy.get('b').contains('Terms and Conditions').click();
        cy.contains('RELAY.CLUB TERMS AND CONDITIONS');
        cy.get('[data-test="close-button"]').click();
        cy.contains('label', 'I agree with the Terms and Conditions');
        cy.get('input[type="checkbox"]').check({ force: true });

        signupIntercept();
        cy.contains('button', 'Start free trial').click();

        // redirects to boostbot page on success
        cy.url().should('include', '/boostbot', { timeout: 30000 });
    });
});
