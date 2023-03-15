describe('template spec', () => {
    it('can log in and load search page', () => {
        cy.visit('/');
        // starts on signup page. has an h1 that says signup in Chinese: 注册
        cy.get('h1').contains('注册');
        cy.loginTestUser();

        cy.contains('Campaigns', { timeout: 10000 }); // dashboard page load
        cy.url().should('include', '/dashboard');
    });
    it('can search for an influencer', () => {
        cy.loginTestUser();

        // wait for search results
        cy.contains('T-Series', { timeout: 20000 }); // the first influencer search result

        // search for an influencer
        // ensure GRTR is not in the search results
        cy.contains('GRTR').should('not.exist');

        cy.getByTestId('creator-search').type('GRTR{enter}');
        // cy.contains will not include the input element in the search, so this shows that the results are in the DOM
        cy.contains('GRTR', { timeout: 20000 });
    });
    it('can search for a topic', () => {
        cy.loginTestUser();

        // // wait for search results
        // cy.contains('T-Series', { timeout: 20000 }); // the first influencer search result

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
        });
        // cy.contains will not include the input element text in the search, so this shows that the result options are in the DOM
        cy.contains('alligators', { timeout: 30000 }).click();

        cy.contains('Brave Wilderness', { timeout: 30000 }); // the first influencer search result for alligators
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
