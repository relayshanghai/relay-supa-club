describe('template spec', () => {
    it('passes', () => {
        cy.visit('/');
        // starts on signup page. has an h1 that says signup in Chinese: 注册
        cy.get('h1').contains('注册');
        // can change language to English. Select language toggle button by attribute data-testid ="language-toggle-button"
        cy.get('[data-testid="language-toggle-button"]').click();
        cy.contains('English').click();
        cy.get('h1').contains('Sign up');
        cy.contains('Log in').click();
        cy.contains('Welcome back!'); // wait for login page load
        cy.get('input[type="email"]').type(Cypress.env('TEST_USER_EMAIL'));
        cy.get('input[type="password"]').type(Cypress.env('TEST_USER_PASSWORD'));
        cy.get('form').get('button').contains('Log in').click();
        cy.contains('Successfully logged in', { timeout: 10000 }); // the toast message
        cy.contains('Campaigns', { timeout: 10000 }); // dashboard page load
        cy.url().should('include', '/dashboard');

        // wait for search results
        cy.contains('T-Series', { timeout: 20000 }); // the first influencer search result
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
